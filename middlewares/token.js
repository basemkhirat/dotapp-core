const path = require("path");
const jwt = require("jsonwebtoken");
const Auth = require("dotapp/services/auth");
const User = require(path.join(process.cwd(), "models/user")).default;
const Config = require("dotapp/services/config");

module.exports = function () {
	return function (req, res, next) {
		req.role = false;
		req.token = false;
		req.user = false;
		req.getUser = Auth.getUser.bind({ req });
		req.getRole = Auth.getRole.bind({ req });
		req.hasRole = Auth.hasRole.bind({ req });

		if (req.headers.authorization) {
			const parts = req.headers.authorization.split(" ");
			if (parts.length === 2 && parts[0] === "Bearer") {
				req.token = parts[1];
			}
		}

		if (req.token) {
			jwt.verify(req.token, Config.get("jwt.secret"), (error, user) => {
				if (!error && user) {
					User.findById(user._id)
						.where("status", 1)
						.populate({ path: "role", populate: { path: "permission" } })
						.exec((error, user) => {
							if (error) return next(error);

							if (user) {
								req.user = user;
								req.role = user.role ? user.role.name : false;
								req.getUser = Auth.getUser.bind({ req });
								req.getRole = Auth.getRole.bind({ req });
								req.hasRole = Auth.hasRole.bind({ req });
							}

							next();
						});
				} else {
					next();
				}
			});
		} else {
			next();
		}
	};
};
