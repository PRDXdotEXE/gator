import { db } from "..";
import { users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createUser(name: string) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));

    return result;
}

export async function getUserById(id: string) {
    const [result] = await db.select().from(users).where(eq(users.id, id));

    return result;
}

export async function resetDb() {
    return await db.execute(sql`TRUNCATE TABLE users CASCADE`);
}
export async function getUsers() {
    return await db.select({ name: users.name }).from(users);
}
