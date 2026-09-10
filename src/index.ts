import {
    handlerAddFeed,
    handlerFollow,
    handlerFollowing,
    handlerUnFollow,
} from "./commands/feeds";
import { handlerAgg } from "./commands/aggregrate";
import {
    CommandsRegistry,
    registerCommand,
    runCommand,
} from "./commands/commands";
import { handlerGetFeed } from "./commands/feeds";
import { handlerReset } from "./commands/reset";
import {
    handlerListUsers,
    handlerLogin,
    handlerRegister,
} from "./commands/users";
import { middlewareLoggedIn } from "./middleware";
import { handlerBrowse } from "./commands/browse";

async function main() {
    const commandsRegistry: CommandsRegistry = {};

    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerListUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(
        commandsRegistry,
        "unfollow",
        middlewareLoggedIn(handlerUnFollow),
    );

    registerCommand(
        commandsRegistry,
        "addfeed",
        middlewareLoggedIn(handlerAddFeed),
    );

    registerCommand(commandsRegistry, "feeds", handlerGetFeed);

    registerCommand(
        commandsRegistry,
        "follow",
        middlewareLoggedIn(handlerFollow),
    );

    registerCommand(
        commandsRegistry,
        "following",
        middlewareLoggedIn(handlerFollowing),
    );
    registerCommand(
        commandsRegistry,
        "browse",
        middlewareLoggedIn(handlerBrowse),
    );

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
