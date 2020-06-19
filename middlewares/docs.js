const swaggerUi = require("swagger-ui-express");
const Config = require("dotapp/services/config");

module.exports = function () {
	let docs = require(process.cwd() + "/docs").default;

	docs.host = Config.get("app.url").replace(/(^\w+:|^)\/\//, "");

	return [
		swaggerUi.serve,
		swaggerUi.setup(docs, {
			swaggerUrl: "CMS API Documentation",
			customSiteTitle: "CMS API Documentation",
			customCss:
				".swagger-ui .topbar { display: none } .responses-table > tbody > div {display: none}",
		}),
	];
};
