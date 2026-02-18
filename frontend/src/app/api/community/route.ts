import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category") || undefined;

    if (isSupabaseConfigured()) {
        const posts = await db.getCommunityPosts(category);
        return NextResponse.json({ posts });
    } else {
        const posts = store.getCommunityPosts(category);
        return NextResponse.json({ posts });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (isSupabaseConfigured()) {
        const post = await db.createCommunityPost({
            user_id: body.userId,
            user_name: body.userName || "Anonymous",
            title: body.title,
            content: body.content,
            category: body.category || "general",
            tags: body.tags || [],
        });
        return NextResponse.json({ post });
    } else {
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
}
