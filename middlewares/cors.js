const Cors = require('cors');
const Config = require('dotapp/services/config');

module.exports = function () {
    return Cors(Config.get("cors"));
}
