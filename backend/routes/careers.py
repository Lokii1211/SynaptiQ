"""SkillTen Career Explorer"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Career, User
from auth import require_user

router = APIRouter()

@router.get("/")
def list_careers(category: str = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(Career)
    if category:
        q = q.filter(Career.category == category)
    return {"careers": [{
        "id": c.id, "title": c.title, "slug": c.slug, "category": c.category,
        "description": c.description[:150], "salary_range_min": c.salary_range_min,
        "salary_range_max": c.salary_range_max, "demand_score": c.demand_score,
        "growth_outlook": c.growth_outlook, "icon": c.icon,
    } for c in q.offset(skip).limit(limit).all()]}

@router.get("/{slug}")
def get_career(slug: str, db: Session = Depends(get_db)):
    c = db.query(Career).filter(Career.slug == slug).first()
    if not c:
        raise HTTPException(status_code=404, detail="Career not found")
    return {
        "id": c.id, "title": c.title, "slug": c.slug, "category": c.category,
        "description": c.description, "day_in_life": c.day_in_life,
        "required_skills": c.required_skills, "required_education": c.required_education,
        "salary_range_min": c.salary_range_min, "salary_range_max": c.salary_range_max,
        "growth_outlook": c.growth_outlook, "demand_score": c.demand_score,
        "top_companies": c.top_companies, "entrance_exams": c.entrance_exams,
        "related_courses": c.related_courses, "icon": c.icon,
    }
