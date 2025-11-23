const mongoose = require("mongoose")

const FaqSchema = new mongoose.Schema({
    question: {
        type: String,
        unique: true,
        required: [true, "Faq Question Is Mendatory"]
    },
    answer: {
        type: String,
        required: [true, "Faq Answer Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Faq = new mongoose.model("Faq", FaqSchema)

module.exports = Faq