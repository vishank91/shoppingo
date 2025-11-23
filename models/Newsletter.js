const mongoose = require("mongoose")

const NewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Newsletter = new mongoose.model("Newsletter", NewsletterSchema)

module.exports = Newsletter