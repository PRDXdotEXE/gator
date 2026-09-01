import {
    CommandsRegistry,
    handlerLogin,
    registerCommand,
    runCommand,
} from "./config";

function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("not enough arguments were provided.");
        process.exit(1);
    }
    const cmdName = args[0];
    const remains: string[] = args.slice(1);
    runCommand(commandsRegistry, cmdName, ...remains);
}

main();
