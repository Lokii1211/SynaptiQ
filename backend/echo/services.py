# ============================================
# Echo — AI Services
# ============================================
import re
import json
from typing import Optional
from loguru import logger

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from deep_translator import GoogleTranslator
    TRANSLATOR_AVAILABLE = True
except ImportError:
    TRANSLATOR_AVAILABLE = False

try:
    from langdetect import detect as detect_language
    LANGDETECT_AVAILABLE = True
except ImportError:
    LANGDETECT_AVAILABLE = False

from config import settings


# ---------- Gemini AI ----------
_gemini_model = None


def get_gemini():
    global _gemini_model
    if _gemini_model is None and GEMINI_AVAILABLE and settings.GOOGLE_AI_API_KEY:
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        _gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    return _gemini_model


# ---------- Translation Service ----------

LANG_MAP = {
    "en": "english", "ta": "tamil", "te": "telugu", "hi": "hindi",
    "ja": "japanese", "es": "spanish", "fr": "french", "de": "german",
    "zh": "chinese (simplified)", "ar": "arabic", "ko": "korean",
    "pt": "portuguese", "ru": "russian", "bn": "bengali", "mr": "marathi",
    "gu": "gujarati", "kn": "kannada", "ml": "malayalam", "pa": "punjabi",
    "ur": "urdu",
}


async def translate_text(
    text: str,
    source_lang: str,
    target_lang: str,
    is_medical: bool = False,
) -> dict:
    """
    Translate text with context-awareness.
    For medical contexts, uses Gemini for enhanced understanding.
    """
    # Detect language if not specified
    detected_lang = source_lang
    if LANGDETECT_AVAILABLE and not source_lang:
        try:
            detected_lang = detect_language(text)
        except Exception:
            detected_lang = "unknown"

    # Medical translation with AI
    if is_medical:
        return await _medical_translate(text, detected_lang, target_lang)

    # Standard translation
    return await _standard_translate(text, detected_lang, target_lang)


async def _medical_translate(text: str, source_lang: str, target_lang: str) -> dict:
    """Medical translation with context, emotion, and urgency detection."""
    model = get_gemini()
    if model:
        prompt = f"""You are a medical translation AI. Translate the following patient communication and analyze it.

Source language: {LANG_MAP.get(source_lang, source_lang)}
Target language: {LANG_MAP.get(target_lang, target_lang)}
Patient text: "{text}"

Return ONLY valid JSON:
{{
  "translation": "the translated text in {LANG_MAP.get(target_lang, target_lang)}",
  "medical_summary": "clinical summary of what patient is reporting",
  "detected_emotion": "primary emotion (e.g., distress, panic, pain, anxiety, calm)",
  "emotion_confidence": 0.85,
  "urgency_level": "critical/urgent/moderate/normal",
  "possible_conditions": ["list of potential conditions"],
  "recommended_actions": ["immediate actions recommended"],
  "alert_message": "one-line emergency alert for medical team"
}}"""
        try:
            response = model.generate_content(prompt)
            raw = response.text.strip()
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
            if json_match:
                raw = json_match.group(1).strip()
            result = json.loads(raw)
            return {
                "translated_text": result.get("translation", text),
                "is_medical": True,
                "medical_context": {
                    "summary": result.get("medical_summary", ""),
                    "possible_conditions": result.get("possible_conditions", []),
                    "recommended_actions": result.get("recommended_actions", []),
                    "alert": result.get("alert_message", ""),
                },
                "detected_emotion": result.get("detected_emotion", "unknown"),
                "emotion_confidence": result.get("emotion_confidence", 0.5),
                "urgency_level": result.get("urgency_level", "moderate"),
                "source_language": source_lang,
                "target_language": target_lang,
            }
        except Exception as e:
            logger.warning(f"Gemini medical translation failed: {e}")

    # Fallback to standard translation
    return await _standard_translate(text, source_lang, target_lang)


async def _standard_translate(text: str, source_lang: str, target_lang: str) -> dict:
    """Standard translation using deep-translator."""
    translated = text
    if TRANSLATOR_AVAILABLE and source_lang != target_lang:
        try:
            translator = GoogleTranslator(source=source_lang, target=target_lang)
            translated = translator.translate(text)
        except Exception as e:
            logger.warning(f"Translation failed: {e}")

    return {
        "translated_text": translated,
        "is_medical": False,
        "medical_context": None,
        "detected_emotion": "neutral",
        "emotion_confidence": 0.5,
        "urgency_level": "normal",
        "source_language": source_lang,
        "target_language": target_lang,
    }


# ---------- Emotion Analysis ----------

async def analyze_emotion(text: str) -> dict:
    """
    Analyze surface and hidden emotions in text.
    Uses Gemini for deep analysis, with rule-based fallback.
    """
    model = get_gemini()
    if model:
        return await _gemini_emotion_analysis(text, model)
    return _rule_based_emotion(text)


async def _gemini_emotion_analysis(text: str, model) -> dict:
    prompt = f"""Analyze the hidden emotions behind this text. People often say things that mask their true feelings.

Text: "{text}"

Return ONLY valid JSON:
{{
  "surface_emotions": [
    {{"label": "emotion_name", "score": 85}},
  ],
  "hidden_emotions": [
    {{"label": "emotion_name", "score": 72}},
  ],
  "incongruence_detected": true,
  "insight": "Detailed analysis of what the person is really feeling and why they might be masking it",
  "depression_risk": 0.3,
  "vocal_stress_indicators": {{
    "voice_tremor": 35,
    "pitch_variation": 60,
    "speech_rate": 20,
    "breath_pattern": 45
  }}
}}

Notes:
- Surface emotions = what the words literally express
- Hidden emotions = what the person is ACTUALLY feeling underneath
- Incongruence = when surface and hidden emotions differ significantly
- Provide 3-5 emotions for each category with scores 0-100
"""
    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
        if json_match:
            raw = json_match.group(1).strip()
        result = json.loads(raw)
        return {
            "surface_emotions": result.get("surface_emotions", []),
            "hidden_emotions": result.get("hidden_emotions", []),
            "incongruence_detected": result.get("incongruence_detected", False),
            "insight": result.get("insight", ""),
            "depression_risk": result.get("depression_risk", 0),
            "vocal_stress": result.get("vocal_stress_indicators", {}),
        }
    except Exception as e:
        logger.warning(f"Gemini emotion analysis failed: {e}")
        return _rule_based_emotion(text)


def _rule_based_emotion(text: str) -> dict:
    """Fallback emotion analysis using keyword matching."""
    text_lower = text.lower()

    # Keyword-based emotion detection
    emotion_keywords = {
        "happiness": ["happy", "great", "wonderful", "joy", "excited", "love", "amazing"],
        "sadness": ["sad", "depressed", "lonely", "miss", "cry", "hurt", "lost"],
        "anger": ["angry", "mad", "furious", "hate", "annoyed", "frustrated"],
        "anxiety": ["worried", "anxious", "nervous", "scared", "fear", "panic"],
        "suppression": ["fine", "okay", "whatever", "don't worry", "it's nothing", "i'm good"],
        "exhaustion": ["tired", "exhausted", "burned out", "can't anymore", "overwhelmed"],
    }

    surface = []
    hidden = []

    for emotion, keywords in emotion_keywords.items():
        score = sum(1 for kw in keywords if kw in text_lower) * 20
        if score > 0:
            surface.append({"label": emotion, "score": min(score, 90)})

    # Detect suppression patterns
    suppression_phrases = [
        "i'm fine", "don't worry", "it doesn't matter", "whatever",
        "i can handle", "i don't need", "no big deal",
    ]
    has_suppression = any(phrase in text_lower for phrase in suppression_phrases)

    if has_suppression:
        hidden = [
            {"label": "sadness", "score": 65},
            {"label": "loneliness", "score": 55},
            {"label": "suppression", "score": 80},
        ]

    if not surface:
        surface = [{"label": "neutral", "score": 50}]
    if not hidden:
        hidden = [{"label": "processing", "score": 40}]

    return {
        "surface_emotions": surface,
        "hidden_emotions": hidden,
        "incongruence_detected": has_suppression,
        "insight": (
            "Suppression patterns detected. The text suggests the person may be masking their true feelings."
            if has_suppression
            else "Standard emotional expression detected."
        ),
        "depression_risk": 0.6 if has_suppression else 0.1,
        "vocal_stress": {
            "voice_tremor": 35 if has_suppression else 10,
            "pitch_variation": 50,
            "speech_rate": 40,
            "breath_pattern": 30,
        },
    }


# ---------- AAC Prediction ----------

async def predict_sentence(symbols: list, context: str = "") -> dict:
    """
    Predict full sentence from selected AAC symbols.
    """
    model = get_gemini()
    if model:
        prompt = f"""An AAC (Augmentative and Alternative Communication) user has selected these symbols/words:
{', '.join(symbols)}

Previous context: {context or 'None'}

Predict the most likely complete sentence they are trying to express.
Return ONLY valid JSON:
{{
  "predicted_sentence": "the full sentence",
  "confidence": 0.92,
  "alternative_sentences": ["other possible interpretations"],
  "urgency": "none/low/medium/high/critical"
}}"""
        try:
            response = model.generate_content(prompt)
            raw = response.text.strip()
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
            if json_match:
                raw = json_match.group(1).strip()
            return json.loads(raw)
        except Exception as e:
            logger.warning(f"AAC prediction failed: {e}")

    # Fallback: simple concatenation
    sentence = " ".join(symbols)
    return {
        "predicted_sentence": f"I {sentence.lower()}",
        "confidence": 0.65,
        "alternative_sentences": [sentence],
        "urgency": "high" if any(w in symbols for w in ["Pain", "Help", "Emergency"]) else "none",
    }


# ---------- Emergency Alert ----------

def generate_emergency_alert(
    patient_text: str,
    translation: dict,
    scenario_type: str,
) -> dict:
    """Generate structured emergency alert for medical team."""
    urgency = translation.get("urgency_level", "moderate")
    emotion = translation.get("detected_emotion", "unknown")
    medical = translation.get("medical_context", {})

    alert = {
        "type": f"{scenario_type.upper()}_ALERT",
        "urgency": urgency,
        "patient_emotion": emotion,
        "summary": medical.get("summary", patient_text[:200]),
        "conditions": medical.get("possible_conditions", []),
        "actions": medical.get("recommended_actions", []),
        "auto_notifications": [],
    }

    # Auto-notification logic
    if urgency in ("critical", "immediate"):
        alert["auto_notifications"] = [
            "Cardiac team paged",
            "ICU charge nurse notified",
            "Patient vitals requested STAT",
            "Crash cart standing by",
        ]
    elif urgency == "urgent":
        alert["auto_notifications"] = [
            "On-call physician notified",
            "Nursing station alerted",
            "Patient monitoring increased",
        ]
    else:
        alert["auto_notifications"] = [
            "Case logged in system",
            "Scheduled follow-up created",
        ]

    return alert
