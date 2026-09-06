import { getFeed } from "src/lib/db/queries/feed";
import { getUserById } from "src/lib/db/queries/users";

export async function handlerGetFeed(_: string) {
    const feed = await getFeed();

    for (const f of feed) {
        const user = await getUserById(f.userId);
        console.log(`* name:          ${f.name}`);
        console.log(`* URL:           ${f.url}`);
        console.log(`* User:          ${user.name}`);
    }
}
