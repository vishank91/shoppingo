const ContactUs = require("../models/ContactUs")
const mailer = require("../mailer/index")

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: `New Contact Inquiry - ${process.env.SITE_NAME}`,
            html: `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0;">
                        <tr>
                            <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                                
                                <!-- Header -->
                                <tr>
                                <td align="center" style="background-color: #0f12c0ff; padding: 20px;">
                                    <h1 style="color: #ffffff; margin: 0;">🛍️ ${process.env.SITE_NAME}</h1>
                                </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                <td style="padding: 30px;">
                                    <h2 style="color: #333333; margin-top: 0;">New Contact Form Submission</h2>
                                    <p style="color: #555555; font-size: 15px;">You have received a new message from the ${process.env.SITE_NAME} contact form.</p>

                                    <table cellpadding="8" cellspacing="0" border="0" width="100%" style="background-color: #f9f9f9; border-radius: 6px; margin-top: 15px;">
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Name:</td>
                                        <td style="color: #555555;">${data.name}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Email:</td>
                                        <td style="color: #555555;">${data.email}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Subject:</td>
                                        <td style="color: #555555;">${data.subject}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Message:</td>
                                        <td style="color: #555555;">${data.message}</td>
                                    </tr>
                                    </table>

                                    <p style="margin-top: 20px; color: #666666; font-size: 14px;">
                                    Please respond to the user at <a href="mailto:${data.email}" style="color: #ff6f61;">${data.email}</a>.
                                    </p>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td align="center" style="background-color: #f9f9f9; padding: 15px;">
                                    <p style="color: #888888; font-size: 13px; margin: 0;">This is an automated notification from ${process.env.SITE_NAME} Contact Form.</p>
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

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: `We Received Your Message - ${process.env.SITE_NAME}`,
            html: `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0;">
                        <tr>
                            <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                                
                                <!-- Header -->
                                <tr>
                                <td align="center" style="background-color: #0f12c0ff; padding: 20px;">
                                    <h1 style="color: #ffffff; margin: 0;">🛍️ ${process.env.SITE_NAME}</h1>
                                </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                <td align="center" style="padding: 40px 30px 20px;">
                                    <h2 style="color: #333333; margin: 0;">Thank You for Contacting Us!</h2>
                                    <p style="color: #666666; font-size: 16px; margin: 15px 0 0;">
                                    Hi <strong>${data.name}</strong>,<br>
                                    We’ve received your message and our support team will get back to you soon.
                                    </p>
                                </td>
                                </tr>

                                <!-- Message Summary -->
                                <tr>
                                <td align="center" style="padding: 20px 30px;">
                                    <table cellpadding="8" cellspacing="0" border="0" width="100%" style="background-color: #f9f9f9; border-radius: 6px;">
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Subject:</td>
                                        <td style="color: #555555;">${data.subject}</td>
                                    </tr>
                                    <tr>
                                        <td width="30%" style="font-weight: bold; color: #333333;">Your Message:</td>
                                        <td style="color: #555555;">${data.message}</td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>

                                <!-- CTA -->
                                <tr>
                                <td align="center" style="padding: 20px;">
                                    <a href="${data.SITE_FRONT_END_DOMAIN}" 
                                    style="background-color: #ff6f61; color: #ffffff; text-decoration: none; 
                                            padding: 12px 28px; border-radius: 25px; display: inline-block; 
                                            font-weight: bold;">
                                    Visit ${process.env.SITE_NAME}
                                    </a>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td align="center" style="background-color: #f9f9f9; padding: 15px;">
                                    <p style="color: #888888; font-size: 13px; margin: 0;">
                                    © 2025 ${process.env.SITE_NAME}. All Rights Reserved.<br>
                                    <a href="mailto:${process.env.SITE_EMAIL}" style="color: #ff6f61; text-decoration: none;">${process.env.SITE_EMAIL}</a>
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
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
        error.errors?.subject ? errorMessage.subject = error.errors.subject.message : ""
        error.errors?.message ? errorMessage.message = error.errors.message.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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