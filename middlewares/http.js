const walkSync = require('walk-sync');
const path = require('path');

module.exports = function () {

    return  (req, res, next)  => {

        let responses_path = path.join(req.app.get("path"), "responses");

        walkSync(responses_path).forEach(file => {

            let response = require(path.join(responses_path, file));

            if (typeof response === "function") {
                res[path.parse(file).name] = response.bind({req, res});
            }
        });

        let requests_path = path.join(req.app.get("path"), "requests");

        walkSync(requests_path).forEach(file => {

            let request = require(path.join(requests_path, file));

            if (typeof request === "function") {
                req[path.parse(file).name] = request.bind({req, res});
            }
        });


        return next();
    }
}
