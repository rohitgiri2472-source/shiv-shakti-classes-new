const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        className: {
            type: String,
            required: true
        },

        source: {
            type: String,
            enum: ["admin", "registered"],
            default: "admin"
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);