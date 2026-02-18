// In-memory data store for Vercel serverless deployment
// Career data + user storage

export const CAREERS = [
    {
        id: "c1", title: "Software Developer", slug: "software-developer", category: "technology",
        description: "Design, develop, and maintain software applications. From mobile apps to enterprise systems, software developers build the digital tools that power modern life.",
        day_in_life: "Start the day with a standup meeting, then dive into writing code — fixing bugs, building new features, or reviewing teammates' code. After lunch, you might join a design discussion or demo new functionality. Evenings could involve learning a new framework or contributing to open source.",
        required_skills: ["Programming (Python/Java/JS)", "Data Structures & Algorithms", "Version Control (Git)", "Problem Solving", "System Design", "API Development"],
        required_education: [{ degree: "B.Tech/BE", field: "Computer Science/IT", duration: "4 years" }, { degree: "BCA/MCA", field: "Computer Applications", duration: "3-5 years" }],
        salary_range_min: 400000, salary_range_max: 2500000, growth_outlook: "high", demand_score: 95,
        top_companies: ["Google", "Microsoft", "Amazon", "Flipkart", "TCS", "Infosys", "Wipro", "Zoho"],
        entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"],
        related_courses: ["B.Tech CS", "BCA", "Full Stack Bootcamp", "NPTEL Programming"], icon: "💻"
    },
    {
        id: "c2", title: "Data Scientist", slug: "data-scientist", category: "technology",
        description: "Extract insights from large datasets using statistics, machine learning, and domain expertise. Data scientists help organizations make data-driven decisions.",
        day_in_life: "Morning: explore a new dataset, clean and wrangle messy data. Afternoon: build and train ML models, run experiments. Present findings to stakeholders with clear visualizations. Late afternoon: read research papers, experiment with new techniques.",
        required_skills: ["Python/R", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Deep Learning", "NLP"],
        required_education: [{ degree: "B.Tech/M.Tech", field: "CS/Mathematics/Statistics", duration: "4-6 years" }, { degree: "M.Sc", field: "Data Science/Statistics", duration: "2 years" }],
        salary_range_min: 600000, salary_range_max: 3500000, growth_outlook: "high", demand_score: 92,
        top_companies: ["Google", "Amazon", "Microsoft", "Flipkart", "Swiggy", "PhonePe", "Reliance Jio"],
        entrance_exams: ["JEE Main", "GATE", "IIT JAM"],
        related_courses: ["M.Tech AI/ML", "Google Data Analytics", "Andrew Ng ML Course"], icon: "📊"
    },
    {
        id: "c3", title: "Product Manager", slug: "product-manager", category: "business",
        description: "Own the strategy, roadmap, and feature definition for a product. Product managers bridge the gap between engineering, design, and business teams to deliver products users love.",
        day_in_life: "Start with metrics review — how are users engaging? Sprint planning with engineers. Lunch meeting with design team on upcoming features. Afternoon: user interviews, competitive analysis, writing PRDs.",
        required_skills: ["Product Strategy", "User Research", "Data Analytics", "Communication", "Roadmapping", "A/B Testing", "SQL"],
        required_education: [{ degree: "B.Tech + MBA", field: "Any + Business", duration: "6 years" }, { degree: "Any degree", field: "With PM certification", duration: "3-4 years" }],
        salary_range_min: 800000, salary_range_max: 4000000, growth_outlook: "high", demand_score: 85,
        top_companies: ["Google", "Microsoft", "Razorpay", "CRED", "Swiggy", "Meesho", "Ola"],
        entrance_exams: ["CAT", "XAT", "GMAT"],
        related_courses: ["MBA", "ISB YLP", "Product School Certification"], icon: "🎯"
    },
    {
        id: "c4", title: "UX/UI Designer", slug: "ux-ui-designer", category: "design",
        description: "Create intuitive, beautiful digital experiences. UX/UI designers research user needs, design interfaces, and ensure products are both functional and delightful.",
        day_in_life: "Morning: review user feedback and analytics. Design wireframes for a new feature in Figma. Afternoon: conduct usability testing with real users, iterate on designs. Collaborate with developers on implementation.",
        required_skills: ["Figma/Sketch", "User Research", "Wireframing", "Prototyping", "Visual Design", "Information Architecture", "Design Systems"],
        required_education: [{ degree: "B.Des", field: "Interaction/Communication Design", duration: "4 years" }, { degree: "Any degree", field: "With UX bootcamp", duration: "3-4 years" }],
        salary_range_min: 400000, salary_range_max: 2000000, growth_outlook: "high", demand_score: 82,
        top_companies: ["Google", "Flipkart", "Swiggy", "CRED", "Razorpay", "Adobe", "Freshworks"],
        entrance_exams: ["UCEED", "NID DAT", "CEED"],
        related_courses: ["B.Des Interaction Design", "Google UX Certificate", "IDF UX Course"], icon: "🎨"
    },
    {
        id: "c5", title: "Chartered Accountant (CA)", slug: "chartered-accountant", category: "finance",
        description: "Provide financial advisory, audit, taxation, and accounting services. CAs are trusted professionals who ensure financial integrity for businesses and individuals.",
        day_in_life: "Review financial statements and audit reports. Meeting with clients on tax planning strategies. Afternoon: analyze complex financial transactions, prepare compliance reports.",
        required_skills: ["Accounting", "Taxation", "Auditing", "Financial Analysis", "Indian GAAP/Ind AS", "MS Excel", "Tally"],
        required_education: [{ degree: "CA Foundation + Inter + Final", field: "Chartered Accountancy", duration: "4-5 years" }],
        salary_range_min: 600000, salary_range_max: 3000000, growth_outlook: "medium", demand_score: 80,
        top_companies: ["Deloitte", "EY", "KPMG", "PwC", "Grant Thornton", "BDO India"],
        entrance_exams: ["CA Foundation", "CA Intermediate", "CA Final"],
        related_courses: ["B.Com", "CA Articleship", "ACCA"], icon: "📈"
    },
    {
        id: "c6", title: "Digital Marketing Specialist", slug: "digital-marketing-specialist", category: "marketing",
        description: "Plan and execute online marketing campaigns across channels like SEO, social media, email, and paid ads. Help brands reach and engage their target audience digitally.",
        day_in_life: "Check campaign metrics first thing — clicks, conversions, ROAS. Create content for social media. Optimize Google Ads campaigns. Afternoon: SEO audit of website, keyword research.",
        required_skills: ["SEO/SEM", "Social Media Marketing", "Google Ads", "Content Strategy", "Analytics", "Email Marketing", "Copywriting"],
        required_education: [{ degree: "BBA/MBA", field: "Marketing", duration: "3-5 years" }, { degree: "Any degree", field: "With Digital Marketing certification", duration: "3-4 years" }],
        salary_range_min: 300000, salary_range_max: 1500000, growth_outlook: "high", demand_score: 78,
        top_companies: ["Google", "Meta", "Amazon", "Flipkart", "GroupM", "Dentsu", "Ogilvy India"],
        entrance_exams: ["CAT", "XAT", "IPMAT"],
        related_courses: ["Google Digital Marketing Certificate", "HubSpot Academy", "MBA Marketing"], icon: "📱"
    },
    {
        id: "c7", title: "Mechanical Engineer", slug: "mechanical-engineer", category: "engineering",
        description: "Design, analyze, and manufacture mechanical systems — from engines and robotics to HVAC and manufacturing processes. One of the broadest engineering disciplines.",
        day_in_life: "Review CAD designs and run simulations. Visit the manufacturing floor to check prototype assembly. Afternoon: FEA analysis on a component, meeting with quality team.",
        required_skills: ["AutoCAD/SolidWorks", "Thermodynamics", "Manufacturing Processes", "FEA/CFD", "Material Science", "GD&T", "Project Management"],
        required_education: [{ degree: "B.Tech/BE", field: "Mechanical Engineering", duration: "4 years" }],
        salary_range_min: 350000, salary_range_max: 1500000, growth_outlook: "medium", demand_score: 70,
        top_companies: ["Tata Motors", "L&T", "Mahindra", "Bosch", "Siemens", "BHEL", "ISRO"],
        entrance_exams: ["JEE Main", "JEE Advanced", "GATE"],
        related_courses: ["B.Tech Mechanical", "NPTEL Courses", "SolidWorks Certification"], icon: "⚙️"
    },
    {
        id: "c8", title: "Doctor (MBBS)", slug: "doctor-mbbs", category: "healthcare",
        description: "Diagnose illnesses, prescribe treatments, and care for patients' health. Doctors play a critical role in society, combining deep medical knowledge with compassion.",
        day_in_life: "Morning rounds checking on admitted patients. OPD hours seeing patients, diagnosing conditions. Afternoon: procedures or surgeries depending on specialization. Review lab reports.",
        required_skills: ["Clinical Diagnosis", "Patient Communication", "Medical Knowledge", "Emergency Medicine", "Research", "Empathy", "Decision Making"],
        required_education: [{ degree: "MBBS", field: "Medicine", duration: "5.5 years" }, { degree: "MBBS + MD/MS", field: "Specialization", duration: "5.5 + 3 years" }],
        salary_range_min: 600000, salary_range_max: 3000000, growth_outlook: "high", demand_score: 90,
        top_companies: ["AIIMS", "Apollo", "Fortis", "Max Healthcare", "Manipal Hospitals"],
        entrance_exams: ["NEET UG", "NEET PG", "AIIMS"],
        related_courses: ["MBBS", "MD/MS", "DNB"], icon: "🩺"
    },
    {
        id: "c9", title: "Civil Services (IAS/IPS)", slug: "civil-services", category: "government",
        description: "Serve the nation at the highest levels of government administration. Civil servants lead policy implementation, governance, and public welfare.",
        day_in_life: "Review government circulars and policy briefs. Meet with department heads on ongoing projects. Field visit to inspect development work. Afternoon: public grievance hearings.",
        required_skills: ["Administrative Skills", "Public Policy", "Leadership", "Decision Making", "Ethics", "Communication", "General Knowledge"],
        required_education: [{ degree: "Any Graduation", field: "Any discipline", duration: "3-4 years" }],
        salary_range_min: 800000, salary_range_max: 2500000, growth_outlook: "medium", demand_score: 88,
        top_companies: ["Government of India", "State Governments", "Public Sector Enterprises"],
        entrance_exams: ["UPSC CSE Prelims", "UPSC CSE Mains", "UPSC Interview"],
        related_courses: ["UPSC Coaching", "Optional Subject Deep Study", "Current Affairs"], icon: "🏛️"
    },
    {
        id: "c10", title: "AI/ML Engineer", slug: "ai-ml-engineer", category: "technology",
        description: "Build intelligent systems that can learn, reason, and make decisions. AI/ML engineers develop models for recommendation systems, computer vision, NLP, and more.",
        day_in_life: "Morning: review model training metrics from overnight runs. Prepare and clean datasets. Afternoon: experiment with new model architectures, fine-tune hyperparameters. Deploy a model to production.",
        required_skills: ["Python", "TensorFlow/PyTorch", "Machine Learning", "Deep Learning", "Mathematics", "NLP/Computer Vision", "MLOps"],
        required_education: [{ degree: "B.Tech/M.Tech", field: "CS/AI/ML", duration: "4-6 years" }, { degree: "M.Sc/PhD", field: "Computer Science/Mathematics", duration: "2-5 years" }],
        salary_range_min: 800000, salary_range_max: 4000000, growth_outlook: "high", demand_score: 96,
        top_companies: ["Google DeepMind", "OpenAI", "Microsoft", "NVIDIA", "Amazon", "Meta"],
        entrance_exams: ["JEE", "GATE", "GRE"],
        related_courses: ["M.Tech AI", "Stanford CS229", "Fast.ai", "DeepLearning.AI"], icon: "🤖"
    },
    {
        id: "c11", title: "Graphic Designer", slug: "graphic-designer", category: "design",
        description: "Create visual content for brands, products, and media. From logos and marketing materials to social media graphics and brand identities.",
        day_in_life: "Morning briefing on new project requirements. Create mood boards and initial concepts. Design social media posts and banners. Afternoon: work on brand identity project.",
        required_skills: ["Adobe Photoshop", "Illustrator", "Typography", "Color Theory", "Brand Design", "Layout Design", "Canva"],
        required_education: [{ degree: "B.Des/BFA", field: "Graphic/Visual Design", duration: "4 years" }],
        salary_range_min: 250000, salary_range_max: 1200000, growth_outlook: "medium", demand_score: 72,
        top_companies: ["Ogilvy", "Dentsu", "WPP", "Adobe", "Canva", "Razorpay", "CRED"],
        entrance_exams: ["NID DAT", "UCEED", "NIFT"],
        related_courses: ["B.Des Visual Communication", "Adobe Certified", "Coursera Graphic Design"], icon: "✏️"
    },
    {
        id: "c12", title: "Cybersecurity Analyst", slug: "cybersecurity-analyst", category: "technology",
        description: "Protect organizations from cyber threats by monitoring systems, investigating incidents, and implementing security controls.",
        day_in_life: "Monitor SIEM dashboard for security alerts. Investigate a phishing attempt targeting employees. Perform vulnerability assessment on new application. Afternoon: update firewall rules.",
        required_skills: ["Network Security", "SIEM Tools", "Penetration Testing", "Python Scripting", "Incident Response", "Cloud Security", "Compliance (ISO 27001)"],
        required_education: [{ degree: "B.Tech", field: "CS/IT/Cybersecurity", duration: "4 years" }],
        salary_range_min: 500000, salary_range_max: 2500000, growth_outlook: "high", demand_score: 88,
        top_companies: ["Palo Alto Networks", "CrowdStrike", "TCS", "Wipro", "KPMG", "Deloitte"],
        entrance_exams: ["JEE Main", "GATE"],
        related_courses: ["CEH", "CompTIA Security+", "OSCP", "B.Tech Cybersecurity"], icon: "🔐"
    },
];

export const ASSESSMENT_QUESTIONS = [
    {
        id: 1, question: "When solving a problem, you prefer to:", category: "analytical", options: [
            { text: "Break it into logical steps and analyze each part", trait: "analytical", score: 5 },
            { text: "Look for creative, unconventional approaches", trait: "creative", score: 5 },
            { text: "Discuss it with others and get different perspectives", trait: "social", score: 5 },
            { text: "Jump right in and learn by doing", trait: "realistic", score: 5 }]
    },
    {
        id: 2, question: "In a group project, you naturally take the role of:", category: "work_style", options: [
            { text: "Leader — organizing tasks and directing the team", trait: "enterprising", score: 5 },
            { text: "Researcher — gathering data and analyzing information", trait: "analytical", score: 5 },
            { text: "Mediator — ensuring everyone is heard and aligned", trait: "social", score: 5 },
            { text: "Executor — doing the hands-on work to get things done", trait: "realistic", score: 5 }]
    },
    {
        id: 3, question: "Which activity excites you the most?", category: "interests", options: [
            { text: "Building something with code or technology", trait: "analytical", score: 5 },
            { text: "Designing visuals or creating art", trait: "creative", score: 5 },
            { text: "Leading or starting a new initiative", trait: "enterprising", score: 5 },
            { text: "Helping people solve their problems", trait: "social", score: 5 }]
    },
    {
        id: 4, question: "When you achieve a goal, what matters most to you?", category: "values", options: [
            { text: "Financial reward and stability", trait: "conventional", score: 5 },
            { text: "Recognition and personal growth", trait: "enterprising", score: 5 },
            { text: "Impact — knowing I made a difference", trait: "social", score: 5 },
            { text: "The learning and skills I gained along the way", trait: "analytical", score: 5 }]
    },
    {
        id: 5, question: "Your ideal work environment would be:", category: "work_style", options: [
            { text: "A quiet office with focused deep work", trait: "analytical", score: 5 },
            { text: "A vibrant, creative studio", trait: "creative", score: 5 },
            { text: "A bustling startup with constant energy", trait: "enterprising", score: 5 },
            { text: "A collaborative team-based setting", trait: "social", score: 5 }]
    },
    {
        id: 6, question: "Which school subject did you enjoy most?", category: "aptitude", options: [
            { text: "Mathematics or Computer Science", trait: "analytical", score: 5 },
            { text: "Art, Music, or Literature", trait: "creative", score: 5 },
            { text: "Economics or Business Studies", trait: "enterprising", score: 5 },
            { text: "Biology or Social Sciences", trait: "social", score: 5 }]
    },
    {
        id: 7, question: "How do you prefer to learn something new?", category: "learning_style", options: [
            { text: "Read documentation/textbooks and understand concepts", trait: "analytical", score: 5 },
            { text: "Watch videos and visual demonstrations", trait: "creative", score: 5 },
            { text: "Hands-on practice and building projects", trait: "realistic", score: 5 },
            { text: "Discuss with mentors or peers", trait: "social", score: 5 }]
    },
    {
        id: 8, question: "Which of these challenges appeals to you?", category: "interests", options: [
            { text: "Optimizing a system to be more efficient", trait: "analytical", score: 5 },
            { text: "Designing an award-winning brand identity", trait: "creative", score: 5 },
            { text: "Scaling a business from 0 to 1 million users", trait: "enterprising", score: 5 },
            { text: "Teaching underprivileged kids new skills", trait: "social", score: 5 }]
    },
    {
        id: 9, question: "You're more comfortable with:", category: "personality", options: [
            { text: "Numbers, data, and spreadsheets", trait: "conventional", score: 5 },
            { text: "Colors, shapes, and visual patterns", trait: "creative", score: 5 },
            { text: "Words, persuasion, and negotiation", trait: "enterprising", score: 5 },
            { text: "People, emotions, and relationships", trait: "social", score: 5 }]
    },
    {
        id: 10, question: "If money wasn't a concern, you would:", category: "passion", options: [
            { text: "Build technology that changes the world", trait: "analytical", score: 5 },
            { text: "Create art, music, or films", trait: "creative", score: 5 },
            { text: "Start a company and build something from scratch", trait: "enterprising", score: 5 },
            { text: "Work in social causes or NGOs", trait: "social", score: 5 }]
    },
    {
        id: 11, question: "When making decisions, you rely more on:", category: "decision_style", options: [
            { text: "Logic, facts, and data analysis", trait: "analytical", score: 5 },
            { text: "Intuition and gut feeling", trait: "creative", score: 5 },
            { text: "Strategic thinking and risk-reward analysis", trait: "enterprising", score: 5 },
            { text: "How it affects people around me", trait: "social", score: 5 }]
    },
    {
        id: 12, question: "What do you value most in a career?", category: "values", options: [
            { text: "High salary and financial growth", trait: "conventional", score: 5 },
            { text: "Creative freedom and expression", trait: "creative", score: 5 },
            { text: "Power, influence, and leadership opportunities", trait: "enterprising", score: 5 },
            { text: "Work-life balance and meaningful impact", trait: "social", score: 5 }]
    },
    {
        id: 13, question: "Your friends would describe you as:", category: "personality", options: [
            { text: "The logical one who always thinks things through", trait: "analytical", score: 5 },
            { text: "The creative one with wild ideas", trait: "creative", score: 5 },
            { text: "The ambitious one always chasing goals", trait: "enterprising", score: 5 },
            { text: "The caring one everyone goes to for advice", trait: "social", score: 5 }]
    },
    {
        id: 14, question: "Which weekend activity do you prefer?", category: "interests", options: [
            { text: "Coding a side project or learning tech", trait: "analytical", score: 5 },
            { text: "Drawing, designing, or photography", trait: "creative", score: 5 },
            { text: "Reading about business or side hustles", trait: "enterprising", score: 5 },
            { text: "Volunteering or spending time with family", trait: "social", score: 5 }]
    },
    {
        id: 15, question: "When faced with ambiguity, you:", category: "adaptability", options: [
            { text: "Research and gather more data before acting", trait: "analytical", score: 5 },
            { text: "Embrace it and see where creativity takes me", trait: "creative", score: 5 },
            { text: "Make a quick decision and pivot if needed", trait: "enterprising", score: 5 },
            { text: "Seek input from trusted people around me", trait: "social", score: 5 }]
    },
];

// Simple in-memory store (resets on cold starts - fine for demo)
interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    age?: number;
    education_level?: string;
    city?: string;
}

interface Assessment {
    id: string;
    userId: string;
    answers: Record<string, number>;
    results: Record<string, unknown>;
}

interface ChatSession {
    id: string;
    userId: string;
    messages: { role: string; content: string; timestamp: string }[];
}

class Store {
    users: Map<string, User> = new Map();
    assessments: Map<string, Assessment[]> = new Map();
    chatSessions: Map<string, ChatSession> = new Map();

    addUser(user: User) { this.users.set(user.id, user); }
    getUserByEmail(email: string) { return Array.from(this.users.values()).find(u => u.email === email); }
    getUserById(id: string) { return this.users.get(id); }

    addAssessment(userId: string, assessment: Assessment) {
        const list = this.assessments.get(userId) || [];
        list.push(assessment);
        this.assessments.set(userId, list);
    }
    getLatestAssessment(userId: string) {
        const list = this.assessments.get(userId) || [];
        return list[list.length - 1] || null;
    }

    getOrCreateChat(sessionId: string, userId: string): ChatSession {
        let session = this.chatSessions.get(sessionId);
        if (!session) {
            session = { id: sessionId, userId, messages: [] };
            this.chatSessions.set(sessionId, session);
        }
        return session;
    }
}

export const store = new Store();
