const path = require("path");

module.exports = {

    app: {

        /**
         * The application base url
         */

        url: process.env.APP_URL || 'http://localhost',

        /**
         * The application base url
         */

        debug: process.env.APP_DEBUG || true,

        /**
         * The `port` setting determines which TCP port your app will be deployed on.
         */

        port: process.env.APP_PORT || 3000,

        /**
         * Enabling trust proxy will have the following impact:
         * The value of req.hostname is derived from the value set in the X-Forwarded-Host header,
         * which can be set by the client or by the proxy. X-Forwarded-Proto can be set by the
         * reverse proxy to tell the app whether it is https or http or even an invalid name.
         * This value is reflected by req.protocol.
         * The req.ip and req.ips values are populated with the list of addresses from X-Forwarded-For.
         *
         * If true, the client’s IP address is understood as the left-most entry in the X-Forwarded-* header.
         * If false, the app is understood as directly facing the Internet and the client’s IP address
         * is derived from req.connection.remoteAddress. This is the default setting.
         */

        trust_proxy: process.env.APP_PROXY || false,

        /**
         * View engine to use for your app's server-side views
         */

        view_engine: "ejs",

        /**
         * The views directory path
         */

        views: "views",
    },

    body: {

        /**
         * The extended option allows to choose between parsing the URL-encoded data with the querystring library
         * (when false) or the qs library (when true). The "extended" syntax allows for rich objects and arrays
         * to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
         */

        extended: true,

        /**
         * When set to true, then deflated (compressed) bodies will be inflated;
         * when false, deflated bodies are rejected. Defaults to true.
         */

        inflate: true,

        /**
         * Controls the maximum request body size. If this is a number, then the value specifies the number of bytes;
         * if it is a string, the value is passed to the bytes library for parsing. Defaults to '100kb'.
         */

        limit: '100mb',

        /**
         * The parameterLimit option controls the maximum number of parameters that are allowed in the URL-encoded data.
         * If a request contains more parameters than this value, a 413 will be returned to the client. Defaults to 1000.
         */

        parameterLimit: 1000,

        /**
         * The type option is used to determine what media type the middleware will parse.
         * This option can be a string, array of strings, or a function.
         * If not a function, type option is passed directly to the type-is library
         * and this can be an extension name (like urlencoded), a mime type (like application/x-www-form-urlencoded),
         * or a mime type with a wildcard (like x-www-form-urlencoded).
         * If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value.
         * Defaults to application/x-www-form-urlencoded.
         */

        type: 'application/x-www-form-urlencoded'
    },

    cache: {

        /**
         * this option controls the default cache connection that gets used while
         * using this caching library. This connection is used when another is
         * not explicitly specified when executing a given caching function.
         * Available engines: memory, file and redis
         */

        default: process.env.CACHE_DRIVER || "memory",

        /**
         * default "Time To Live" in seconds
         */

        ttl: process.env.CACHE_TTL || 60,

        /**
         * here you may define all of the cache "engines" for your application
         */

        engines: {

            file: {
                path: process.cwd() + "/storage/cache"
            },

            redis: {
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: process.env.REDIS_PORT || 6379,
                database: process.env.REDIS_DB || 0,
                prefix: process.env.REDIS_PREFIX || "store",
                password: process.env.REDIS_PASS || undefined
            }
        }
    },

    cors: {

        /**
         * Boolean - set origin to true to reflect the request origin, as defined by req.header('Origin'),
         * or set it to false to disable CORS.
         * String - set origin to a specific origin. For example if you set it to "http://example.com"
         * only requests from "http://example.com" will be allowed.
         * RegExp - set origin to a regular expression pattern which will be used to test the request origin.
         * If it's a match, the request origin will be reflected. For example the pattern /example\.com$/
         * will reflect any request that is coming from an origin ending with "example.com".
         * Array - set origin to an array of valid origins. Each origin can be a String or a RegExp.
         * For example ["http://example1.com", /\.example2\.com$/] will accept any request
         * from "http://example1.com" or from a subdomain of "example2.com".
         * Function - set origin to a function implementing some custom logic.
         * The function takes the request origin as the first parameter and a callback
         * (which expects the signature err [object], allow [bool]) as the second.
         */

        origin: "*",

        /**
         * Configures the Access-Control-Allow-Methods CORS header.
         * Expects a comma-delimited string (ex: 'GET,PUT,POST')
         * or an array (ex: ['GET', 'PUT', 'POST'])
         */

        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],

        /**
         * Pass the CORS preflight response to the next handler
         */

        preflightContinue: false,

        /**
         * Provides a status code to use for successful OPTIONS requests,
         * since some legacy browsers (IE11, various SmartTVs) choke on 204.
         */

        optionsSuccessStatus: 204,
    },

    database: {

        /**
         * The database connection string
         */

        url: process.env.DB_URL || 'mongodb://localhost/db_name',

        options: {

            /**
             * The underlying MongoDB driver has deprecated their current connection string parser.
             * Because this is a major change, they added the useNewUrlParser flag to allow users to
             * fall back to the old parser if they find a bug in the new parser.
             * You should set useNewUrlParser: true unless that prevents you from connecting.
             * Note that if you specify useNewUrlParser: true, you must specify a port in your connection string,
             * like mongodb://localhost:27017/dbname. The new url parser does not support connection strings that
             * do not have a port, like mongodb://localhost/dbname.
             */

            useNewUrlParser: true,

            /**
             * DB user
             */

            user: process.env.DB_USER || '',

            /**
             * DB password
             */

            pass: process.env.DB_PASS || '',

            /**
             * By default, mongoose will automatically build indexes defined in your schema
             * when it connects. This is great for development, but not ideal for large production deployments,
             * because index builds can cause performance degradation. If you set autoIndex to false,
             * mongoose will not automatically build indexes for any model associated with this connection.
             */

            autoIndex: true,

            /**
             * False by default. Set to true to make Mongoose's default index build use createIndex()
             * instead of ensureIndex() to avoid deprecation warnings from the MongoDB driver.
             */

            useCreateIndex: true,

            /**
             * True by default. Set to false to make findOneAndUpdate() and findOneAndRemove()
             * use native findOneAndUpdate() rather than findAndModify().
             */

            useFindAndModify: true,

            /**
             * The maximum number of sockets the MongoDB driver will keep open for this connection.
             * By default, poolSize is 5. Keep in mind that, as of MongoDB 3.4, MongoDB only allows
             * one operation per socket at a time, so you may want to increase this if you find you
             * have a few slow queries that are blocking faster queries from proceeding.
             */

            poolSize: 5,

            /**
             * How long the MongoDB driver will wait before killing a socket due to inactivity during
             * initial connection. Defaults to 30000. This option is passed transparently to
             * Node.js' socket#setTimeout() function.
             */

            connectTimeoutMS: 30000,

            /**
             * How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection.
             * A socket may be inactive because of either no activity or a long-running operation.
             * This is set to 30000 by default,
             * you should set this to 2-3x your longest running operation if you expect some of
             * your database operations to run longer than 20 seconds. This option is passed to Node.js
             * socket#setTimeout() function after the MongoDB driver successfully completes.
             */

            socketTimeoutMS: 30000,
        }
    },

    i18n: {

        /**
         * you may alter a site wide default locale
         */

        defaultLocale: "ar",

        /**
         * setup some locales - other locales default to en silently
         */

        locales: ['en', 'ar'],

        /**
         * fall back from ar to en
         */

        fallbacks: {
            'ar': 'en'
        },

        /**
         * where to store json files - defaults to './locales' relative to modules directory
         */

        directory: process.cwd() + '/lang',

        /**
         * sets a custom cookie name to parse locale settings from  - defaults to NULL
         */

        cookie: 'lang',

        /**
         * query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
         */

        queryParameter: 'lang',

        /**
         * control mode on directory creation - defaults to NULL which defaults to umask of process user. Setting has no effect on win.
         */

        directoryPermissions: '755',

        /**
         * watch for changes in json files to reload locale on updates - defaults to false
         */

        autoReload: true,

        /**
         * whether to write new locale information to disk - defaults to true
         */

        updateFiles: false,

        /**
         * sync locale information across all files - defaults to false
         */

        syncFiles: false,

        /**
         * what to use as the indentation unit - defaults to "\t"
         */

        indent: "\t",

        /**
         * setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
         */

        extension: '.json',

        /**
         * setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
         */

        prefix: '',

        /**
         * enable object notation
         */

        objectNotation: false,

        /**
         * setting of log level DEBUG - default to require('debug')('i18n:debug')
         * @param msg
         */

        logDebugFn: function (msg) {
            // console.log('debug', msg);
        },

        /**
         * setting of log level WARN - default to require('debug')('i18n:warn')
         * @param msg
         */

        logWarnFn: function (msg) {
            // console.log('warn', msg);
        },

        /**
         * setting of log level ERROR - default to require('debug')('i18n:error')
         * @param msg
         */

        logErrorFn: function (msg) {
            // console.log('error', msg);
        },

        /**
         * object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
         */

        //register: global,

        /**
         * Downcase locale when passed on queryParam; e.g. lang=en-US becomes
         * en-us.  When set to false, the queryParam value will be used as passed
         * e.g. lang=en-US remains en-US.
         */

        preserveLegacyCase: true
    },

    json: {

        /**
         * When set to true, then deflated (compressed) bodies will be inflated; when false,
         * deflated bodies are rejected. Defaults to true.
         */

        inflate: true,

        /**
         * Controls the maximum request body size. If this is a number,
         * then the value specifies the number of bytes; if it is a string,
         * the value is passed to the bytes library for parsing. Defaults to '100kb'.
         */

        limit: '100mb',

        /**
         * When set to true, will only accept arrays and objects;
         * when false will accept anything JSON.parse accepts. Defaults to true.
         */

        strict: true,

        /**
         * The type option is used to determine what media type the middleware will parse.
         * This option can be a string, array of strings, or a function.
         * If not a function, type option is passed directly to the type-is library and
         * this can be an extension name (like json), a mime type (like application/json),
         * or a mime type with a wildcard.
         * If a function, the type option is called as fn(req) and the request is parsed
         * if it returns a truthy value. Defaults to application/json.
         */

        type: 'application/json'
    },

    jwt: {

        /**
         * is a string, buffer, or object containing either the secret for HMAC algorithms
         * or the PEM encoded private key for RSA and ECDSA.
         * In case of a private key with passphrase an object { key, passphrase }
         * can be used (based on crypto documentation),
         * in this case be sure you pass the algorithm option
         */

        secret: process.env.TOKEN_SECRET || "Q%!$^I4lkj31r$231rkvmmdks231@!$!RFsaf",

        /**
         * expressed in seconds.
         * Eg: 600
         */

        expires: process.env.TOKEN_EXPIRES || 604800
    },

    mail: {

        /**
         * Default mail driver
         * Supported: stream, sendmail, smtp, ses.
         */

        default: process.env.MAIL_DRIVER || "stream",

        /**
         * Sender mail
         */

        from: "Sender <sender@example.com>",

        /**
         * Mail drivers
         */

        drivers: {

            /**
             * write email to console
             * for development
             */

            stream: {
                newline: 'unix',
                buffer: true,
                jsonTransport: true
            },

            /**
             * server sendmail service
             */

            sendmail: {
                sendmail: true,
                newline: 'unix',
                path: process.env.MAIL_SENDMAIL_PATH || '/usr/sbin/sendmail'
            },

            /**
             * smtp account
             */

            smtp: {
                host: process.env.MAIL_HOST || '127.0.0.1',
                port: process.env.MAIL_PORT || 25,
                secure: process.env.MAIL_SECURE || true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                },
                pool: true
            },

            /**
             * AWS SES account
             */

            ses: {
                sendingRate: 1
            }
        }
    },

    media: {

        /**
         * default media storage
         */

        storage: process.env.MEDIA_STORAGE || "uploads",

        /**
         * max file size for upload
         */

        max_file_size: 100 * 1024 * 1024,

        /**
         *  allowed extensions grouped by type
         */

        types: {
            image: ['jpg', 'jpeg', 'png', 'bmp'],
            video: ['mp4', 'flv', 'avi', '3gp', 'webm', "mkv", "mov", "mpg", "wmv", "swf"],
            audio: ['mp3', 'wav'],
            document: ['txt', 'pdf', 'doc', 'docx', 'rtf', 'csv', 'xls', 'xlsx', 'ppt', 'pptx']
        },

        image: {

            /**
             * convert all images to jpg
             */

            force_jpeg: true,

            /**
             * Image quality
             */

            quality: 100,

            /**
             *  modes: scaleToFit, cover, scale, resize, contain
             */

            thumbnails: [
                {name: "medium", width: 256, height: 256, mode: "scaleToFit", quality: 100},
                {name: "small", width: 128, height: 128, mode: "scaleToFit", quality: 100},
                {name: "large", width: 500, height: 400, mode: "scaleToFit", quality: 100},
                {name: "max", width: 1000, height: 600, mode: "scaleToFit", quality: 100}
            ]
        }
    },

    rates: {

        /**
         * Max number of connections during windowMs milliseconds before sending a 429 response.
         * May be a number, or a function that returns a number or a promise
         * Defaults to 5. Set to 0 to disable.
         */

        max: 1000,

        /**
         * How long in milliseconds to keep records of requests in memory.
         * Defaults to 60000 (1 minute).
         */

        windowMs: 60000,

        /**
         * Enable headers for request limit (X-RateLimit-Limit) and current usage (X-RateLimit-Remaining)
         * on all responses and time to wait before retrying (Retry-After) when max is exceeded.
         * Defaults to true.
         */

        headers: true,

        /**
         * Function used to generate keys.
         * Defaults to req.ip:
         * @param req
         * @returns {*}
         */

        keyGenerator: function (req /*, res*/) {
            return req.ip;
        },

        /**
         * The function to handle requests once the max limit is exceeded.
         * It receives the request and the response objects.
         * The "next" param is available if you need to pass to the next middleware.
         * The req.rateLimit object has limit, current, and remaining number of requests and,
         * if the store provides it, a resetTime Date object.
         * @param req
         * @param res
         */

        handler: function (req, res, /*next*/) {
            res.error(req.lang("messages.rate_limit_exceeded"), 429);
        },

        /**
         * When set to true, failed requests won't be counted. Request considered failed when:response status >= 400
         * requests that were cancelled before last chunk of data was sent (response close event triggered)
         * response error event was triggrered by response (Technically they are counted and then un-counted,
         * so a large number of slow requests all at once could still trigger a rate-limit.
         * This may be fixed in a future release.)
         */

        skipFailedRequests: false,

        /**
         * Function used to skip requests. Returning true from the function will skip limiting for that request.
         * Defaults to always false (count all requests):
         */

        skip: function (/*req, res*/) {
            return false;
        }
    },

    services: {

        aws: {

            /**
             * your AWS access key ID
             */

            accessKeyId: process.env.AWS_KEY,

            /**
             * your AWS secret access key
             */

            secretAccessKey: process.env.AWS_SECRET,

            /**
             * the region to send service requests to.
             */

            region: process.env.AWS_REGION || "eu-west-1"
        },

        youtube: {

            key: process.env.YOUTUBE_KEY

        },

        soundcloud: {

            key: process.env.SOUNDCLOUD_KEY

        }
    },

    storage: {

        /**
         * Here you may specify the default filesystem disk that should be used.
         * The "local" storage is enabled by default.
         */

        default: "uploads",

        /**
         * Here you may configure as many filesystem "disks" as you wish, and you
         * may even configure multiple disks of the same driver.
         */

        disks: {

            public: {
                driver: "local",
                path: path.join(process.cwd(), "public"),
                url: process.env.APP_URL
            },

            /**
             * public upload storage
             * used for public file access
             */

            uploads: {
                driver: "local",
                path: path.join(process.cwd(), "public/uploads"),
                url: process.env.APP_URL + "/uploads"
            },

            /**
             * temporary storage
             * used for private file access
             */

            temp: {
                driver: "local",
                path: path.join(process.cwd(), "storage/temp"),
                url: false
            },

            /**
             * s3 cloud storage
             */

            s3: {
                driver: "s3",
                bucket: "cms-js",
                region: "eu-west-1"
            }
        }
    }
};
