const mongoose = require('mongoose');
const Log = require("dotapp/services/log");
const Config = require('dotapp/services/config');

module.exports = new class {

    /**
     * setting global mongoose params
     * and debugging option
     */
    constructor() {

        mongoose.set('debug', Config.get("app.debug") && !Boolean(process.env.APP_CONSOLE));

        mongoose.set('toObject', {
            getters: true,
            virtuals: true,
            minimize: true,
            versionKey: false
        });

        mongoose.set('toJSON', {
            getters: true,
            virtuals: true,
            minimize: true,
            versionKey: false,
        });

        this.connect();
    }

    /**
     * initializing connection
     */
    connect() {

        let config = Config.get("database");

        mongoose.connect(config.url, config.options);

        mongoose.connection.on('connected', function () {
            Log.message('Mongodb connection established to ' + config.url, 'info');
        });

        mongoose.connection.on('error', function (error) {
            Log.message('Mongodb connection error: ' + error, 'error');
        });

        mongoose.connection.on('disconnected', function () {
            Log.message('Mongodb connection disconnected', 'warn');
        });

        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                Log.message('Mongodb connection disconnected through app termination', 'info');
                process.exit();
            });
        });

    }

    /**
     * closing connection
     */
    close() {
        mongoose.connection.close();
    }
}
