const Address = require("../models/Address")

async function createRecord(req, res) {
    try {
        let data = new Address(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        // console.log(error)
        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
        error.errors?.address ? errorMessage.address = error.errors.address.message : ""
        error.errors?.pin ? errorMessage.pin = error.errors.pin.message : ""
        error.errors?.city ? errorMessage.city = error.errors.city.message : ""
        error.errors?.state ? errorMessage.state = error.errors.state.message : ""
        error.errors?.user ? errorMessage.user = error.errors.user.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Address.find({ user: req.params.userid }).sort({ _id: -1 })
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
        let data = await Address.findOne({ _id: req.params._id })
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
        let data = await Address.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.pin = req.body.pin ?? data.pin
            data.city = req.body.city ?? data.city
            data.state = req.body.state ?? data.state
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

        error.keyValue ? errorMessage.name = "Address With This Name Already Exist" : ""
        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Address.findOne({ _id: req.params._id })
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