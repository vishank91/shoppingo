const mongoose = require("mongoose")

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Subcategory Name Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Subcategory Pic Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Subcategory = new mongoose.model("Subcategory", SubcategorySchema)

module.exports = Subcategory