const Setting = require("../models/Setting")

async function createRecord(req, res) {
    try {
        var data = await Setting.findOne()
        if (!data) {
            data = new Setting(req.body)
        }
        else {
            data.map1 = req.body.map1
            data.map2 = req.body.map2
            data.address = req.body.address
            data.siteName = req.body.siteName
            data.email = req.body.email
            data.phone = req.body.phone
            data.whatsapp = req.body.whatsapp
            data.facebook = req.body.facebook
            data.youtube = req.body.youtube
            data.linkedin = req.body.linkedin
            data.twitter = req.body.twitter
            data.instagram = req.body.instagram
        }
        await data.save()
        res.send({
            result: "Done",
            data: [data]
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
        let data = await Setting.find()
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

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord
}