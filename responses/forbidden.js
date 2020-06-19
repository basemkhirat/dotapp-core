/**
 * send forbidden response
 * @param message string
 * @returns {*}
 */
module.exports = function (message) {
    return this.res.error(message || this.req.lang("messages.forbidden"), 403);
};
