require("dotapp/services/prototypes");
require('dotapp/services/database');

const path = require("path");
const Config = require('dotapp/services/config');
const express = require('express');
const Rates = require("dotapp/middlewares/rates");
const Security = require("dotapp/middlewares/security");
const Compression = require("dotapp/middlewares/compression");
const Http = require("dotapp/middlewares/http");
const Token = require("dotapp/middlewares/token");
const Assets = require("dotapp/middlewares/assets");
const Cors = require("dotapp/middlewares/cors");
const I18n = require("dotapp/middlewares/i18n");
const BodyParser = require("dotapp/middlewares/body");
const Json = require("dotapp/middlewares/json");
const Logger = require("dotapp/middlewares/logger");
const Views = require("dotapp/middlewares/views");
const NotFound = require("dotapp/middlewares/notFound");
const ServerError = require("dotapp/middlewares/serverError");
const Router = require("dotapp/services/router");

module.exports = () => {

    const app = express();

    app.set("path", __dirname);
    app.set("env", process.env.NODE_ENV);
    app.set("views", Config.get("app.views"));
    app.set("view engine", Config.get("app.view_engine"));
    app.set('trust proxy', Config.get("app.trust_proxy"));

    app.use(Http());
    app.use(BodyParser());
    app.use(Json());
    app.use(Cors());
    app.use(Security());
    app.use(Compression());
    app.use(Token());
    app.use(I18n());
    app.use(Logger());
    app.use(Assets());
    app.use(Views());
    app.use(Rates());

    app.use(Router.create(require(path.join(process.cwd(), 'routes')).default));

    app.errorHandler = () => [
        NotFound(),
        ServerError()
    ];

    return app;
};
