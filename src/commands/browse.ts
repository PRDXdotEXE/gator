import { User } from "../lib/db/schema";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(_: string, user: User, ...args: string[]) {
    let limit = 2;

    if (args.length > 0) {
        limit = parseInt(args[0]);

        if (Number.isNaN(limit) || limit <= 0) {
            throw new Error("limit must be a positive number");
        }
    }

    const posts = await getPostsForUser(user.id, limit);

    for (const post of posts) {
        console.log(post.title);
        console.log(post.url);
        console.log();
    }
}
