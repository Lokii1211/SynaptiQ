import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";

export async function POST(req: NextRequest) {
    const { postId, action, userId, userName, content } = await req.json();

    if (isSupabaseConfigured()) {
        if (action === "like") {
            await db.likePost(postId);
            return NextResponse.json({ success: true });
        }
        if (action === "comment") {
            await db.addComment(postId, { user_id: userId, user_name: userName, content });
            return NextResponse.json({ success: true });
        }
    } else {
        if (action === "like") {
            const post = store.likePost(postId);
            return NextResponse.json({ success: true, likes: post?.likes });
        }
        if (action === "comment") {
            const post = store.addComment(postId, { userId, userName, content, timestamp: new Date().toISOString() });
            return NextResponse.json({ success: true, comments: post?.comments });
        }
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
