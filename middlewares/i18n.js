const I18n = require("i18n");
const Config = require("dotapp/services/config");
const moment = require("moment");
const parser = require("accept-language-parser");
const Validator = require("validatorjs");
const path = require("path");
const fs = require("fs");

module.exports = function () {
	let config = Config.get("i18n");

	I18n.configure(config);

	return function (req, res, next) {
		let default_locale = config.defaultLocale;

		if (req.headers["accept-language"] !== undefined) {
			let header_lang = req.headers["accept-language"];

			if (config.locales.indexOf(header_lang) > -1) {
				default_locale = header_lang;
			} else {
				let languages = parser.parse(header_lang);

				if (languages.length) {
					default_locale = languages[0].code;
				}
			}
		} else {
			if (req.user && config.locales.indexOf(req.user.lang) > -1) {
				default_locale = req.user.lang;
			}
		}

		req.language = default_locale;

		moment.locale(default_locale);

		Validator.useLang(req.getLocale());

		fs.readFile(
			path.join(process.cwd(), "lang/" + req.getLocale() + "/validation.json"),
			(error, data) => {
				if (error) return next(error);
				Validator.setMessages(req.getLocale(), JSON.parse(data));
				next();
			}
		);
	};
};
