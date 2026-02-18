"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Career {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    salary_range: string;
    growth_outlook: string;
    demand_score: number;
    icon: string;
}

interface Category {
    key: string;
    name: string;
    icon: string;
    color: string;
}

export default function CareersPage() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeCategory, search]);

    const loadData = async () => {
        try {
            const [careersRes, catsRes] = await Promise.all([
                api.getCareers(activeCategory || undefined, search || undefined),
                categories.length ? Promise.resolve({ categories }) : api.getCategories(),
            ]);
            setCareers(careersRes.careers);
            if (!categories.length) setCategories(catsRes.categories);
        } catch (err) {
            console.error("Failed to load:", err);
        } finally {
            setLoading(false);
        }
    };

    const growthColor = (g: string) => {
        if (g === "high") return "text-emerald-400 bg-emerald-500/10";
        if (g === "medium") return "text-amber-400 bg-amber-500/10";
        return "text-gray-400 bg-gray-500/10";
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Navbar */}
            <nav className="border-b border-white/5 sticky top-0 z-50 glass-strong">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">S</div>
                        <span className="text-xl font-bold">Skill<span className="text-indigo-400">Sync</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/careers" className="text-white font-medium text-sm">Careers</Link>
                        <Link href="/assessment" className="text-gray-400 hover:text-white transition text-sm">Assessment</Link>
                        <Link href="/skills" className="text-gray-400 hover:text-white transition text-sm">Skill Gap</Link>
                        <Link href="/chat" className="text-gray-400 hover:text-white transition text-sm">AI Chat</Link>
                    </div>
                    <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold mb-3">Career Explorer</h1>
                    <p className="text-gray-400 text-lg">Discover careers that match your interests, with real salary data and growth outlook.</p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search careers... (e.g. Data Scientist, Doctor, Designer)"
                        className="input-field max-w-lg text-lg !py-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-10">
                    <button
                        onClick={() => setActiveCategory("")}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!activeCategory ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        All Careers
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(activeCategory === cat.key ? "" : cat.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${activeCategory === cat.key ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <span>{cat.icon}</span> {cat.name}
                        </button>
                    ))}
                </div>

                {/* Career Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-12 w-12 bg-white/10 rounded-xl mb-4" />
                                <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                                <div className="h-4 bg-white/5 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : careers.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold mb-2">No careers found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                        {careers.map((career) => (
                            <Link key={career.id} href={`/careers/${career.slug}`}>
                                <div className="card cursor-pointer group h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-4xl">{career.icon}</div>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${growthColor(career.growth_outlook)}`}>
                                            {career.growth_outlook === "high" ? "🔥 High Growth" : career.growth_outlook === "medium" ? "📊 Moderate" : "📉 Stable"}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">{career.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{career.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Salary Range</div>
                                            <div className="text-sm font-semibold text-emerald-400">{career.salary_range}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-0.5">Demand</div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="progress-bar w-16">
                                                    <div className="progress-bar-fill" style={{ width: `${career.demand_score}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-400">{career.demand_score}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
