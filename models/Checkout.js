const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id Field is Mendatory"]
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: [true, "Delivery Address Field is Mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order Is Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal Field is Mendatory"]
    },
    shipping: {
        type: Number,
        required: [true, "Shipping Field is Mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Total Field is Mendatory"]
    },
    rppid: {
        type: String,
        default: "N/A"
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Product Id is Mendatory"]
            },
            color: {
                type: String,
                required: [true, "Color Field is Mendatory"]
            },
            size: {
                type: String,
                required: [true, "Size Field is Mendatory"]
            },
            quantity: {
                type: Number,
                required: [true, "Product Quantity is Mendatory"]
            },
            total: {
                type: Number,
                required: [true, "Total Amount is Mendatory"]
            }
        }
    ]
}, { timestamps: true })
const Checkout = new mongoose.model("Checkout", CheckoutSchema)

module.exports = Checkout