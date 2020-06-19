/**
 * send bad request response
 * @param message string
 * @returns {*}
 */
module.exports = function (message) {
    return this.res.error(message || this.req.lang("messages.bad_request"), 400);
};
