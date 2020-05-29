const mysql = require("mysql")
const mysqlConfig = require("./dbConfig")

const database = mysql.createConnection(mysqlConfig)

database.connect(err => {
    if (!err) {
        console.log("Establshed connection with database")
    } else {
        console.log("Failed to connect to database")
    }
})

module.exports = database;