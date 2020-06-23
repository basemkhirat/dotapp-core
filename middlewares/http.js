const walkSync = require('walk-sync');
const path = require('path');

module.exports = function () {

    let requests = {}
    let responses = {};
    let requests_path = path.join(__dirname, "..", "requests");
    let responses_path = path.join(__dirname, "..", "responses");

    walkSync(responses_path).forEach(file => {
        let response = require(path.join(responses_path, file));
        if (typeof response === "function") {
            responses[path.parse(file).name] = response;
        }
    });

    walkSync(requests_path).forEach(file => {
        let request = require(path.join(requests_path, file));
        if (typeof request === "function") {
            requests[path.parse(file).name] = request;
        }
    });

    return  (req, res, next)  => {

        for(let response in responses) {
            res[response] = responses[response].bind({req, res}); ;
        }

        for(let request in requests) {
            req[request] = requests[request].bind({req, res}); ;
        }

        return next();
    }
}
