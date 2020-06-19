const BodyParser = require('body-parser');
const Config = require('dotapp/services/config');

module.exports = function () {
    return BodyParser.json(Config.get('json'));
}
