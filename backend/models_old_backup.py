"""
SkillSync AI - Complete Database Models
Production-grade schema covering ALL platform sections:
  A: Jobs Engine + Application Tracker + Internships
  B: Coding Arena + Learning Hub
  C: Challenges & Competitions
  D: Network + Company Intelligence
  E: Resume Builder
  F: Campus Command Center + Certified Assessments
  G: Notifications Engine
"""

from sqlalchemy import (
    Column, String, Integer, Float, DateTime, Text, JSON, Boolean,
    ForeignKey, Table, Enum as SQLEnum, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from database import Base


def _uuid():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


# ╔══════════════════════════════════════════════════════════════╗
# ║                     CORE — USER MODEL                       ║
# ╚══════════════════════════════════════════════════════════════╝

class UserRole(str, enum.Enum):
    student = "student"
    mentor = "mentor"
    recruiter = "recruiter"
    college_admin = "college_admin"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student")

    # Profile
    age = Column(Integer, nullable=True)
    phone = Column(String, nullable=True)
    education_level = Column(String, nullable=True)
    current_field = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    college_tier = Column(Integer, nullable=True)  # 1, 2, 3
    graduation_year = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # SkillSync Intelligence
    skillsync_score = Column(Integer, default=0)
    career_path = Column(String, nullable=True)  # e.g. "SWE", "Data Science", "PM"
    archetype = Column(String, nullable=True)     # from 4D assessment
    streak_days = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    is_open_to_work = Column(Boolean, default=False)
    is_open_to_recruiters = Column(Boolean, default=False)

    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    # Relationships
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    saved_careers = relationship("SavedCareer", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    job_applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    skill_verifications = relationship("SkillVerification", back_populates="user", cascade="all, delete-orphan")
    coding_submissions = relationship("CodingSubmission", back_populates="user", cascade="all, delete-orphan")
    challenge_participations = relationship("ChallengeParticipation", back_populates="user", cascade="all, delete-orphan")
    network_connections_sent = relationship("NetworkConnection", foreign_keys="NetworkConnection.from_user_id", back_populates="from_user", cascade="all, delete-orphan")
    network_connections_received = relationship("NetworkConnection", foreign_keys="NetworkConnection.to_user_id", back_populates="to_user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    learning_enrollments = relationship("LearningEnrollment", back_populates="user", cascade="all, delete-orphan")
    mentor_profile = relationship("MentorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_reviews = relationship("CompanyReview", back_populates="user", cascade="all, delete-orphan")
    study_group_memberships = relationship("StudyGroupMembership", back_populates="user", cascade="all, delete-orphan")


# ╔══════════════════════════════════════════════════════════════╗
# ║                 SECTION A — JOBS ENGINE                      ║
# ╚══════════════════════════════════════════════════════════════╝

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=_uuid)
    company_name = Column(String, nullable=False, index=True)
    role_title = Column(String, nullable=False, index=True)
    role_type = Column(String, nullable=False)  # fulltime | internship | contract
    location = Column(String, nullable=False)
    salary_min_lpa = Column(Float, nullable=True)
    salary_max_lpa = Column(Float, nullable=True)
    equity_percent = Column(Float, nullable=True)
    company_type = Column(String, nullable=True)  # startup | mid | MNC | PSU | NGO
    company_logo_url = Column(String, nullable=True)

    college_tier_required = Column(String, default="any")  # 1 | 2 | 3 | any
    min_cgpa = Column(Float, nullable=True)
    graduation_year_range = Column(JSON, nullable=True)  # [2025, 2026]
    required_skills = Column(JSON, nullable=True)
    preferred_skills = Column(JSON, nullable=True)

    application_deadline = Column(DateTime, nullable=True)
    posted_at = Column(DateTime, default=_now)
    source = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    interview_rounds = Column(JSON, nullable=True)
    avg_interview_difficulty = Column(Integer, nullable=True)  # 1-5
    job_description = Column(Text, nullable=False)
    honest_summary = Column(Text, nullable=True)

    # Startup-specific
    funding_stage = Column(String, nullable=True)
    investors = Column(String, nullable=True)
    team_size = Column(String, nullable=True)

    created_at = Column(DateTime, default=_now)

    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False, index=True)
    status = Column(String, default="saved")  # saved | applied | screening | interview | offer | rejected
    notes = Column(Text, nullable=True)
    resume_version_id = Column(String, ForeignKey("resumes.id"), nullable=True)
    interview_dates = Column(JSON, nullable=True)
    offer_details = Column(JSON, nullable=True)
    applied_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="job_applications")
    job = relationship("Job", back_populates="applications")
    resume = relationship("Resume")

    __table_args__ = (
        UniqueConstraint("user_id", "job_id", name="uq_user_job"),
    )


class Internship(Base):
    __tablename__ = "internships"

    id = Column(String, primary_key=True, default=_uuid)
    company_name = Column(String, nullable=False, index=True)
    role_title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    stipend_min = Column(Integer, nullable=True)
    stipend_max = Column(Integer, nullable=True)
    duration_weeks = Column(Integer, nullable=True)
    work_hours_per_week = Column(Integer, nullable=True)
    is_remote = Column(Boolean, default=False)
    company_type = Column(String, nullable=True)
    company_logo_url = Column(String, nullable=True)

    required_skills = Column(JSON, nullable=True)
    portfolio_impact_score = Column(Integer, nullable=True)  # 1-10
    certificate_quality = Column(String, nullable=True)
    ppo_rate = Column(Float, nullable=True)
    real_stipend_reported = Column(Integer, nullable=True)
    career_path_tags = Column(JSON, nullable=True)  # ["SWE", "Data Science"]

    description = Column(Text, nullable=False)
    honest_summary = Column(Text, nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    posted_at = Column(DateTime, default=_now)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=_now)


# ╔══════════════════════════════════════════════════════════════╗
# ║           SECTION B — CODING & LEARNING ENGINE               ║
# ╚══════════════════════════════════════════════════════════════╝

class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    difficulty = Column(Integer, nullable=False)  # 1-5
    estimated_minutes = Column(Integer, nullable=True)
    category = Column(String, nullable=False)  # arrays | strings | trees | dp | etc
    career_path_tags = Column(JSON, nullable=True)
    company_tags = Column(JSON, nullable=True)
    round_tag = Column(String, nullable=True)
    frequency_india = Column(String, default="medium")  # low | medium | high | very_high

    problem_statement = Column(Text, nullable=False)
    constraints = Column(Text, nullable=True)
    examples = Column(JSON, nullable=True)
    starter_code = Column(JSON, nullable=True)  # {"python": "...", "javascript": "..."}
    hints = Column(JSON, nullable=True)  # 3 progressive hints
    solution_approaches = Column(JSON, nullable=True)
    time_complexity = Column(String, nullable=True)
    space_complexity = Column(String, nullable=True)
    similar_problems = Column(JSON, nullable=True)
    interview_context = Column(Text, nullable=True)
    test_cases = Column(JSON, nullable=True)  # [{"input": ..., "output": ...}]

    created_at = Column(DateTime, default=_now)

    submissions = relationship("CodingSubmission", back_populates="problem", cascade="all, delete-orphan")


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    problem_id = Column(String, ForeignKey("coding_problems.id"), nullable=False, index=True)
    language = Column(String, nullable=False)
    code = Column(Text, nullable=False)
    status = Column(String, nullable=False)  # accepted | wrong_answer | TLE | runtime_error
    runtime_ms = Column(Integer, nullable=True)
    memory_kb = Column(Integer, nullable=True)
    test_cases_passed = Column(Integer, default=0)
    test_cases_total = Column(Integer, default=0)
    ai_code_review = Column(JSON, nullable=True)
    submitted_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="coding_submissions")
    problem = relationship("CodingProblem", back_populates="submissions")


class LearningTrack(Base):
    __tablename__ = "learning_tracks"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=True)
    level = Column(String, nullable=True)  # "Beginner → Advanced"
    duration_weeks = Column(Integer, nullable=True)
    estimated_hours = Column(Integer, nullable=True)
    career_path_tags = Column(JSON, nullable=True)
    skills_covered = Column(JSON, nullable=True)
    is_free = Column(Boolean, default=True)
    rating = Column(Float, default=0)
    enrolled_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=_now)

    modules = relationship("LearningModule", back_populates="track", cascade="all, delete-orphan", order_by="LearningModule.order")
    enrollments = relationship("LearningEnrollment", back_populates="track", cascade="all, delete-orphan")


class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(String, primary_key=True, default=_uuid)
    track_id = Column(String, ForeignKey("learning_tracks.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    lesson_count = Column(Integer, default=0)
    content_type = Column(String, default="mixed")  # article | video | project | quiz
    content = Column(JSON, nullable=True)  # lesson content
    resources = Column(JSON, nullable=True)  # external links

    created_at = Column(DateTime, default=_now)

    track = relationship("LearningTrack", back_populates="modules")


class LearningEnrollment(Base):
    __tablename__ = "learning_enrollments"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    track_id = Column(String, ForeignKey("learning_tracks.id"), nullable=False, index=True)
    progress = Column(JSON, nullable=True)  # {"module_id": "completed|in_progress|locked"}
    current_module_id = Column(String, nullable=True)
    completed_lessons = Column(Integer, default=0)
    total_time_minutes = Column(Integer, default=0)
    enrolled_at = Column(DateTime, default=_now)
    last_activity = Column(DateTime, default=_now)

    user = relationship("User", back_populates="learning_enrollments")
    track = relationship("LearningTrack", back_populates="enrollments")

    __table_args__ = (
        UniqueConstraint("user_id", "track_id", name="uq_user_track"),
    )


class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    author_id = Column(String, ForeignKey("users.id"), nullable=True)
    category = Column(String, nullable=False)
    tags = Column(JSON, nullable=True)
    career_path_tags = Column(JSON, nullable=True)
    read_time_minutes = Column(Integer, nullable=True)
    is_published = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)

    created_at = Column(DateTime, default=_now)
    published_at = Column(DateTime, nullable=True)


# ╔══════════════════════════════════════════════════════════════╗
# ║         SECTION C — CHALLENGES & COMPETITIONS                ║
# ╚══════════════════════════════════════════════════════════════╝

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    challenge_type = Column(String, nullable=False)  # company | campus_war | weekly_sprint | hackathon | quiz
    description = Column(Text, nullable=False)
    rules = Column(Text, nullable=True)
    sponsor_company = Column(String, nullable=True)
    career_path_tags = Column(JSON, nullable=True)

    difficulty = Column(Integer, nullable=True)  # 1-5
    prize_pool = Column(String, nullable=True)
    prize_details = Column(JSON, nullable=True)  # {"1st": "₹50K", "2nd": "₹25K"}
    fast_track_hiring = Column(Boolean, default=False)

    format = Column(String, nullable=True)  # coding | case_study | design | data_analysis | mixed
    team_size_min = Column(Integer, default=1)
    team_size_max = Column(Integer, default=1)
    duration_hours = Column(Integer, nullable=True)

    starts_at = Column(DateTime, nullable=True)
    ends_at = Column(DateTime, nullable=True)
    registration_deadline = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

    max_participants = Column(Integer, nullable=True)
    registered_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=_now)

    participations = relationship("ChallengeParticipation", back_populates="challenge", cascade="all, delete-orphan")


class ChallengeParticipation(Base):
    __tablename__ = "challenge_participations"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False, index=True)
    status = Column(String, default="registered")  # registered | in_progress | submitted | judged
    score = Column(Integer, nullable=True)
    rank = Column(Integer, nullable=True)
    submission = Column(JSON, nullable=True)
    feedback = Column(Text, nullable=True)
    registered_at = Column(DateTime, default=_now)
    submitted_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="challenge_participations")
    challenge = relationship("Challenge", back_populates="participations")

    __table_args__ = (
        UniqueConstraint("user_id", "challenge_id", name="uq_user_challenge"),
    )


# ╔══════════════════════════════════════════════════════════════╗
# ║            SECTION D — NETWORK & COMPANY INTEL               ║
# ╚══════════════════════════════════════════════════════════════╝

class NetworkConnection(Base):
    __tablename__ = "network_connections"

    id = Column(String, primary_key=True, default=_uuid)
    from_user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    to_user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    connection_type = Column(String, default="peer")  # peer | mentor | alumni
    status = Column(String, default="pending")  # pending | accepted | rejected
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_now)

    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="network_connections_sent")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="network_connections_received")

    __table_args__ = (
        UniqueConstraint("from_user_id", "to_user_id", name="uq_connection"),
    )


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    company = Column(String, nullable=True)
    role = Column(String, nullable=True)
    years_experience = Column(Integer, nullable=True)
    specializations = Column(JSON, nullable=True)
    availability = Column(JSON, nullable=True)  # {"slots": [...]}
    max_mentees = Column(Integer, default=3)
    current_mentees = Column(Integer, default=0)
    rating = Column(Float, default=0)
    total_sessions = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="mentor_profile")


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    career_path = Column(String, nullable=True)
    max_members = Column(Integer, default=6)
    is_public = Column(Boolean, default=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=_now)

    memberships = relationship("StudyGroupMembership", back_populates="group", cascade="all, delete-orphan")


class StudyGroupMembership(Base):
    __tablename__ = "study_group_memberships"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    group_id = Column(String, ForeignKey("study_groups.id"), nullable=False, index=True)
    role = Column(String, default="member")  # admin | member
    joined_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="study_group_memberships")
    group = relationship("StudyGroup", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("user_id", "group_id", name="uq_user_group"),
    )


class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, nullable=False, unique=True, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    company_type = Column(String, nullable=True)  # startup | mid | MNC | PSU
    founded_year = Column(Integer, nullable=True)
    team_size = Column(String, nullable=True)
    funding_stage = Column(String, nullable=True)
    investors = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    headquarters = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)

    honest_summary = Column(Text, nullable=True)

    # Hiring Intelligence
    fresh_roles = Column(JSON, nullable=True)
    college_tiers = Column(String, nullable=True)
    min_cgpa = Column(Float, nullable=True)
    interview_process = Column(Text, nullable=True)
    interview_difficulty = Column(Integer, nullable=True)  # 1-5
    ppo_rate = Column(Float, nullable=True)
    offer_acceptance_rate = Column(String, nullable=True)
    hiring_timeline = Column(String, nullable=True)

    # Salary Truth
    salary_data = Column(JSON, nullable=True)  # {"sde1": {"ctc": "...", "in_hand": "..."}}
    joining_bonus = Column(String, nullable=True)
    first_increment = Column(String, nullable=True)

    # Culture
    work_hours_actual = Column(String, nullable=True)
    wfh_policy = Column(String, nullable=True)
    growth_speed = Column(String, nullable=True)
    manager_quality_rating = Column(Float, nullable=True)
    pros = Column(JSON, nullable=True)
    cons = Column(JSON, nullable=True)

    # Verdict
    overall_rating = Column(Float, nullable=True)
    best_for = Column(Text, nullable=True)
    not_ideal_for = Column(Text, nullable=True)
    verdict = Column(Text, nullable=True)

    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    reviews = relationship("CompanyReview", back_populates="company", cascade="all, delete-orphan")


class CompanyReview(Base):
    __tablename__ = "company_reviews"

    id = Column(String, primary_key=True, default=_uuid)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    role = Column(String, nullable=True)
    experience_type = Column(String, nullable=True)  # intern | fulltime | contract
    pros = Column(Text, nullable=True)
    cons = Column(Text, nullable=True)
    interview_experience = Column(Text, nullable=True)
    interview_difficulty = Column(Integer, nullable=True)
    salary_reported = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=True)

    created_at = Column(DateTime, default=_now)

    company = relationship("Company", back_populates="reviews")
    user = relationship("User", back_populates="company_reviews")


# ╔══════════════════════════════════════════════════════════════╗
# ║            SECTION E — RESUME & PROFILE BUILDER              ║
# ╚══════════════════════════════════════════════════════════════╝

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assessment_type = Column(String, nullable=False)  # career | aptitude | tech | domain
    answers = Column(JSON, nullable=False)
    results = Column(JSON, nullable=True)
    top_careers = Column(JSON, nullable=True)
    personality_traits = Column(JSON, nullable=True)
    score = Column(Integer, nullable=True)
    percentile = Column(Float, nullable=True)
    completed = Column(Boolean, default=False)
    proctored = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="assessments")


class Career(Base):
    __tablename__ = "careers"

    id = Column(String, primary_key=True, default=_uuid)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    day_in_life = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=True)
    required_education = Column(JSON, nullable=True)
    salary_range_min = Column(Integer, nullable=True)
    salary_range_max = Column(Integer, nullable=True)
    growth_outlook = Column(String, nullable=True)
    demand_score = Column(Integer, nullable=True)
    top_companies = Column(JSON, nullable=True)
    entrance_exams = Column(JSON, nullable=True)
    related_courses = Column(JSON, nullable=True)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=_now)


class SavedCareer(Base):
    __tablename__ = "saved_careers"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    career_id = Column(String, ForeignKey("careers.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="saved_careers")
    career = relationship("Career")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, default="My Resume")
    template = Column(String, default="fresher")  # fresher | intern-exp | technical | non-tech | management
    content = Column(JSON, nullable=False)
    ai_suggestions = Column(JSON, nullable=True)
    ats_score = Column(Integer, nullable=True)
    target_role = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False)
    download_count = Column(Integer, default=0)
    response_rate = Column(Float, nullable=True)  # % of applications that got callbacks with this version
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="resumes")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, default="New Chat")
    messages = Column(JSON, default=list)
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    user = relationship("User", back_populates="chat_sessions")


# ╔══════════════════════════════════════════════════════════════╗
# ║       SECTION F — CAMPUS COMMAND + CERTIFIED ASSESSMENTS     ║
# ╚══════════════════════════════════════════════════════════════╝

class SkillVerification(Base):
    __tablename__ = "skill_verifications"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    skill_name = Column(String, nullable=False)
    assessment_type = Column(String, nullable=True)  # aptitude | tech | domain | english
    score = Column(Integer, nullable=True)
    percentile = Column(Float, nullable=True)
    level = Column(String, nullable=True)  # bronze | silver | gold | platinum
    is_certified = Column(Boolean, default=False)
    certificate_url = Column(String, nullable=True)
    verified_at = Column(DateTime, default=_now)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="skill_verifications")


class CampusDrive(Base):
    __tablename__ = "campus_drives"

    id = Column(String, primary_key=True, default=_uuid)
    college_name = Column(String, nullable=False, index=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    company_name = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    eligibility = Column(JSON, nullable=True)  # {"min_cgpa": 7.0, "branches": ["CSE", "IT"]}
    drive_date = Column(DateTime, nullable=True)
    registration_deadline = Column(DateTime, nullable=True)
    status = Column(String, default="upcoming")  # upcoming | ongoing | completed
    results = Column(JSON, nullable=True)  # {"offers": 12, "appeared": 80}
    salary_offered = Column(String, nullable=True)
    created_at = Column(DateTime, default=_now)


# ╔══════════════════════════════════════════════════════════════╗
# ║           SECTION G — NOTIFICATION ENGINE                    ║
# ╚══════════════════════════════════════════════════════════════╝

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    notification_type = Column(String, nullable=False)  # opportunity | market_brief | company_alert | deadline | peer_update | learning_nudge | interview_prep | achievement
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    action_url = Column(String, nullable=True)
    action_label = Column(String, nullable=True)
    extra_data = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    is_pushed = Column(Boolean, default=False)
    priority = Column(String, default="normal")  # low | normal | high | urgent
    created_at = Column(DateTime, default=_now)

    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index("ix_notification_user_read", "user_id", "is_read"),
    )


# ╔══════════════════════════════════════════════════════════════╗
# ║                   MARKET INSIGHTS                            ║
# ╚══════════════════════════════════════════════════════════════╝

class MarketInsight(Base):
    __tablename__ = "market_insights"

    id = Column(String, primary_key=True, default=_uuid)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    source = Column(String, nullable=True)
    region = Column(String, default="India")
    created_at = Column(DateTime, default=_now)
