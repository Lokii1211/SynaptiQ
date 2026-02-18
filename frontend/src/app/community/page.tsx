"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
    { id: "all", label: "All Posts", icon: "🌐" },
    { id: "success-stories", label: "Success Stories", icon: "🏆" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "career-dilemma", label: "Career Dilemmas", icon: "🤔" },
    { id: "interview-exp", label: "Interview Experiences", icon: "💼" },
    { id: "general", label: "General", icon: "💬" },
];

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [category, setCategory] = useState("all");
    const [showCreate, setShowCreate] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "general", tags: "" });
    const [loading, setLoading] = useState(true);

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
        setPosts([data.post, ...posts]);
        setShowCreate(false);
        setNewPost({ title: "", content: "", category: "general", tags: "" });
    };

    const handleLike = async (postId: string) => {
        await fetch("/api/community/interact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, action: "like" }),
        });
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }}>
            <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 }}>
                <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🧠</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>SkillSync <span style={{ color: "var(--accent-primary)" }}>Community</span></span>
                </Link>
                <button onClick={() => setShowCreate(true)} style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>
                    ✍️ New Post
                </button>
            </nav>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
                {/* Categories */}
                <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => setCategory(c.id)}
                            style={{ padding: "0.5rem 1rem", borderRadius: 999, border: "1px solid", borderColor: category === c.id ? "var(--accent-primary)" : "var(--border-color)", background: category === c.id ? "rgba(99,102,241,0.15)" : "var(--bg-card)", color: category === c.id ? "var(--accent-primary)" : "var(--text-secondary)", cursor: "pointer", whiteSpace: "nowrap", fontSize: "0.85rem", fontWeight: 600 }}>
                            {c.icon} {c.label}
                        </button>
                    ))}
                </div>

                {/* Create Post Modal */}
                {showCreate && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setShowCreate(false)}>
                        <div className="glass-card" style={{ padding: "2rem", borderRadius: 20, maxWidth: 600, width: "100%" }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>Share with the Community</h2>
                            <input placeholder="Post title..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "1rem", marginBottom: "1rem", outline: "none", boxSizing: "border-box" }} />
                            <textarea placeholder="Write your post..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={6}
                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "1rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                                    style={{ padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", flex: 1, minWidth: 150 }}>
                                    {CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                                <input placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
                                    style={{ padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", flex: 2, minWidth: 150 }} />
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                <button onClick={() => setShowCreate(false)} style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
                                <button onClick={handleCreate} style={{ padding: "0.6rem 1.5rem", borderRadius: 10, background: "linear-gradient(135deg, var(--accent-primary), #8b5cf6)", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Post →</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}><div style={{ width: 48, height: 48, border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} /></div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-secondary)" }}>
                        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</p>
                        <p>No posts yet in this category. Be the first to share!</p>
                    </div>
                ) : posts.map(post => (
                    <div key={post.id} className="glass-card" style={{ padding: "1.5rem", borderRadius: 16, marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <div>
                                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{post.title}</h3>
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>by <strong>{post.userName}</strong> · {new Date(post.timestamp).toLocaleDateString()}</p>
                            </div>
                            <span style={{ padding: "0.25rem 0.75rem", borderRadius: 999, background: "rgba(99,102,241,0.1)", color: "var(--accent-primary)", fontSize: "0.75rem", fontWeight: 600 }}>
                                {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                            </span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "1rem" }}>
                            {post.content.length > 300 ? post.content.slice(0, 300) + "..." : post.content}
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                            {post.tags?.map((tag: string, i: number) => (
                                <span key={i} style={{ padding: "0.2rem 0.6rem", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.7rem" }}>#{tag}</span>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <button onClick={() => handleLike(post.id)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                ❤️ {post.likes}
                            </button>
                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>💬 {post.comments?.length || 0} comments</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
