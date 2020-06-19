const Config = require('dotapp/services/config');
const ejs = require('ejs');
const path = require('path');

/**
 * Get HTML of a given view
 */
module.exports = function (name, payload = {}, callback) {

    const promise = new Promise((resolve, reject) => {

        payload.req = this.req;

        let view_path = path.join(process.cwd(), Config.get("app.views") + "/" + name + ".ejs");

        ejs.renderFile(view_path, payload, (error, data) => {

            if (error) return reject(error);

            resolve(data);
        });
    });

    if(callback && typeof callback === "function"){
        promise.then(data => callback(null, data)).catch(error => callback(error));
    }

    return promise;
};
