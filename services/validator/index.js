const Validator = require("validatorjs");

module.exports = class extends Validator {
	/**
	 * Create the validator object
	 * @param  {...any} params
	 */
	static make(...params) {
		return new this(...params);
	}

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

	/**
	 * check async valid operation
	 */
	async passesAsync() {
		return await this.validate();
	}

	/**
	 * check async invalid operation
	 */
	async failsAsync() {
		return !(await this.validate());
	}
};
