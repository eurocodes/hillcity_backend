const express = require("express")
const bodyParser = require("body-parser")

const UserRoute = require("./usingDB/routes/user.route")

const app = express()
app.use(bodyParser.json())

app.use("/api/v1/user", UserRoute)

module.exports = app
