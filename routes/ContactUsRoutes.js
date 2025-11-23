const ContactUsRouter = require("express").Router()
const {
    verifyAll,
    verifyAdmin,
    verifySuperAdmin,
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ContactUsControllers")

ContactUsRouter.post("", verifyAll, createRecord)
ContactUsRouter.get("", verifyAdmin, getRecord)
ContactUsRouter.get("/:_id", verifyAdmin, getSingleRecord)
ContactUsRouter.put("/:_id", verifyAdmin, updateRecord)
ContactUsRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = ContactUsRouter