const compression = require('compression');

module.exports = function () {
    return compression({
        threshold: 0,
        filter: function () {
            return true;
        }
    });
}
