const Config = require('dotapp/services/config');
const JWT = require("jsonwebtoken");
const Bcrypt = require("bcrypt");

module.exports = new class Index {

    /**
     * check user policies in async way
     * @param permission string
     * @param params mixed
     * @param callback function
     * @returns {promise}
     */
    canAsync(permission, params) {
        return new Promise((resolve) => {
            this.req.can(permission, params, (result) => resolve(result));
        });
    }

    /**
     * check user policies
     * @param {string} permission
     * @param {*} params
     * @param {function} callback
     * @returns {boolean}
     */
    can(permission, params, callback) {

        if(typeof params === "function"){
            callback = params;
            params = undefined;
        }

        let policy_check = false;
        let policies = this.req.policies;
        let [module, action] = permission.split(".");

        if (!module) {

            // Module is not registered in policies

            return this.req.hasPermission(permission);
        }

        if (module in policies) {

            let handler = policies[module];

            if (typeof handler == 'boolean') {
                policy_check = handler;
            }

            if (typeof handler == 'function') {
                if(params !== undefined){
                    handler = handler(this.req, params, callback);
                }else{
                    handler = handler(this.req, callback);
                }
            }

            if (typeof handler == 'object') {

                if (action in handler) {

                    handler = handler[action];

                    if (typeof handler == 'boolean') {
                        policy_check = handler;
                    }

                    if (typeof handler == 'function') {
                        if(params !== undefined){
                            policy_check = handler(this.req, params, callback);
                        }else{
                            policy_check = handler(this.req, callback);
                        }

                    }
                } else {

                    // Action is not registered in policies

                    return this.req.hasPermission(permission);
                }
            }
        }

        return policy_check;
    }


    /**
     * check user permissions
     * @param {string} permission
     * @returns {boolean}
     */
    hasPermission(permission) {

        if(permission === undefined) return false;

        if (this.req.hasRole("superadmin")) return true;

        let [module, action] = permission.split(".");

        let actions = Object.keys(this.req.policies[module]);

        console.log(actions);

        if(actions === undefined) return false;

        if (action === undefined) {

            // match if user has at least one action of module

            return actions.some(action => this.req.permissions.indexOf(module + "." + action) > -1);

        } else if (action === "*") {

            // match if user has all actions of module

            return actions.every(action => this.req.permissions.indexOf(module + "." + action) > -1);
        }

        return this.req.permissions.indexOf(permission) > -1;
    }


    /**
     * get user object
     * @param {string} field
     * @returns {null|object}
     */
    getUser(field = null) {

        let user = this.req.user;

        if (!user) {
            return null;
        }

        if (field) {

            if (field in user) {
                return user[field];
            } else {
                return null;
            }
        }

        return user;
    }


    /**
     * get role object
     * @param {string} field
     * @returns {null|object}
     */
    getRole(field = null) {

        let user = this.req.user;

        if (!user) {
            return null;
        }

        if ("role" in user) {

            let role = user.role;

            if(!role) {
                return null;
            }

            if (field) {

                if (field in role) {
                    return role[field];
                } else {
                    return null;
                }

            } else {
                return role;
            }
        }

        return null;
    }

    /**
     * check if user has specific role
     * @param {boolean} name
     */
    hasRole(name = false) {

        if (!name) {
            return false;
        }

        if (this.req.getRole("name") === name) {
            return true;
        }

        return false;
    }

    /**
     * generate hash from password
     * @param {string} raw_password
     */
    generateHash(raw_password, callback) {
        const promise = new Promise((resolve, reject) => {
            Bcrypt.genSalt(10, (error, salt) => {
                if (error) return reject(error);
                Bcrypt.hash(raw_password, salt, (error, hash) => {
                    if (error) return reject(error);
                    resolve(hash);
                });
            });
        });

        if(callback && typeof callback === "function") {
            promise.then((hash) => callback(hash)).catch((error) => callback(error));
        }

        return promise;

    }

    /**
     * generate a token from payload
     * @param {string} payload 
     */
    generateToken(payload) {
        return JWT.sign(payload, Config.get("jwt.secret"), {
            expiresIn: Config.get("jwt.expires"),
        });
    }

    /**
     * compare two passwords
     * @param {string} first_password
     * @param {string} second_password
     * @param {function} callback
     */
    comparePasswords(first_password, second_password, callback) {
        const promise = new Promise((resolve, reject) => {
            Bcrypt.compare(String(first_password), String(second_password), function (
                error,
                match
            ) {
                if (error) return reject(error);
                if (match) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });

        if(callback && typeof callback === "function") {
            promise.then((is_same) => callback(is_same)).catch((error) => callback(error));
        }

        return promise;
    }

    /**
     * get token expiration
     */
    getTokenExpiration() {
        return Config.get("jwt.expires");
    }
}
