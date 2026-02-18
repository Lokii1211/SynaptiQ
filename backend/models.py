"""
SkillSync AI - Database Models
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    education_level = Column(String, nullable=True)  # "10th", "12th", "undergraduate", "graduate"
    current_field = Column(String, nullable=True)
    city = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    assessments = relationship("Assessment", back_populates="user")
    saved_careers = relationship("SavedCareer", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    assessment_type = Column(String, nullable=False)  # "career", "personality", "aptitude"
    answers = Column(JSON, nullable=False)
    results = Column(JSON, nullable=True)  # AI-generated results
    top_careers = Column(JSON, nullable=True)  # [{career, match_score, reasons}]
    personality_traits = Column(JSON, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="assessments")


class Career(Base):
    __tablename__ = "careers"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False)  # "technology", "healthcare", "business", etc.
    description = Column(Text, nullable=False)
    day_in_life = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=True)  # ["Python", "ML", ...]
    required_education = Column(JSON, nullable=True)  # [{degree, field, duration}]
    salary_range_min = Column(Integer, nullable=True)  # Annual in INR
    salary_range_max = Column(Integer, nullable=True)
    growth_outlook = Column(String, nullable=True)  # "high", "medium", "low"
    demand_score = Column(Integer, nullable=True)  # 1-100
    top_companies = Column(JSON, nullable=True)  # ["Google", "TCS", ...]
    entrance_exams = Column(JSON, nullable=True)
    related_courses = Column(JSON, nullable=True)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SavedCareer(Base):
    __tablename__ = "saved_careers"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    career_id = Column(String, ForeignKey("careers.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="saved_careers")
    career = relationship("Career")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, default="My Resume")
    content = Column(JSON, nullable=False)  # Structured resume data
    template = Column(String, default="modern")
    ai_suggestions = Column(JSON, nullable=True)
    ats_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resumes")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, default="New Chat")
    messages = Column(JSON, default=list)  # [{role, content, timestamp}]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="chat_sessions")


class MarketInsight(Base):
    __tablename__ = "market_insights"

    id = Column(String, primary_key=True, default=generate_uuid)
    category = Column(String, nullable=False)  # "trending_skill", "salary_data", "job_posting"
    title = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    source = Column(String, nullable=True)
    region = Column(String, default="India")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
