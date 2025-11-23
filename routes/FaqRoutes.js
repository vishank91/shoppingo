const FaqRouter = require("express").Router()
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
} = require("../controllers/FaqControllers")

FaqRouter.post("", verifyAdmin, createRecord)
FaqRouter.get("", verifyAll, getRecord)
FaqRouter.get("/:_id", verifyAll, getSingleRecord)
FaqRouter.put("/:_id", verifyAdmin, updateRecord)
FaqRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = FaqRouter