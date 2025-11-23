const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name Is Mendatory"]
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Maincategory Id Field is Mendatory"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Subcategory Id Field is Mendatory"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand Id Field is Mendatory"]
    },
    color: {
        type: Array,
        required: [true, "Color Field is Mendatory"]
    },
    size: {
        type: Array,
        required: [true, "Size Field is Mendatory"]
    },
    basePrice: {
        type: Number,
        required: [true, "Base Price Field is Mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Discount Field is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Final Price Field is Mendatory"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Stock Quantity Field is Mendatory"]
    },
    description: {
        type: String,
        default: ""
    },
    pic: {
        type: Array,
        required: [true, "Product Pic Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Product = new mongoose.model("Product", ProductSchema)

module.exports = Product