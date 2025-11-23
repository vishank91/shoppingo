const WishlistRouter = require("express").Router()
const {
    verifyUser,
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/WishlistControllers")

WishlistRouter.post("", verifyUser, createRecord)
WishlistRouter.get("/user/:userid", verifyUser, getRecord)
WishlistRouter.get("/:_id", verifyUser, getSingleRecord)
WishlistRouter.put("/:_id", verifyUser, updateRecord)
WishlistRouter.delete("/:_id", verifyUser, deleteRecord)


module.exports = WishlistRouter