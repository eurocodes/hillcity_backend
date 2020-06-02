const express = require("express")
const EngagementCntrl = require("../../usingObj/controllers/engagement.controller");

const Router = express.Router()

Router.post("/engagement/create/new", EngagementCntrl.createEngagement);
Router.get("/mentee/engagements", EngagementCntrl.getMyEngagementAwardee);
Router.get("/mentor/engagements", EngagementCntrl.getMyEngagementMentor);
Router.get("/engagements/:id", EngagementCntrl.getOneEngagement);
Router.put("/accepted/engagements/:id", EngagementCntrl.acceptEngagement);
Router.put("/rejected/engagements/:id", EngagementCntrl.rejectEngagement);

module.exports = Router;
