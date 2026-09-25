const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentDate: {
            type: Date,
            default: Date.now
        },

        method: {
            type: String,
            enum: ["Cash", "UPI", "Bank Transfer", "Other"],
            default: "Cash"
        },

        note: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        _id: true
    }
);

const feeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            unique: true
        },

        totalFee: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        payments: {
            type: [paymentSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Fee", feeSchema);