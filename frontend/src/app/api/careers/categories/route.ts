import { CAREERS } from "@/lib/server-data";
import { jsonResponse } from "@/lib/server-auth";

const CATEGORY_META: Record<string, { name: string; icon: string; color: string }> = {
    technology: { name: "Technology", icon: "💻", color: "indigo" },
    business: { name: "Business", icon: "💼", color: "amber" },
    design: { name: "Design", icon: "🎨", color: "pink" },
    finance: { name: "Finance", icon: "📈", color: "emerald" },
    marketing: { name: "Marketing", icon: "📱", color: "cyan" },
    engineering: { name: "Engineering", icon: "⚙️", color: "orange" },
    healthcare: { name: "Healthcare", icon: "🩺", color: "red" },
    government: { name: "Government", icon: "🏛️", color: "blue" },
    legal: { name: "Legal", icon: "⚖️", color: "slate" },
    education: { name: "Education & Research", icon: "🎓", color: "violet" },
    science: { name: "Science & Research", icon: "🔬", color: "teal" },
    media: { name: "Media & Journalism", icon: "📰", color: "rose" },
};

export async function GET() {
    const catSet = new Set(CAREERS.map(c => c.category));
    const categories = Array.from(catSet).map(key => ({
        key,
        ...(CATEGORY_META[key] || { name: key, icon: "📁", color: "gray" }),
    }));
    return jsonResponse({ categories });
}
