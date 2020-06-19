const Auth = require('dotapp/services/auth');

module.exports = function () {

    return function (req, res, next) {

        if (!req.user) {
            return res.forbidden();
        }

        return next();
    };

}
