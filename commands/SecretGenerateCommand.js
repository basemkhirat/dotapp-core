const fs = require("fs");

module.exports = class {

    constructor(){
        this.command = "secret:generate";
        this.description = "Genarate a new application secret key";;
    }

    async action() {
        try {

            let key = generateRandomString();

            let content = await fs.readFileSync('.env');

            let file = content.toString();

            file = file.replace(/^TOKEN_SECRET=.*$/mi, "TOKEN_SECRET="+ key);

            fs.writeFileSync(".env", file);

            this.log("Secret key updated successfully!");
        } catch (error) {
            throw error;
        }
    }
}


function generateRandomString(length = 50) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
