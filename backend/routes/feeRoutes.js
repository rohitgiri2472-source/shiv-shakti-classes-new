const express = require("express"); 
const router = express.Router(); 
 
const Fee = require("../models/Fee"); 
const Student = require("../models/Student"); 
const { protect, adminOnly } = require("../middleware/authMiddleware"); 
 
 
// ========================================== 
// ADMIN: GET ALL STUDENTS WITH FEE DETAILS 
// ========================================== 
 
router.get("/", protect, adminOnly, async (req, res) => { 
    try { 
        const students = await Student.find() 
            .populate("userId", "name email") 
            .sort({ createdAt: -1 }); 
 
        const result = await Promise.all( 
            students.map(async (student) => { 
                const fee = await Fee.findOne({ 
                    student: student._id 
                }); 
 
                const paidAmount = fee 
                    ? fee.payments.reduce( 
                        (total, payment) => total + payment.amount, 
                        0 
                    ) 
                    : 0; 
 
                const totalFee = fee ? fee.totalFee : 0; 
 
                return { 
                    student, 
                    fee, 
                    totalFee, 
                    paidAmount, 
                    pendingAmount: totalFee - paidAmount 
                }; 
            }) 
        ); 
 
        res.json(result); 
 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ 
            message: "Failed to load fee details." 
        }); 
    } 
}); 
 
 
// ========================================== 
// ADMIN: CREATE / UPDATE TOTAL FEE 
// ========================================== 
 
router.put("/:studentId", protect, adminOnly, async (req, res) => { 
    try { 
        const { totalFee } = req.body; 
 
        if (totalFee === undefined || totalFee < 0) { 
            return res.status(400).json({ 
                message: "Please provide a valid total fee." 
            }); 
        } 
 
        const student = await Student.findById(req.params.studentId); 
 
        if (!student) { 
            return res.status(404).json({ 
                message: "Student not found." 
            }); 
        } 
 
        const fee = await Fee.findOneAndUpdate( 
            { student: student._id }, 
            { 
                totalFee: Number(totalFee) 
            }, 
            { 
                new: true, 
                upsert: true 
            } 
        ); 
 
        res.json({ 
            message: "Total fee updated successfully.", 
            fee 
        }); 
 
    } catch (error) { 
        console.error(error); 
 
        res.status(500).json({ 
            message: "Failed to update total fee." 
        }); 
    } 
}); 
 
 
// ========================================== 
// ADMIN: ADD PAYMENT 
// ========================================== 
 
router.post("/:studentId/payment", protect, adminOnly, async (req, res) => { 
    try { 
        const { 
            amount, 
            paymentMethod, 
            note 
        } = req.body; 
 
        if (!amount || amount <= 0) { 
            return res.status(400).json({ 
                message: "Please enter a valid payment amount." 
            }); 
        } 
 
        const student = await Student.findById(req.params.studentId); 
 
        if (!student) { 
            return res.status(404).json({ 
                message: "Student not found." 
            }); 
        } 
 
        let fee = await Fee.findOne({ 
            student: student._id 
        }); 
 
        if (!fee) { 
            fee = await Fee.create({ 
                student: student._id, 
                totalFee: 0, 
                payments: [] 
            }); 
        } 
 
        const currentPaid = fee.payments.reduce( 
            (total, payment) => total + payment.amount, 
            0 
        ); 
 
        const pending = fee.totalFee - currentPaid; 
 
        if (Number(amount) > pending) { 
            return res.status(400).json({ 
                message: `Payment cannot be more than pending amount ₹${pending}.` 
            }); 
        } 
 
        fee.payments.push({ 
            amount: Number(amount), 
            method: paymentMethod || "Cash", 
            note: note || "", 
            paymentDate: new Date() 
        }); 
 
        await fee.save(); 
 
        res.json({ 
            message: "Payment added successfully.", 
            fee 
        }); 
 
    } catch (error) { 
        console.error(error); 
 
        res.status(500).json({ 
            message: "Failed to add payment." 
        }); 
    } 
}); 
 
 
// ========================================== 
// ADMIN: DELETE PAYMENT 
// ========================================== 
 
router.delete( 
    "/:studentId/payment/:paymentId", 
    protect, 
    adminOnly, 
    async (req, res) => { 
        try { 
            const fee = await Fee.findOne({ 
                student: req.params.studentId 
            }); 
 
            if (!fee) { 
                return res.status(404).json({ 
                    message: "Fee record not found." 
                }); 
            } 
 
            const payment = fee.payments.id( 
                req.params.paymentId 
            ); 
 
            if (!payment) { 
                return res.status(404).json({ 
                    message: "Payment not found." 
                }); 
            } 
 
            payment.deleteOne(); 
 
            await fee.save(); 
 
            res.json({ 
                message: "Payment deleted successfully." 
            }); 
 
        } catch (error) { 
            console.error(error); 
 
            res.status(500).json({ 
                message: "Failed to delete payment." 
            }); 
        } 
    } 
); 
 
 
// ========================================== 
// STUDENT: GET OWN FEE DETAILS 
// ========================================== 
 
router.get("/my-fees", protect, async (req, res) => { 
    try { 
        const student = await Student.findOne({ 
            userId: req.user._id 
        }); 
 
        if (!student) { 
            return res.status(404).json({ 
                message: "Student profile not found." 
            }); 
        } 
 
        const fee = await Fee.findOne({ 
            student: student._id 
        }); 
 
        if (!fee) { 
            return res.json({ 
                student, 
                totalFee: 0, 
                paidAmount: 0, 
                pendingAmount: 0, 
                payments: [] 
            }); 
        } 
 
        const paidAmount = fee.payments.reduce( 
            (total, payment) => total + payment.amount, 
            0 
        ); 
 
        res.json({ 
            student, 
            totalFee: fee.totalFee, 
            paidAmount, 
            pendingAmount: fee.totalFee - paidAmount, 
            payments: fee.payments 
        }); 
 
    } catch (error) { 
        console.error(error); 
 
        res.status(500).json({ 
            message: "Failed to load your fee details." 
        }); 
    } 
}); 
 
 
module.exports = router;