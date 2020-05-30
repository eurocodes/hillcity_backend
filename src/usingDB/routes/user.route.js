const express = require("express")
const UserCntrl = require("../../usingObj/controllers/user.controller");

const Router = express.Router()

Router.post("/login", UserCntrl.login);

module.exports = Router;