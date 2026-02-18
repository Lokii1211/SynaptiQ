# SkillSync AI 🎯

**AI-Powered Career Guidance Platform for Indian Students**

> Discover. Plan. Achieve.

SkillSync AI helps students discover their ideal career path through AI-powered psychometric assessments, real-time job market data, and personalized learning roadmaps.

## 🚀 Live Demo

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`

## ✨ Features

### 🧠 AI Career Assessment
- 15-question psychometric test
- AI-powered personality analysis (Gemini)
- Top 5 career recommendations with match scores
- Personality trait visualization (Holland's RIASEC model)

### 🔍 Career Explorer
- 12+ detailed career profiles (200+ planned)
- Real salary data in Indian Rupees (LPA)
- Growth outlook & market demand scores
- Day-in-life descriptions, required skills, education paths
- Top hiring companies & entrance exams

### 📊 Skill Gap Analyzer
- Input current skills → Get gap analysis
- AI-generated personalized learning roadmap
- Free & paid resource recommendations (NPTEL, Coursera, etc.)
- Timeline estimation for job-readiness

### 💬 AI Career Chat
- 24/7 AI career counselor
- Context-aware conversations
- India-specific job market advice
- Conversation history

### 📈 Market Intelligence
- Trending skills with growth %
- Salary benchmarks by role & experience
- Top cities for each career

### 📝 AI Resume Builder
- ATS-optimized resume creation
- AI suggestions for improvement
- ATS score calculation

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt |
| AI | Google Gemini API |

## 📂 Project Structure

```
skillsync-ai/
├── backend/
│   ├── main.py              # FastAPI app entry
│   ├── routes.py             # All API routes
│   ├── models.py             # SQLAlchemy models
│   ├── database.py           # DB config
│   ├── auth.py               # JWT authentication
│   ├── ai_engine.py          # Gemini AI integration
│   ├── career_data.py        # Career profiles & assessment questions
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx          # Landing page
│       │   ├── signup/page.tsx   # Signup
│       │   ├── login/page.tsx    # Login
│       │   ├── careers/page.tsx  # Career explorer
│       │   ├── careers/[slug]/   # Career detail
│       │   ├── assessment/       # AI assessment
│       │   ├── skills/page.tsx   # Skill gap analyzer
│       │   ├── chat/page.tsx     # AI chat
│       │   ├── dashboard/        # User dashboard
│       │   ├── layout.tsx        # Root layout + SEO
│       │   └── globals.css       # Design system
│       └── lib/
│           └── api.ts            # API client
│
└── PRODUCT_SPEC.md           # Product specification
```

## 🛠️ Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key (optional — works with mock data)

### Backend
```bash
cd backend
pip install -r requirements.txt
# Edit .env with your GOOGLE_API_KEY
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |
| GET | `/api/assessment/questions` | Get quiz questions |
| POST | `/api/assessment/submit` | Submit & get results |
| GET | `/api/assessment/results` | Get past results |
| GET | `/api/careers` | Browse careers |
| GET | `/api/careers/{slug}` | Career detail |
| GET | `/api/careers/categories` | Career categories |
| POST | `/api/skills/gap-analysis` | Skill gap analysis |
| POST | `/api/resume/create` | Create resume |
| POST | `/api/chat` | AI career chat |
| GET | `/api/market/trending-skills` | Trending skills |
| GET | `/api/market/salary-insights` | Salary data |

## 🎨 Design

- **Theme**: Dark mode with glassmorphism
- **Colors**: Indigo/Purple gradient palette
- **Typography**: Inter font family
- **Animations**: Smooth fade-ins, progress bars, floating effects
- **Responsive**: Mobile-first design

## 📝 License

MIT © 2026 SkillSync AI
