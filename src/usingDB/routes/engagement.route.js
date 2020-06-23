const express = require("express")
const EngagementCntrl = require("../../usingObj/controllers/engagement.controller");
const multer = require('../../usingObj/middlwares/multerConfig');

const Router = express.Router()

Router.post("/engagement/create/new", EngagementCntrl.createEngagement);
Router.get("/mentee/engagements", EngagementCntrl.getMyEngagementAwardee);
Router.get("/mentor/engagements", EngagementCntrl.getMyEngagementMentor);
Router.get("/engagements/:id", EngagementCntrl.getOneEngagement);
Router.put("/accepted/engagements/:id", EngagementCntrl.acceptEngagement);
Router.put("/task-assigned/engagements/:id", EngagementCntrl.assignTask);
Router.put("/rejected/engagements/:id", EngagementCntrl.rejectEngagement);
Router.put("/report/engagements/:id", multer, EngagementCntrl.uploadReport);
Router.get("/admin/engagements", EngagementCntrl.getAllEngagements);

module.exports = Router;
