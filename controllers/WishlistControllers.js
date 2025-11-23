const Wishlist = require("../models/Wishlist")

async function createRecord(req, res) {
    try {
        let data = new Wishlist(req.body)
        await data.save()

        let finalData = await Wishlist.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : ""
        error.errors?.product ? errorMessage.product = error.errors.product.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Wishlist.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
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
        let data = await Wishlist.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "product",
                select: "name brand finalPrice stockQuantity stock pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
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
        let data = await Wishlist.findOne({ _id: req.params._id })
        if (data) {
            data.quantity = req.body.quantity ?? data.quantity
            data.total = req.body.total ?? data.total
            await data.save()

            let finalData = await Wishlist.findOne({ _id: data._id })
                .populate("user", ["name", "username"])
                .populate({
                    path: "product",
                    select: "name brand finalPrice stockQuantity stock pic",
                    populate: {
                        path: "brand",
                        select: "-_id name"
                    },
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
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
        let data = await Wishlist.findOne({ _id: req.params._id })
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