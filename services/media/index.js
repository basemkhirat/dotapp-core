const Resource = require('dotapp/services/media/resource');
const path = require("path");
const Media = require(path.join(process.cwd(), 'models/media')).default;
const FileSizeException = require("dotapp/services/media/exceptions/FileSizeException");
const FileTypeException = require("dotapp/services/media/exceptions/FileTypeException");

module.exports = new class Index {

    FileSizeException=FileSizeException;
    FileTypeException=FileTypeException;

    /**
     * upload a new resource
     * @param payload
     * @param options {}
     * @param callback
     * @returns {*}
     */
    async save(payload, options = {}, callback) {

        if(typeof options === "function"){
            callback = options;
        }

        const promise = new Promise((resolve, reject) => {

            if (!payload) {
                return reject("Invalid media payload. Available protocols: data:, http:, https");
            }

            let object = new Resource(payload, options);

            object.store((error, resource) => {
                if (error) return reject(error);
                resolve(new Media(resource.toObject()));
            });
        });

        if(callback && typeof callback === "function"){
            promise.then(data => {
                callback(null, data)
            }).catch(error => {
                callback(error)
            });
        }

        return promise;
    }

    /**
     * create a new resource
     * @param payload
     * @param callback
     * @returns {*}
     */
    create(payload, callback) {

        this.upload(payload, (error, media) => {
            if (error) return callback(error);

            media.save((error, media) => {
                if (error) return callback(error);
                callback(null, media);
            });
        });
    }
}
