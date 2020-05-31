const express = require("express");
const bodyParser = require("body-parser");

const Auth = require("./usingObj/middlwares/Auth");
const UserRoute = require("./usingDB/routes/user.route");
const PageRoute = require("./usingDB/routes/page.route");

const app = express();
app.use(bodyParser.json());

app.use("/api/v1/auth", UserRoute);
app.use("/api/v1/auth", Auth.verifyToken, PageRoute);

module.exports = app;
