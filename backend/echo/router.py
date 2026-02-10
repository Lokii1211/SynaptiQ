# ============================================
# Echo — API Router
# ============================================
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import json

from database import get_db
from auth.models import User
from auth.utils import get_current_user
from echo.models import Translation, EmotionAnalysis, EmergencySession, AACSession, EndangeredLanguage
from echo.services import translate_text, analyze_emotion, predict_sentence, generate_emergency_alert

router = APIRouter(prefix="/api/echo", tags=["Echo"])


# ---- Schemas ----

class TranslateRequest(BaseModel):
    text: str
    source_language: str = "auto"
    target_language: str = "en"
    is_medical: bool = False


class TranslateResponse(BaseModel):
    id: int
    translated_text: str
    source_language: str
    target_language: str
    is_medical: bool
    medical_context: Optional[dict] = None
    detected_emotion: Optional[str] = None
    emotion_confidence: Optional[float] = None
    urgency_level: Optional[str] = None


class EmotionRequest(BaseModel):
    text: str


class EmotionResponse(BaseModel):
    id: int
    input_text: str
    surface_emotions: list
    hidden_emotions: list
    incongruence_detected: bool
    insight: Optional[str]
    depression_risk_score: Optional[float]
    vocal_stress: Optional[dict] = None


class AACRequest(BaseModel):
    symbols: List[str]
    input_method: str = "eye_tracking"
    context: str = ""
    language: str = "en"


class AACResponse(BaseModel):
    predicted_sentence: str
    confidence: float
    alternatives: list = []
    urgency: str = "none"
    session_id: int


class EmergencyStartRequest(BaseModel):
    scenario_type: str  # cardiac, allergy, stroke, trauma
    patient_language: str = "ta"
    doctor_language: str = "en"


class EmergencyMessageRequest(BaseModel):
    session_id: int
    text: str
    side: str = "patient"  # patient or doctor


# ---- Translation ----

@router.post("/translate", response_model=TranslateResponse)
async def post_translate(
    req: TranslateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Translate text with optional medical context analysis."""
    result = await translate_text(
        text=req.text,
        source_lang=req.source_language,
        target_lang=req.target_language,
        is_medical=req.is_medical,
    )

    translation = Translation(
        user_id=user.id,
        source_text=req.text,
        source_language=result["source_language"],
        translated_text=result["translated_text"],
        target_language=result["target_language"],
        is_medical=result["is_medical"],
        medical_context=result.get("medical_context"),
        urgency_level=result.get("urgency_level"),
        detected_emotion=result.get("detected_emotion"),
        emotion_confidence=result.get("emotion_confidence"),
    )
    db.add(translation)
    await db.commit()
    await db.refresh(translation)

    return TranslateResponse(
        id=translation.id,
        translated_text=translation.translated_text,
        source_language=translation.source_language,
        target_language=translation.target_language,
        is_medical=translation.is_medical,
        medical_context=translation.medical_context,
        detected_emotion=translation.detected_emotion,
        emotion_confidence=translation.emotion_confidence,
        urgency_level=translation.urgency_level,
    )


@router.get("/translations", response_model=List[TranslateResponse])
async def list_translations(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
):
    """Get translation history."""
    result = await db.execute(
        select(Translation)
        .where(Translation.user_id == user.id)
        .order_by(desc(Translation.created_at))
        .limit(limit)
    )
    translations = result.scalars().all()
    return [
        TranslateResponse(
            id=t.id,
            translated_text=t.translated_text,
            source_language=t.source_language,
            target_language=t.target_language,
            is_medical=t.is_medical,
            medical_context=t.medical_context,
            detected_emotion=t.detected_emotion,
            emotion_confidence=t.emotion_confidence,
            urgency_level=t.urgency_level,
        )
        for t in translations
    ]


# ---- Emotion Analysis ----

@router.post("/emotion/analyze", response_model=EmotionResponse)
async def post_emotion_analysis(
    req: EmotionRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Analyze hidden emotions in text."""
    result = await analyze_emotion(req.text)

    analysis = EmotionAnalysis(
        user_id=user.id,
        input_text=req.text,
        surface_emotions=result.get("surface_emotions", []),
        hidden_emotions=result.get("hidden_emotions", []),
        incongruence_detected=result.get("incongruence_detected", False),
        insight=result.get("insight", ""),
        voice_tremor=result.get("vocal_stress", {}).get("voice_tremor"),
        pitch_variation=result.get("vocal_stress", {}).get("pitch_variation"),
        speech_rate=result.get("vocal_stress", {}).get("speech_rate"),
        breath_pattern=result.get("vocal_stress", {}).get("breath_pattern"),
        depression_risk_score=result.get("depression_risk", 0),
        alert_triggered=result.get("depression_risk", 0) > 0.7,
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)

    return EmotionResponse(
        id=analysis.id,
        input_text=analysis.input_text,
        surface_emotions=analysis.surface_emotions,
        hidden_emotions=analysis.hidden_emotions,
        incongruence_detected=analysis.incongruence_detected,
        insight=analysis.insight,
        depression_risk_score=analysis.depression_risk_score,
        vocal_stress=result.get("vocal_stress"),
    )


@router.get("/emotion/history", response_model=List[EmotionResponse])
async def emotion_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
):
    """Get emotion analysis history."""
    result = await db.execute(
        select(EmotionAnalysis)
        .where(EmotionAnalysis.user_id == user.id)
        .order_by(desc(EmotionAnalysis.created_at))
        .limit(limit)
    )
    analyses = result.scalars().all()
    return [
        EmotionResponse(
            id=a.id,
            input_text=a.input_text,
            surface_emotions=a.surface_emotions,
            hidden_emotions=a.hidden_emotions,
            incongruence_detected=a.incongruence_detected,
            insight=a.insight,
            depression_risk_score=a.depression_risk_score,
        )
        for a in analyses
    ]


# ---- AAC (Eye-tracking, Gestures) ----

@router.post("/aac/predict", response_model=AACResponse)
async def aac_predict(
    req: AACRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Predict full sentence from selected symbols."""
    prediction = await predict_sentence(req.symbols, req.context)

    session = AACSession(
        user_id=user.id,
        input_method=req.input_method,
        selected_symbols=req.symbols,
        predicted_sentence=prediction.get("predicted_sentence", ""),
        prediction_confidence=prediction.get("confidence", 0.5),
        spoken_text=prediction.get("predicted_sentence", ""),
        spoken_language=req.language,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return AACResponse(
        predicted_sentence=prediction.get("predicted_sentence", ""),
        confidence=prediction.get("confidence", 0.5),
        alternatives=prediction.get("alternative_sentences", []),
        urgency=prediction.get("urgency", "none"),
        session_id=session.id,
    )


# ---- Emergency Sessions ----

@router.post("/emergency/start")
async def start_emergency(
    req: EmergencyStartRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a new emergency communication session."""
    session = EmergencySession(
        user_id=user.id,
        scenario_type=req.scenario_type,
        patient_language=req.patient_language,
        doctor_language=req.doctor_language,
        messages=[],
        alerts_generated=[],
        status="active",
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {
        "session_id": session.id,
        "scenario_type": session.scenario_type,
        "status": "active",
        "message": f"Emergency session started for {req.scenario_type} scenario",
    }


@router.post("/emergency/message")
async def emergency_message(
    req: EmergencyMessageRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Process a message in an emergency session (translate + analyze)."""
    result = await db.execute(
        select(EmergencySession).where(
            EmergencySession.id == req.session_id,
            EmergencySession.user_id == user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Emergency session not found")

    # Determine translation direction
    if req.side == "patient":
        source = session.patient_language
        target = session.doctor_language
    else:
        source = session.doctor_language
        target = session.patient_language

    # Translate with medical context
    translation = await translate_text(
        text=req.text,
        source_lang=source,
        target_lang=target,
        is_medical=True,
    )

    # Generate alert if critical
    alert = None
    if translation.get("urgency_level") in ("critical", "immediate", "urgent"):
        alert = generate_emergency_alert(req.text, translation, session.scenario_type)

    # Save message
    messages = session.messages or []
    messages.append({
        "side": req.side,
        "original_text": req.text,
        "translated_text": translation["translated_text"],
        "emotion": translation.get("detected_emotion"),
        "urgency": translation.get("urgency_level"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    session.messages = messages

    if alert:
        alerts = session.alerts_generated or []
        alerts.append(alert)
        session.alerts_generated = alerts

    await db.commit()

    return {
        "translation": translation,
        "alert": alert,
        "message_count": len(messages),
    }


@router.post("/emergency/{session_id}/resolve")
async def resolve_emergency(
    session_id: int,
    notes: Optional[str] = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Resolve an emergency session."""
    result = await db.execute(
        select(EmergencySession).where(
            EmergencySession.id == session_id,
            EmergencySession.user_id == user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = "resolved"
    session.resolution_notes = notes
    session.resolved_at = datetime.now(timezone.utc)
    await db.commit()

    return {"status": "resolved", "session_id": session_id}


# ---- Endangered Languages ----

@router.get("/languages/endangered")
async def list_endangered_languages(
    db: AsyncSession = Depends(get_db),
    status_filter: Optional[str] = None,
    country: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
):
    """List endangered languages with optional filtering."""
    query = select(EndangeredLanguage)
    if status_filter:
        query = query.where(EndangeredLanguage.status == status_filter)
    if country:
        query = query.where(EndangeredLanguage.country == country)
    query = query.order_by(EndangeredLanguage.speakers_count).limit(limit)

    result = await db.execute(query)
    languages = result.scalars().all()

    return [
        {
            "id": lang.id,
            "name": lang.name,
            "region": lang.region,
            "country": lang.country,
            "speakers_count": lang.speakers_count,
            "status": lang.status,
            "risk_score": lang.risk_score,
            "hours_recorded": lang.hours_recorded,
            "words_documented": lang.words_documented,
            "has_ai_model": lang.has_ai_model,
        }
        for lang in languages
    ]


@router.get("/stats")
async def echo_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's Echo usage statistics."""
    from sqlalchemy import func as sqlfunc

    trans_count = await db.execute(
        select(sqlfunc.count(Translation.id)).where(Translation.user_id == user.id)
    )
    emotion_count = await db.execute(
        select(sqlfunc.count(EmotionAnalysis.id)).where(EmotionAnalysis.user_id == user.id)
    )
    emergency_count = await db.execute(
        select(sqlfunc.count(EmergencySession.id)).where(EmergencySession.user_id == user.id)
    )
    aac_count = await db.execute(
        select(sqlfunc.count(AACSession.id)).where(AACSession.user_id == user.id)
    )

    return {
        "total_translations": trans_count.scalar() or 0,
        "total_emotion_analyses": emotion_count.scalar() or 0,
        "total_emergency_sessions": emergency_count.scalar() or 0,
        "total_aac_sessions": aac_count.scalar() or 0,
    }


# ---- WebSocket for real-time emergency communication ----

class ConnectionManager:
    """Manage WebSocket connections for emergency sessions."""

    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast(self, session_id: int, message: dict):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass


ws_manager = ConnectionManager()


@router.websocket("/ws/emergency/{session_id}")
async def emergency_websocket(websocket: WebSocket, session_id: int):
    """
    WebSocket endpoint for real-time emergency communication.
    Patient and Doctor connect to the same session_id.
    Messages are translated and broadcast in real-time.
    """
    await ws_manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_json()
            text = data.get("text", "")
            side = data.get("side", "patient")
            source_lang = data.get("source_language", "ta")
            target_lang = data.get("target_language", "en")

            # Translate
            translation = await translate_text(
                text=text,
                source_lang=source_lang,
                target_lang=target_lang,
                is_medical=True,
            )

            # Broadcast to all in session
            await ws_manager.broadcast(session_id, {
                "type": "message",
                "side": side,
                "original": text,
                "translated": translation["translated_text"],
                "emotion": translation.get("detected_emotion"),
                "urgency": translation.get("urgency_level"),
                "medical_context": translation.get("medical_context"),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, session_id)
