import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const posts = store.getCommunityPosts(category);
    return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const post = {
        id: `p${Date.now()}`,
        userId: body.userId || "anon",
        userName: body.userName || "Anonymous",
        title: body.title,
        content: body.content,
        category: body.category || "general",
        tags: body.tags || [],
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString(),
    };
    store.addCommunityPost(post);
    return NextResponse.json({ post });
}
