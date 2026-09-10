import { db } from "..";
import { Feed, feedFollows, feeds, User, users } from "../schema";
import { and, eq, sql } from "drizzle-orm";
import { getUserByName } from "./users";

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

export async function feedByURL(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function FeedUnFollow(feed: Feed, user: User) {
    const [deleted] = await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.feedId, feed.id),
                eq(feedFollows.userId, user.id),
            ),
        )
        .returning();

    return deleted;
}
export async function getFeedFollowsForUser(userName: string) {
    const user = await getUserByName(userName);
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, user.id));

    return result;
}

export async function markFeedFetched(feedId: string) {
    const now = new Date();

    const [feed] = await db
        .update(feeds)
        .set({
            lastFetchedAt: now,
            updatedAt: now,
        })
        .where(eq(feeds.id, feedId))
        .returning();

    return feed;
}
export async function getNextFeedToFetch() {
    const [feed] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1);
    return feed;
}
