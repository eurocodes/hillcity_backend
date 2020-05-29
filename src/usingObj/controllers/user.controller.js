const database = require("../../usingDB/connection")

class UserCntrl {

    getUser(req, res) {
        const queryText = `SELECT * from creat_an_account where email_address like "%umeoke@gmail.com%"`;
        const users = database.query(queryText, (error, rows) => {
            if (!error) {
                return res.status(200).send({
                    status: "success",
                    data: rows,
                })
            } else {
                console.log(error);
            }
        })
    }
}

module.exports = new UserCntrl;