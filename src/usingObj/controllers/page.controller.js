const database = require("../../usingDB/connection");

const People = {
    getMentor(req, res) {
        const queryText = `SELECT m.First_Name as "firstName", m.Last_Name as "lastName",
        m.Phone_Number as "phone", m.Email_Address as "email", m.photo as "photo",
        a.First_Name as "Awardee_Firstname", a.Last_Name as "Awardee_Lastname", a.Email_Address as "Awardee_Email", a.Phone_Number as "Awardee_Phone", a.photo as "Awardee_Photo"
        FROM creat_an_account a inner join creat_an_account m
        on a.MentorID = m.Hillcity_Reference_number where a.Hillcity_Reference_number = ?`;

        database.query(queryText, [req.user.id], (error, results) => {
            if (results[0]) {
                return res.status(200).send({
                    status: "success",
                    data: {
                        myDetails: {
                            firstName: results[0].Awardee_Firstname,
                            lastName: results[0].Awardee_Lastname,
                            phone: results[0].Awardee_Phone,
                            email: results[0].Awardee_Email,
                            photo: results[0].Awardee_Photo,
                        },
                        myConnections: results
                    },
                })
            } else if (error) {
                return res.status(404).send({ message: "Not Found" })
            } else {
                return res.status(204).send({ message: "Nothing to display" })
            }
        })
    },

    getMentee(req, res) {
        const queryText = `SELECT a.First_Name as "firstName", a.Last_Name as "lastName",
        a.Phone_Number as "phone", a.Email_Address as "email", a.photo as "photo",
        m.First_Name as "Mentor_FirstName", m.Last_Name as "Mentor_LastName", m.Email_Address as "Mentor_Email", m.Phone_Number as "Mentor_Phone", m.photo as "Mentor_Photo"
        FROM creat_an_account a inner join creat_an_account m
        on a.MentorID = m.Hillcity_Reference_number where a.MentorID = ?`

        database.query(queryText, [req.user.id], (error, results) => {
            if (results[0]) {
                return res.status(200).send({
                    status: "success",
                    data: {
                        myDetails: {
                            firstName: results[0].Mentor_FirstName,
                            lastName: results[0].Mentor_LastName,
                            email: results[0].Mentor_Email,
                            phone: results[0].Mentor_Phone,
                            photo: results[0].Mentor_Photo,
                        },
                        myConnections: results
                    },
                })
            } else if (error) {
                return res.status(404).send({ message: "Not Found" })
            } else {
                return res.status(403).send({ message: "Nothing to display" })
            }
        })
    }
}

module.exports = People;