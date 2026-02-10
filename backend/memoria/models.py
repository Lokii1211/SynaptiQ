# ============================================
# Memoria — Database Models
# ============================================
from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean, Text, Float,
    ForeignKey, JSON, Enum as SqlEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


class MemoryType(str, enum.Enum):
    CONVERSATIONAL = "conversational"
    VISUAL = "visual"
    DOCUMENT = "document"
    AUDIO = "audio"
    CALENDAR = "calendar"
    MESSAGE = "message"


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Content
    title = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    memory_type = Column(String(50), default=MemoryType.CONVERSATIONAL)
    
    # AI-extracted metadata
    entities_people = Column(JSON, default=list)      # ["Sarah", "Rajesh"]
    entities_locations = Column(JSON, default=list)    # ["Café Blue", "Office"]
    entities_events = Column(JSON, default=list)       # ["client meeting", "birthday"]
    entities_emotions = Column(JSON, default=list)     # ["happy", "stressed"]
    entities_tasks = Column(JSON, default=list)        # ["prepare report", "call mom"]
    
    # Knowledge graph connections
    related_memory_ids = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    importance_score = Column(Float, default=0.5)      # 0-1 how important this memory is
    
    # Recall tracking
    recall_count = Column(Integer, default=0)
    last_recalled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Media
    media_urls = Column(JSON, default=list)
    
    # Timestamps
    memory_date = Column(DateTime(timezone=True), nullable=True)  # When the event happened
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="memories")


class CognitiveProfile(Base):
    __tablename__ = "cognitive_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Scores (0-100)
    overall_score = Column(Float, default=0)
    memory_retention = Column(Float, default=0)
    processing_speed = Column(Float, default=0)
    language_complexity = Column(Float, default=0)
    attention_span = Column(Float, default=0)
    vocabulary_diversity = Column(Float, default=0)
    pattern_recognition = Column(Float, default=0)
    reaction_time_ms = Column(Float, default=0)
    
    # Biomarkers
    typing_speed_wpm = Column(Float, nullable=True)
    mouse_precision = Column(Float, nullable=True)
    voice_tremor_score = Column(Float, nullable=True)
    speech_coherence = Column(Float, nullable=True)
    
    # Alert level
    alert_zone = Column(String(20), default="green")  # green, yellow, orange, red
    alert_message = Column(Text, nullable=True)
    
    # Assessment details
    assessment_type = Column(String(50), default="automatic")  # automatic, manual, demo
    raw_data = Column(JSON, default=dict)
    
    # Timestamps
    assessed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="cognitive_profiles")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Chat
    conversation_type = Column(String(50), default="companion")  # companion, legacy
    messages = Column(JSON, default=list)  # [{role, content, timestamp}]
    
    # Context
    context_summary = Column(Text, nullable=True)
    referenced_memory_ids = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="conversations")


class LegacyProfile(Base):
    __tablename__ = "legacy_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    creator_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Profile info
    name = Column(String(255), nullable=False)
    birth_year = Column(Integer, nullable=True)
    death_year = Column(Integer, nullable=True)
    relationship_to_creator = Column(String(100), nullable=True)
    profile_image = Column(String(500), nullable=True)
    
    # Personality model
    personality_traits = Column(JSON, default=dict)  # {warmth: 96, humor: 88, ...}
    knowledge_domains = Column(JSON, default=list)   # ["Indian Cooking", "Family History"]
    speaking_style = Column(Text, nullable=True)     # Description of how they speak
    common_phrases = Column(JSON, default=list)
    
    # Archived content
    stories_count = Column(Integer, default=0)
    recipes_count = Column(Integer, default=0)
    life_lessons_count = Column(Integer, default=0)
    photos_count = Column(Integer, default=0)
    voice_clips_count = Column(Integer, default=0)
    
    # Model confidence
    personality_confidence = Column(Float, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
