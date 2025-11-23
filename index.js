const express = require("express")
const cors = require("cors")
const path = require("path")

require("dotenv").config()

require("./db-connect")
const Router = require("./routes/index")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", Router)
app.use("/public", express.static("./public"))
app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
    express.static(path.join(__dirname, 'dist'))
});

const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server Is Running at Port ${PORT}`))