const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")
const fs = require("fs")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        let newsletters = await Newsletter.find()
        if (req.files) {
            data.pic = Array.from(req.files).map(x => x.path)
        }
        await data.save()

        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })

        newsletters.forEach(({ email }) => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: `Checkout Our Latest Product - ${process.env.SITE_NAME}`,
                html: `
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 40px 0;">
                    <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #0f12c0ff; padding: 20px;">
                                <h1 style="color: #ffffff; margin: 0;">🛍️ ${process.env.SITE_NAME}</h1>
                            </td>
                        </tr>

                        <tr>
                            <td align="center">
                            <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                                <td align="center" style="padding: 30px 20px 10px;">
                                    <h2 style="color: #333333; margin: 0;">Introducing Our Latest Collection!</h2>
                                    <p style="color: #666666; font-size: 16px; margin-top: 10px;">
                                    Discover the newest addition to our store — crafted just for you.
                                    </p>
                                </td>
                                </tr>

                                <!-- Product Image -->
                                
                                <!-- Description -->
                                <tr>
                                <td align="center" style="padding: 20px;">
                                    <p style="color: #444444; font-size: 15px; line-height: 1.6; margin: 0;">
                                    Be the first to experience our newest product — designed for style, comfort, and quality.
                                    Available now exclusively at <strong>${process.env.SITE_NAME}</strong>. Don’t miss out!
                                    </p>
                                </td>
                                </tr>

                                <!-- CTA Button -->
                                <tr>
                                <td align="center" style="padding: 20px;">
                                    <a href="${process.env.SITE_FRONT_END_DOMAIN}/product/${data._id}" 
                                    style="background-color: #ff6f61; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 25px; display: inline-block; font-weight: bold;">
                                    Explore Now
                                    </a>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td align="center" style="background-color: #f9f9f9; padding: 20px;">
                                    <p style="color: #888888; font-size: 13px; margin: 0;">
                                    You're receiving this email because you subscribed to our newsletter.<br>
                                    © 2025 ${process.env.SITE_NAME}. All Rights Reserved.
                                    </p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                        `
            }, (error) => {
                error ? console.log(error) : ''
            })
        })
    } catch (error) {
        let errorMessage = {}

        if (req.files) {
            Array.from(req.files).forEach(x => {
                fs.unlinkSync(x.path)
            })
        }

        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.maincategory ? errorMessage.maincategory = error.errors.maincategory.message : ""
        error.errors?.subcategory ? errorMessage.subcategory = error.errors.subcategory.message : ""
        error.errors?.brand ? errorMessage.brand = error.errors.brand.message : ""
        error.errors?.color ? errorMessage.color = error.errors.color.message : ""
        error.errors?.size ? errorMessage.size = error.errors.size.message : ""
        error.errors?.stockQuantity ? errorMessage.stockQuantity = error.errors.stockQuantity.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Product.find()
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
            .sort({ _id: -1 })

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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            if (req.body.flag) {
                data.stock = req.body.stock ?? data.stock
                data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            }
            else {
                data.name = req.body.name ?? data.name
                data.maincategory = req.body.maincategory ?? data.maincategory
                data.subcategory = req.body.subcategory ?? data.subcategory
                data.brand = req.body.brand ?? data.brand
                data.color = req.body.color ?? data.color
                data.size = req.body.size ?? data.size
                data.basePrice = req.body.basePrice ?? data.basePrice
                data.discount = req.body.discount ?? data.discount
                data.finalPrice = req.body.finalPrice ?? data.finalPrice
                data.stock = req.body.stock ?? data.stock
                data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
                data.description = req.body.description ?? data.description
                data.active = req.body.active ?? data.active
            }

            if (req.body.oldPics || req.body.oldPics === "") {
                if (req.body.oldPics === "") {
                    data.pic.forEach(x => {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) { }
                    })
                }
                else {
                    data.pic.forEach(x => {
                        if (!(req.body.oldPics.replaceAll("\\", "").includes(x.replaceAll("\\", "")))) {
                            try {
                                fs.unlinkSync(x)
                            } catch (error) { }
                        }
                    })
                }
                data.pic = req.body.oldPics === "" ? [] : req.body.oldPics.split(",")
            }

            if (await data.save() && req.files) {
                data.pic = data.pic.concat(Array.from(req.files).map(x => x.path))
                await data.save()
            }
            await data.save()
            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
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
        let errorMessage = {}

        if (req.files) {
            Array.from(req.files).forEach(x => {
                fs.unlinkSync(x.path)
            })
        }

        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.pic.forEach(x => {
                try {
                    fs.unlinkSync(x)
                } catch (error) { }
            })
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