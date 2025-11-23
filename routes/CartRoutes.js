const CartRouter = require("express").Router()
const {
    verifyUser
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/CartControllers")

CartRouter.post("", verifyUser, createRecord)
CartRouter.get("/user/:userid", verifyUser, getRecord)
CartRouter.get("/:_id", verifyUser, getSingleRecord)
CartRouter.put("/:_id", verifyUser, updateRecord)
CartRouter.delete("/:_id", verifyUser, deleteRecord)


module.exports = CartRouter