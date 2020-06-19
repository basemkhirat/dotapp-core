const Log = require('dotapp/services/log');
const Config = require('dotapp/services/config');

/**
 * send server error response
 * @param message string
 * @returns {*}
 */
module.exports = function (message) {

    if (message instanceof Error) {
        message = message.stack.split('\n')
            .splice(0, 2)
            .map(line => {
                return line.trim();
            }).join(" ");
    }

    if(message === undefined) {
        message = this.req.lang("messages.server_error");
    }

    Log.message(message, "error");

    if (!Config.get("app.debug")) {
        message = this.req.lang("messages.something_wrong");
    }

    return this.res.error(message, 500);
};
