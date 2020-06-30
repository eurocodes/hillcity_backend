const mysql = require("mysql")
const dotenv = require("dotenv");

dotenv.config();

const database = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "bac60cfb94e5ec",
    password: "dd5ba189",
    database: "heroku_a04241cf73b03f9",
    multipleStatements: true,
})

database.connect(err => {
    if (!err) {
        console.log("Establshed connection with database")
    } else {
        console.log("Failed to connect to database", err.message)
    }
})

module.exports = database;