import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;
export function middlewareLoggedIn(
    handler: UserCommandHandler,
): CommandHandler {
    return async (cmdName, ...args) => {
        const config = readConfig();
        const userName = config.currentUserName;

        const user = await getUserByName(userName as string);

        if (!user) {
            throw new Error(`User ${userName} not found`);
        }

        await handler(cmdName, user, ...args);
    };
}
