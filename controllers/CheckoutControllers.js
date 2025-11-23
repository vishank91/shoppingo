const Checkout = require("../models/Checkout")
const mailer = require("../mailer/index")
const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body)
        await data.save()

        let finalData = await Checkout.findOne({ _id: data._id })
            .populate("user", ["name", "username", "email"])
            .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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

        let products = finalData.products.map((item) => {
            return `<tr>
                <td style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">${item.product.name}</td>
                <td align="center" style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">${item.quantity}</td>
                <td align="right" style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">₹${item.product.finalPrice}</td>
            </tr>`
        })

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: finalData.user?.email,
            subject: `Your Order From ${process.env.SITE_NAME} Has Been Placed`,
            html: `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f2f4f6;padding:30px 0;">
                        <tr>
                            <td align="center">
                            <!-- Main Container -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                                
                                <!-- Hero Section -->
                                <tr>
                                <td align="center" style="background-color:#6c63ff;padding:40px 24px;color:#ffffff;">
                                    <h1 style="margin:0;font-size:26px;font-weight:700;">Thank You for Your Order!</h1>
                                    <p style="margin:12px 0 0;font-size:16px;line-height:1.5;">
                                    Hi <strong>${finalData.user?.name}</strong>, your ${process.env.SITE_NAME} order has been received successfully 🎉
                                    </p>
                                </td>
                                </tr>

                                <!-- Order Summary -->
                                <tr>
                                <td style="padding:30px 24px 20px 24px;">
                                    <p style="margin:0 0 10px 0;color:#4b5563;font-size:15px;">
                                    <strong>Order ID:</strong> ${finalData._id}<br/>
                                    <strong>Order Date:</strong> ${finalData.createdAt}
                                    </p>

                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0" style="border-collapse:collapse;margin-top:20px;">
                                    <thead>
                                        <tr style="background-color:#f9fafb;">
                                        <th align="left" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Item</th>
                                        <th align="center" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Qty</th>
                                        <th align="right" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${products}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                        <td colspan="2" align="right" style="padding:8px;font-weight:bold;font-size:14px;color:#111827;">Subtotal:</td>
                                        <td align="right" style="padding:8px;font-size:14px;color:#111827;">₹${finalData.subtotal}</td>
                                        </tr>
                                        <tr>
                                        <td colspan="2" align="right" style="padding:8px;font-weight:bold;font-size:14px;color:#111827;">Shipping:</td>
                                        <td align="right" style="padding:8px;font-size:14px;color:#111827;">₹${finalData.shipping}</td>
                                        </tr>
                                        <tr>
                                        <td colspan="2" align="right" style="padding:8px;font-weight:bold;font-size:15px;color:#111827;border-top:1px solid #e5e7eb;">Total:</td>
                                        <td align="right" style="padding:8px;font-weight:bold;font-size:15px;color:#6c63ff;border-top:1px solid #e5e7eb;">₹${finalData.total}</td>
                                        </tr>
                                    </tfoot>
                                    </table>

                                    <!-- Shipping Address -->
                                    <div style="margin-top:24px;">
                                    <h3 style="margin:0 0 8px 0;font-size:16px;color:#111827;">Shipping Address</h3>
                                    <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                                        ${finalData.deliveryAddress?.name}<br/>
                                        ${finalData.deliveryAddress?.email},${finalData.deliveryAddress?.phone}<br/>
                                        ${finalData.deliveryAddress?.address}<br/>
                                        ${finalData.deliveryAddress?.pin}, ${finalData.deliveryAddress?.city} - ${finalData.deliveryAddress?.state}
                                    </p>
                                    </div>

                                    <!-- CTA -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto;">
                                    <tr>
                                        <td align="center">
                                        <a href="${process.env.SITE_FRONT_END_DOMAIN}/orders" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;background-color:#6c63ff;border:1px solid #6c63ff;">
                                            View Order Details
                                        </a>
                                        </td>
                                    </tr>
                                    </table>
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
                                    <p style="margin:6px 0 0 0;">You’re receiving this email because you placed an order on <strong>${process.env.SITE_NAME}</strong>.</p>
                                    <a href="mailto:${process.env.SITE_EMAIL}" style="color:#9aa0a6;text-decoration:underline;">Contact Support</a>
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
        console.log(error)
        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : ""
        error.errors?.deliveryAddress ? errorMessage.deliveryAddress = error.errors.deliveryAddress.message : ""
        error.errors?.subtotal ? errorMessage.subtotal = error.errors.subtotal.message : ""
        error.errors?.total ? errorMessage.total = error.errors.total.message : ""
        error.errors?.shipping ? errorMessage.shipping = error.errors.shipping.message : ""

        res.send({
            result: "Fail",
            reason: Object.values(errorMessage).length ? errorMessage : "Internal Server Error"
        })
    }
}
async function getAllRecord(req, res) {
    try {
        let data = await Checkout.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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
async function getRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
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
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()

            let finalData = await Checkout.findOne({ _id: data._id })
                .populate("user", ["name", "username", "email"])
                .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
                .populate({
                    path: "products.product",
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

            let products = finalData.products.map((item) => {
                return `<tr>
                <td style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">${item.product.name}</td>
                <td align="center" style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">${item.quantity}</td>
                <td align="right" style="padding:8px;color:#4b5563;font-size:14px;border-bottom:1px solid #f1f5f9;">₹${item.product.finalPrice}</td>
            </tr>`
            })

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: finalData.user?.email,
                subject: `Order Status Update - ${process.env.SITE_NAME}`,
                html: `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f2f4f6;padding:30px 0;">
                        <tr>
                            <td align="center">
                            <!-- Main container -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
                                <!-- Hero -->
                                <tr>
                                <td align="center" style="background-color:#6c63ff;padding:40px 24px;color:#ffffff;">
                                    <h1 style="margin:0;font-size:26px;font-weight:700;">Order Status Updated</h1>
                                    <p style="margin:12px 0 0;font-size:16px;line-height:1.5;">
                                    Hi <strong>${finalData.user?.name}</strong>, your ${process.env.SITE_NAME} order status has changed.
                                    </p>
                                </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                <td style="padding:30px 24px 20px 24px;">
                                    <p style="margin:0 0 18px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                                    We wanted to let you know that your order <strong>#${finalData._id}</strong> placed on <strong>${finalData.createdAt}</strong> has been updated.
                                    </p>

                                    <div style="margin:20px 0;padding:16px 20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">
                                    <p style="margin:0;font-size:15px;color:#111827;">
                                        <strong>Current Status:</strong>
                                        <span style="color:#6c63ff;font-weight:600;">${finalData.orderStatus}</span>
                                    </p>
                                    </div>

                                    <!-- CTA -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto;">
                                    <tr>
                                        <td align="center">
                                        <a href="${process.env.SITE_FRONT_END_DOMAIN}/orders" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;background-color:#6c63ff;border:1px solid #6c63ff;">
                                            View Order Details
                                        </a>
                                        </td>
                                    </tr>
                                    </table>

                                    <!-- Order Summary -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="8" border="0" style="border-collapse:collapse;margin-top:20px;">
                                    <thead>
                                        <tr style="background-color:#f9fafb;">
                                        <th align="left" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Item</th>
                                        <th align="center" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Qty</th>
                                        <th align="right" style="font-size:14px;color:#374151;padding:8px;border-bottom:1px solid #e5e7eb;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${products}
                                    </tbody>
                                    </table>

                                    <p style="margin-top:18px;color:#6b7280;font-size:13px;line-height:1.6;">
                                    You’ll receive another email when there’s a new update or once your order is delivered.
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

                                <!-- Legal -->
                                <tr>
                                <td style="padding:12px 24px 24px 24px;text-align:center;font-size:12px;color:#9aa0a6;">
                                    <p style="margin:6px 0 0 0;">You’re receiving this email because you made an order on <strong>${process.env.SITE_NAME}</strong>.</p>
                                    <p style="margin:6px 0 0 0;">
                                    <a href="mailto:${process.env.SITE_EMAIL}" style="color:#9aa0a6;text-decoration:underline;">Contact Support</a>
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
        let data = await Checkout.findOne({ _id: req.params._id })
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
    getAllRecord: getAllRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    order: order,
    verifyOrder: verifyOrder
}