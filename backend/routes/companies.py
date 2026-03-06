"""SkillTen Companies Intel — search, detail, reviews"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import ViyaCompany, CompanyReview, User
from auth import require_user

router = APIRouter()


@router.get("")
def list_companies(
    q: Optional[str] = None, company_type: Optional[str] = None,
    skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    query = db.query(ViyaCompany)
    if q:
        query = query.filter(ViyaCompany.name.ilike(f"%{q}%"))
    if company_type:
        query = query.filter(ViyaCompany.company_type == company_type)
    total = query.count()
    companies = query.offset(skip).limit(limit).all()
    return {"total": total, "companies": [{
        "id": c.id, "name": c.name, "slug": c.slug, "logo_url": c.logo_url,
        "company_type": c.company_type, "industry": c.industry,
        "headquarters_city": c.headquarters_city,
        "viya_overall_rating": c.viya_overall_rating,
        "is_hiring_actively": c.is_hiring_actively,
    } for c in companies]}


@router.get("/{slug}")
def get_company(slug: str, db: Session = Depends(get_db)):
    c = db.query(ViyaCompany).filter(ViyaCompany.slug == slug).first()
    if not c:
        raise HTTPException(status_code=404, detail="Company not found")
    return {
        "id": c.id, "name": c.name, "slug": c.slug, "logo_url": c.logo_url,
        "company_type": c.company_type, "founded_year": c.founded_year,
        "team_size_range": c.team_size_range, "funding_stage": c.funding_stage,
        "industry": c.industry, "headquarters_city": c.headquarters_city,
        "viya_honest_summary": c.viya_honest_summary,
        "viya_overall_rating": c.viya_overall_rating,
        "salary_data": c.salary_data, "work_hours_actual": c.work_hours_actual,
        "wfh_policy": c.wfh_policy, "interview_process": c.interview_process,
        "interview_difficulty": c.interview_difficulty, "ppo_rate": c.ppo_rate,
        "pros": c.pros, "cons": c.cons, "best_for": c.best_for,
        "not_ideal_for": c.not_ideal_for, "verdict": c.verdict,
    }


class ReviewReq(BaseModel):
    overall_rating: int
    culture_rating: Optional[int] = None
    growth_rating: Optional[int] = None
    wlb_rating: Optional[int] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    interview_experience: Optional[str] = None
    interview_difficulty: Optional[int] = None
    is_anonymous: bool = True

@router.post("/{slug}/reviews")
def add_review(slug: str, req: ReviewReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    company = db.query(ViyaCompany).filter(ViyaCompany.slug == slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    review = CompanyReview(
        company_id=company.id, reviewer_id=user.id,
        overall_rating=req.overall_rating, culture_rating=req.culture_rating,
        growth_rating=req.growth_rating, wlb_rating=req.wlb_rating,
        pros=req.pros, cons=req.cons,
        interview_experience=req.interview_experience,
        interview_difficulty=req.interview_difficulty,
        is_anonymous=req.is_anonymous,
    )
    db.add(review)
    avg = db.query(func.avg(CompanyReview.overall_rating)).filter_by(company_id=company.id).scalar()
    company.viya_overall_rating = round(float(avg or req.overall_rating), 1)
    db.commit()
    return {"status": "review_added", "review_id": review.id}


@router.get("/{slug}/reviews")
def get_reviews(slug: str, db: Session = Depends(get_db)):
    company = db.query(ViyaCompany).filter(ViyaCompany.slug == slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    reviews = db.query(CompanyReview).filter_by(company_id=company.id).order_by(CompanyReview.created_at.desc()).all()
    return {"reviews": [{
        "id": r.id, "overall_rating": r.overall_rating,
        "culture_rating": r.culture_rating, "growth_rating": r.growth_rating,
        "wlb_rating": r.wlb_rating, "pros": r.pros, "cons": r.cons,
        "interview_experience": r.interview_experience,
        "interview_difficulty": r.interview_difficulty,
        "is_anonymous": r.is_anonymous, "created_at": str(r.created_at),
    } for r in reviews]}
