const passwordValidator = require('password-validator');
const bcript = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")
const mailer = require("../mailer/index")

var schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


async function createRecord(req, res) {
    if (req.body.password && schema.validate(req.body.password)) {
        bcript.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                res.send({
                    result: "Fail",
                    reason: "Internal Server Error"
                })
            }
            else {
                try {
                    let data = new User(req.body)
                    data.password = hash
                    await data.save()
                    res.send({
                        result: "Done",
                        data: data
                    })

                    mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: data.email,
                        subject: `Welcome to - ${process.env.SITE_NAME}`,
                        html: `
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f2f4f6;padding:30px 0;">
                            <tr>
                                <td align="center">
                                <!-- Main container -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                                    
                                    <!-- Hero Section -->
                                    <tr>
                                    <td align="center" style="background-color:#6c63ff;padding:40px 24px;color:#ffffff;">
                                        <h1 style="margin:0;font-size:26px;font-weight:700;">Welcome to ${process.env.SITE_NAME}!</h1>
                                        <p style="margin:12px 0 0;font-size:16px;line-height:1.5;">
                                        Hi <strong>${data.name}</strong>, your ${process.env.SITE_NAME} journey begins now 🎉
                                        </p>
                                    </td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                    <td style="padding:30px 24px 20px 24px;">
                                        <p style="margin:0 0 18px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                                        Thank you for joining <strong>${process.env.SITE_NAME}</strong> — your one-stop destination for the latest fashion, lifestyle, and tech products.
                                        </p>
                                        <p style="margin:0 0 18px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                                        You can now explore exclusive deals, track your orders, and create wishlists personalized just for you.
                                        </p>

                                        <!-- CTA -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto;">
                                        <tr>
                                            <td align="center">
                                            <a href="${process.env.SITE_FRONT_END_DOMAIN}/login" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;background-color:#6c63ff;border:1px solid #6c63ff;">
                                                Start Shopping
                                            </a>
                                            </td>
                                        </tr>
                                        </table>

                                        <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;">

                                        <p style="margin:0 0 16px 0;color:#6b7280;font-size:13px;line-height:1.6;">
                                        Tip: Turn on order notifications to never miss updates about your favorite products and flash sales.
                                        </p>
                                    </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                    <td style="padding:18px 24px;background-color:#fafafa;border-top:1px solid #f1f5f9;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td style="font-size:13px;color:#8b95a3;">
                                            <strong>${process.env.SITE_NAME}</strong><br/>
                                            ${process.env.SITE_ADDRESS}
                                            </td>
                                            <td style="text-align:right;font-size:13px;color:#8b95a3;">
                                            <a href="${process.env.SITE_FRONT_END_DOMAIN}" style="color:#6c63ff;text-decoration:none;">Visit our site</a>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>

                                    <!-- Small legal -->
                                    <tr>
                                    <td style="padding:12px 24px 24px 24px;text-align:center;font-size:12px;color:#9aa0a6;">
                                        <p style="margin:6px 0 0 0;">You’re receiving this email because you created an account on <strong>${process.env.SITE_NAME}</strong>.</p>
                                        <p style="margin:6px 0 0 0;">
                                        <a href="mailto:${process.env.SITE_EMAIL}" style="color:#9aa0a6;text-decoration:underline;">Contact Support</a>
                                        </p>
                                    </td>
                                    </tr>

                                </table>
                                <!-- /Main container -->
                                </td>
                            </tr>
                            </table>
                `
                    }, (error) => {
                        error ? console.log(error) : ''
                    })
                } catch (error) {
                    let errorMessage = {}
                    error.keyValue && error.keyValue.username ? errorMessage.username = "User Already Taken" : ""
                    error.keyValue && error.keyValue.email ? errorMessage.email = "Email Address is Already Registered" : ""
                    error.errors?.name ? errorMessage.name = error.errors.name.message : ""
                    error.errors?.username ? errorMessage.username = error.errors.username.message : ""
                    error.errors?.email ? errorMessage.email = error.errors.email.message : ""
                    error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
                    error.errors?.password ? errorMessage.password = error.errors.password.message : ""

                    res.send({
                        result: "Fail",
                        reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
                    })
                }
            }
        })
    }
    else {
        res.send({
            result: "Fail",
            reason: {
                password: "Invalid Password, Password Must Contains Atleast 1 Digit, 1 Upper Case Alphabet, 1 Lower Case Alphabet and Length Must Be 8-100 Character, and Should Not Contains Any Space"
            }
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
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
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.role = req.body.role ?? data.role
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

        error.keyValue && error.keyValue.username ? errorMessage.username = "User Already Taken" : ""
        error.keyValue && error.keyValue.email ? errorMessage.email = "Email Address is Already Registered" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
        error.errors?.password ? errorMessage.password = error.errors.password.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username },
            ]
        })
        if (data && await bcript.compare(req.body.password, data.password)) {
            let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : data.role === "Admin" ? process.env.JWT_SECRET_KEY_ADMIN : process.env.JWT_SECRET_KEY_SUPER_ADMIN
            jwt.sign({ data }, key, {
                expiresIn: "15 days"
            }, (error, token) => {
                if (error) {
                    res.send({
                        result: "Fail",
                        reason: "Internal Server Error, Authetication Token Generation Failed"
                    })
                }
                else {
                    res.send({
                        result: "Done",
                        token: token,
                        data: data
                    })
                }
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: "Invalid Username or Password"
            })
        }
    } catch (error) {
        // console.log(error)
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username },
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, 1))
            data.passwordResetOption = {
                createdAt: new Date(),
                otp: otp
            }
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `OTP for Password Reset : Team - ${process.env.SITE_NAME}`,
                html: `
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
                    <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
                    
                    <p style="font-size: 16px; color: #555555;">Hello ${data.name},</p>
                    
                    <p style="font-size: 16px; color: #555555;">
                        We received a request to reset your password for your ${process.env.SITE_NAME} account. Please use the OTP below to proceed with resetting your password:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 4px;">${otp}</span>
                    </div>

                    <p style="font-size: 14px; color: #777777;">
                        This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support.
                    </p>

                    <p style="font-size: 16px; color: #555555;">Thank you,<br>The ${process.env.SITE_NAME} Team</p>
                    </div>
                `
            }, (error) => {
                error ? console.log(error) : ''
            })

            res.send({
                result: "Done",
                date: "OTP Has Been Sent On Your Registered Email Address"
            })
        }
        else {
            res.send({
                result: "Fail",
                reason: "User Not Found"
            })
        }
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username },
            ]
        })
        if (data) {
            if (data.passwordResetOption.otp == req.body.otp) {
                if ((Date.now() - data.passwordResetOption.createdAt) > 600000) {
                    res.send({
                        result: "Fail",
                        date: "OTP Has Been Expired, Please Try Again"
                    })
                }
                else {
                    res.send({
                        result: "Done"
                    })
                }
            }
            else {
                res.send({
                    result: "Fail",
                    reason: "OTP is Invalid"
                })
            }
        }
        else {
            res.send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username },
            ]
        })
        if (data) {
            if (req.body.password && schema.validate(req.body.password)) {
                bcript.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        res.send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done",
                            message: 'Password Has Been Reset Successfully'
                        })
                    }
                })
            }
            else {
                res.send({
                    result: "Fail",
                    reason: {
                        password: "Invalid Password, Password Must Contains Atleast 1 Digit, 1 Upper Case Alphabet, 1 Lower Case Alphabet and Length Must Be 8-100 Character, and Should Not Contains Any Space"
                    }
                })
            }
        }
        else {
            res.send({
                result: "Fail",
                reason: "UnAuthorized Activity"
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
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3,
}