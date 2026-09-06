import { XMLParser } from "fast-xml-parser";

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

type ParsedRSSFeed = {
    rss: {
        channel: {
            title: string;
            link: string;
            description: string;
            item: RSSItem | RSSItem[];
        };
    };
};

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        items: RSSItem[];
    };
};
export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        },
    });

    const body = await response.text();

    const parser = new XMLParser({
        processEntities: false,
    });

    const feed: ParsedRSSFeed = parser.parse(body);

    const channel = feed.rss.channel;

    if (!channel.title) {
        throw new Error("Feed has no title");
    }

    const title = channel.title;

    if (!channel.link) {
        throw new Error("Feed has no link");
    }

    const link = channel.link;

    if (!channel.description) {
        throw new Error("Feed has no description");
    }

    const description = channel.description;

    const items: RSSItem[] = [];

    if (channel.item) {
        if (Array.isArray(channel.item)) {
            for (const item of channel.item) {
                if (
                    item.link &&
                    item.description &&
                    item.pubDate &&
                    item.title
                ) {
                    items.push(item);
                }
            }
        } else {
            const item = channel.item;

            if (item.title && item.link && item.description && item.pubDate) {
                items.push(item);
            }
        }
    }

    const result: RSSFeed = {
        channel: {
            title,
            link,
            description,
            items,
        },
    };

    return result;
}
