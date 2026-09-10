import { User } from "../lib/db/schema";
import { readConfig, writeConfig } from "../config";

export type CommandHandler = (
    cmdName: string,
    ...args: string[]
) => Promise<void>;
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

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(
            "Invalid duration. Use formats like 500ms, 1s, 5m, or 1h.",
        );
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return value;

        case "s":
            return value * 1000;

        case "m":
            return value * 60 * 1000;

        case "h":
            return value * 60 * 60 * 1000;

        default:
            throw new Error("Unsupported duration unit.");
    }
}
