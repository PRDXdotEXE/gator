import {
    CommandsRegistry,
    handlerLogin,
    register,
    registerCommand,
    reset,
    runCommand,
    users,
} from "./commands";
async function main() {
    const commandsRegistry: CommandsRegistry = {};

    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", register);
    registerCommand(commandsRegistry, "reset", reset);
    registerCommand(commandsRegistry, "users", users);

    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("not enough arguments were provided.");
        process.exit(1);
    }

    const cmdName = args[0];
    const remains: string[] = args.slice(1);

    await runCommand(commandsRegistry, cmdName, ...remains);
    process.exit(0);
}

main();
