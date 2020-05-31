const jwt = require("jsonwebtoken");
const database = require("../../usingDB/connection");

const Auth = {
    /**
       * Verify Token
       * @param {object} req, res, next
       * @returns {object | void} response object
       */

    async verifyToken(req, res, next) {
        // const token = req.headers['x-access-token'];
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ message: 'Token is not provided' });
        }
        try {
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = 'SELECT * FROM creat_an_account WHERE Hillcity_Reference_number = ?';
            database.query(text, [decoded.Hillcity_Reference_number], (error, rows) => {
                if (!rows[0]) {
                    return res.status(401).send({ message: 'Not permitted' });
                }
                req.user = { id: decoded.Hillcity_Reference_number };
                next();
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    },
};

module.exports = Auth;