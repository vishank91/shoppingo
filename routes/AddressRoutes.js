const AddressRouter = require("express").Router()
const {
    verifyUser
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/AddressControllers")

AddressRouter.post("", verifyUser, createRecord)
AddressRouter.get("/user/:userid", verifyUser, getRecord)
AddressRouter.get("/:_id", verifyUser, getSingleRecord)
AddressRouter.put("/:_id", verifyUser, updateRecord)
AddressRouter.delete("/:_id", verifyUser, deleteRecord)


module.exports = AddressRouter