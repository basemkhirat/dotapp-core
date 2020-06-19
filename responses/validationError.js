/**
 * send validation error response
 * @param errors mixed
 * @param message string
 * @returns {*}
 */
module.exports = function (errors = [], message) {
    errors = Array.isArray(errors) ? errors : [errors];
    return this.res.error(message || this.req.lang("messages.validation_error"), 422, errors);
};
