const NewsletterRouter = require("express").Router()
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
} = require("../controllers/NewsletterControllers")

NewsletterRouter.post("", verifyAll, createRecord)
NewsletterRouter.get("", verifyAdmin, getRecord)
NewsletterRouter.get("/:_id", verifyAdmin, getSingleRecord)
NewsletterRouter.put("/:_id", verifyAdmin, updateRecord)
NewsletterRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = NewsletterRouter