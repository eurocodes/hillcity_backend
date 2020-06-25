const database = require("../../usingDB/connection");
const DateTime = require("../middlwares/DateTime");
const ID = require("../middlwares/ID.gen");
const nodeMailer = require("../middlwares/NodeMailer");

const Engagement = {
    async createEngagement(req, res) {
        const month = DateTime.generateDateTime().split(" ")[1];
        const year = DateTime.generateDateTime().split(" ")[3];
        const num = Math.floor(Math.random() * 30);
        const engagementId = ID.generateID();
        const submittedBy = req.user.id;
        const mentorId = req.user.m_id;
        const status = "Pending";
        const any = "";
        let score = 0;
        const { modeOfEngagement, proposedDate, proposedTime, engagementType, reasonForEngagement } = req.body;
        const dateSubmitted = DateTime.generateDateTime();
        const findQuery = `SELECT cm.First_Name as "firstName", cm.Last_Name as "lastName", cm.Email_Address as "email"
        from creat_an_account cm inner join creat_an_account ca on ca.MentorID = cm.Hillcity_Reference_number where ca.Hillcity_Reference_number = ?`;
        const queryText = `INSERT INTO engagement SET engagement_ID = ?, submitted_by = ?, month_submitted = ?, year_submitted = ?,
            mentors_id = ?, status = ?, mode_of_engagement = ?, proposed_date = ?, proposed_time = ?, is_report_up = ?,
            engagement_task_achieved = ?, engagement_communicate = ?, engagement_completed_done = ?, engagement_report_reflect = ?,
            date_submitted = ?, eng_apply_status = ?, Mentors_Accept_rejected_date = ?, mentor_reject_comment = ?, report_date_submitted = ?,
            task_type = ?, date_task_assigned = ?, month_expire = ?, year_expire = ?, engagement_type = ?, reason_for_engagement = ?,
            Mentor_Closure_Comment = ?, Closure_date = ?, Total_Engagement_score = ?`;
        const values = [engagementId, submittedBy, month, year, mentorId, status, modeOfEngagement, proposedDate,
            proposedTime, any, any, any, any, any, dateSubmitted, any, any, any, any, any,
            any, num, year, engagementType, reasonForEngagement, any, any, score];
        database.query(findQuery, [req.user.id], (error, rows) => {
            if (error) {
                console.log("Error here:::", error)
                return res.status(400).send({ message: "Error occured" })
            } else if (rows[0]) {
                database.query(queryText, values, (error, results) => {
                    if (!error) {
                        const message = {
                            from: "mentorship@hillcityfoundation.org",
                            to: rows[0].email,
                            subject: `New Engagement Created by | ${req.user.name}`,
                            html: `<h2>Dear ${rows[0].firstName} ${rows[0].lastName}</h2>
                            <p>Your mentee ${req.user.name} has created a new engagement <b>${engagementId}</b>. The status has been updated to ${status}.</p>
                            <h3><b>Type of engagement: </b>${engagementType}</h3>
                            <h3><b>Reason for engagement: </b>${reasonForEngagement}</h3>
                            <p>This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                        };
                        nodeMailer.sendMail(message, (error, info) => {
                            if (error) {
                                console.log("Error occured", error)
                            } else {
                                console.log("success", info)
                            }
                        })
                        return res.status(201).send({
                            status: "successfully created new engagement",
                            data: results,
                        })
                    } else {
                        return res.status(400).send({ message: "Oops!, something went wrong" })
                    }
                })
            } else {
                res.status(404).send({ message: "an unknown error occured" })
            }
        })
    },

    getMyEngagementAwardee(req, res) {
        const queryText = `SELECT * FROM engagement where submitted_by = ? order by date_submitted desc`;
        database.query(queryText, [req.user.id], (error, results) => {
            if (!error) {
                return res.status(200).send({
                    status: "success",
                    data: results,
                })
            } else {
                return res.status(404).send({ message: "You do not have any engagement records" })
            }
        })
    },

    getMyEngagementMentor(req, res) {
        const queryText = `select ca.First_Name, ca.Last_Name, ca.Email_Address, ca.photo, en.engagement_ID, en.status,
        en.date_submitted, en.report_attached, en.mode_of_engagement, en.proposed_date, en.proposed_time,
        en.report_uploaded, en.engagement_task, en.date_task_assigned, en.task_type, en.engagement_type,
        en.reason_for_engagement from creat_an_account ca inner join engagement en
        on ca.Hillcity_Reference_number = en.submitted_by
        where en.mentors_id = ? order by en.date_submitted desc`;
        database.query(queryText, [req.user.id], (error, results) => {
            if (!error) {
                return res.status(200).send({
                    status: "success",
                    data: results,
                })
            } else {
                return res.status(404).send({ message: "You do not have any engagement records" })
            }
        })
    },

    getOneEngagement(req, res) {
        const queryText = `SELECT * from engagement where engagement_ID = ?`;
        database.query(queryText, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].submitted_by || req.user.id === results[0].mentors_id) {
                return res.status(200).send({
                    status: "success",
                    data: results,
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    },

    acceptEngagement(req, res) {
        const status = "Accepted";
        const { comment } = req.body;
        const findQuery = `SELECT ca.First_Name as "firstName", ca.Last_Name as "lastName", ca.Email_Address as "email",
        en.mentors_id, en.mentor_reject_comment from creat_an_account ca inner join engagement en on
        en.submitted_by = ca.Hillcity_Reference_number where en.engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, Mentors_Accept_rejected_date = ?,
        mentor_reject_comment = ? where engagement_ID = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    DateTime.generateDateTime(),
                    comment || results[0].mentor_reject_comment,
                    req.params.id,
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
                        const message = {
                            from: "mentorship@hillcityfoundation.org",
                            to: results[0].email,
                            subject: `Engagement Status Updated | ${status.toUpperCase()}`,
                            html: `<h2>Dear ${results[0].firstName} ${results[0].lastName}</h2>
                            <p>Your Engagement <b>${req.params.id}</b> has been updated. Your engagement status is now ${status}.
                            This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                        };
                        nodeMailer.sendMail(message, (error, info) => {
                            if (error) {
                                console.log("Error occured", error)
                            } else {
                                console.log("success", info)
                            }
                        })
                        return res.status(200).send({ rows });
                    } else {
                        console.log(error);
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    },

    rejectEngagement(req, res) {
        const status = "Rejected";
        const { comment } = req.body;
        const findQuery = `SELECT ca.First_Name as "firstName", ca.Last_Name as "lastName", ca.Email_Address as "email",
        en.mentors_id, en.mentor_reject_comment from creat_an_account ca inner join engagement en on
        en.submitted_by = ca.Hillcity_Reference_number where en.engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, Mentors_Accept_rejected_date = ?,
        mentor_reject_comment = ? where engagement_ID = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    DateTime.generateDateTime(),
                    comment || results[0].mentor_reject_comment,
                    req.params.id
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
                        const message = {
                            from: "mentorship@hillcityfoundation.org",
                            to: results[0].email,
                            subject: `Engagement Status Updated | ${status.toUpperCase()}`,
                            html: `<h2>Dear ${results[0].firstName} ${results[0].lastName}</h2>
                            <p>Your Engagement <b>${req.params.id}</b> has been updated. Your engagement status is now ${status}.
                            This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                        };
                        nodeMailer.sendMail(message, (error, info) => {
                            if (error) {
                                console.log("Error occured", error)
                            } else {
                                console.log("success", info)
                            }
                        })
                        return res.status(200).send({ rows });
                    } else {
                        console.log(error);
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    },

    assignTask(req, res) {
        const status = "Task Assigned";
        const dateTime = DateTime.generateDateTime()
        const { engagementTask, taskType } = req.body;
        const findQuery = `SELECT ca.First_Name as "firstName", ca.Last_Name as "lastName", ca.Email_Address as "email",
        en.mentors_id, en.mentor_reject_comment from creat_an_account ca inner join engagement en on
        en.submitted_by = ca.Hillcity_Reference_number where en.engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, engagement_task = ?, task_type = ?, date_task_assigned = ?
        where engagement_ID = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    engagementTask,
                    taskType,
                    dateTime,
                    req.params.id
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
                        const message = {
                            from: "mentorship@hillcityfoundation.org",
                            to: results[0].email,
                            subject: `Engagement Status Updated | ${status.toUpperCase()}`,
                            html: `<h2>Dear ${results[0].firstName} ${results[0].lastName}</h2>
                            <p>Your Engagement <b>${req.params.id}</b> has been updated. Your engagement status is now ${status}.
                            This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                        };
                        nodeMailer.sendMail(message, (error, info) => {
                            if (error) {
                                console.log("Error occured", error)
                            } else {
                                console.log("success", info)
                            }
                        })
                        return res.status(200).send({ rows });
                    } else {
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    },

    uploadReport(req, res) {
        const isReportUp = "Yes";
        const reportAttached = "report attached"
        const dateTime = DateTime.generateDateTime()
        console.log("Request File:", req.file);
        const findQuery = `SELECT cm.First_Name as "firstName", cm.Last_Name as "lastName", cm.Email_Address as "email",
        en.submitted_by from creat_an_account cm inner join engagement en on
        en.mentors_id = cm.Hillcity_Reference_number where en.engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET is_report_up = ?, report_attached = ?, report_date_submitted = ?, report_uploaded = ?
        where engagement_ID = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (!req.file) {
                return res.status(400).send({ message: "File is required" })
            } else if (req.user.id === results[0].submitted_by) {
                const url = req.protocol + "://" + req.get("host");
                const fileUrl = url + "/uploads/" + req.file.filename;
                console.log("File Url::::::", fileUrl);
                const values = [
                    isReportUp,
                    reportAttached,
                    dateTime,
                    fileUrl,
                    req.params.id,

                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
                        const message = {
                            from: "mentorship@hillcityfoundation.org",
                            to: results[0].email,
                            subject: `Engagement Status Updated | ${reportAttached.toUpperCase()}`,
                            html: `<h2>Dear ${results[0].firstName} ${results[0].lastName}</h2>
                            <p>Your mentee ${req.user.name} has updated the engagement <b>${req.params.id}</b>. New status is ${reportAttached}.
                            This is a test, please ignore if you recieve this email by accident and report to Hillcity Admin asap.</p>`,
                        };
                        nodeMailer.sendMail(message, (error, info) => {
                            if (error) {
                                console.log("Error occured", error)
                            } else {
                                console.log("success", info)
                            }
                        })
                        return res.status(200).send({ rows });
                    } else {
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    },

    getAllEngagements(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const engDetailsQuery = `SELECT en.engagement_ID, ca.First_Name, ca.Last_Name, ca.Email_Address, en.status, en.date_submitted, en.report_attached,
        en.mode_of_engagement, en.proposed_date, en.proposed_time, en.report_uploaded, en.engagement_task, en.date_task_assigned,
        en.task_type, en.engagement_type, en.reason_for_engagement, cm.First_Name as "Mentor FirstName", 
        cm.Last_Name as "Mentor LastName", cm.Email_Address as "Mentor Email" FROM creat_an_account ca 
        inner join engagement en on ca.Hillcity_Reference_number = en.submitted_by
        inner join creat_an_account cm on en.mentors_id = cm.Hillcity_Reference_number order by en.date_submitted desc;`
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" })
            } else if (results[0].accesslv2 === "adminmember") {
                database.query(engDetailsQuery, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows });
                    } else {
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "Access denied" })
            }
        })
    },

    getAllMentorsAndEngagements(req, res) {
        const query = 'SELECT * from creat_an_account ca where ca.Hillcity_Reference_number = ?';
        const engDetailsQuery = `SELECT cm.Hillcity_Reference_number, cm.Email_Address, cm.First_Name, cm.Last_Name, en.status,
        en.engagement_type, en.reason_for_engagement, en.report_uploaded, ca.Email_Address as "Mentee Email", ca.First_Name as "Mentee FirstName",
        ca.Last_Name as "Mentee LastName" from creat_an_account cm inner join engagement en
        on cm.Hillcity_Reference_number = en.mentors_id inner join creat_an_account ca
        on cm.Hillcity_Reference_number = ca.MentorID order by cm.Email_Address`;
        database.query(query, [req.user.id], (error, results) => {
            if (error) {
                return res.status(400).send({ message: "Error occured" })
            } else if (results[0].accesslv2 === "adminmember") {
                database.query(engDetailsQuery, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows });
                    } else {
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "Access denied" })
            }
        })
    }
}

module.exports = Engagement;