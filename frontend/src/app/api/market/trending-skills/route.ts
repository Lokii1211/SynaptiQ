import { jsonResponse } from "@/lib/server-auth";

export async function GET() {
    return jsonResponse({
        skills: [
            { name: "Generative AI & LLMs", growth: "+320%", avg_salary: "₹18-45 LPA", category: "technology" },
            { name: "Prompt Engineering", growth: "+280%", avg_salary: "₹12-30 LPA", category: "technology" },
            { name: "Full Stack Development", growth: "+45%", avg_salary: "₹8-25 LPA", category: "technology" },
            { name: "Cloud Computing (AWS/GCP)", growth: "+60%", avg_salary: "₹10-30 LPA", category: "technology" },
            { name: "Data Engineering", growth: "+55%", avg_salary: "₹12-35 LPA", category: "technology" },
            { name: "Cybersecurity", growth: "+50%", avg_salary: "₹8-25 LPA", category: "technology" },
            { name: "Product Management", growth: "+40%", avg_salary: "₹15-40 LPA", category: "business" },
            { name: "UI/UX Design", growth: "+35%", avg_salary: "₹6-20 LPA", category: "design" },
            { name: "Digital Marketing (AI)", growth: "+42%", avg_salary: "₹5-15 LPA", category: "marketing" },
            { name: "DevOps & SRE", growth: "+38%", avg_salary: "₹10-28 LPA", category: "technology" },
        ],
    });
}
