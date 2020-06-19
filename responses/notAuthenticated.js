/**
 * send unauthenticated response
 * @param message string
 * @returns {*}
 */
module.exports = function (message) {
    return this.res.error(message || this.req.lang("messages.not_authenticated"), 401);
};
