import { error } from "console";
import fs from "fs";
import os from "os";
import path from "path";
import { throwDeprecation } from "process";
import { errorMonitor } from "stream";
import { threadId } from "worker_threads";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
};

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig !== "object" || rawConfig === null) {
        throw new Error("Invalid configuration format");
    }

    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Missing or invalid 'db_url' in configuration");
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
    };

    if (typeof rawConfig.current_user_name === "string") {
        config.currentUserName = rawConfig.current_user_name;
    }

    return config;
}

function writeConfig(cfg: Config): void {
    const filePath = getConfigFilePath();
    const rawConfig: Record<string, any> = {
        db_url: cfg.dbUrl,
    };

    if (cfg.currentUserName !== undefined) {
        rawConfig.current_user_name = cfg.currentUserName;
    }

    fs.writeFileSync(filePath, JSON.stringify(rawConfig, null, 2), "utf-8");
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const rawConfig = JSON.parse(fileContent);
    return validateConfig(rawConfig);
}

export function setUser(userName: string): void {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args) {
        throw new Error(
            " the login handler expects a single argument, the username.",
        );
    }
    const userName = args[0];
    if (!userName) {
        throw new Error("a username is required.");
    }
    setUser(userName);
    console.log(`User has been set to ${userName}`);
}

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
    registry: CommandsRegistry,
    cmdName: string,
    handler: CommandHandler,
) {
    registry[cmdName] = handler;
}
export function runCommand(
    registry: CommandsRegistry,
    cmdName: string,
    ...args: string[]
) {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error("No such command exist");
    }
    handler(cmdName, ...args);
}
