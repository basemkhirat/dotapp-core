/**
 * send 404 response
 * @param message string
 * @returns {*}
 */
module.exports = function (message) {
    return this.res.error(message || this.req.lang("messages.not_found"), 404);
};
