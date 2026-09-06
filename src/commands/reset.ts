import { resetDb } from "src/lib/db/queries/users";

export async function handlerReset(_: string) {
    await resetDb();
    console.log("Database reset successfully!");
}
