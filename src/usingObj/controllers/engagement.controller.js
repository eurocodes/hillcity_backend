const database = require("../../usingDB/connection");
const DateTime = require("../middlwares/DateTime");
const ID = require("../middlwares/ID.gen");

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
        const queryText = `INSERT INTO engagement SET engagement_ID = ?, submitted_by = ?, month_submitted = ?, year_submitted = ?,
            mentors_id = ?, status = ?, mode_of_engagement = ?, proposed_date = ?, proposed_time = ?, is_report_up = ?,
            engagement_task_achieved = ?, engagement_communicate = ?, engagement_completed_done = ?, engagement_report_reflect = ?,
            date_submitted = ?, eng_apply_status = ?, Mentors_Accept_rejected_date = ?, mentor_reject_comment = ?, report_date_submitted = ?,
            task_type = ?, date_task_assigned = ?, month_expire = ?, year_expire = ?, engagement_type = ?, reason_for_engagement = ?,
            Mentor_Closure_Comment = ?, Closure_date = ?, Total_Engagement_score = ?`;
        const values = [engagementId, submittedBy, month, year, mentorId, status, modeOfEngagement, proposedDate,
            proposedTime, any, any, any, any, any, dateSubmitted, any, any, any, any, any,
            any, num, year, engagementType, reasonForEngagement, any, any, score];
        database.query(queryText, values, (error, results) => {
            if (!error) {
                return res.status(201).send({
                    status: "successfully created new engagement",
                    data: results,
                })
            } else {
                return res.status(400).send({ message: "Oops!, something went wrong" })
            }
        })
    },

    getMyEngagementAwardee(req, res) {
        const queryText = `SELECT * FROM engagement where submitted_by = ?`;
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
        const queryText = `select ca.First_Name, ca.Last_Name, ca.Email_Address, en.status,
        en.date_submitted, en.report_attached, en.mode_of_engagement, en.proposed_date, en.proposed_time,
        en.report_uploaded, en.engagement_task, en.date_task_assigned, en.task_type, en.engagement_type,
        en.reason_for_engagement from creat_an_account ca inner join engagement en
        on ca.Hillcity_Reference_number = en.submitted_by
        where en.mentors_id = ?`;
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
        const findQuery = `SELECT * from engagement where engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, Mentors_Accept_rejected_date = ?,
        mentor_reject_comment = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    DateTime.generateDateTime(),
                    comment || results[0].mentor_reject_comment,
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
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
        const findQuery = `SELECT * from engagement where engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, Mentors_Accept_rejected_date = ?,
        mentor_reject_comment = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    DateTime.generateDateTime(),
                    comment || results[0].mentor_reject_comment,
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
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
        const findQuery = `SELECT * from engagement where engagement_ID = ?`;
        const updateQuery = `UPDATE engagement SET status = ?, engagement_task = ?, task_type = ?, date_task_assigned = ?`;
        database.query(findQuery, [req.params.id], (error, results) => {
            if (!results[0]) {
                return res.status(404).send({ message: "Item cannot be found" })
            } else if (req.user.id === results[0].mentors_id) {
                const values = [
                    status,
                    engagementTask,
                    taskType,
                    dateTime,
                ];
                database.query(updateQuery, values, (error, rows) => {
                    if (!error) {
                        return res.status(200).send({ rows });
                    } else {
                        return res.status(403).send({ message: "Ooh! Uh!, something went wrong" });
                    }
                })
            } else {
                return res.status(401).send({ message: "You do not have permission to view this item" })
            }
        })
    }
}

module.exports = Engagement;