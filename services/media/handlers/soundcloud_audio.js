const request = require('request');
const Media = require('dotapp/services/media');
const Config = require('dotapp/services/config');
const Log = require('dotapp/services/log');

module.exports = class {

    constructor(resource) {
        this.resource = resource;
    }

    /**
     * handle video file
     * @param callback
     */
    handle(callback) {

        Log.message("processing soundcloud handler", "info");

        this.getTrack(this.resource.payload).then(audio => {

            this.resource.data = {
                id: audio.id,
                duration: audio.duration,
                embed: "https://w.soundcloud.com/player/?url=" + audio.uri
            };

            this.resource.url = audio.permalink_url;
            this.resource.title = audio.title;
            this.resource.description = audio.description;

            if (audio.artwork_url) {
                Media.save(audio.artwork_url, (error, file) => {
                    this.resource.image = file.image;
                    callback(null, this.resource);
                });
            } else {
                callback(null, this.resource);
            }

        }).catch(error => {
            return callback(error);
        });
    }

    getTrack(url) {

        return new Promise((resolve, reject) => {

            let api = "http://api.soundcloud.com/resolve.json?url="
                + url + "&client_id=" + Config.get("services.soundcloud.key");


            request({uri: api}, (error, response, data) => {
                if (error) return reject(error);

                resolve(JSON.parse(data));
            });
        });
    }
}
