# SkillSync AI - Product Specification
## AI-Powered Career Guidance Platform for Indian Students

---

## 🎯 Vision
Be India's most intelligent, accessible, and actionable career guidance platform — helping every student discover their ideal career path through AI-powered assessments, real-time market data, and personalized roadmaps.

## 👤 Target Users

### Primary: Students (Age 16-24)
- Class 10-12 students choosing streams/subjects
- Undergraduate students (year 1-4) exploring careers
- Fresh graduates job-hunting

### Secondary:
- Parents helping children decide
- Career counselors needing tools
- Colleges wanting placement support

## 🔑  Core User Problems We Solve

1. **"I don't know what career suits me"** → AI Psychometric Assessment
2. **"I don't know what skills the market wants"** → Real-time Job Market Intelligence
3. **"I have a gap between my skills and dream job"** → Skill Gap Analyzer
4. **"I need help with my resume"** → AI Resume Builder
5. **"Which colleges/courses should I pick?"** → Smart Course Recommender
6. **"I want to practice for interviews"** → AI Interview Coach
7. **"I need a step-by-step plan"** → Personalized Career Roadmap

## 🏗️ Tech Stack (Production)

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | SEO, SSR, Performance |
| Styling | Tailwind CSS + shadcn/ui patterns | Rapid, consistent UI |
| Backend | FastAPI (Python) | AI/ML integrations, speed |
| Database | SQLite (dev) → PostgreSQL (prod) | Reliable, scalable |
| ORM | SQLAlchemy | Mature Python ORM |
| Auth | JWT + bcrypt | Standard token auth |
| AI | Google Gemini API | Intelligence layer |
| Deployment | Vercel (FE) + Railway/Render (BE) | Fast, affordable |

## 📱 MVP Features (v1.0)

### 1. AI Career Assessment
- 30-question psychometric test
- Measures: Interests, Aptitude, Personality, Values
- Returns: Top 5 career recommendations with match scores

### 2. Career Explorer
- 200+ career profiles
- Salary data, growth outlook, skills required
- Day-in-life descriptions
- Required education paths

### 3. Skill Gap Analyzer
- Input: Current skills + Target career
- Output: Missing skills, learning resources, timeline

### 4. AI Resume Builder
- Template-based resume generator
- AI-powered content suggestions
- ATS-optimized formatting
- PDF export

### 5. Job Market Dashboard
- Trending skills by industry
- Salary benchmarks by role/city
- Hiring companies
- Growth sectors

### 6. AI Career Chat
- Ask any career question
- Powered by Gemini
- Context-aware responses
- Saves conversation history

### 7. User Dashboard
- Assessment results
- Saved careers
- Skill progress tracking
- Resume drafts

## 🎨 Design Principles
- Clean, minimal, professional
- Dark mode by default (students love it)
- Mobile-first responsive
- Fast load times (<2s)
- Accessibility (WCAG 2.1 AA)
