# ============================================
# Memoria — API Router
# ============================================
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

from database import get_db
from auth.models import User
from auth.utils import get_current_user
from memoria.models import Memory, CognitiveProfile, Conversation, LegacyProfile
from memoria.services import analyze_memory_text, calculate_cognitive_score, chat_with_memoria

router = APIRouter(prefix="/api/memoria", tags=["Memoria"])


# ---- Schemas ----

class MemoryCreate(BaseModel):
    content: str
    memory_type: str = "conversational"
    memory_date: Optional[datetime] = None
    media_urls: Optional[List[str]] = None


class MemoryResponse(BaseModel):
    id: int
    title: Optional[str]
    content: str
    memory_type: str
    entities_people: list
    entities_locations: list
    entities_events: list
    entities_emotions: list
    entities_tasks: list
    tags: list
    importance_score: float
    recall_count: int
    memory_date: Optional[datetime]
    created_at: Optional[datetime]


class CognitiveAssessmentRequest(BaseModel):
    memory_text: Optional[str] = ""
    word_recall: Optional[dict] = {}
    pattern: Optional[dict] = {}
    reaction_time_ms: Optional[float] = 0
    assessment_type: str = "manual"


class CognitiveProfileResponse(BaseModel):
    id: int
    overall_score: float
    memory_retention: float
    processing_speed: float
    language_complexity: float
    attention_span: float
    vocabulary_diversity: float
    pattern_recognition: float
    reaction_time_ms: float
    alert_zone: str
    alert_message: Optional[str]
    assessed_at: Optional[datetime]


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    conversation_type: str = "companion"


class ChatResponse(BaseModel):
    reply: str
    conversation_id: int
    referenced_memories: list = []


# ---- Memory CRUD ----

@router.post("/memories", response_model=MemoryResponse, status_code=201)
async def create_memory(
    req: MemoryCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new memory with AI analysis."""
    # AI analyze the content
    analysis = await analyze_memory_text(req.content)

    memory = Memory(
        user_id=user.id,
        content=req.content,
        memory_type=req.memory_type,
        title=analysis.get("title"),
        entities_people=analysis.get("entities_people", []),
        entities_locations=analysis.get("entities_locations", []),
        entities_events=analysis.get("entities_events", []),
        entities_emotions=analysis.get("entities_emotions", []),
        entities_tasks=analysis.get("entities_tasks", []),
        tags=analysis.get("tags", []),
        importance_score=analysis.get("importance_score", 0.5),
        memory_date=req.memory_date or datetime.now(timezone.utc),
        media_urls=req.media_urls or [],
    )
    db.add(memory)
    await db.commit()
    await db.refresh(memory)

    return _memory_to_response(memory)


@router.get("/memories", response_model=List[MemoryResponse])
async def list_memories(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    memory_type: Optional[str] = None,
):
    """List user's memories with search and filtering."""
    query = select(Memory).where(Memory.user_id == user.id)

    if search:
        query = query.where(Memory.content.ilike(f"%{search}%"))
    if memory_type:
        query = query.where(Memory.memory_type == memory_type)

    query = query.order_by(desc(Memory.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    memories = result.scalars().all()

    return [_memory_to_response(m) for m in memories]


@router.get("/memories/{memory_id}", response_model=MemoryResponse)
async def get_memory(
    memory_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single memory by ID."""
    result = await db.execute(
        select(Memory).where(Memory.id == memory_id, Memory.user_id == user.id)
    )
    memory = result.scalar_one_or_none()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    # Track recall
    memory.recall_count += 1
    memory.last_recalled_at = datetime.now(timezone.utc)
    await db.commit()

    return _memory_to_response(memory)


@router.delete("/memories/{memory_id}", status_code=204)
async def delete_memory(
    memory_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a memory."""
    result = await db.execute(
        select(Memory).where(Memory.id == memory_id, Memory.user_id == user.id)
    )
    memory = result.scalar_one_or_none()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    await db.delete(memory)
    await db.commit()


# ---- Cognitive Assessments ----

@router.post("/cognitive/assess", response_model=CognitiveProfileResponse)
async def run_cognitive_assessment(
    req: CognitiveAssessmentRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Run a cognitive assessment and store the results."""
    scores = calculate_cognitive_score(req.model_dump())

    profile = CognitiveProfile(
        user_id=user.id,
        overall_score=scores["overall_score"],
        memory_retention=scores["memory_retention"],
        processing_speed=scores["processing_speed"],
        language_complexity=scores["language_complexity"],
        attention_span=scores["attention_span"],
        vocabulary_diversity=scores["vocabulary_diversity"],
        pattern_recognition=scores["pattern_recognition"],
        reaction_time_ms=scores["reaction_time_ms"],
        alert_zone=scores["alert_zone"],
        alert_message=scores["alert_message"],
        assessment_type=req.assessment_type,
        raw_data=req.model_dump(),
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    return _profile_to_response(profile)


@router.get("/cognitive/history", response_model=List[CognitiveProfileResponse])
async def cognitive_history(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(30, ge=1, le=100),
):
    """Get cognitive assessment history (for trend charts)."""
    result = await db.execute(
        select(CognitiveProfile)
        .where(CognitiveProfile.user_id == user.id)
        .order_by(desc(CognitiveProfile.assessed_at))
        .limit(limit)
    )
    profiles = result.scalars().all()
    return [_profile_to_response(p) for p in profiles]


@router.get("/cognitive/latest", response_model=CognitiveProfileResponse)
async def latest_cognitive_profile(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the most recent cognitive profile."""
    result = await db.execute(
        select(CognitiveProfile)
        .where(CognitiveProfile.user_id == user.id)
        .order_by(desc(CognitiveProfile.assessed_at))
        .limit(1)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="No cognitive profile found. Take an assessment first.")
    return _profile_to_response(profile)


# ---- Chat / Companion ----

@router.post("/chat", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Chat with Memoria AI companion."""
    # Load or create conversation
    conversation = None
    if req.conversation_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == req.conversation_id,
                Conversation.user_id == user.id,
            )
        )
        conversation = result.scalar_one_or_none()

    if not conversation:
        conversation = Conversation(
            user_id=user.id,
            conversation_type=req.conversation_type,
            messages=[],
        )
        db.add(conversation)
        await db.flush()

    # Add user message
    messages = conversation.messages or []
    messages.append({
        "role": "user",
        "content": req.message,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Fetch recent memories for context
    mem_result = await db.execute(
        select(Memory)
        .where(Memory.user_id == user.id)
        .order_by(desc(Memory.created_at))
        .limit(5)
    )
    recent_memories = [
        {"content": m.content, "title": m.title, "tags": m.tags}
        for m in mem_result.scalars().all()
    ]

    # Generate AI response
    reply = await chat_with_memoria(req.message, messages, recent_memories)

    # Save AI response
    messages.append({
        "role": "assistant",
        "content": reply,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    conversation.messages = messages
    conversation.last_message_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(conversation)

    return ChatResponse(
        reply=reply,
        conversation_id=conversation.id,
        referenced_memories=[m.get("title", "") for m in recent_memories],
    )


# ---- Knowledge Graph ----

@router.get("/knowledge-graph")
async def get_knowledge_graph(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Build knowledge graph data from user's memories."""
    result = await db.execute(
        select(Memory).where(Memory.user_id == user.id).limit(100)
    )
    memories = result.scalars().all()

    nodes = []
    edges = []
    node_ids = {}

    for memory in memories:
        # Add people nodes
        for person in (memory.entities_people or []):
            if person not in node_ids:
                node_ids[person] = len(nodes)
                nodes.append({"id": len(nodes), "label": person, "type": "person", "color": "#7C5CFC"})

        # Add location nodes
        for loc in (memory.entities_locations or []):
            if loc not in node_ids:
                node_ids[loc] = len(nodes)
                nodes.append({"id": len(nodes), "label": loc, "type": "location", "color": "#00F5A0"})

        # Add event nodes
        for event in (memory.entities_events or []):
            if event not in node_ids:
                node_ids[event] = len(nodes)
                nodes.append({"id": len(nodes), "label": event, "type": "event", "color": "#00D4FF"})

        # Create edges between co-occurring entities
        all_entities = (
            (memory.entities_people or []) +
            (memory.entities_locations or []) +
            (memory.entities_events or [])
        )
        for i in range(len(all_entities)):
            for j in range(i + 1, len(all_entities)):
                if all_entities[i] in node_ids and all_entities[j] in node_ids:
                    edges.append({
                        "source": node_ids[all_entities[i]],
                        "target": node_ids[all_entities[j]],
                        "memory_id": memory.id,
                    })

    return {"nodes": nodes, "edges": edges, "total_memories": len(memories)}


# ---- Stats ----

@router.get("/stats")
async def get_user_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's overall Memoria statistics."""
    memory_count = await db.execute(
        select(func.count(Memory.id)).where(Memory.user_id == user.id)
    )
    total_memories = memory_count.scalar() or 0

    profile_count = await db.execute(
        select(func.count(CognitiveProfile.id)).where(CognitiveProfile.user_id == user.id)
    )
    total_assessments = profile_count.scalar() or 0

    convo_count = await db.execute(
        select(func.count(Conversation.id)).where(Conversation.user_id == user.id)
    )
    total_conversations = convo_count.scalar() or 0

    return {
        "total_memories": total_memories,
        "total_assessments": total_assessments,
        "total_conversations": total_conversations,
        "member_since": user.created_at.isoformat() if user.created_at else None,
    }


# ---- Helpers ----

def _memory_to_response(m: Memory) -> MemoryResponse:
    return MemoryResponse(
        id=m.id,
        title=m.title,
        content=m.content,
        memory_type=m.memory_type,
        entities_people=m.entities_people or [],
        entities_locations=m.entities_locations or [],
        entities_events=m.entities_events or [],
        entities_emotions=m.entities_emotions or [],
        entities_tasks=m.entities_tasks or [],
        tags=m.tags or [],
        importance_score=m.importance_score or 0.5,
        recall_count=m.recall_count or 0,
        memory_date=m.memory_date,
        created_at=m.created_at,
    )


def _profile_to_response(p: CognitiveProfile) -> CognitiveProfileResponse:
    return CognitiveProfileResponse(
        id=p.id,
        overall_score=p.overall_score,
        memory_retention=p.memory_retention,
        processing_speed=p.processing_speed,
        language_complexity=p.language_complexity,
        attention_span=p.attention_span,
        vocabulary_diversity=p.vocabulary_diversity,
        pattern_recognition=p.pattern_recognition,
        reaction_time_ms=p.reaction_time_ms,
        alert_zone=p.alert_zone,
        alert_message=p.alert_message,
        assessed_at=p.assessed_at,
    )
