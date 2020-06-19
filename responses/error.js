/**
 * send a custom error response
 * @param message string
 * @param code integer
 * @param errors array
 * @returns {*}
 */
module.exports = function (message, code = 500, errors = []) {

    let error = new Error();

    error.message = message;
    error.errors = errors.length ? errors : undefined;
    error.status = code;
    error.success = false;

    this.res.status(error.status);

    return this.res.json(error);
};
