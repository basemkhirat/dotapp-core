/**
 * set request message
 * @param message
 * @returns {*}
 */
module.exports = function (message) {
    this.res.smessage = message;
    return this.res;
};
