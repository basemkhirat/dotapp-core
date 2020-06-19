const Log = require('dotapp/services/log');
const fs = require('fs');
const mime = require('mime-types');

module.exports = class {

    handle(callback) {

        Log.message("getting file from path", "info");

        this.setProvider("file");

        let data = fs.readFileSync(this.payload).toString('base64');

        this.setFileType(mime.lookup(this.payload));
        this.setFileSize(Buffer.byteLength(data, 'base64'));

        this.validate((error) => {
            if (error) return callback(error);

            this.generateFileName((error, file) => {
                if (error) return callback(error);

                data = Buffer.from(data, 'base64');

                this.setFileContent(data);

                callback();
            });
        });
    }
}
