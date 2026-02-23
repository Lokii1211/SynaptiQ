"""SkillTen Market Insights"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import MarketInsight, SkillsTaxonomy

router = APIRouter()

@router.get("/insights")
def list_insights(category: str = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(MarketInsight)
    if category:
        q = q.filter(MarketInsight.category == category)
    insights = q.order_by(MarketInsight.created_at.desc()).offset(skip).limit(limit).all()
    return {"insights": [{"id": i.id, "category": i.category, "title": i.title, "data": i.data, "source": i.source, "region": i.region} for i in insights]}

@router.get("/trending-skills")
def trending_skills(db: Session = Depends(get_db)):
    skills = db.query(SkillsTaxonomy).filter(SkillsTaxonomy.is_trending == True).order_by(SkillsTaxonomy.trending_score.desc()).limit(20).all()
    return {"skills": [{"id": s.id, "name": s.name, "slug": s.slug, "category": s.category, "demand_level": s.demand_level, "trending_score": s.trending_score, "avg_salary_premium_pct": s.avg_salary_premium_pct} for s in skills]}
