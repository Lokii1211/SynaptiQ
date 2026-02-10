# ============================================
# Echo — Database Models
# ============================================
from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean, Text, Float,
    ForeignKey, JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Source
    source_text = Column(Text, nullable=False)
    source_language = Column(String(20), nullable=False)

    # Output
    translated_text = Column(Text, nullable=False)
    target_language = Column(String(20), nullable=False)

    # Medical context
    is_medical = Column(Boolean, default=False)
    medical_context = Column(JSON, nullable=True)  # {urgency, condition, recommendation}
    urgency_level = Column(String(20), nullable=True)  # normal, urgent, critical, immediate

    # Emotion
    detected_emotion = Column(String(50), nullable=True)
    emotion_confidence = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="translations")


class EmotionAnalysis(Base):
    __tablename__ = "emotion_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Input
    input_text = Column(Text, nullable=False)

    # Analysis results
    surface_emotions = Column(JSON, default=list)   # [{label, score}]
    hidden_emotions = Column(JSON, default=list)     # [{label, score}]
    incongruence_detected = Column(Boolean, default=False)
    insight = Column(Text, nullable=True)

    # Vocal stress (if audio input)
    voice_tremor = Column(Float, nullable=True)
    pitch_variation = Column(Float, nullable=True)
    speech_rate = Column(Float, nullable=True)
    breath_pattern = Column(Float, nullable=True)

    # Depression indicators
    depression_risk_score = Column(Float, nullable=True)  # 0-1
    alert_triggered = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="emotion_analyses")


class EmergencySession(Base):
    __tablename__ = "emergency_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Session
    scenario_type = Column(String(50), nullable=False)  # cardiac, allergy, stroke, trauma
    patient_language = Column(String(20), nullable=False)
    doctor_language = Column(String(20), default="en")

    # Timeline
    messages = Column(JSON, default=list)  # [{side, text, timestamp, emotion, urgency}]
    alerts_generated = Column(JSON, default=list)

    # resolution
    status = Column(String(20), default="active")  # active, resolved, escalated
    resolution_notes = Column(Text, nullable=True)

    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="emergency_sessions")


class AACSession(Base):
    __tablename__ = "aac_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Input type
    input_method = Column(String(50), nullable=False)  # eye_tracking, gesture, blink, switch
    selected_symbols = Column(JSON, default=list)

    # AI prediction
    predicted_sentence = Column(Text, nullable=True)
    prediction_confidence = Column(Float, nullable=True)

    # Output
    spoken_text = Column(Text, nullable=True)
    spoken_language = Column(String(20), default="en")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EndangeredLanguage(Base):
    __tablename__ = "endangered_languages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Language info
    name = Column(String(255), nullable=False, unique=True)
    region = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    speakers_count = Column(Integer, nullable=True)

    # Status
    status = Column(String(50), nullable=False)  # safe, vulnerable, endangered, critical, extinct
    risk_score = Column(Float, nullable=True)     # 0-1

    # Preservation data
    hours_recorded = Column(Float, default=0)
    words_documented = Column(Integer, default=0)
    songs_preserved = Column(Integer, default=0)
    stories_recorded = Column(Integer, default=0)

    # AI model
    has_ai_model = Column(Boolean, default=False)
    model_accuracy = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
