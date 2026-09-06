import {
    feedByURL,
    FeedUnFollow,
    getFeed,
    getFeedFollowsForUser,
} from "src/lib/db/queries/feed";
import { getUserById } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { createFeed, createFeedFollow } from "src/lib/db/queries/feed";

export async function handlerAddFeed(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed({
        name: feedName,
        url: url,
        userId: user.id,
    });

    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    try {
        await createFeedFollow(feed, user);
    } catch (err) {
        console.log(err);
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}
function printFeed(feed: Feed, user: User) {
    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);
}

export async function handlerGetFeed(_: string) {
    const feed = await getFeed();

    for (const f of feed) {
        const user = await getUserById(f.userId);
        console.log(`* name:          ${f.name}`);
        console.log(`* URL:           ${f.url}`);
        console.log(`* User:          ${user.name}`);
    }
}

export async function handlerFollow(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    try {
        if (args.length !== 1) {
            throw new Error(`usage: ${cmdName} <url>`);
        }

        const url = args[0];

        const feed = await feedByURL(url);

        if (!feed) {
            console.error(`Error: Could not find a feed with URL: ${url}`);
            return;
        }

        const result = await createFeedFollow(feed, user);

        console.log(`userName:${user.name}`);

        for (let i = 0; i < result.length; i++) {
            console.log(`feedName:${result[i].feedName}`);
        }
    } catch (err) {
        console.log("Try again");
    }
}

export async function handlerFollowing(_: string, user: User) {
    const followingFeeds = await getFeedFollowsForUser(user.name);

    console.log(`${user.name} follows:`);

    for (let i = 0; i < followingFeeds.length; i++) {
        console.log(`${followingFeeds[i].feedName}`);
    }
}

export async function handlerUnFollow(
    cmdName: string,
    user: User,
    ...args: string[]
) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const url = args[0];

    const feed = await feedByURL(url);

    if (!feed) {
        throw new Error(`Feed with URL ${url} not found`);
    }

    await FeedUnFollow(feed, user);

    console.log(`${user.name} unfollowed ${feed.name}`);
}
