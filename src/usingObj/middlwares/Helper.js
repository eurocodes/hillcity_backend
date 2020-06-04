const jwt = require("jsonwebtoken");
const md5 = require("md5")

const Helper = {
    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} true or false
     */
    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    },

    /**
     * Hash Password Method
     * @param {string} Password
     * @returns {string} returns hashed password
     */
    getPassword(password) {
        return password;
    },

    /**
     * Compare Password
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} returns true or false
     */
    comparePassword(comPassword, password) {
        return md5(password) === comPassword;
    },

    /**
     * Generate Token
     * @param {string} id
     * @param {string} token
     */
    generateToken(id) {
        const token = jwt.sign({
            Hillcity_Reference_number: id,
        },
            process.env.SECRET, { expiresIn: '7d' });
        return token;
    },
}

module.exports = Helper;