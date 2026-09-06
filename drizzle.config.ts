import { defineConfig } from "drizzle-kit";

import { readConfig } from "./src/config";

const config = readConfig();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./src/lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: config.dbUrl,
    },
});
