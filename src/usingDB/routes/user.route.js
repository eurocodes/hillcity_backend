const express = require("express")
const UserCntrl = require("../../usingObj/controllers/user.controller");

const Router = express.Router()

Router.get("/getuser", UserCntrl.getUser)

module.exports = Router;