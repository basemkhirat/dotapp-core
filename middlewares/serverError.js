module.exports = function () {
    return function (error, req, res, next) {
        return res.serverError(error);
    };
}
