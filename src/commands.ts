import { config } from "process";
import { readConfig, writeConfig, Config } from "./config";
import {
    createUser,
    getUserByName,
    getUsers,
    resetDb,
} from "./db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) {
    registry[cmdName] = handler;
}
export async function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error("No such command exist");
    }
    await handler(cmdName, ...args);
}

export async function setUser(userName: string): Promise<void> {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export async function handlerLogin(
    cmdName: string,
    ...args: string[]
): Promise<void> {
    if (args.length < 1) {
        throw new Error(
            " the login handler expects a single argument, the username.",
        );
    }
    const userName = args[0];
    if (!userName) {
        throw new Error("a username is required.");
    }

    const name = await getUserByName(userName);
    if (!name) {
        throw new Error("a username didn't match");
    }
    await setUser(name.name);
    console.log(`User has been set to ${name.name}`);
}

export async function register(cmdName: string, ...args: string[]) {
    const name = args[0];

    console.log("1. name:", name);

    const existingUser = await getUserByName(name);

    if (existingUser) {
        throw new Error("user with same username already exists");
    }

    const user = await createUser(name);
    await setUser(name);
    console.log("run successfully", user);
}

export async function reset() {
    try {
        await resetDb();
        console.log("Database reset successful!");
        process.exit(0);
    } catch (err) {
        console.log("Database reset failed!");
        process.exit(1);
    }
}

export async function users() {
    const config = readConfig();
    const users = await getUsers();

    for (let i = 0; i < users.length; i++) {
        if (config.currentUserName === users[i].name) {
            console.log(`${users[i].name} (current)`);
        } else {
            console.log(`${users[i].name}`);
        }
    }
}
