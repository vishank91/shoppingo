const mongoose = require("mongoose")

const FeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Feature Name Is Mendatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Feature Short Description Is Mendatory"]
    },
    icon: {
        type: String,
        required: [true, "Feature Icon Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Feature = new mongoose.model("Feature", FeatureSchema)

module.exports = Feature