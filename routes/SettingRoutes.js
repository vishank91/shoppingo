const SettingRouter = require("express").Router()
const {
    verifyAll,
    verifyAdmin
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
} = require("../controllers/SettingControllers")

SettingRouter.post("", verifyAdmin, createRecord)
SettingRouter.get("", verifyAll, getRecord)

module.exports = SettingRouter