const mailer = require('nodemailer');

class TransporterSingleton {
    constructor() {
        this.transporter = null;
    }

    getTransporter() {
        if (!this.transporter) {
            this.transporter = mailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAILUSER,
                    pass: process.env.EMAILPWD,
                },
            });
        }
        return this.transporter;
    }
}

const transporter = new TransporterSingleton();

module.exports = transporter.getTransporter();
