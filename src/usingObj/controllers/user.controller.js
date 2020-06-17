const database = require("../../usingDB/connection");
const Helper = require("../middlwares/Helper");

class UserCntrl {

    // Login Methoth
    login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Some values are missing" })
        }
        const queryText = 'SELECT * FROM creat_an_account WHERE Email_Address = ?';
        database.query(queryText, [req.body.email], (error, results) => {
            if (error) {
                console.log(error);
            } else if (!results[0]) {
                return res.status(404).send({ message: "Your data cannot be found on our database" })
            }
            if (!Helper.comparePassword(results[0].Password, req.body.password)) {
                return res.status(401).send({ message: "The credentials you provided is incorrect" })
            }
            const userId = results[0].Hillcity_Reference_number;
            const token = Helper.generateToken(userId);
            const role = results[0].accesslv2;
            const name = `${results[0].First_Name} ${results[0].Last_Name}`;

            return res.status(200).send({
                status: "success",
                data: {
                    token,
                    userId,
                    name,
                    role,
                }
            })
        })

    }
}


module.exports = new UserCntrl;