const BrandRouter = require("express").Router()
const { brandUploader } = require("../middlewares/fileUploader")
const {
    verifyAll,
    verifyAdmin,
    verifySuperAdmin
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/BrandControllers")

BrandRouter.post("", verifyAdmin, brandUploader.single("pic"), createRecord)
BrandRouter.get("", verifyAll, getRecord)
BrandRouter.get("/:_id", verifyAll, getSingleRecord)
BrandRouter.put("/:_id", verifyAdmin, brandUploader.single("pic"), updateRecord)
BrandRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = BrandRouter