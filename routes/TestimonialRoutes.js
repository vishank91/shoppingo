const TestimonialRouter = require("express").Router()
const {
    verifyUser,
    verifyAdmin,
    verifyAll,
} = require("../auth/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/TestimonialControllers")

TestimonialRouter.post("", verifyUser, createRecord)
TestimonialRouter.get("/", verifyAll, getRecord)
TestimonialRouter.get("/:_id", verifyAll, getSingleRecord)
TestimonialRouter.put("/:_id", verifyUser, updateRecord)
TestimonialRouter.delete("/:_id", verifyUser, deleteRecord)


module.exports = TestimonialRouter