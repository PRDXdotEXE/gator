import {
    feedByURL,
    FeedUnFollow,
    getFeed,
    getFeedFollowsForUser,
    getNextFeedToFetch,
    markFeedFetched,
} from "../lib/db/queries/feed";
import { getUserById } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";
import { createFeed, createFeedFollow } from "../lib/db/queries/feed";
import { fetchFeed } from "../rss";
import { createPost } from "../lib/db/queries/posts";

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

function parsePublishedAt(value?: string): Date | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

export async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();

    if (!feed) {
        console.log("No feeds found.");
        return;
    }

    console.log(`Fetching feed: ${feed.name}`);

    const rssFeed = await fetchFeed(feed.url);

    await markFeedFetched(feed.id);

    for (const item of rssFeed.channel.items) {
        await createPost({
            title: item.title,
            url: item.link,
            description: item.description ?? null,
            publishedAt: parsePublishedAt(item.pubDate),
            feedId: feed.id,
        });
    }
}
