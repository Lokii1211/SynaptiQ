import { jsonResponse } from "@/lib/server-auth";

export async function GET() {
    return jsonResponse({
        insights: [
            { role: "Software Developer", entry: "₹4-8 LPA", mid: "₹10-18 LPA", senior: "₹20-40 LPA", top_cities: ["Bangalore", "Hyderabad", "Pune"] },
            { role: "Data Scientist", entry: "₹6-10 LPA", mid: "₹15-25 LPA", senior: "₹30-50 LPA", top_cities: ["Bangalore", "Mumbai", "Gurgaon"] },
            { role: "Product Manager", entry: "₹8-12 LPA", mid: "₹18-30 LPA", senior: "₹35-60 LPA", top_cities: ["Bangalore", "Mumbai", "Delhi NCR"] },
            { role: "AI/ML Engineer", entry: "₹8-14 LPA", mid: "₹20-35 LPA", senior: "₹40-70 LPA", top_cities: ["Bangalore", "Hyderabad", "Chennai"] },
            { role: "UX Designer", entry: "₹4-7 LPA", mid: "₹10-18 LPA", senior: "₹20-35 LPA", top_cities: ["Bangalore", "Mumbai", "Pune"] },
        ],
    });
}
