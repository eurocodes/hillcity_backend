const mysql = require("mysql")
const dotenv = require("dotenv");

dotenv.config();

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "euro@eurocodes1",
    database: "hillcity_mentorship",
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