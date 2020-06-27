const path = require("path");
const Auth = require("dotapp/services/auth");
const merge = require("merge-deep");
const all_policies = require(path.join(process.cwd(), "policies")).default;

module.exports = function () {
	return function (req, res, next) {
		req.permissions = [];
		req.policies = all_policies;
		req.can = Auth.can.bind({ req });
		req.canAsync = Auth.canAsync.bind({ req });
		req.hasPermission = Auth.hasPermission.bind({ req });

		if (req.user && req.user.role) {
			req.permissions = req.user.role.permissions;
		}

		let policies = {};

		req.permissions.forEach((permission) => {
			let [module, action] = permission.split(".");
			if (!(module in policies)) {
				policies[module] = {};
				policies[module][action] = true;
			} else {
				policies[module][action] = true;
			}
		});

		req.policies = merge(true, policies, all_policies);

		next();
	};
};
