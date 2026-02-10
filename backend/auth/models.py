# ============================================
# Auth — Database Models
# ============================================
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String(50), default="user")  # user, doctor, admin, caregiver
    profile_image = Column(String(500), nullable=True)

    # Preferences
    preferred_language = Column(String(10), default="en")
    accessibility_mode = Column(String(50), default="standard")  # standard, high_contrast, screen_reader, eye_tracking

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    memories = relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    cognitive_profiles = relationship("CognitiveProfile", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    translations = relationship("Translation", back_populates="user", cascade="all, delete-orphan")
    emotion_analyses = relationship("EmotionAnalysis", back_populates="user", cascade="all, delete-orphan")
    emergency_sessions = relationship("EmergencySession", back_populates="user", cascade="all, delete-orphan")
