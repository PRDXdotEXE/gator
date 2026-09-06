import { User } from "src/lib/db/schema";
import { readConfig, writeConfig } from "../config";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;
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
