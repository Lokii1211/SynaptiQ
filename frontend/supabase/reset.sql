-- ═══════════════════════════════════════════════════════════════
-- RESET: Drop all existing tables (run this FIRST, then run schema.sql)
-- ═══════════════════════════════════════════════════════════════

-- Drop policies first (they depend on tables)
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Drop triggers
DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP TRIGGER IF EXISTS openings_updated_at ON openings;
DROP TRIGGER IF EXISTS chat_sessions_updated_at ON chat_sessions;
DROP FUNCTION IF EXISTS update_updated_at();

-- Drop all tables (order matters due to foreign keys)
DROP TABLE IF EXISTS skill_market_data CASCADE;
DROP TABLE IF EXISTS skillsync_scores CASCADE;
DROP TABLE IF EXISTS quiz_history CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS behavior_events CASCADE;
DROP TABLE IF EXISTS placement_outcomes CASCADE;
DROP TABLE IF EXISTS learning_roadmaps CASCADE;
DROP TABLE IF EXISTS career_matches CASCADE;
DROP TABLE IF EXISTS career_profiles_4d CASCADE;
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS openings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ✅ All tables dropped. Now run schema.sql
