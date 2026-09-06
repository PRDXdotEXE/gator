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
