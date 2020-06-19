const Config = require('dotapp/services/config');
const path = require("path");

module.exports = class Index {

    /**
     * initialize default storage
     * @param storage
     */

    constructor(storage = false) {

        let config = Config.get("storage");

        this.disk = storage;

        let disk_params = storage in config.disks ? config.disks[storage] : config.disks[config.default];

        let driver_module = require(path.join(path.dirname(__filename), "drivers/" + disk_params.driver));

        this.driver = new driver_module(disk_params);
    }

    /**
     * read a file
     * @param file
     * @param encoding
     * @param callback
     */

    read(file, encoding = null, callback) {

        if(typeof encoding === 'function'){
            callback = encoding;
            encoding = null;
        }

        const promise = new Promise((resolve, reject) => {
            this.driver.read(file, encoding, (error, data) => {
                if(error) return reject(error);

                return resolve(data);
            });
        });


        if(callback && typeof callback === "function"){
            promise.then(file => callback(null, file))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * save a file
     * @param file
     * @param data
     * @param encoding
     * @param callback
     */

    save(file, data, encoding = "utf8", callback) {

        if(typeof encoding === 'function'){
            callback = encoding;
            encoding = "utf8";
        }

        const promise = new Promise((resolve, reject) => {
            this.driver.save(file, data, encoding, error => {
                if(error) return reject(error);

                return resolve(file);
            });
        });

        if(callback && typeof callback === "function"){
            promise.then(file => callback(null, file))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * delete a file
     * @param file
     * @param callback
     */

    delete(file, callback) {

        const promise = new Promise((resolve, reject) => {
            this.driver.delete(file, error => {
                if(error) return reject(error);

                return resolve(file)
            });
        });

        if(callback && typeof callback === "function"){
            promise.then(file => callback(null, file))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * check file exists
     * @param file
     * @param callback
     */

    exists(file, callback) {

        const promise = new Promise((resolve, reject) => {
            this.driver.exists(file, error => {
                if(error) return resolve(false);

                return resolve(true)
            });
        });


        if(callback && typeof callback === "function"){
            promise.then(file => callback(null, file))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * get absolute file path
     * @param file
     * @returns {*}
     */

    path(file) {
        return this.driver.path(file);
    }

    /**
     * get file url
     * @param file
     * @returns {*}
     */

    url(file) {
        return this.driver.url(file);
    }

    /**
     * set storage disk
     * @param driver
     * @returns {Index}
     */
    static disk(disk) {
        return new Index(disk);
    }
}
