import { handleError, parseDuration } from "../utils";
import { scrapeFeeds } from "./feeds";

export async function handlerAgg(cmdName: string, timeBetweenRequests: string) {
    const duration = parseDuration(timeBetweenRequests);

    console.log(`Collecting feeds every ${timeBetweenRequests}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, duration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");

            clearInterval(interval);

            resolve();
        });
    });
}
