const path = require('path');
const jwt = require("jsonwebtoken");
const merge = require('merge-deep');
const Auth = require('dotapp/services/auth');
const User = require(path.join(process.cwd(), 'models/user')).default;
const all_policies = require(path.join(process.cwd(), 'policies')).default;
const Config = require("dotapp/services/config");

module.exports = function () {

    return function (req, res, next) {

        req.role = false;
        req.token = false;
        req.user = false;
        req.permissions = [];
        req.policies = all_policies;
        req.can = Auth.can.bind({req});
        req.canAsync = Auth.canAsync.bind({req});
        req.hasPermission = Auth.hasPermission.bind({req});
        req.getUser = Auth.getUser.bind({req});
        req.getRole = Auth.getRole.bind({req});
        req.hasRole = Auth.hasRole.bind({req});

        if (req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                req.token = parts[1];
            }
        }

        if (req.token) {

            jwt.verify(req.token, Config.get('jwt.secret'), (error, user) => {

                if (!error && user) {

                    User.findById(user._id)
                        .where("status", 1)
                        .populate({path: 'role', populate: { path: 'permission'}})
                        .exec((error, user) => {
                            if (error) return next(error);

                            if (user) {
                                req.permissions = user.role ? user.role.permissions : [];
                                req.user = user;
                                req.role = user.role ? user.role.name : false;
                                req.getUser = Auth.getUser.bind({req});
                                req.getRole = Auth.getRole.bind({req});
                                req.hasRole = Auth.hasRole.bind({req});
                            }

                            let policies = {};

                            req.permissions.forEach(permission => {

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
                        });

                } else {
                    next();
                }
            });

        } else {
            next();
        }
    }

}
