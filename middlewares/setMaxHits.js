const rates = require('express-rate-limit');
const Config = require('dotapp/services/config');

module.exports = function (rate, handler) {

    if(rate == undefined){
        throw new Error("setHits requires a valid hits rate max:windowMs")
    }

    let config = Config.get("rates");

    if(typeof rate === "function") {
        handler = rates;
        rate = config.max + ":" + config.windowMs;
    }

    let [max, windowMs] = rate.split(":")

    config.max = max;
    config.windowMs = windowMs;
    config.handler = handler && typeof handler === "function" ? handler: config.handler;

    return rates(config);
}
