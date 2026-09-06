import { fetchFeed } from "src/rss";

export async function HandlerAgg(_: string) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed, null, 2));
}
