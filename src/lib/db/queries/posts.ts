import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { CreatePost, feedFollows, Post, posts } from "../schema";

export async function createPost(post: CreatePost) {
    const result = await db
        .insert(posts)
        .values(post)
        .onConflictDoNothing()
        .returning();

    return result[0];
}

export async function getPostsForUser(userId: string, limit: number) {
    return await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId,
        })
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
}
