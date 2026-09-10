export function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(
            `Invalid duration: ${durationStr}. Use formats like 1s, 1m, 1h, or 100ms`,
        );
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        default:
            throw new Error(`Unknown duration unit: ${unit}`);
    }
}

export function handleError(err: unknown): void {
    console.error("Error:", err);
}
