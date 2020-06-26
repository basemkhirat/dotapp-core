/**
 * send a custom error response
 * @param message string
 * @param code integer
 * @param errors array
 * @returns {*}
 */
module.exports = function (message, code = 500, errors) {

    let error = new Error();

    error.message = message;
    error.code = code;
    error.success = false;
    error.errors = errors || undefined;

    this.res.status(code);

    return this.res.json(error);
};
