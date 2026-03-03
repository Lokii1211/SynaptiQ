"""
SkillTen — Complete Database Models
Production-grade schema: Users, Skills, Assessment 4D, Coding, Aptitude,
Jobs, Challenges, Social, Roadmaps, Gamification, Companies, Notifications,
Placement Outcomes, Colleges, Interview Experiences, Resumes, Chat, Careers
"""
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, Date, Text, JSON, Boolean,
    ForeignKey, UniqueConstraint, Index, Numeric
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from database import Base

def _uuid():
    return str(uuid.uuid4())

def _now():
    return datetime.now(timezone.utc)


# ═══════════════════════════ CORE USER ═══════════════════════════

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255))
    oauth_provider = Column(String(50))
    oauth_id = Column(String(255))
    is_email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    role = Column(String(20), default="student")
    created_at = Column(DateTime, default=_now)
    last_active_at = Column(DateTime, default=_now)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skill_verifications = relationship("UserSkillVerification", back_populates="user", cascade="all, delete-orphan")
    assessment_sessions = relationship("AssessmentSession", back_populates="user", cascade="all, delete-orphan")
    career_profiles = relationship("CareerProfile4D", back_populates="user", cascade="all, delete-orphan")
    coding_stats = relationship("UserCodingStats", back_populates="user", uselist=False, cascade="all, delete-orphan")
    submissions = relationship("UserProblemSubmission", back_populates="user", cascade="all, delete-orphan")
    aptitude_profile = relationship("UserAptitudeProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    job_applications = relationship("UserJobApplication", back_populates="user", cascade="all, delete-orphan")
    challenge_registrations = relationship("ChallengeRegistration", back_populates="user", cascade="all, delete-orphan")
    connections_sent = relationship("UserConnection", foreign_keys="UserConnection.requester_id", back_populates="requester", cascade="all, delete-orphan")
    connections_received = relationship("UserConnection", foreign_keys="UserConnection.receiver_id", back_populates="receiver", cascade="all, delete-orphan")
    community_posts = relationship("CommunityPost", back_populates="author", cascade="all, delete-orphan")
    roadmaps = relationship("LearningRoadmap", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    score_log = relationship("UserViyaScoreLog", back_populates="user", cascade="all, delete-orphan")
    activity_daily = relationship("UserActivityDaily", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("ViyaNotification", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    company_reviews = relationship("CompanyReview", back_populates="reviewer", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    tagline = Column(String(150))
    avatar_url = Column(Text)
    banner_url = Column(Text)
    bio = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(50), default="India")
    mobility_preference = Column(String(20), default="metro")
    date_of_birth = Column(Date)
    gender = Column(String(20))
    # Education
    college_name = Column(String(200))
    college_tier = Column(Integer)
    stream = Column(String(100))
    graduation_year = Column(Integer)
    current_year_of_study = Column(Integer)
    cgpa = Column(Float)
    # Career
    target_role = Column(String(100))
    target_industry = Column(String(100))
    open_to_work = Column(Boolean, default=False)
    open_to_work_type = Column(String(20))
    open_to_work_visible = Column(Boolean, default=True)
    # Social
    linkedin_url = Column(Text)
    github_username = Column(String(100))
    personal_website = Column(Text)
    twitter_handle = Column(String(100))
    # Viya Score
    viya_score = Column(Integer, default=0)
    score_breakdown = Column(JSON)
    score_7d_trend = Column(Integer, default=0)
    score_30d_trend = Column(Integer, default=0)
    score_percentile = Column(Float, default=0)
    # Settings
    is_public = Column(Boolean, default=True)
    show_activity_heatmap = Column(Boolean, default=True)
    show_aptitude_scores = Column(Boolean, default=True)
    show_coding_stats = Column(Boolean, default=True)
    allow_recruiter_contact = Column(Boolean, default=True)
    # System
    profile_complete_score = Column(Integer, default=0)
    share_token = Column(String, default=_uuid)
    # Gamification
    streak_days = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    archetype_code = Column(String(20))
    archetype_name = Column(String(100))
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="profile")


# ═══════════════════════════ SKILLS ═══════════════════════════

class SkillsTaxonomy(Base):
    __tablename__ = "skills_taxonomy"
    id = Column(String, primary_key=True, default=_uuid)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50))
    sub_category = Column(String(100))
    description = Column(Text)
    icon_url = Column(Text)
    color = Column(String(7))
    is_trending = Column(Boolean, default=False)
    trending_score = Column(Float)
    demand_level = Column(String(10))
    avg_salary_premium_pct = Column(Integer)
    related_skills = Column(JSON)
    learning_time_hours = Column(Integer)
    created_at = Column(DateTime, default=_now)

    verifications = relationship("UserSkillVerification", back_populates="skill", cascade="all, delete-orphan")


class UserSkillVerification(Base):
    __tablename__ = "user_skill_verifications"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String, ForeignKey("skills_taxonomy.id"), nullable=False, index=True)
    verified_score = Column(Integer)
    verified_percentile = Column(Float)
    proficiency_level = Column(String(20))
    attempts_count = Column(Integer, default=1)
    score_history = Column(JSON)
    expires_at = Column(DateTime)
    is_expired = Column(Boolean, default=False)
    is_self_claimed = Column(Boolean, default=False)
    last_verified_at = Column(DateTime, default=_now)
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="skill_verifications")
    skill = relationship("SkillsTaxonomy", back_populates="verifications")
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)


# ═══════════════════════════ ASSESSMENT 4D ═══════════════════════════

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=_uuid)
    question_type = Column(String(20), nullable=False)
    category = Column(String(50))
    sub_category = Column(String(100))
    difficulty = Column(Integer)
    question_text = Column(Text, nullable=False)
    options = Column(JSON)
    correct_answer = Column(String(10))
    explanation = Column(Text)
    tags = Column(JSON)
    career_path_tags = Column(JSON)
    company_tags = Column(JSON)
    is_active = Column(Boolean, default=True)
    is_assessment_question = Column(Boolean, default=False)
    is_quiz_question = Column(Boolean, default=False)
    is_aptitude_question = Column(Boolean, default=False)
    usage_count = Column(Integer, default=0)
    avg_completion_time_ms = Column(Integer)
    created_at = Column(DateTime, default=_now)


class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    version = Column(Integer, default=1)
    started_at = Column(DateTime, default=_now)
    completed_at = Column(DateTime)
    is_complete = Column(Boolean, default=False)
    is_abandoned = Column(Boolean, default=False)
    question_sequence = Column(JSON)
    total_questions = Column(Integer, default=0)
    device_type = Column(String(20))

    user = relationship("User", back_populates="assessment_sessions")
    answers = relationship("AssessmentAnswer", back_populates="session", cascade="all, delete-orphan")


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"
    id = Column(String, primary_key=True, default=_uuid)
    session_id = Column(String, ForeignKey("assessment_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String, ForeignKey("questions.id"))
    question_order = Column(Integer)
    selected_option = Column(String(10))
    time_spent_ms = Column(Integer)
    hesitation_ms = Column(Integer)
    is_skipped = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)

    session = relationship("AssessmentSession", back_populates="answers")


class CareerProfile4D(Base):
    __tablename__ = "career_profiles_4d"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String, ForeignKey("assessment_sessions.id"))
    dim_analytical = Column(Float)
    dim_interpersonal = Column(Float)
    dim_creative = Column(Float)
    dim_systematic = Column(Float)
    dominant_dimension = Column(String(20))
    archetype_code = Column(String(20))
    archetype_name = Column(String(100))
    archetype_description = Column(Text)
    avg_response_time_ms = Column(Integer)
    consistency_score = Column(Float)
    circumstance_vector = Column(JSON)
    version = Column(Integer, default=1)
    is_current = Column(Boolean, default=True)
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="career_profiles")
    matches = relationship("CareerMatch", back_populates="profile", cascade="all, delete-orphan")


class CareerMatch(Base):
    __tablename__ = "career_matches"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    profile_id = Column(String, ForeignKey("career_profiles_4d.id"))
    career_slug = Column(String(100), nullable=False)
    career_name = Column(String(200))
    match_score = Column(Float)
    rank = Column(Integer)
    driving_dimension = Column(String(20))
    green_zone = Column(JSON)
    yellow_zone = Column(JSON)
    red_zone = Column(JSON)
    salary_p50 = Column(Integer)
    timeline_months_realistic = Column(Integer)
    day_in_life_snapshot = Column(Text)
    why_match = Column(Text)
    created_at = Column(DateTime, default=_now)

    profile = relationship("CareerProfile4D", back_populates="matches")



# ═══════════════════════════ CODING ═══════════════════════════

class CodingProblem(Base):
    __tablename__ = "coding_problems"
    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String(300), nullable=False)
    slug = Column(String(300), unique=True, nullable=False, index=True)
    difficulty = Column(String(10))  # easy|medium|hard
    difficulty_numeric = Column(Integer)
    estimated_minutes_fresher = Column(Integer)
    category = Column(String(50))
    sub_categories = Column(JSON)
    career_path_tags = Column(JSON)
    company_tags = Column(JSON)
    round_tags = Column(JSON)
    india_frequency = Column(String(20))
    problem_statement = Column(Text, nullable=False)
    constraints = Column(Text)
    examples = Column(JSON)
    hints = Column(JSON)
    solution_approaches = Column(JSON)
    time_complexity = Column(String(50))
    space_complexity = Column(String(50))
    starter_code = Column(JSON)
    test_cases = Column(JSON)
    hidden_test_cases = Column(JSON)
    interview_context = Column(Text)
    similar_problem_slugs = Column(JSON)
    total_submissions = Column(Integer, default=0)
    accepted_submissions = Column(Integer, default=0)
    acceptance_rate = Column(Float)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)

    submissions = relationship("UserProblemSubmission", back_populates="problem", cascade="all, delete-orphan")


class UserProblemSubmission(Base):
    __tablename__ = "user_problem_submissions"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id = Column(String, ForeignKey("coding_problems.id"), nullable=False, index=True)
    language = Column(String(20))
    code = Column(Text, nullable=False)
    status = Column(String(20))
    runtime_ms = Column(Integer)
    memory_mb = Column(Float)
    test_cases_passed = Column(Integer)
    test_cases_total = Column(Integer)
    ai_review = Column(JSON)
    time_spent_ms = Column(Integer)
    attempt_number = Column(Integer, default=1)
    hints_used = Column(Integer, default=0)
    submitted_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="submissions")
    problem = relationship("CodingProblem", back_populates="submissions")


class UserCodingStats(Base):
    __tablename__ = "user_coding_stats"
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    problems_solved_total = Column(Integer, default=0)
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    problems_by_category = Column(JSON, default={})
    problems_by_company = Column(JSON, default={})
    current_streak_days = Column(Integer, default=0)
    longest_streak_days = Column(Integer, default=0)
    last_solved_at = Column(DateTime)
    contest_rating = Column(Integer, default=1500)
    contest_global_rank = Column(Integer)
    contest_participated = Column(Integer, default=0)
    activity_heatmap = Column(JSON, default={})
    updated_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="coding_stats")


# ═══════════════════════════ APTITUDE ═══════════════════════════

class AptitudeTestSession(Base):
    __tablename__ = "aptitude_test_sessions"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_type = Column(String(50))
    company_tag = Column(String(100))
    started_at = Column(DateTime, default=_now)
    completed_at = Column(DateTime)
    duration_minutes = Column(Integer)
    is_proctored = Column(Boolean, default=False)
    sections = Column(JSON)
    total_score = Column(Float)
    section_scores = Column(JSON)
    percentile_scores = Column(JSON)
    national_benchmark = Column(JSON)
    passed_cutoff = Column(Boolean)
    time_taken_seconds = Column(Integer)


class UserAptitudeProfile(Base):
    __tablename__ = "user_aptitude_profile"
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    quant_percentile = Column(Float)
    logical_percentile = Column(Float)
    verbal_percentile = Column(Float)
    di_percentile = Column(Float)
    overall_percentile = Column(Float)
    best_section = Column(String(30))
    weakest_section = Column(String(30))
    tests_taken = Column(Integer, default=0)
    last_tested_at = Column(DateTime)
    score_trend = Column(JSON)
    viya_certified_level = Column(String(20))
    certified_at = Column(DateTime)

    user = relationship("User", back_populates="aptitude_profile")


# ═══════════════════════════ JOBS ═══════════════════════════

class JobListing(Base):
    __tablename__ = "job_listings"
    id = Column(String, primary_key=True, default=_uuid)
    company_name = Column(String(200), nullable=False, index=True)
    company_logo_url = Column(Text)
    company_type = Column(String(30))
    role_title = Column(String(200), nullable=False, index=True)
    role_type = Column(String(20))
    location = Column(String(200))
    is_remote = Column(Boolean, default=False)
    is_hybrid = Column(Boolean, default=False)
    salary_min_lpa = Column(Float)
    salary_max_lpa = Column(Float)
    stipend_monthly = Column(Integer)
    equity_percent = Column(Float)
    college_tier_required = Column(Integer)
    min_cgpa = Column(Float)
    graduation_year_min = Column(Integer)
    graduation_year_max = Column(Integer)
    stream_requirements = Column(JSON)
    required_skills = Column(JSON)
    preferred_skills = Column(JSON)
    required_experience_months = Column(Integer, default=0)
    description_raw = Column(Text)
    description_honest = Column(Text)
    interview_rounds = Column(JSON)
    interview_difficulty = Column(Integer)
    application_deadline = Column(DateTime)
    application_url = Column(Text)
    application_type = Column(String(20))
    posted_at = Column(DateTime, default=_now)
    source = Column(String(50))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    posted_by = Column(String, ForeignKey("users.id"))
    # Startup-specific
    funding_stage = Column(String(30))
    team_size_range = Column(String(30))
    created_at = Column(DateTime, default=_now)

    applications = relationship("UserJobApplication", back_populates="job", cascade="all, delete-orphan")


class UserJobApplication(Base):
    __tablename__ = "user_job_applications"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(String, ForeignKey("job_listings.id"), nullable=False, index=True)
    status = Column(String(30), default="saved")
    resume_version_id = Column(String)
    applied_at = Column(DateTime)
    cover_letter = Column(Text)
    match_score = Column(Float)
    notes = Column(Text)
    interview_dates = Column(JSON)
    offer_details = Column(JSON)
    rejection_stage = Column(String(30))
    rejection_reason = Column(Text)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="job_applications")
    job = relationship("JobListing", back_populates="applications")
    __table_args__ = (UniqueConstraint("user_id", "job_id", name="uq_user_job"),)


# ═══════════════════════════ CHALLENGES ═══════════════════════════

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String(300), nullable=False)
    slug = Column(String(300), unique=True, nullable=False, index=True)
    challenge_type = Column(String(30))
    sponsor_company = Column(String(200))
    sponsor_logo_url = Column(Text)
    description = Column(Text)
    rules = Column(Text)
    prizes = Column(JSON)
    fast_track_offer = Column(Boolean, default=False)
    career_path_tags = Column(JSON)
    difficulty = Column(String(10))
    start_at = Column(DateTime)
    end_at = Column(DateTime)
    registration_deadline = Column(DateTime)
    max_participants = Column(Integer)
    is_team_challenge = Column(Boolean, default=False)
    team_size_min = Column(Integer, default=1)
    team_size_max = Column(Integer, default=1)
    problems = Column(JSON)
    evaluation_criteria = Column(JSON)
    total_registrations = Column(Integer, default=0)
    total_submissions = Column(Integer, default=0)
    status = Column(String(20), default="upcoming")
    created_by = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=_now)

    registrations = relationship("ChallengeRegistration", back_populates="challenge", cascade="all, delete-orphan")


class ChallengeRegistration(Base):
    __tablename__ = "challenge_registrations"
    id = Column(String, primary_key=True, default=_uuid)
    challenge_id = Column(String, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    team_id = Column(String)
    team_name = Column(String(100))
    registered_at = Column(DateTime, default=_now)
    status = Column(String(20), default="registered")
    score = Column(Float)
    rank = Column(Integer)
    submission = Column(JSON)
    feedback = Column(Text)
    submitted_at = Column(DateTime)

    challenge = relationship("Challenge", back_populates="registrations")
    user = relationship("User", back_populates="challenge_registrations")
    __table_args__ = (UniqueConstraint("challenge_id", "user_id", name="uq_challenge_user"),)


# ═══════════════════════════ SOCIAL ═══════════════════════════

class UserConnection(Base):
    __tablename__ = "user_connections"
    id = Column(String, primary_key=True, default=_uuid)
    requester_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(20), default="pending")
    connection_type = Column(String(20), default="peer")
    message = Column(Text)
    created_at = Column(DateTime, default=_now)
    responded_at = Column(DateTime)

    requester = relationship("User", foreign_keys=[requester_id], back_populates="connections_sent")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="connections_received")
    __table_args__ = (UniqueConstraint("requester_id", "receiver_id", name="uq_connection"),)


class CommunityPost(Base):
    __tablename__ = "community_posts"
    id = Column(String, primary_key=True, default=_uuid)
    author_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    post_type = Column(String(30))
    title = Column(String(300))
    content = Column(Text, nullable=False)
    tags = Column(JSON)
    career_path_tags = Column(JSON)
    is_pinned = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    helpful_votes = Column(Integer, default=0)
    moderation_status = Column(String(20), default="approved")
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    author = relationship("User", back_populates="community_posts")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")


class PostComment(Base):
    __tablename__ = "post_comments"
    id = Column(String, primary_key=True, default=_uuid)
    post_id = Column(String, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)

    post = relationship("CommunityPost", back_populates="comments")
    author = relationship("User")


class PostLike(Base):
    __tablename__ = "post_likes"
    id = Column(String, primary_key=True, default=_uuid)
    post_id = Column(String, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=_now)
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_like"),)

    post = relationship("CommunityPost", back_populates="likes")
    user = relationship("User")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(100), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)


# ═══════════════════════════ ROADMAP ═══════════════════════════

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_career_slug = Column(String(100))
    target_career_name = Column(String(200))
    total_months = Column(Integer)
    hours_per_week = Column(Integer)
    generated_at = Column(DateTime, default=_now)
    last_rerouted_at = Column(DateTime)
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    completion_pct = Column(Float, default=0)

    user = relationship("User", back_populates="roadmaps")
    phases = relationship("RoadmapPhase", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"
    id = Column(String, primary_key=True, default=_uuid)
    roadmap_id = Column(String, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"), nullable=False)
    phase_number = Column(Integer)
    title = Column(String(200))
    description = Column(Text)
    duration_weeks = Column(Integer)
    weekly_hours = Column(Integer)
    status = Column(String(20), default="pending")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    completion_pct = Column(Float, default=0)

    roadmap = relationship("LearningRoadmap", back_populates="phases")
    milestones = relationship("RoadmapMilestone", back_populates="phase", cascade="all, delete-orphan")


class RoadmapMilestone(Base):
    __tablename__ = "roadmap_milestones"
    id = Column(String, primary_key=True, default=_uuid)
    phase_id = Column(String, ForeignKey("roadmap_phases.id", ondelete="CASCADE"), nullable=False)
    roadmap_id = Column(String, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    milestone_order = Column(Integer)
    skill_name = Column(String(200))
    resource_name = Column(String(300))
    resource_url = Column(Text)
    is_free = Column(Boolean, default=True)
    estimated_hours = Column(Float)
    project_to_build = Column(Text)
    why_companies_care = Column(Text)
    non_obvious_tip = Column(Text)
    status = Column(String(20), default="pending")
    completed_at = Column(DateTime)
    reroute_triggered = Column(Boolean, default=False)
    linked_problem_ids = Column(JSON)
    created_at = Column(DateTime, default=_now)

    phase = relationship("RoadmapPhase", back_populates="milestones")


# ═══════════════════════════ GAMIFICATION ═══════════════════════════

class Badge(Base):
    __tablename__ = "badges"
    id = Column(String, primary_key=True, default=_uuid)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    icon_url = Column(Text)
    category = Column(String(50))
    rarity = Column(String(20))
    condition_type = Column(String(50))
    condition_data = Column(JSON)
    points_value = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=_now)


class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(String, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=_now)
    is_featured = Column(Boolean, default=False)
    featured_order = Column(Integer)

    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")
    __table_args__ = (UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),)


class UserViyaScoreLog(Base):
    __tablename__ = "user_viya_score_log"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    score_breakdown = Column(JSON)
    delta = Column(Integer)
    calculated_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="score_log")


class UserActivityDaily(Base):
    __tablename__ = "user_activity_daily"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_date = Column(Date, nullable=False)
    activity_score = Column(Integer, default=0)
    problems_solved = Column(Integer, default=0)
    quiz_completed = Column(Integer, default=0)
    milestones_completed = Column(Integer, default=0)
    aptitude_tests = Column(Integer, default=0)
    challenges_participated = Column(Integer, default=0)
    community_posts_count = Column(Integer, default=0)
    learning_modules = Column(Integer, default=0)
    session_minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="activity_daily")
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_user_date"),)


# ═══════════════════════════ COMPANIES ═══════════════════════════

class ViyaCompany(Base):
    __tablename__ = "viya_companies"
    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String(200), unique=True, nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    logo_url = Column(Text)
    company_type = Column(String(30))
    founded_year = Column(Integer)
    team_size_range = Column(String(30))
    funding_stage = Column(String(30))
    investors = Column(JSON)
    headquarters_city = Column(String(100))
    india_office_cities = Column(JSON)
    website_url = Column(Text)
    industry = Column(String(100))
    viya_honest_summary = Column(Text)
    is_hiring_actively = Column(Boolean, default=False)
    viya_overall_rating = Column(Float)
    # Salary truth
    salary_data = Column(JSON)
    work_hours_actual = Column(String(50))
    wfh_policy = Column(String(100))
    interview_process = Column(Text)
    interview_difficulty = Column(Integer)
    ppo_rate = Column(Float)
    pros = Column(JSON)
    cons = Column(JSON)
    best_for = Column(Text)
    not_ideal_for = Column(Text)
    verdict = Column(Text)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    reviews = relationship("CompanyReview", back_populates="company", cascade="all, delete-orphan")


class CompanyReview(Base):
    __tablename__ = "company_reviews"
    id = Column(String, primary_key=True, default=_uuid)
    company_id = Column(String, ForeignKey("viya_companies.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    reviewer_role = Column(String(200))
    reviewer_tenure_months = Column(Integer)
    is_current_employee = Column(Boolean, default=False)
    overall_rating = Column(Integer)
    culture_rating = Column(Integer)
    growth_rating = Column(Integer)
    wlb_rating = Column(Integer)
    management_rating = Column(Integer)
    actual_work_hours_per_week = Column(Integer)
    ctc_lpa = Column(Float)
    in_hand_monthly = Column(Integer)
    pros = Column(Text)
    cons = Column(Text)
    interview_experience = Column(Text)
    interview_difficulty = Column(Integer)
    interview_rounds = Column(JSON)
    offer_received = Column(Boolean)
    is_verified = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=True)
    moderation_status = Column(String(20), default="pending")
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)

    company = relationship("ViyaCompany", back_populates="reviews")
    reviewer = relationship("User", back_populates="company_reviews")


# ═══════════════════════════ NOTIFICATIONS + MISC ═══════════════════════════

class ViyaNotification(Base):
    __tablename__ = "viya_notifications"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    title = Column(String(200))
    body = Column(Text)
    action_url = Column(Text)
    icon = Column(String(50))
    is_read = Column(Boolean, default=False)
    is_pushed = Column(Boolean, default=False)
    extra_data = Column(JSON)
    created_at = Column(DateTime, default=_now)
    read_at = Column(DateTime)
    expires_at = Column(DateTime)

    user = relationship("User", back_populates="notifications")
    __table_args__ = (Index("ix_notif_user_read", "user_id", "is_read"),)


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, default="My Resume")
    template = Column(String, default="fresher")
    content = Column(JSON, nullable=False)
    ai_suggestions = Column(JSON)
    ats_score = Column(Integer)
    target_role = Column(String)
    is_primary = Column(Boolean, default=False)
    download_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="resumes")


class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, default="New Chat")
    messages = Column(JSON, default=list)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="chat_sessions")


class Career(Base):
    __tablename__ = "careers"
    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    day_in_life = Column(Text)
    required_skills = Column(JSON)
    required_education = Column(JSON)
    salary_range_min = Column(Integer)
    salary_range_max = Column(Integer)
    growth_outlook = Column(String)
    demand_score = Column(Integer)
    top_companies = Column(JSON)
    entrance_exams = Column(JSON)
    related_courses = Column(JSON)
    icon = Column(String)
    created_at = Column(DateTime, default=_now)


class PlacementOutcome(Base):
    __tablename__ = "placement_outcomes"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(200), nullable=False)
    role_title = Column(String(200), nullable=False)
    ctc_lpa = Column(Float)
    in_hand_monthly = Column(Integer)
    offer_type = Column(String(20))
    joining_date = Column(Date)
    location = Column(String(200))
    months_from_assessment = Column(Integer)
    matched_viya_career = Column(Boolean)
    top_skills_used = Column(JSON)
    satisfaction_1month = Column(Integer)
    would_recommend_viya = Column(Boolean)
    college_tier = Column(Integer)
    stream = Column(String(100))
    graduation_year = Column(Integer)
    is_anonymized = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    reported_at = Column(DateTime, default=_now)
    verified_at = Column(DateTime)


class College(Base):
    __tablename__ = "colleges"
    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String(300), unique=True, nullable=False, index=True)
    slug = Column(String(300), unique=True, nullable=False)
    short_name = Column(String(100))
    tier = Column(Integer)
    city = Column(String(100))
    state = Column(String(100))
    college_type = Column(String(30))
    naac_grade = Column(String(5))
    nirf_rank = Column(Integer)
    total_students = Column(Integer)
    placement_rate_reported = Column(Float)
    placement_rate_viya = Column(Float)
    avg_ctc_reported = Column(Float)
    avg_ctc_viya = Column(Float)
    top_recruiters = Column(JSON)
    viya_enrolled_students = Column(Integer, default=0)
    viya_partner = Column(Boolean, default=False)
    tp_officer_name = Column(String(200))
    tp_officer_email = Column(String(255))
    created_at = Column(DateTime, default=_now)


class InterviewExperience(Base):
    __tablename__ = "interview_experiences"
    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(200), nullable=False, index=True)
    role_title = Column(String(200))
    round_number = Column(Integer)
    round_type = Column(String(30))
    questions_asked = Column(JSON)
    difficulty_rating = Column(Integer)
    duration_minutes = Column(Integer)
    interviewer_style = Column(String(20))
    outcome = Column(String(20))
    tips_for_next = Column(Text)
    overall_rating = Column(Integer)
    is_anonymous = Column(Boolean, default=True)
    college_tier = Column(Integer)
    reported_at = Column(DateTime, default=_now)


class MarketInsight(Base):
    __tablename__ = "market_insights"
    id = Column(String, primary_key=True, default=_uuid)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    source = Column(String)
    region = Column(String, default="India")
    created_at = Column(DateTime, default=_now)
