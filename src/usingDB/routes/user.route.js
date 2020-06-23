const express = require("express")
const UserCntrl = require("../../usingObj/controllers/user.controller");

const Router = express.Router()

Router.post("/login", UserCntrl.login);
Router.get("/get/users", UserCntrl.getAllUsers);
Router.get("/get/users/:id", UserCntrl.getSingleUser);
Router.get("/get/users/mentees", UserCntrl.getAllMentees);
Router.get("/get/users/mentors", UserCntrl.getAllMentors)
Router.put("/assign/mentor/mentee/:id", UserCntrl.assignMentorMentee)

module.exports = Router;