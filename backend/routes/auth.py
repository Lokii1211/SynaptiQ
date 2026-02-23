"""SkillTen Auth Routes — signup, login, me, profile update"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, UserProfile
from auth import hash_password, verify_password, create_access_token, require_user

router = APIRouter()


class SignupReq(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    username: str

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateReq(BaseModel):
    display_name: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    college_name: Optional[str] = None
    college_tier: Optional[int] = None
    stream: Optional[str] = None
    graduation_year: Optional[int] = None
    current_year_of_study: Optional[int] = None
    cgpa: Optional[float] = None
    target_role: Optional[str] = None
    target_industry: Optional[str] = None
    open_to_work: Optional[bool] = None
    open_to_work_type: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_username: Optional[str] = None
    personal_website: Optional[str] = None
    avatar_url: Optional[str] = None


def _user_response(user: User, profile: UserProfile):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "profile": {
            "username": profile.username,
            "display_name": profile.display_name,
            "tagline": profile.tagline,
            "avatar_url": profile.avatar_url,
            "bio": profile.bio,
            "city": profile.city,
            "state": profile.state,
            "college_name": profile.college_name,
            "college_tier": profile.college_tier,
            "stream": profile.stream,
            "graduation_year": profile.graduation_year,
            "cgpa": profile.cgpa,
            "target_role": profile.target_role,
            "target_industry": profile.target_industry,
            "open_to_work": profile.open_to_work,
            "skillten_score": profile.viya_score,
            "streak_days": profile.streak_days,
            "archetype_name": profile.archetype_name,
            "linkedin_url": profile.linkedin_url,
            "github_username": profile.github_username,
        } if profile else None
    }


@router.post("/signup")
def signup(req: SignupReq, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(UserProfile).filter(UserProfile.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username taken")

    user = User(email=req.email, hashed_password=hash_password(req.password))
    db.add(user)
    db.flush()

    profile = UserProfile(user_id=user.id, username=req.username, display_name=req.display_name)
    db.add(profile)
    db.commit()
    db.refresh(user)
    db.refresh(profile)

    token = create_access_token({"sub": user.id})
    return {"token": token, "user": _user_response(user, profile)}


@router.post("/login")
def login(req: LoginReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.last_active_at = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token({"sub": user.id})
    return {"token": token, "user": _user_response(user, user.profile)}


@router.get("/me")
def me(user: User = Depends(require_user)):
    return _user_response(user, user.profile)


@router.patch("/profile")
def update_profile(req: ProfileUpdateReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    profile = user.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    data = req.dict(exclude_unset=True)
    for k, v in data.items():
        if hasattr(profile, k):
            setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return _user_response(user, profile)
