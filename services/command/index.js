const vorpal = require('vorpal');
const walkSync = require('walk-sync');
const path = require('path');
const connection = require("dotapp/services/database");
const SecretGenerateCommand = require("dotapp/commands/SecretGenerateCommand");

let c = vorpal();

c.on("client_command_executed", () => connection.close());

let commands_path = path.join(process.cwd(), "commands");

/**
 * Load user commands
 */
walkSync(commands_path).forEach(file => {
    let command = require(commands_path + "/" + file).default;
    initializeCommand(command);
});

/**
 * Load built-in commands
 */
initializeCommand([
    SecretGenerateCommand
])

/**
 * Initialize a command
 * @param {*} command
 */
function initializeCommand(command) {

    let commands = Array.isArray(command) ? command: [command];

    commands.forEach(command => {
        if (command !== undefined) {
            let command_object = new command();

            let cli = c.delimiter("")
                .command(command_object.command)
                .description(command_object.description);

            if (Array.isArray(command_object.options)) {
                command_object.options.forEach(option => {
                    cli.option(option[0] ? option[0] : "", option[1] ? option[1] : "");
                });
            }

            cli.action(command_object.action).cancel(command_object.cancel);
        }
    });
}

c.show();
c.parse(process.argv);

module.exports = c;
