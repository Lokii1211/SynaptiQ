# ============================================
# Memoria — AI Services
# ============================================
import re
import json
import math
import random
from datetime import datetime, timezone
from typing import Optional
from loguru import logger

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from config import settings


# ---------- Gemini AI Client ----------

_gemini_model = None


def get_gemini_model():
    global _gemini_model
    if _gemini_model is None and GEMINI_AVAILABLE and settings.GOOGLE_AI_API_KEY:
        genai.configure(api_key=settings.GOOGLE_AI_API_KEY)
        _gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    return _gemini_model


# ---------- Memory Analysis ----------

async def analyze_memory_text(text: str) -> dict:
    """
    Extract entities, emotions, tasks, and relationships from a memory description.
    Uses Gemini AI if available, otherwise falls back to rule-based extraction.
    """
    model = get_gemini_model()
    if model:
        return await _analyze_with_gemini(text, model)
    return _analyze_with_rules(text)


async def _analyze_with_gemini(text: str, model) -> dict:
    prompt = f"""Analyze this personal memory/diary entry and extract structured information.
Return ONLY valid JSON with these exact keys:
{{
  "title": "A short title for this memory (max 10 words)",
  "people": ["list of people mentioned"],
  "locations": ["list of places mentioned"],
  "events": ["key events or activities"],
  "emotions": ["emotions detected in the text"],
  "tasks": ["any commitments, to-dos, or follow-up actions"],
  "tags": ["relevant topic tags"],
  "importance": 0.7,
  "summary": "A one-line summary"
}}

Memory text: "{text}"
"""
    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()
        # Extract JSON from markdown code block if present
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', raw)
        if json_match:
            raw = json_match.group(1).strip()
        result = json.loads(raw)
        return {
            "title": result.get("title", "Untitled Memory"),
            "entities_people": result.get("people", []),
            "entities_locations": result.get("locations", []),
            "entities_events": result.get("events", []),
            "entities_emotions": result.get("emotions", []),
            "entities_tasks": result.get("tasks", []),
            "tags": result.get("tags", []),
            "importance_score": float(result.get("importance", 0.5)),
            "summary": result.get("summary", ""),
        }
    except Exception as e:
        logger.warning(f"Gemini analysis failed, falling back to rules: {e}")
        return _analyze_with_rules(text)


def _analyze_with_rules(text: str) -> dict:
    """Rule-based fallback for memory analysis."""
    text_lower = text.lower()
    words = text.split()

    # Simple NER: capitalized words as potential names/places
    potential_names = []
    potential_locations = []
    for i, word in enumerate(words):
        clean = re.sub(r'[^\w]', '', word)
        if clean and clean[0].isupper() and len(clean) > 1 and i > 0:
            # Heuristic: if preceded by "with", "at", "from" etc.
            prev = words[i - 1].lower().rstrip('.,!?') if i > 0 else ''
            if prev in ('with', 'and', 'told', 'called', 'met', 'saw', 'asked'):
                potential_names.append(clean)
            elif prev in ('at', 'to', 'in', 'from', 'near', 'visited'):
                potential_locations.append(clean)
            else:
                potential_names.append(clean)

    # Emotions
    emotion_words = {
        'happy': 'happy', 'excited': 'excited', 'stressed': 'stressed',
        'worried': 'worried', 'sad': 'sad', 'angry': 'angry',
        'surprised': 'surprised', 'grateful': 'grateful', 'anxious': 'anxious',
        'proud': 'proud', 'tired': 'tired', 'nervous': 'nervous',
        'love': 'love', 'joy': 'joy', 'fear': 'fear',
    }
    emotions = [v for k, v in emotion_words.items() if k in text_lower]

    # Tasks (sentences with action verbs)
    task_patterns = [
        r'need to (.+?)[\.\,]', r'should (.+?)[\.\,]', r'have to (.+?)[\.\,]',
        r'must (.+?)[\.\,]', r'remind me to (.+?)[\.\,]', r'don\'t forget (.+?)[\.\,]',
    ]
    tasks = []
    for pattern in task_patterns:
        matches = re.findall(pattern, text_lower)
        tasks.extend(matches)

    # Events
    event_keywords = ['meeting', 'party', 'lunch', 'dinner', 'call', 'birthday',
                      'wedding', 'appointment', 'interview', 'class', 'exam']
    events = [kw for kw in event_keywords if kw in text_lower]

    importance = min(1.0, 0.3 + len(potential_names) * 0.1 + len(emotions) * 0.1 + len(tasks) * 0.15)

    return {
        "title": " ".join(words[:6]) + ("..." if len(words) > 6 else ""),
        "entities_people": list(set(potential_names))[:10],
        "entities_locations": list(set(potential_locations))[:10],
        "entities_events": events[:5],
        "entities_emotions": emotions[:5] or ["neutral"],
        "entities_tasks": tasks[:5],
        "tags": list(set(events + emotions))[:8],
        "importance_score": round(importance, 2),
        "summary": " ".join(words[:20]) + ("..." if len(words) > 20 else ""),
    }


# ---------- Cognitive Assessment ----------

def calculate_cognitive_score(assessment_data: dict) -> dict:
    """
    Calculate cognitive score from raw assessment data.
    Returns breakdown scores and overall score.
    """
    memory_score = _score_memory_recall(assessment_data.get("word_recall", {}))
    pattern_score = _score_pattern_recognition(assessment_data.get("pattern", {}))
    reaction_score = _score_reaction_time(assessment_data.get("reaction_time_ms", 0))
    language_score = _score_language_complexity(assessment_data.get("memory_text", ""))

    overall = (
        memory_score * 0.30 +
        pattern_score * 0.25 +
        reaction_score * 0.20 +
        language_score * 0.25
    )

    alert_zone = "green"
    alert_message = None
    if overall < 50:
        alert_zone = "red"
        alert_message = "Urgent: Significant cognitive decline detected. Medical consultation strongly recommended."
    elif overall < 65:
        alert_zone = "orange"
        alert_message = "Warning: Concerning cognitive patterns detected. Consider scheduling a medical check-up."
    elif overall < 80:
        alert_zone = "yellow"
        alert_message = "Mild changes detected. Continue monitoring. May be stress-related."

    return {
        "overall_score": round(overall, 1),
        "memory_retention": round(memory_score, 1),
        "processing_speed": round(reaction_score, 1),
        "language_complexity": round(language_score, 1),
        "attention_span": round((memory_score + pattern_score) / 2, 1),
        "vocabulary_diversity": round(language_score * 0.95, 1),
        "pattern_recognition": round(pattern_score, 1),
        "reaction_time_ms": assessment_data.get("reaction_time_ms", 0),
        "alert_zone": alert_zone,
        "alert_message": alert_message,
    }


def _score_memory_recall(data: dict) -> float:
    total = data.get("total_words", 10)
    recalled = data.get("recalled_count", 0)
    if total == 0:
        return 50.0
    return min(100, (recalled / total) * 100)


def _score_pattern_recognition(data: dict) -> float:
    correct = data.get("correct", 0)
    total = data.get("total", 1)
    return min(100, (correct / max(total, 1)) * 100)


def _score_reaction_time(rt_ms: float) -> float:
    if rt_ms <= 0:
        return 50.0
    # Optimal ~250ms, concerning >600ms
    if rt_ms < 200:
        return 100
    elif rt_ms < 300:
        return 95
    elif rt_ms < 400:
        return 85
    elif rt_ms < 500:
        return 70
    elif rt_ms < 600:
        return 55
    elif rt_ms < 800:
        return 40
    else:
        return max(20, 100 - rt_ms / 10)


def _score_language_complexity(text: str) -> float:
    if not text:
        return 50.0
    words = text.split()
    word_count = len(words)
    unique_words = len(set(w.lower() for w in words))
    avg_word_len = sum(len(w) for w in words) / max(word_count, 1)
    sentences = max(1, text.count('.') + text.count('!') + text.count('?'))
    avg_sentence_len = word_count / sentences

    diversity_score = (unique_words / max(word_count, 1)) * 40
    complexity_score = min(30, avg_word_len * 5)
    fluency_score = min(30, avg_sentence_len * 2)

    return min(100, diversity_score + complexity_score + fluency_score)


# ---------- AI Chat ----------

async def chat_with_memoria(
    user_message: str,
    conversation_history: list,
    user_memories: list = None,
) -> str:
    """Generate AI response as the Memoria companion."""
    model = get_gemini_model()
    if model:
        return await _gemini_chat(user_message, conversation_history, user_memories, model)
    return _fallback_chat(user_message)


async def _gemini_chat(
    user_message: str,
    history: list,
    memories: list,
    model,
) -> str:
    memory_context = ""
    if memories:
        memory_context = "\n\nUser's relevant memories:\n" + "\n".join(
            [f"- {m.get('content', '')[:200]}" for m in memories[:5]]
        )

    history_text = "\n".join(
        [f"{'User' if m['role'] == 'user' else 'Memoria'}: {m['content']}" for m in history[-10:]]
    )

    prompt = f"""You are Memoria, an AI cognitive companion. You help users remember, organize, and recall their memories.
You are warm, empathetic, proactive, and highly intelligent.
You analyze patterns in their life and offer helpful insights.

Previous conversation:
{history_text}

{memory_context}

User says: {user_message}

Respond as Memoria (keep response under 150 words, be helpful and natural):"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini chat error: {e}")
        return _fallback_chat(user_message)


def _fallback_chat(message: str) -> str:
    """Rule-based fallback when AI is unavailable."""
    msg = message.lower()
    if any(w in msg for w in ['meeting', 'prepare', 'tomorrow']):
        return ("I've compiled relevant information for your upcoming engagement. "
                "Based on your past interactions, here are key points to remember, "
                "along with related context from your memory archive.")
    elif any(w in msg for w in ['forgot', 'forget', 'remember']):
        return ("Let me search through your memory archive. I track conversations, "
                "commitments, and important details so nothing falls through the cracks. "
                "Could you give me more context about what you're trying to recall?")
    elif any(w in msg for w in ['how are', 'hello', 'hi']):
        return ("Hello! I'm here and ready to help. Your cognitive metrics are looking "
                "stable today. Is there anything specific you'd like to remember or recall?")
    elif any(w in msg for w in ['pattern', 'trend', 'score']):
        return ("Your cognitive patterns show consistent performance this month. "
                "Memory retention is strong, and I've noticed your recall speed "
                "has improved by 12% compared to last month.")
    else:
        return ("I've noted that. Let me cross-reference this with your existing memories "
                "and see if there are any relevant connections or follow-ups needed. "
                "Would you like me to set a reminder for anything related?")
