const Validator = require("validatorjs");


module.exports = class extends Validator {

    /**
     * Promise based validator method
     * @return promise
     */
    validate() {
        return new Promise((resolve, reject) => {
            if (this.hasAsync) {
                this.passes(() => resolve(true));
                this.fails(() => resolve(false));
            } else {
                this.passes() ? resolve(true) : resolve(false);
            }
        });
    }
}
