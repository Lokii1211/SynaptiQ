"""SkillTen Auth Routes — signup, login, me, profile update, forgot/reset password, Google OAuth"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from database import get_db
from models import User, UserProfile, PasswordResetToken
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

class ForgotPasswordReq(BaseModel):
    email: EmailStr

class ResetPasswordReq(BaseModel):
    token: str
    new_password: str

class ChangePasswordReq(BaseModel):
    current_password: str
    new_password: str


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

    # Send welcome email (async-safe, non-blocking)
    try:
        from email_service import send_welcome_email
        send_welcome_email(user.email, req.display_name)
    except Exception as e:
        print(f"[Email] Welcome email failed (non-fatal): {e}")

    # Create welcome notification
    try:
        from models import ViyaNotification
        notif = ViyaNotification(
            user_id=user.id,
            type="welcome",
            title="Welcome to SkillTen! 🎉",
            body="Take your 4D Career Assessment to discover your career archetype.",
            action_url="/assessment",
            icon="🧬",
        )
        db.add(notif)
        db.commit()
    except Exception:
        pass

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


# ─── Forgot Password ───

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordReq, db: Session = Depends(get_db)):
    """Request a password reset email. Always returns success (security: don't reveal if email exists)."""
    user = db.query(User).filter(User.email == req.email).first()

    if user:
        import secrets
        # Invalidate previous tokens
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == False
        ).update({"is_used": True})

        # Create new token (valid 1 hour)
        reset_token = secrets.token_urlsafe(48)
        token_obj = PasswordResetToken(
            user_id=user.id,
            token=reset_token,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        db.add(token_obj)
        db.commit()

        # Send reset email
        try:
            from email_service import send_password_reset
            name = user.profile.display_name if user.profile else "User"
            send_password_reset(user.email, name, reset_token)
        except Exception as e:
            print(f"[Email] Password reset email failed: {e}")

    return {"success": True, "message": "If that email is registered, we've sent a reset link."}


@router.post("/reset-password")
def reset_password(req: ResetPasswordReq, db: Session = Depends(get_db)):
    """Reset password using a valid reset token."""
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    token_obj = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == req.token,
        PasswordResetToken.is_used == False,
    ).first()

    if not token_obj:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")

    if token_obj.expires_at < datetime.now(timezone.utc):
        token_obj.is_used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")

    # Update password
    user = db.query(User).filter(User.id == token_obj.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(req.new_password)
    token_obj.is_used = True
    db.commit()

    return {"success": True, "message": "Password reset successfully. You can now log in."}


@router.post("/change-password")
def change_password(req: ChangePasswordReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Change password for logged-in user."""
    if not verify_password(req.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"success": True, "message": "Password changed successfully"}


# ─── Google OAuth ───
import os, httpx

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "https://skillten.vercel.app/api/auth/google/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://synaptiqq.vercel.app")


@router.get("/google")
def google_login():
    """Redirect to Google OAuth consent screen."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth not configured. Set GOOGLE_CLIENT_ID env var.")

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent"
    )
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url=google_auth_url)


@router.get("/google/callback")
def google_callback(code: str = "", error: str = "", db: Session = Depends(get_db)):
    """Handle Google OAuth callback — exchange code for token, create/find user."""
    from fastapi.responses import RedirectResponse

    if error or not code:
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=google_auth_failed")

    try:
        # Exchange code for tokens
        token_resp = httpx.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        tokens = token_resp.json()
        access_token = tokens.get("access_token")

        if not access_token:
            return RedirectResponse(url=f"{FRONTEND_URL}/login?error=google_token_failed")

        # Get user info from Google
        user_info_resp = httpx.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        google_user = user_info_resp.json()
        email = google_user.get("email")
        name = google_user.get("name", "User")
        picture = google_user.get("picture", "")

        if not email:
            return RedirectResponse(url=f"{FRONTEND_URL}/login?error=google_no_email")

        # Find or create user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # New user — create account
            import secrets
            user = User(
                email=email,
                hashed_password=hash_password(secrets.token_urlsafe(32)),
                oauth_provider="google",
                is_email_verified=True,
            )
            db.add(user)
            db.flush()

            username = email.split("@")[0].lower().replace(".", "")[:20]
            existing = db.query(UserProfile).filter(UserProfile.username == username).first()
            if existing:
                username = f"{username}{user.id[:4]}"

            profile = UserProfile(
                user_id=user.id,
                username=username,
                display_name=name,
                avatar_url=picture,
            )
            db.add(profile)
            db.commit()
            db.refresh(user)

            # Send welcome email for new Google users too
            try:
                from email_service import send_welcome_email
                send_welcome_email(email, name)
            except Exception:
                pass
        else:
            user.last_active_at = datetime.now(timezone.utc)
            if not user.oauth_provider:
                user.oauth_provider = "google"
                user.is_email_verified = True
            db.commit()

        token = create_access_token({"sub": user.id})
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard?token={token}&google=1")

    except Exception as e:
        print(f"Google OAuth error: {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=google_auth_error")
