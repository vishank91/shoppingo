const MaincategoryRouter = require("express").Router()
const { maincategoryUploader } = require("../middlewares/fileUploader")
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
} = require("../controllers/MaincategoryControllers")

MaincategoryRouter.post("", verifyAdmin, maincategoryUploader.single("pic"), createRecord)
MaincategoryRouter.get("", verifyAll, getRecord)
MaincategoryRouter.get("/:_id", verifyAll, getSingleRecord)
MaincategoryRouter.put("/:_id", verifyAdmin, maincategoryUploader.single("pic"), updateRecord)
MaincategoryRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = MaincategoryRouter