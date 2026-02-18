# 🧠 SkillSync AI — India's AI-Powered Career Intelligence Platform

> **The most comprehensive career guidance platform built for Indian students & freshers.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🚀 What is SkillSync AI?

SkillSync AI is a **full-stack career intelligence platform** that helps Indian students make data-driven career decisions. Unlike generic career tests, SkillSync combines AI-powered assessments, coding practice, community learning, salary intelligence, and gamification into a single, life-changing platform.

**Built to solve the #1 problem of Indian students:** *"What career should I choose, and how do I prepare?"*

---

## ✨ Features (18+ Modules)

### 🎯 Core Modules
| Module | Description | Status |
|--------|-------------|--------|
| � **4D Career Assessment** | 45-question deep personality + aptitude profiling | ✅ Live |
| 💻 **Code Practice Arena** | 25 LeetCode-style problems, 5 languages (JS/Python/Java/C++/C), company-tagged | ✅ Live |
| 📝 **Daily Career Quiz** | 5 daily questions with streak gamification | ✅ Live |
| 🎓 **Learning Courses** | Industry-aligned courses (DSA, Full Stack, ML, etc.) | ✅ Live |
| 💼 **Jobs & Internships** | Fresh openings from top MNCs with freemium model | ✅ Live |
| 🌐 **Community Hub** | Share, learn, discuss — with admin moderation | ✅ Live |

### 🧰 Career Intelligence
| Module | Description | Status |
|--------|-------------|--------|
| 🎮 **Career Day Simulator** | Experience a real day in different roles | ✅ Live |
| 💰 **Salary Negotiation Sim** | Practice with AI recruiter | ✅ Live |
| 🏛️ **College ROI Calculator** | Is your ₹20L degree worth it? | ✅ Live |
| 👨‍👩‍👧 **Parent Toolkit** | Data-backed reports for family conversations | ✅ Live |
| 🗺️ **Skill Gap Analyzer** | Current skills vs dream career roadmap | ✅ Live |
| � **AI Career Counselor** | 24/7 AI career advisor (India-focused) | ✅ Live |
| 🧭 **Career Explorer** | 12+ career paths with honest data | ✅ Live |

### � Analytics & Social
| Module | Description | Status |
|--------|-------------|--------|
| 📊 **Analytics Dashboard** | Daily/Weekly/Monthly performance tracking | ✅ Live |
| 🏆 **Leaderboard** | Compete with students across India (Bronze → Diamond) | ✅ Live |
| 🏢 **Company Prep Mode** | Curated problems from Google, Amazon, Microsoft, etc. | ✅ Live |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | CSS Variables + Glassmorphism Design System |
| **API** | Next.js API Routes (16 REST endpoints) |
| **Auth** | JWT + bcrypt password hashing |
| **Data** | In-memory store (production-ready for DB migration) |
| **Deployment** | Vercel-optimized |

---

## � Project Structure

```
cybershield-campus/frontend/
├── src/
│   ├── app/
│   │   ├── api/                    # 16 API routes
│   │   │   ├── auth/               # signup, login, me
│   │   │   ├── assessment/         # questions, submit, results
│   │   │   ├── careers/            # list, categories, detail
│   │   │   ├── practice/           # coding challenges (GET/POST)
│   │   │   ├── community/          # posts + interaction
│   │   │   ├── daily-quiz/         # daily quiz engine
│   │   │   ├── courses/            # course catalog
│   │   │   ├── jobs/               # job listings
│   │   │   ├── chat/               # AI career counselor
│   │   │   ├── skills/             # gap analysis
│   │   │   ├── market/             # trending skills, salary insights
│   │   │   ├── leaderboard/        # rankings
│   │   │   ├── negotiate/          # salary negotiation sim
│   │   │   ├── simulate/           # career day simulation
│   │   │   ├── college-roi/        # ROI calculator
│   │   │   └── parent-report/      # parent toolkit
│   │   ├── analytics/              # Analytics dashboard
│   │   ├── assessment/             # 4D Assessment page
│   │   ├── careers/                # Career explorer
│   │   ├── chat/                   # AI counselor
│   │   ├── community/              # Community hub
│   │   ├── courses/                # Courses catalog
│   │   ├── daily/                  # Daily quiz
│   │   ├── dashboard/              # Main dashboard
│   │   ├── jobs/                   # Jobs & internships
│   │   ├── leaderboard/            # Rankings
│   │   ├── login/                  # Login page
│   │   ├── practice/               # Code practice arena
│   │   ├── signup/                 # Multi-step onboarding
│   │   ├── simulator/              # Career simulator
│   │   ├── skills/                 # Skill gap finder
│   │   ├── negotiate/              # Salary negotiation
│   │   ├── college-roi/            # College ROI
│   │   └── parent/                 # Parent toolkit
│   ├── lib/
│   │   ├── api.ts                  # Frontend API client
│   │   ├── server-data.ts          # Data store + seed data
│   │   └── server-auth.ts          # Auth utilities
│   └── globals.css                 # Design system
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## � Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repo
git clone https://github.com/your-username/cybershield-campus.git
cd cybershield-campus/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

### Production Build
```bash
npx next build
npx next start
```

---

## � API Endpoints (16 Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | User registration (multi-step onboarding) |
| POST | `/api/auth/login` | User authentication |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/assessment/questions` | Fetch assessment questions |
| POST | `/api/assessment/submit` | Submit assessment answers |
| GET | `/api/assessment/results` | Get career profiling results |
| GET | `/api/careers` | Browse career paths |
| GET | `/api/careers/categories` | Career categories |
| GET | `/api/practice` | Coding challenges (filter by difficulty/company/career) |
| POST | `/api/practice` | Submit & evaluate code |
| GET | `/api/community` | Community posts (with category filter) |
| POST | `/api/community` | Create post (admin approval required) |
| GET | `/api/daily-quiz` | Daily quiz questions |
| GET | `/api/courses` | Course catalog |
| GET | `/api/jobs` | Job & internship listings |
| POST | `/api/chat` | AI career counselor |
| GET | `/api/leaderboard` | Rankings & points |
| GET | `/api/market/trending-skills` | Trending skills in India |
| GET | `/api/market/salary-insights` | Salary data by role |
| POST | `/api/skills/gap-analysis` | Skill gap analysis |
| POST | `/api/negotiate` | Salary negotiation sim |
| POST | `/api/simulate` | Career day simulation |
| GET | `/api/college-roi` | College ROI calculator |
| POST | `/api/parent-report` | Parent toolkit report |

---

## � Coding Practice Highlights

- **25 problems** across Easy (8), Medium (12), Hard (5)
- **Company-tagged**: Google, Amazon, Microsoft, Meta, Apple, Goldman Sachs, TCS, Infosys, Flipkart, Razorpay, Uber, and more
- **5 language support**: JavaScript, Python, Java, C++, C
- **Categories**: Arrays, Strings, Dynamic Programming, Graphs, Trees, Stacks, Searching, Design, Matrix, Linked Lists
- **Company Prep Mode**: Select a target company → see curated problems from their actual interviews
- **Career-based filtering**: Problems aligned with your career path

---

## 🌟 Key Design Decisions

1. **Glassmorphism UI** — Dark theme with translucent cards, accent glows, and smooth animations
2. **Gamification** — Points, streaks, levels (Bronze→Diamond), leaderboard
3. **Admin moderation** — Community posts require review before publishing
4. **Multi-step onboarding** — Captures education, institution, career interest
5. **India-focused** — Real salary data, Indian company names, IIT/NIT/VIT colleges
6. **Responsive** — Mobile-first design across all 18+ pages

---

## � Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Secure code sandbox for multi-language execution
- [ ] Admin panel for community moderation
- [ ] Push notifications for daily quiz reminders
- [ ] Company-specific interview preparation modules
- [ ] Resume builder with ATS optimization
- [ ] Peer-to-peer mentorship matching
- [ ] Real-time collaborative coding

---

## 👥 Team

Built with ❤️ for Indian students who deserve better career guidance.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
