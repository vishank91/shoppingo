const Feature = require("../models/Feature")

async function createRecord(req, res) {
    try {
        let data = new Feature(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Feature With This Name Already Exist" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : ""
        error.errors?.icon ? errorMessage.icon = error.errors.icon.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Feature.find().sort({ _id: -1 })
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
        let data = await Feature.findOne({ _id: req.params._id })
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
        let data = await Feature.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.shortDescription = req.body.shortDescription ?? data.shortDescription
            data.icon = req.body.icon ?? data.icon
            data.active = req.body.active ?? data.active
            await data.save()
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
        let errorMessage = {}

        error.keyValue ? errorMessage.name = "Feature With This Name Already Exist" : ""
        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Feature.findOne({ _id: req.params._id })
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