import fs from "fs";
import os from "os";
import path from "path";

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

export function writeConfig(cfg: Config): void {
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
