const express = require("express");
const PageCntrl = require("../../usingObj/controllers/page.controller");

const Router = express.Router();

Router.get("/mentee/dashboard", PageCntrl.getMentor);
Router.get("/mentor/dashboard", PageCntrl.getMentee);

module.exports = Router;