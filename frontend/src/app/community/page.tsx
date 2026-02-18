"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = [
    { id: "all", label: "All Posts", icon: "🌐" },
    { id: "success-stories", label: "Success Stories", icon: "🏆" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "career-dilemma", label: "Career Dilemmas", icon: "🤔" },
    { id: "interview-exp", label: "Interview Experiences", icon: "💼" },
    { id: "general", label: "General", icon: "💬" },
    { id: "coding-help", label: "Coding Help", icon: "🛠️" },
    { id: "opportunities", label: "Opportunities", icon: "🚀" },
];

const SORT_OPTIONS = [
    { id: "latest", label: "Latest First" },
    { id: "popular", label: "Most Popular" },
    { id: "commented", label: "Most Discussed" },
];

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [category, setCategory] = useState("all");
    const [showCreate, setShowCreate] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "general", tags: "" });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [pendingApproval, setPendingApproval] = useState(false);
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        fetch(`/api/community${category !== "all" ? `?category=${category}` : ""}`)
            .then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); });
    }, [category]);

    const handleCreate = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) return;
        const res = await fetch("/api/community", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newPost, tags: newPost.tags.split(",").map(t => t.trim()).filter(Boolean), userName: "You" }),
        });
        const data = await res.json();
        if (data.post) {
            // Mark as pending admin approval
            const postWithApproval = { ...data.post, status: "pending" };
            setPosts([postWithApproval, ...posts]);
        }
        setShowCreate(false);
        setNewPost({ title: "", content: "", category: "general", tags: "" });
        setPendingApproval(true);
        setTimeout(() => setPendingApproval(false), 5000);
    };

    const handleLike = async (postId: string) => {
        await fetch("/api/community/interact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, action: "like" }),
        });
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleComment = async (postId: string) => {
        if (!commentText.trim()) return;
        await fetch("/api/community/interact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, action: "comment", content: commentText, userName: "You" }),
        });
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), { userName: "You", content: commentText, timestamp: new Date().toISOString() }] } : p));
        setCommentText("");
    };

    // Filtered + Sorted + Searched
    const displayPosts = useMemo(() => {
        let list = [...posts];

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.userName?.toLowerCase().includes(q) ||
                p.tags?.some((t: string) => t.toLowerCase().includes(q))
            );
        }

        // Sort
        if (sortBy === "latest") list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        else if (sortBy === "popular") list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        else if (sortBy === "commented") list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));

        return list;
    }, [posts, searchQuery, sortBy]);

    const timeAgo = (ts: string) => {
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            {/* Navbar */}
            <nav style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.3rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>Community</span></span>
                </Link>
                <button onClick={() => setShowCreate(true)} style={{ padding: "0.5rem 1.25rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
                    ✍️ New Post
                </button>
            </nav>

            {/* Admin Approval Toast */}
            {pendingApproval && (
                <div style={{ maxWidth: 600, margin: "0.75rem auto", padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "#eab308", fontSize: "0.85rem", textAlign: "center" }}>
                    📋 Your post has been submitted for <strong>admin review</strong>. It will be visible after approval to prevent spam.
                </div>
            )}

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
                {/* Search + Sort Bar */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                        <input placeholder="🔍 Search posts, tags, users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: "100%", padding: "0.65rem 1rem", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{ padding: "0.6rem 0.85rem", borderRadius: 10, background: "#1a1a2e", border: "1px solid var(--border-color)", color: "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer" }}>
                        {SORT_OPTIONS.map(s => <option key={s.id} value={s.id} style={{ background: "#1a1a2e", color: "#f1f5f9" }}>{s.label}</option>)}
                    </select>
                </div>

                {/* Categories */}
                <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => setCategory(c.id)}
                            style={{ padding: "0.4rem 0.8rem", borderRadius: 999, border: "1px solid", borderColor: category === c.id ? "var(--accent-primary)" : "var(--border-color)", background: category === c.id ? "rgba(99,102,241,0.15)" : "var(--bg-card)", color: category === c.id ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", whiteSpace: "nowrap", fontSize: "0.8rem", fontWeight: 600 }}>
                            {c.icon} {c.label}
                        </button>
                    ))}
                </div>

                {/* Create Post Modal */}
                {showCreate && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowCreate(false)}>
                        <div style={{ padding: "2rem", borderRadius: 20, maxWidth: 600, width: "100%", background: "rgba(26,26,46,0.95)", border: "1px solid var(--border-color)", backdropFilter: "blur(30px)" }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>Share with the Community</h2>
                            <p style={{ fontSize: "0.8rem", color: "#eab308", marginBottom: "1.25rem" }}>⚠️ Posts require admin approval before publishing. No spam/scam links allowed.</p>

                            <input placeholder="Post title..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.75rem", outline: "none", boxSizing: "border-box" }} />

                            <textarea placeholder="Write your post..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={6}
                                style={{ width: "100%", padding: "0.7rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "0.75rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />

                            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                                    style={{ padding: "0.5rem 0.75rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "#1a1a2e", color: "var(--text-primary)", flex: 1, minWidth: 150 }}>
                                    {CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id} style={{ background: "#1a1a2e", color: "#f1f5f9" }}>{c.label}</option>)}
                                </select>
                                <input placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                                    style={{ padding: "0.5rem 0.75rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", flex: 2, minWidth: 150 }} />
                            </div>

                            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
                                <button onClick={() => setShowCreate(false)} style={{ padding: "0.55rem 1.25rem", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                <button onClick={handleCreate} style={{ padding: "0.55rem 1.25rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Submit for Review →</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}><div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} /></div>
                ) : displayPosts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
                        <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📝</p>
                        <p>No posts found. {searchQuery ? "Try a different search." : "Be the first to share!"}</p>
                    </div>
                ) : displayPosts.map(post => (
                    <div key={post.id} style={{ padding: "1.25rem", borderRadius: 16, marginBottom: "0.75rem", background: "rgba(26,26,46,0.6)", border: `1px solid ${post.status === "pending" ? "rgba(234,179,8,0.3)" : "var(--border-color)"}`, transition: "all 0.2s" }}>
                        {/* Pending badge */}
                        {post.status === "pending" && (
                            <div style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 999, background: "rgba(234,179,8,0.1)", color: "#eab308", fontSize: "0.7rem", fontWeight: 600, marginBottom: "0.5rem" }}>⏳ Pending Admin Approval</div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.4rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>{post.title}</h3>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                    by <strong style={{ color: "#818cf8" }}>{post.userName}</strong> · {timeAgo(post.timestamp)}
                                </p>
                            </div>
                            <span style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", fontSize: "0.7rem", fontWeight: 600 }}>
                                {CATEGORIES.find(c => c.id === post.category)?.icon} {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                            </span>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "0.75rem" }}>
                            {expandedPost === post.id ? post.content : post.content.length > 300 ? post.content.slice(0, 300) + "..." : post.content}
                            {post.content.length > 300 && (
                                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", marginLeft: "0.3rem" }}>
                                    {expandedPost === post.id ? "Show less" : "Read more"}
                                </button>
                            )}
                        </p>

                        {/* Tags */}
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                            {post.tags?.map((tag: string, i: number) => (
                                <span key={i} style={{ padding: "0.15rem 0.5rem", borderRadius: 999, background: "rgba(34,197,94,0.08)", color: "#22c55e", fontSize: "0.65rem", fontWeight: 600 }}>#{tag}</span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "0.6rem" }}>
                            <button onClick={() => handleLike(post.id)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                ❤️ {post.likes}
                            </button>
                            <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                💬 {post.comments?.length || 0}
                            </button>
                        </div>

                        {/* Comments Section */}
                        {expandedPost === post.id && (
                            <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
                                {post.comments?.map((c: any, i: number) => (
                                    <div key={i} style={{ padding: "0.5rem 0.75rem", borderRadius: 8, background: "rgba(255,255,255,0.02)", marginBottom: "0.4rem" }}>
                                        <p style={{ fontSize: "0.7rem", color: "#818cf8", fontWeight: 600 }}>{c.userName} · {timeAgo(c.timestamp)}</p>
                                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.content}</p>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                    <input placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") handleComment(post.id); }}
                                        style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8, background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }} />
                                    <button onClick={() => handleComment(post.id)} style={{ padding: "0.5rem 1rem", borderRadius: 8, background: "var(--accent-primary)", color: "white", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>Send</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
