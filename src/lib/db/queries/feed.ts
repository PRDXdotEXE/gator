import { url } from "inspector/promises";
import { db } from "..";
import { Feed, feedFollows, feeds, User, users } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeed(feed: {
    name: string;
    url: string;
    userId: string;
}) {
    const [result] = await db.insert(feeds).values(feed).returning();

    return result;
}

export async function getFeed() {
    const result = await db
        .select({ userId: feeds.userId, name: feeds.name, url: feeds.url })
        .from(feeds);
    return result;
}

export async function createFeedFollow(feed: Feed, user: User) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({
            userId: user.id,
            feedId: feed.id,
        })
        .returning();
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(users.id, user.id))
        .where(eq(feedFollows.id, newFeedFollow.id));
    return result;
}

export async function follow(url: string) {
    
}
