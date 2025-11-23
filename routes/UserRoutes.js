const UserRouter = require("express").Router()
const {
    verifyAll,
    verifyUser,
    verifyAdmin,
    verifySuperAdmin,
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3,
} = require("../controllers/UserControllers")

UserRouter.post("", verifyAll, createRecord)
UserRouter.get("", verifyAdmin, getRecord)
UserRouter.get("/:_id", verifyUser, getSingleRecord)
UserRouter.put("/:_id", verifyUser, updateRecord)
UserRouter.delete("/:_id", verifySuperAdmin, deleteRecord)
UserRouter.post("/login", verifyAll, login)
UserRouter.post("/forget-password1", verifyAll, forgetPassword1)
UserRouter.post("/forget-password2", verifyAll, forgetPassword2)
UserRouter.post("/forget-password3", verifyAll, forgetPassword3)



module.exports = UserRouter