const SubcategoryRouter = require("express").Router()
const { subcategoryUploader } = require("../middlewares/fileUploader")
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
} = require("../controllers/SubcategoryControllers")

SubcategoryRouter.post("", verifyAdmin, subcategoryUploader.single("pic"), createRecord)
SubcategoryRouter.get("", verifyAll, getRecord)
SubcategoryRouter.get("/:_id", verifyAll, getSingleRecord)
SubcategoryRouter.put("/:_id", verifyAdmin, subcategoryUploader.single("pic"), updateRecord)
SubcategoryRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = SubcategoryRouter