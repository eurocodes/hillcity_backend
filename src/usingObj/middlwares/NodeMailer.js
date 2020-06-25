const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ab572a9571eaa7",
        pass: "c7e20e710b02d6"
    }
});

module.exports = transport;
