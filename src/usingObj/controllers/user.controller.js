const database = require("../../usingDB/connection");
const Helper = require("../middlwares/Helper");

const UserCntrl = {

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

    },

    getAllUsers(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const userQuery = `SELECT Hillcity_Reference_number, First_Name, Last_Name, Email_Address, Phone_Number, 
        Gender, photo,  accesslv2 FROM creat_an_account where educational_status = "Active" order by Email_Address`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" });
            }
            else if (results[0].accesslv2 === "adminmember") {
                database.query(userQuery, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows })
                    } else {
                        console.log(error)
                        return res.status(400).send({ message: "Error occured" })
                    }
                })
            } else {
                return res.status(401).send({ message: "You are not permitted to view these items" })
            }
        })
    },

    getAllMentees(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const userQuery = `SELECT Hillcity_Reference_number, First_Name, Last_Name, Email_Address, Phone_Number, 
        Gender, photo,  accesslv2 FROM creat_an_account where educational_status = "Active"
        and accesslv2 = "mentee" order by Email_Address`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" });
            }
            else if (results[0].accesslv2 === "adminmember") {
                database.query(userQuery, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows })
                    } else {
                        console.log(error)
                        return res.status(400).send({ message: "Error occured" })
                    }
                })
            } else {
                return res.status(401).send({ message: "You are not permitted to view these items" })
            }
        })
    },

    getAllMentors(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const userQuery = `SELECT Hillcity_Reference_number, First_Name, Last_Name, Email_Address, Phone_Number, 
        Gender, photo,  accesslv2 FROM creat_an_account where educational_status = "Active"
        and accesslv2 = "mentor" order by Email_Address`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" });
            }
            else if (results[0].accesslv2 === "adminmember") {
                database.query(userQuery, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows })
                    } else {
                        console.log(error)
                        return res.status(400).send({ message: "Error occured" })
                    }
                })
            } else {
                return res.status(401).send({ message: "You are not permitted to view these items" })
            }
        })
    },

    getSingleUser(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const userQuery = `SELECT Hillcity_Reference_number, First_Name, Last_Name, Email_Address, Phone_Number, 
        Gender, photo,  accesslv2 FROM creat_an_account where Hillcity_Reference_number = ?`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" });
            }
            else if (results[0].accesslv2 === "adminmember") {
                database.query(userQuery, [req.params.id], (error, rows) => {
                    if (rows[0]) {
                        return res.status(200).send({ rows })
                    } else if (error) {
                        return res.status(400).send({ message: "Error occured" })
                    } else {
                        return res.status(404).send({ message: "User not found" })
                    }
                })
            } else {
                return res.status(401).send({ message: "You are not permitted to view these items" })
            }
        })
    },

    assignMentorMentee(req, res) {
        const { mentorId } = req.body;
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const findQuery = `SELECT * from creat_an_account where Hillcity_Reference_number = ?`
        const assignQuery = `UPDATE creat_an_account SET MentorID = ? where Hillcity_Reference_number = ?`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" });
            }
            else if (results[0].accesslv2 === "adminmember") {
                database.query(findQuery, [req.params.id], (error, results) => {
                    if (results[0]) {
                        database.query(assignQuery, [mentorId, req.params.id], (error, rows) => {
                            if (!error) {
                                return res.status(200).send({ rows })
                            } else {
                                console.log(error)
                                return res.status(400).send({ message: "Error occured" })
                            }
                        })
                    } else {
                        return res.status(404).send({ message: "Cannot find this person" })
                    }
                })
            } else {
                return res.status(401).send({ message: "You are not permitted to perform this operation" })
            }
        })
    },

}


module.exports = UserCntrl;