const FeatureRouter = require("express").Router()
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
} = require("../controllers/FeatureControllers")

FeatureRouter.post("", verifyAdmin, createRecord)
FeatureRouter.get("", verifyAll, getRecord)
FeatureRouter.get("/:_id", verifyAll, getSingleRecord)
FeatureRouter.put("/:_id", verifyAdmin, updateRecord)
FeatureRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = FeatureRouter