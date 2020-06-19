const Cacheman = require('cacheman');
const Config = require('dotapp/services/config');
const Log = require('dotapp/services/log');

let options = {
    engine: Config.get("cache.default"),
    ttl: Config.get("cache.ttl")
};

let engine;

if (Config.get("cache.default") === "file") {

    options.tmpDir = Config.get("cache.engines.file.path");

    let CacheManFile = require('cacheman-file');

    engine = new CacheManFile(options);

} else if (Config.get("cache.default") === "redis") {

    options.host = Config.get("cache.engines.redis.host");
    options.port = Config.get("cache.engines.redis.port");
    options.password = Config.get("cache.engines.redis.password");
    options.database = Config.get("cache.engines.redis.database");
    options.prefix = Config.get("cache.engines.redis.prefix") + ":";

    let CacheManRedis = require('cacheman-redis');

    engine = new CacheManRedis(options);

} else {
    engine = new Cacheman(options);
}

class Cache {

    /**
     * get a value from cache by key
     * @param {*} key
     * @param {*} callback
     */
    get(key, callback) {
        const promise = new Promise((resolve, reject) => {
            engine.get(key, (error, value) => {
                if(error) return reject(error);

                return resolve(value)
            })
        });

        if(callback && typeof callback === "function"){
            promise.then((value) => callback(null, value))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * set a cache value
     * @param {*} key
     * @param {*} value
     * @param {*} ttl
     * @param {*} callback
     */
    set(key, value, ttl = options.ttl, callback) {

        if(typeof ttl === "function"){
            callback = ttl;
            ttl = options.ttl;
        }

        const promise = new Promise((reslove, reject) => {
            engine.set(key, value, ttl, (error, value) => {
                if(error) return reject(error);

                return reslove(value)
            })
        });

        if(callback && typeof callback === "function"){
            promise.then((value) => callback(null, value))
            .catch(error => callback(error));
        }

        return promise;
    }

    /**
     * delete a value from cache
     * @param {*} key
     * @param {*} callback
     */
    delete(key, callback) {
        const promise = new Promise((resolve, reject) => {
            engine.del(key, (error, value) => {
                if(error) return reject(error);

                return resolve(value)
            })
        });

        if(callback && typeof callback === "function"){
            promise.then((value) => callback(null, value))
            .catch(error => callback(error));
        }

        return promise;
    }

}

Log.message("Cache engine: " + JSON.stringify(options), "info");

module.exports = new Cache();

