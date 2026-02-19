import { jsonResponse } from "@/lib/server-auth";

// Skill Stock Market™ data — Updated weekly (manually curated for MVP)
// Sources: NASSCOM reports, LinkedIn Economic Graph India, public job postings
const SKILL_MARKET_DATA = [
    { skill_name: "GenAI / LLMs", posting_count: 890, avg_salary_lpa: 22.0, delta_pct: 23.4, top_hiring_companies: ["Google", "Amazon", "Razorpay", "Flipkart"], city: "Bangalore", category: "technology" },
    { skill_name: "Cybersecurity", posting_count: 560, avg_salary_lpa: 15.0, delta_pct: 19.8, top_hiring_companies: ["Infosys", "TCS", "Flipkart", "Amazon"], city: "Bangalore", category: "technology" },
    { skill_name: "System Design", posting_count: 980, avg_salary_lpa: 20.0, delta_pct: 18.2, top_hiring_companies: ["Google", "Amazon", "Microsoft", "Meta"], city: "Bangalore", category: "technology" },
    { skill_name: "DevOps / Cloud", posting_count: 1560, avg_salary_lpa: 18.0, delta_pct: 15.7, top_hiring_companies: ["Flipkart", "Amazon", "Microsoft", "Razorpay"], city: "Bangalore", category: "technology" },
    { skill_name: "TypeScript", posting_count: 1870, avg_salary_lpa: 15.0, delta_pct: 12.3, top_hiring_companies: ["CRED", "Razorpay", "PhonePe", "Flipkart"], city: "Bangalore", category: "technology" },
    { skill_name: "Kotlin", posting_count: 890, avg_salary_lpa: 16.0, delta_pct: 11.2, top_hiring_companies: ["PhonePe", "CRED", "Flipkart", "Amazon"], city: "Bangalore", category: "technology" },
    { skill_name: "Figma / UI Design", posting_count: 780, avg_salary_lpa: 12.0, delta_pct: 9.4, top_hiring_companies: ["Swiggy", "CRED", "Flipkart", "Razorpay"], city: "Bangalore", category: "design" },
    { skill_name: "React", posting_count: 2340, avg_salary_lpa: 14.5, delta_pct: 8.2, top_hiring_companies: ["CRED", "Flipkart", "Swiggy", "PhonePe"], city: "Bangalore", category: "technology" },
    { skill_name: "Data Science", posting_count: 1230, avg_salary_lpa: 17.0, delta_pct: 6.8, top_hiring_companies: ["Google", "Flipkart", "Swiggy", "PhonePe"], city: "Bangalore", category: "technology" },
    { skill_name: "Python", posting_count: 3120, avg_salary_lpa: 16.0, delta_pct: 5.1, top_hiring_companies: ["Google", "Amazon", "Microsoft", "Infosys"], city: "Bangalore", category: "technology" },
    { skill_name: "Product Management", posting_count: 670, avg_salary_lpa: 19.0, delta_pct: 4.5, top_hiring_companies: ["Razorpay", "CRED", "Flipkart", "Swiggy"], city: "Bangalore", category: "business" },
    { skill_name: "SQL / Databases", posting_count: 2100, avg_salary_lpa: 12.0, delta_pct: 1.3, top_hiring_companies: ["All companies"], city: "Bangalore", category: "technology" },
    { skill_name: "Java", posting_count: 2890, avg_salary_lpa: 13.5, delta_pct: -2.1, top_hiring_companies: ["Goldman Sachs", "Infosys", "TCS", "Amazon"], city: "Bangalore", category: "technology" },
    { skill_name: "Manual Testing", posting_count: 890, avg_salary_lpa: 6.5, delta_pct: -8.4, top_hiring_companies: ["TCS", "Infosys", "Wipro"], city: "Bangalore", category: "technology" },

    // Mumbai market
    { skill_name: "GenAI / LLMs", posting_count: 620, avg_salary_lpa: 20.0, delta_pct: 28.1, top_hiring_companies: ["Jio", "Amazon", "TCS", "Infosys"], city: "Mumbai", category: "technology" },
    { skill_name: "React", posting_count: 1890, avg_salary_lpa: 13.0, delta_pct: 6.5, top_hiring_companies: ["Jio", "TCS", "Accenture", "HDFC"], city: "Mumbai", category: "technology" },
    { skill_name: "Python", posting_count: 2450, avg_salary_lpa: 14.5, delta_pct: 4.2, top_hiring_companies: ["Jio", "Amazon", "Goldman Sachs", "JP Morgan"], city: "Mumbai", category: "technology" },
    { skill_name: "Financial Modeling", posting_count: 890, avg_salary_lpa: 15.0, delta_pct: 7.3, top_hiring_companies: ["Goldman Sachs", "JP Morgan", "HDFC", "ICICI"], city: "Mumbai", category: "finance" },
    { skill_name: "Digital Marketing", posting_count: 1120, avg_salary_lpa: 8.0, delta_pct: 5.6, top_hiring_companies: ["Nykaa", "Mamaearth", "Jio", "Zee"], city: "Mumbai", category: "marketing" },

    // Hyderabad market
    { skill_name: "GenAI / LLMs", posting_count: 450, avg_salary_lpa: 19.0, delta_pct: 25.3, top_hiring_companies: ["Google", "Amazon", "Microsoft", "ServiceNow"], city: "Hyderabad", category: "technology" },
    { skill_name: "DevOps / Cloud", posting_count: 1230, avg_salary_lpa: 16.0, delta_pct: 14.2, top_hiring_companies: ["Amazon", "Microsoft", "Deloitte", "TCS"], city: "Hyderabad", category: "technology" },
    { skill_name: "Python", posting_count: 2100, avg_salary_lpa: 14.0, delta_pct: 3.8, top_hiring_companies: ["Google", "Amazon", "Microsoft", "Qualcomm"], city: "Hyderabad", category: "technology" },

    // Delhi/NCR market
    { skill_name: "GenAI / LLMs", posting_count: 380, avg_salary_lpa: 18.0, delta_pct: 22.7, top_hiring_companies: ["Adobe", "Samsung", "Paytm", "Zomato"], city: "Delhi", category: "technology" },
    { skill_name: "Content Strategy", posting_count: 560, avg_salary_lpa: 9.0, delta_pct: 11.5, top_hiring_companies: ["Zomato", "Paytm", "ShareChat", "MakeMyTrip"], city: "Delhi", category: "marketing" },
    { skill_name: "React", posting_count: 1450, avg_salary_lpa: 12.5, delta_pct: 5.8, top_hiring_companies: ["Paytm", "Zomato", "MakeMyTrip", "Adobe"], city: "Delhi", category: "technology" },

    // Pune market
    { skill_name: "Java", posting_count: 1890, avg_salary_lpa: 12.0, delta_pct: 2.1, top_hiring_companies: ["Infosys", "TCS", "Persistent", "Amdocs"], city: "Pune", category: "technology" },
    { skill_name: "DevOps / Cloud", posting_count: 980, avg_salary_lpa: 15.0, delta_pct: 13.6, top_hiring_companies: ["Persistent", "Infosys", "Tech Mahindra", "Amazon"], city: "Pune", category: "technology" },
    { skill_name: "Python", posting_count: 1560, avg_salary_lpa: 13.0, delta_pct: 4.5, top_hiring_companies: ["Infosys", "TCS", "Persistent", "Synechron"], city: "Pune", category: "technology" },

    // Chennai market
    { skill_name: "Python", posting_count: 1340, avg_salary_lpa: 12.5, delta_pct: 3.9, top_hiring_companies: ["Zoho", "TCS", "Infosys", "Cognizant"], city: "Chennai", category: "technology" },
    { skill_name: "Full Stack", posting_count: 980, avg_salary_lpa: 11.0, delta_pct: 6.2, top_hiring_companies: ["Zoho", "Freshworks", "TCS", "HCL"], city: "Chennai", category: "technology" },
    { skill_name: "GenAI / LLMs", posting_count: 290, avg_salary_lpa: 17.0, delta_pct: 20.1, top_hiring_companies: ["Zoho", "Freshworks", "Amazon", "PayPal"], city: "Chennai", category: "technology" },
];

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");

    let filtered = [...SKILL_MARKET_DATA];
    if (city && city !== "All Cities") {
        filtered = filtered.filter(s => s.city === city);
    }
    if (category && category !== "All Paths") {
        filtered = filtered.filter(s => s.category === category.toLowerCase());
    }

    // Sort by absolute delta (biggest movers first)
    filtered.sort((a, b) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct));

    return jsonResponse({
        skills: filtered,
        total: filtered.length,
        last_updated: "2026-02-17",
        source: "Public job market reports, NASSCOM, LinkedIn Economic Graph India",
    });
}
