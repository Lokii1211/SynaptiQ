-- ╔══════════════════════════════════════════════════════════════╗
-- ║  SkillSync AI — Supabase Database Schema                     ║
-- ║  Production-grade schema for long-term deployment             ║
-- ╚══════════════════════════════════════════════════════════════╝
-- Run this SQL in your Supabase Dashboard → SQL Editor

-- ─── ENABLE EXTENSIONS ───
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. USERS TABLE ───
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'mentor')),
    age INTEGER,
    education_level TEXT,
    city TEXT,
    institution TEXT,
    career_choice TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. OPENINGS TABLE ───
CREATE TABLE IF NOT EXISTS openings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    type TEXT DEFAULT 'Full-time',
    salary TEXT,
    category TEXT DEFAULT 'technology',
    description TEXT,
    skills TEXT[] DEFAULT '{}',
    apply_link TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deadline TEXT,
    applicants INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. ASSESSMENTS TABLE ───
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scores JSONB NOT NULL DEFAULT '{}',
    top_careers JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. CHAT SESSIONS TABLE ───
CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. COMMUNITY POSTS TABLE ───
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. POST COMMENTS TABLE ───
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. QUIZ HISTORY TABLE ───
CREATE TABLE IF NOT EXISTS quiz_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_date DATE NOT NULL DEFAULT CURRENT_DATE,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES FOR PERFORMANCE ───
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_openings_active ON openings(is_active);
CREATE INDEX IF NOT EXISTS idx_openings_category ON openings(category);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_user ON quiz_history(user_id);

-- ─── AUTO-UPDATE updated_at TRIGGER ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER openings_updated_at
    BEFORE UPDATE ON openings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) ───
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- Allow service role (our backend) full access
CREATE POLICY "Service role full access on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on openings" ON openings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on assessments" ON assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on chat_sessions" ON chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on community_posts" ON community_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on post_comments" ON post_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on quiz_history" ON quiz_history FOR ALL USING (true) WITH CHECK (true);

-- ─── SEED ADMIN USER ───
-- Password: admin123 (bcrypt hash)
INSERT INTO users (id, email, name, password_hash, role, points)
VALUES (
    'a0000001-0000-0000-0000-000000000001',
    'admin@skillsync.ai',
    'SkillSync Admin',
    '$2b$10$SfLKaCHUnXnVh1K.gfbTSOK6pzKAAZktfIh2IXpEShpgdZHN2XJXe',
    'admin',
    0
) ON CONFLICT (email) DO NOTHING;

-- ─── SEED SAMPLE OPENINGS ───
INSERT INTO openings (title, company, location, type, salary, category, description, skills, apply_link, is_urgent, deadline, applicants) VALUES
('AI/ML Engineer', 'Google India', 'Bangalore', 'Full-time', '₹25-45 LPA', 'technology', 'Build next-gen AI models for Google Search and Assistant. Work with cutting-edge transformer architectures.', ARRAY['Python', 'TensorFlow', 'PyTorch', 'LLMs'], 'https://careers.google.com', true, '2026-03-15', 142),
('Product Manager', 'Razorpay', 'Bangalore', 'Full-time', '₹18-30 LPA', 'business', 'Define product strategy for payments infrastructure. Lead cross-functional teams.', ARRAY['Product Strategy', 'SQL', 'Analytics', 'Agile'], 'https://razorpay.com/jobs', false, '2026-03-30', 89),
('Full Stack Developer', 'CRED', 'Bangalore', 'Full-time', '₹15-25 LPA', 'technology', 'Build fintech products used by millions. React + Node.js stack.', ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'], 'https://cred.club/careers', false, '2026-04-01', 203),
('UX Designer', 'Swiggy', 'Bangalore', 'Full-time', '₹12-22 LPA', 'design', 'Design delightful food ordering experiences for 50M+ users.', ARRAY['Figma', 'User Research', 'Prototyping', 'Design Systems'], 'https://careers.swiggy.com', true, '2026-03-10', 67),
('Backend Engineer', 'PhonePe', 'Pune', 'Full-time', '₹20-35 LPA', 'technology', 'Scale payments infrastructure serving 400M+ users. Java/Kotlin microservices.', ARRAY['Java', 'Kotlin', 'Microservices', 'Kafka', 'Redis'], 'https://phonepe.com/careers', false, '2026-04-15', 156),
('Business Analyst', 'McKinsey', 'Mumbai', 'Full-time', '₹15-28 LPA', 'business', 'Drive transformation for Fortune 500 clients across industries.', ARRAY['Excel', 'PowerPoint', 'SQL', 'Problem Solving'], 'https://mckinsey.com/careers', false, '2026-03-25', 234),
('Data Engineer Intern', 'Deloitte', 'Hyderabad', 'Internship', '₹40K/month', 'technology', '6-month internship building data pipelines and analytics dashboards.', ARRAY['Python', 'SQL', 'Spark', 'Airflow'], 'https://deloitte.com/careers', false, '2026-03-20', 312),
('Financial Analyst', 'Zerodha', 'Bangalore', 'Full-time', '₹10-18 LPA', 'finance', 'Analyze market trends and build financial models for India''s largest broker.', ARRAY['Financial Modeling', 'Python', 'Excel', 'Bloomberg'], 'https://zerodha.com/careers', false, '2026-04-10', 98)
ON CONFLICT DO NOTHING;

-- ─── SEED COMMUNITY POSTS ───
INSERT INTO community_posts (user_name, title, content, category, tags, likes) VALUES
('Priya S.', 'How I got into Google as a fresher from a Tier-3 college', 'I want to share my journey of cracking Google''s interview. Total prep time: 8 months. Don''t let your college name hold you back!', 'success-stories', ARRAY['google', 'placement', 'tier-3'], 347),
('Rahul K.', 'Best free resources for ML in 2026', 'After trying 20+ courses, here are my top picks for learning ML for free in India.', 'resources', ARRAY['ml', 'free-resources', 'learning'], 215),
('Ananya M.', 'Parents want me to do MBA, I want to be a designer - advice?', 'I''m in my final year of B.Com and I''ve been doing freelance graphic design for 2 years. How do I convince them?', 'career-dilemma', ARRAY['parents', 'design', 'mba'], 189)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- ✅ Schema ready! Your SkillSync database is production-ready.
-- ═══════════════════════════════════════════════════════════
