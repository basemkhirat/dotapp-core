const path = require('path');
const fs = require('fs');
const walkSync = require('walk-sync');

module.exports = new class {

    constructor() {

        let directory = path.join(__dirname, "..", "..", "prototypes");

        walkSync(directory).forEach(function (file) {

            if (fs.statSync(path.join(directory, file)).isFile()) {

                let methods = require(path.join(directory, file));
                let type = eval(path.parse(file).name);

                for (let method in methods) {
                    type.prototype[method] = methods[method];
                }
            }
        });
    }
};
