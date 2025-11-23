const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema({
    map1: {
        type: String,
        default: ""
    },
    map2: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    siteName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    whatsapp: {
        type: String,
        default: ""
    },
    facebook: {
        type: String,
        default: ""
    },
    youtube: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
    }
}, { timestamps: true })
const Setting = new mongoose.model("Setting", SettingSchema)

module.exports = Setting