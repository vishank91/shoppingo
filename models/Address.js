const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id Field is Mendatory"]
    },
    name: {
        type: String,
        required: [true, "Name Field is Mendatory"]
    },
    email: {
        type: String,
        required: [true, "Email Field is Mendatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Field is Mendatory"]
    },
    address: {
        type: String,
        required: [true, "Address Field is Mendatory"]
    },
    pin: {
        type: String,
        required: [true, "Pin Code Field is Mendatory"]
    },
    city: {
        type: String,
        required: [true, "City Name Field is Mendatory"]
    },
    state: {
        type: String,
        required: [true, "State Name Field is Mendatory"]
    },
}, { timestamps: true })
const Address = new mongoose.model("Address", AddressSchema)

module.exports = Address