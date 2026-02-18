import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/server-data";

export async function POST(req: NextRequest) {
    const { postId, action, userId, userName, content } = await req.json();
    if (action === "like") {
        const post = store.likePost(postId);
        return NextResponse.json({ success: true, likes: post?.likes });
    }
    if (action === "comment") {
        const post = store.addComment(postId, { userId, userName, content, timestamp: new Date().toISOString() });
        return NextResponse.json({ success: true, comments: post?.comments });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
