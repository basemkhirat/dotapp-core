const mailer = require('nodemailer');
const Config = require('dotapp/services/config');
const AWS = require('dotapp/services/aws');

module.exports = new class {

    constructor() {

        this.config = Config.get("mail");

        let transport_options = this.config.drivers[this.config.default];

        if (this.config.default === 'ses') {
            transport_options.SES = new AWS.SES(this.config.drivers[this.config.default])
        }

        this.mailer = mailer.createTransport(transport_options);
    }

    /**
     * send mail
     * @param data
     * @param callback
     */
    async send(data, callback) {

        if (!("from" in data)) {
            data.from = this.config.from;
        }

        const promise = new Promise((resolve, reject) => {
            this.mailer.sendMail(data, (error, info) => {
                if (error) return reject(error);
               resolve(info);
            });
        });

        if(callback && typeof callback === "function"){
            promise.then(data => {
                callback(null, data)
            }).catch(error => {
                callback(error)
            });
        }

        return promise;

        // this.mailer.sendMail(data, (error, info) => {
        //     if (error && callback) return callback(error, info);
        //     if (callback) callback(null, info);
        // });
    }

    /**
     * check connectivity
     * @returns {*}
     */
    verify() {
        return this.mailer.verify;
    }
}




