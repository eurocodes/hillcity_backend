const mysql = require("mysql")
const dotenv = require("dotenv");

const { mysqlConfig } = require("./dbConfig")

dotenv.config();

const database = mysql.createPool(mysqlConfig)

database.getConnection((err, connection) => {
    if (!err) {
        connection.release()
        console.log("Establshed connection with database")
    } else {
        console.log("Failed to connect to database", err.message)
    }
})


module.exports = database;