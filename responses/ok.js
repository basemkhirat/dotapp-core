/**
 * send success response
 * @param data mixed
 * @param message string
 * @returns {*}
 */
module.exports = function (data, message) {

    let response = {};

    response.message = message || this.req.lang("messages.ok");
    response.code = 200;
    response.success = true;
    response.data = data || undefined;

    this.res.status(response.status);

    return this.res.json(response);
};
