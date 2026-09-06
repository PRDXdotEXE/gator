import { db } from "..";
import { Feed, feedFollows, feeds, User, users } from "../schema";
import { eq } from "drizzle-orm";
import { getUserById, getUserByName } from "./users";
import { readConfig } from "src/config";

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

export async function handlerfollow(cmd: string, url: string) {
    try {
        const feed = await feedByURL(url);

        if (!feed) {
            console.error(`Error: Could not find a feed with URL: ${url}`);
            return;
        }

        const config = readConfig();
        const user = await getUserByName(config.currentUserName as string);

        if (!user) {
            console.error(
                `Error: Could not find user: ${config.currentUserName}. Have you logged in?`,
            );
            return;
        }

        const result = await createFeedFollow(feed, user);

        console.log(`userName:${user.name}`);

        for (let i = 0; i < result.length; i++) {
            console.log(`feedName:${result[i].feedName}`);
        }
    } catch (err) {
        console.log("Try again ");
    }
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

export async function handlerFollowing(_: string) {
    const user = readConfig().currentUserName;

    const userInfo = await getUserByName(user as string);

    const follwingFeeds = await getFeedFollowsForUser(userInfo.name);

    console.log(`${userInfo.name} follows:`);
    for (let i = 0; i < follwingFeeds.length; i++) {
        console.log(`${follwingFeeds[i].feedName}`);
    }
}
