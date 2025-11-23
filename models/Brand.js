const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Brand Name Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Brand Pic Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Brand = new mongoose.model("Brand", BrandSchema)

module.exports = Brand