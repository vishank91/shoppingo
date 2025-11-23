const ProductRouter = require("express").Router()
const { productUploader } = require("../middlewares/fileUploader")
const {
    verifyAll,
    verifyAdmin,
    verifySuperAdmin,
    verifyUser,
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ProductControllers")

ProductRouter.post("", verifyAdmin, productUploader.array("pic"), createRecord)
ProductRouter.get("", verifyAll, getRecord)
ProductRouter.get("/:_id", verifyAll, getSingleRecord)
ProductRouter.put("/:_id", verifyUser, productUploader.array("pic"), updateRecord)
ProductRouter.delete("/:_id", verifySuperAdmin, deleteRecord)


module.exports = ProductRouter