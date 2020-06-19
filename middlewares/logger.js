const Logger = require('morgan');
const path = require('path');
const fs = require('fs');

/**
 * Access log is displayed in console in development
 * and logged in access.log in production
 * @returns {logger}
 */
module.exports = function () {
    return process.env.NODE_ENV !== 'production' ?
        Logger("dev") : Logger(
            "combined",
            {stream: fs.createWriteStream(path.join(process.cwd(), 'storage/logs/access.log'))}
        );
}
