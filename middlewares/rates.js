const rates = require('express-rate-limit');
const Config = require('dotapp/services/config');

module.exports = function () {

    let config = Config.get("rates");

    if(config.global){
        delete config.global;
        return rates(config);
    }

    return (req, res, next) => next();
}
