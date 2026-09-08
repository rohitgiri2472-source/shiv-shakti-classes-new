const express = require("express");

const Student = require("../models/Student");
const User = require("../models/User");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET ALL STUDENTS
// Combines:
// 1. Admin-added students
// 2. Students who registered themselves
// =====================================================

router.get("/", protect, adminOnly, async (req, res) => {

    try {

        // Get admin-added students
        const adminStudents = await Student.find()
            .sort({ createdAt: -1 })
            .lean();


        // Get registered students
        const registeredStudents = await User.find({
            role: "student"
        })
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();


        // Convert registered users into same format
        const registeredStudentList = registeredStudents.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone || "",
            className: student.className || "",
            source: "registered",
            userId: student._id,
            createdAt: student.createdAt
        }));


        // Convert admin students into same format
        const adminStudentList = adminStudents.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email || "",
            phone: student.phone || "",
            className: student.className,
            source: "admin",
            userId: student.userId || null,
            createdAt: student.createdAt
        }));


        // Combine both lists
        const students = [
            ...registeredStudentList,
            ...adminStudentList
        ];


        // Latest students first
        students.sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );


        res.json({
            students
        });

    } catch (error) {

        console.error("Get students error:", error);

        res.status(500).json({
            message: "Unable to load students."
        });

    }

});


// =====================================================
// ADD STUDENT BY ADMIN
// NO PASSWORD
// =====================================================

router.post("/", protect, adminOnly, async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            className
        } = req.body;


        // Validate required fields

        if (!name || !className) {

            return res.status(400).json({
                message: "Name and class are required."
            });

        }


        // Check if same email already exists
        if (email) {

            const existingUser = await User.findOne({
                email: email.toLowerCase().trim()
            });

            if (existingUser) {

                return res.status(400).json({
                    message:
                        "A user with this email already exists."
                });

            }


            const existingStudent = await Student.findOne({
                email: email.toLowerCase().trim()
            });

            if (existingStudent) {

                return res.status(400).json({
                    message:
                        "A student with this email already exists."
                });

            }

        }


        // Create student details
        const student = await Student.create({

            name: name.trim(),

            email: email
                ? email.toLowerCase().trim()
                : "",

            phone: phone || "",

            className,

            source: "admin",

            userId: null

        });


        res.status(201).json({

            message: "Student added successfully.",

            student

        });


    } catch (error) {

        console.error("Add student error:", error);

        res.status(500).json({

            message:
                error.message ||
                "Unable to add student."

        });

    }

});


// =====================================================
// UPDATE ADMIN-ADDED STUDENT
// =====================================================

router.put("/admin/:id", protect, adminOnly, async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            className
        } = req.body;


        const student = await Student.findById(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({
                message: "Student not found."
            });

        }


        // Check email against registered users
        if (email) {

            const emailValue =
                email.toLowerCase().trim();


            const existingUser = await User.findOne({
                email: emailValue
            });


            if (existingUser) {

                return res.status(400).json({
                    message:
                        "This email belongs to a registered user."
                });

            }


            const existingStudent = await Student.findOne({
                email: emailValue,
                _id: { $ne: student._id }
            });


            if (existingStudent) {

                return res.status(400).json({
                    message:
                        "Another student already uses this email."
                });

            }


            student.email = emailValue;

        }


        if (name !== undefined) {
            student.name = name.trim();
        }


        if (phone !== undefined) {
            student.phone = phone;
        }


        if (className !== undefined) {
            student.className = className;
        }


        await student.save();


        res.json({

            message: "Student updated successfully.",

            student

        });


    } catch (error) {

        console.error("Update student error:", error);

        res.status(500).json({

            message:
                error.message ||
                "Unable to update student."

        });

    }

});


// =====================================================
// UPDATE REGISTERED STUDENT
// Admin can update details in User collection
// Password is NOT touched
// =====================================================

router.put("/registered/:id", protect, adminOnly, async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            className
        } = req.body;


        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        });


        if (!student) {

            return res.status(404).json({
                message: "Registered student not found."
            });

        }


        if (email !== undefined) {

            const newEmail =
                email.toLowerCase().trim();


            const existingUser = await User.findOne({

                email: newEmail,

                _id: {
                    $ne: student._id
                }

            });


            if (existingUser) {

                return res.status(400).json({
                    message:
                        "This email is already being used."
                });

            }


            student.email = newEmail;

        }


        if (name !== undefined) {
            student.name = name.trim();
        }


        if (phone !== undefined) {
            student.phone = phone;
        }


        if (className !== undefined) {
            student.className = className;
        }


        await student.save();


        res.json({

            message: "Student updated successfully.",

            student: {

                _id: student._id,

                name: student.name,

                email: student.email,

                phone: student.phone,

                className: student.className,

                source: "registered",

                userId: student._id

            }

        });

    } catch (error) {

        console.error(
            "Update registered student error:",
            error
        );

        res.status(500).json({

            message:
                error.message ||
                "Unable to update student."

        });

    }

});


// =====================================================
// DELETE ADMIN-ADDED STUDENT
// =====================================================

router.delete("/admin/:id", protect, adminOnly, async (req, res) => {

    try {

        const student =
            await Student.findByIdAndDelete(
                req.params.id
            );


        if (!student) {

            return res.status(404).json({
                message: "Student not found."
            });

        }


        res.json({

            message:
                "Student deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete admin student error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to delete student."

        });

    }

});


// =====================================================
// DELETE REGISTERED STUDENT
// =====================================================

router.delete(
    "/registered/:id",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const student =
                await User.findOneAndDelete({

                    _id: req.params.id,

                    role: "student"

                });


            if (!student) {

                return res.status(404).json({

                    message:
                        "Registered student not found."

                });

            }


            res.json({

                message:
                    "Student deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete registered student error:",
                error
            );

            res.status(500).json({

                message:
                    "Unable to delete student."

            });

        }

    }
);


module.exports = router;