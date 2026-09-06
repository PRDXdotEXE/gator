import { handlerAddFeed } from "./commands/addfeed";
import { HandlerAgg } from "./commands/aggregrate";
import {
    CommandsRegistry,
    registerCommand,
    runCommand,
} from "./commands/commands";
import { handlerGetFeed } from "./commands/getfeed";
import { handlerReset } from "./commands/reset";
import {
    handlerListUsers,
    handlerLogin,
    handlerRegister,
} from "./commands/users";
import {
    createFeedFollow,
    handlerfollow,
    handlerFollowing,
} from "./lib/db/queries/feed";

async function main() {
    const commandsRegistry: CommandsRegistry = {};

    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerListUsers);
    registerCommand(commandsRegistry, "agg", HandlerAgg);
    registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
    registerCommand(commandsRegistry, "feeds", handlerGetFeed);
    registerCommand(commandsRegistry, "follow", handlerfollow);
    registerCommand(commandsRegistry, "following", handlerFollowing);

    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("not enough arguments were provided.");
        process.exit(1);
    }

    const cmdName = args[0];
    const remains: string[] = args.slice(1);

    try {
        await runCommand(commandsRegistry, cmdName, ...remains);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();
