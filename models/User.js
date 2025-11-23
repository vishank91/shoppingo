const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Full Name Is Mendatory"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "User Name Is Mendatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address Is Mendatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number Is Mendatory"]
    },
    password: {
        type: String,
        required: [true, "Password Field Is Mendatory"]
    },
    role: {
        type: String,
        default: 'Buyer'
    },
    passwordResetOption: {
        type: Object,
        default: {}
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const User = new mongoose.model("User", UserSchema)

module.exports = User