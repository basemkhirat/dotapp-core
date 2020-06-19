const request = require('request');

module.exports = new class Request  {

    get(url, options) {
        return this.build(url, "GET", options);
    }

    post(url, options) {
        return this.build(url, "POST", options);
    }

    put(url, options) {
        return this.build(url, "PUT", options);
    }

    patch(url, options) {
        return this.build(url, "PATCH", options);
    }

    delete(url, options) {
        return this.build(url, "DELETE", options);
    }

    build(url, method, options) {

        return new Promise((resolve, reject) => {
            request({
                method: method,
                uri: url,
                ...options
            }, (error, response, body) => {
                if (error) return reject(error);

                return resolve(response);
            })
        })

    }
}


