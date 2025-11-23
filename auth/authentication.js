const jwt = require("jsonwebtoken")

async function verifySuperAdmin(req, res, next) {
    let token = req.headers.authorization
    let secretKey = process.env.JWT_SECRET_KEY_SUPER_ADMIN
    try {
        jwt.verify(token, secretKey)
        next()
    } catch (error) {
        res.send({
            result: "Fail",
            reason: "Authentication Failed, Possibe Reasons :  1. You Are Not Authorized to Access This API 2. AUthentication Token Expire So Login Again"
        })
    }
}

async function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
        next()
    } catch (error) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
            next()
        } catch (error) {
            res.send({
                result: "Fail",
                reason: "Authentication Failed, Possibe Reasons :  1. You Are Not Authorized to Access This API 2. AUthentication Token Expire So Login Again"
            })
        }
    }
}

async function verifyUser(req, res, next) {
    let token = req.headers.authorization
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
        next()
    } catch (error) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
            next()
        } catch (error) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER)
                next()
            } catch (error) {
                res.send({
                    result: "Fail",
                    reason: "Authentication Failed, Possibe Reasons :  1. You Are Not Authorized to Access This API 2. AUthentication Token Expire So Login Again"
                })
            }
        }
    }
}

async function verifyAll(req, res, next) {
    let token = req.headers.authorization
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY_SUPER_ADMIN)
        next()
    } catch (error) {
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN)
            next()
        } catch (error) {
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER)
                next()
            } catch (error) {
                try {
                    jwt.verify(token, process.env.JWT_SECRET_KEY_PUBLIC)
                    next()
                } catch (error) {
                    res.send({
                        result: "Fail",
                        reason: "Authentication Failed, Possibe Reasons :  1. You Are Not Authorized to Access This API 2. AUthentication Token Expire So Login Again"
                    })
                }
            }
        }
    }
}


module.exports = {
    verifySuperAdmin: verifySuperAdmin,
    verifyAdmin: verifyAdmin,
    verifyUser: verifyUser,
    verifyAll: verifyAll
}