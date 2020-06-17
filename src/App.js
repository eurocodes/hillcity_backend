const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Auth = require("./usingObj/middlwares/Auth");
const EngagementRoute = require("./usingDB/routes/engagement.route");
const UserRoute = require("./usingDB/routes/user.route");
const PageRoute = require("./usingDB/routes/page.route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/auth", UserRoute);
app.use("/api/v1/auth", Auth.verifyToken, PageRoute);
app.use("/api/v1/post", Auth.verifyToken, EngagementRoute)
app.use("/api/v1/get", Auth.verifyToken, EngagementRoute);
app.use("/api/v1/update", Auth.verifyToken, EngagementRoute);

module.exports = app;
