const mongoose = require('mongoose');
const moment = require("moment");
const mongooseAutoPopulate = require('mongoose-autopopulate');
const Config = require('dotapp/services/config');
const Intl = require('./models/plugins/intl');

mongoose.plugin(mongooseAutoPopulate);
mongoose.plugin(Intl, {
    languages: Config.get("i18n.locales"),
    defaultLanguage: Config.get("i18n.defaultLocale")
});

mongoose.plugin(function (schema) {

    schema.set("versionKey", false);

    schema.virtual("created").get(function () {
        return this.created_at ? moment(this.created_at).fromNow() : undefined;
    });

    schema.virtual("updated").get(function () {
        return this.updated_at ? moment(this.updated_at).fromNow() : undefined;
    });

    schema.query.execWithCount = function (callback) {

        if (this.options.limit === 0) {

            this.limit(undefined).skip(undefined).sort(undefined);

            if (callback) {
                return this.countDocuments((error, total) => {
                    if (error) return callback(error);

                    callback(null, {
                        total: total,
                        docs: []
                    })
                });
            } else {
                return new Promise((resolve, reject) => {
                    this.countDocuments((error, total) => {
                        if (error) return reject(error);

                        resolve({
                            total: total,
                            docs: []
                        })
                    });
                });
            }


        } else {

            if (callback) {

                return this.exec((error, docs) => {
                    if (error) return callback(error);

                    this.limit(undefined).skip(undefined).sort(undefined);

                    this.countDocuments((error, total) => {
                        if (error) return callback(error);

                        callback(null, {
                            total: total,
                            docs: docs
                        })
                    });
                });

            } else {

                return new Promise((resolve, reject) => {
                    this.exec((error, docs) => {
                        if (error) return reject(error);

                        this.limit(undefined).skip(undefined).sort(undefined);

                        this.countDocuments((error, total) => {
                            if (error) return reject(error);

                            resolve({
                                total: total,
                                docs: docs
                            })
                        });
                    });
                });

            }


        }
    };

    /**
     * page query scope
     * @param page
     * @param limit
     * @returns {*}
     */
    schema.query.page = function (page = 1, limit = 10) {

        limit = parseInt(limit), page = parseInt(page);

        limit = limit < 800 ? limit : 800;

        return this.limit(limit).skip((page - 1) * limit);
    };

    /**
     * order query scope
     * @param field
     * @param direction
     * @returns {*}
     */
    schema.query.order = function (field = "created_at", direction = "desc") {
        return this.sort({[field]: direction === "desc" ? -1 : 1});
    };
});

mongoose.plugin(function (schema) {

    let toHide = [
        "_id",
    ];

    schema.eachPath(function (pathname, schemaType) {
        if (schemaType.options && schemaType.options.hide) {
            toHide.push(pathname);
        }
    });

    schema.options.toObject = schema.options.toObject || {};

    schema.options.toObject.transform = function (doc, ret) {
        // Loop over all fields to hide
        toHide.forEach(function (pathname) {
            // Break the path up by dots to find the actual
            // object to delete
            var sp = pathname.split('.');
            var obj = ret;
            for (var i = 0; i < sp.length - 1; ++i) {
                if (!obj) {
                    return;
                }
                obj = obj[sp[i]];
            }
            // Delete the actual field
            delete obj[sp[sp.length - 1]];
        });

        return ret;
    };
});

module.exports.Mongoose = mongoose;
module.exports.Schema = mongoose.Schema;
module.exports.Model = mongoose.model;

