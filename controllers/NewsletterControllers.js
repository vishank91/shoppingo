const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new Newsletter(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `Newsletter Subscription Confirmation - ${process.env.SITE_NAME}`,
            html: `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0; background-color: #f4f4f4;">
                        <tr>
                            <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                                
                                <!-- Header -->
                               <tr>
                                    <td align="center" style="background-color: #0f12c0ff; padding: 20px;">
                                        <h1 style="color: #ffffff; margin: 0;">🛍️ ${process.env.SITE_NAME}</h1>
                                    </td>
                                </tr>

                                <!-- Main Message -->
                                <tr>
                                <td align="center" style="padding: 40px 30px 20px;">
                                    <h2 style="color: #333333; margin: 0;">You're In!</h2>
                                    <p style="color: #666666; font-size: 16px; margin: 15px 0 0;">
                                    Thank you for subscribing to <strong>${process.env.SITE_NAME}</strong>!  
                                    </p>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td align="center" style="background-color: #f9f9f9; padding: 20px;">
                                    <p style="color: #888888; font-size: 13px; margin: 0;">
                                    © 2025 ${process.env.SITE_NAME}. All Rights Reserved.<br>
                                    <a href="${process.env.SITE_FRONT_END_DOMAIN}" style="color: #ff6f61; text-decoration: none;">Visit our website</a>
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
    } catch (error) {
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Email Address is Already Registered With Us" : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
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
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
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