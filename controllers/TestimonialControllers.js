const Testimonial = require("../models/Testimonial")

async function createRecord(req, res) {
    try {
        let data = new Testimonial(req.body)
        await data.save()

        let finalData = await Testimonial.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name",
            })
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : ""
        error.errors?.product ? errorMessage.product = error.errors.product.message : ""
        error.errors?.message ? errorMessage.message = error.errors.message.message : ""
        error.errors?.star ? errorMessage.star = error.errors.star.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Testimonial.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name",
            })
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name",
            })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            data.message = req.body.message ?? data.message
            data.star = req.body.star ?? data.star
            await data.save()

            let finalData = await Testimonial.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "product",
                    select: "name",
                })
            res.send({
                result: "Done",
                data: finalData
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                result: "Done",
                message: "Record Has Been Deleted"
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
}