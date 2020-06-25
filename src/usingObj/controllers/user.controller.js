const database = require("../../usingDB/connection");
const Helper = require("../middlwares/Helper");
const { response } = require("express");
const nodeMailer = require("../middlwares/NodeMailer");

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
        const queryMail = `SELECT cm.First_Name as "firstNameMentor", cm.Last_Name as "lastNameMentor", cm.Email_Address as "emailMentor",
        cm.Phone_Number as "phoneMentor", ca.First_Name as "firstNameMentee", ca.Last_Name as "lastNameMentee", ca.Email_Address as "emailMentee", ca.Phone_Number as "phoneMentee"
        from creat_an_account cm inner join creat_an_account ca on ca.MentorID = cm.Hillcity_Reference_number where ca.Hillcity_Reference_number = ?`;
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
                                database.query(queryMail, [req.params.id], (error, response) => {
                                    if (error) {
                                        return res.status(400).send({ message: "An error occured" })
                                    } else if (response[0]) {
                                        const messageMentor = {
                                            from: "mentorship@hillcityfoundation.org",
                                            to: [response[0].emailMentor, "vision@hillcityfoundation.org"],
                                            subject: `New Mentee Assignment on the Hillcity Portal`,
                                            html: `<h2>Dear ${response[0].firstNameMentor} ${response[0].lastNameMentor.toUpperCase()}</h2>
                                            <p>A new mentee has been assigned to you on the Hillcity e-portal.</p>
                                            <h3><b>Name of mentee: </b>${response[0].firstNameMentee} ${response[0].lastNameMentee}</h3>
                                            <h3><b>Email Address: </b>${response[0].emailMentee}</h3>
                                            <h3><b>Phone Number: </b>${response[0].phoneMentee}</h3>
                                            <p>This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                                        };
                                        const messageMentee = {
                                            from: "mentorship@hillcityfoundation.org",
                                            to: response[0].emailMentee,
                                            subject: `Mentor Assignment on the Hillcity Portal`,
                                            html: `<h2>Dear ${response[0].firstNameMentee} ${response[0].lastNameMentee.toUpperCase()}</h2>
                                            <p>A new mentee has been assigned to you on the Hillcity e-portal.</p>
                                            <h3><b>Name: </b>${response[0].firstNameMentor} ${response[0].lastNameMentor}</h3>
                                            <h3><b>Email Address: </b>${response[0].emailMentor}</h3>
                                            <h3><b>Phone Number: </b>${response[0].phoneMentor}</h3>
                                            <p>This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                                        };
                                        nodeMailer.sendMail(messageMentor, (error, info) => {
                                            if (error) {
                                                console.log("Error occured", error)
                                            } else {
                                                console.log("success", info)
                                            }
                                        });
                                        nodeMailer.sendMail(messageMentee, (error, info) => {
                                            if (error) {
                                                console.log("Error occured", error)
                                            } else {
                                                console.log("success", info)
                                            }
                                        })
                                    }
                                })
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