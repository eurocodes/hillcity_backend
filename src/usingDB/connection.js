const mysql = require("mysql")
const dotenv = require("dotenv");
const mysqlConfig = require("./dbConfig")

dotenv.config();

const database = mysql.createConnection(mysqlConfig)

database.connect(err => {
    if (!err) {
        console.log("Establshed connection with database")
    } else {
        console.log("Failed to connect to database")
    }
})

module.exports = database;