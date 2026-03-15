"""
Mentixy — Email Integration Service
Handles transactional emails: welcome, streak reminders, weekly digest, password reset
Uses Resend API (primary) or SMTP (fallback). Configure via env vars.
"""
import os
import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime

# ─── Configuration ───
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "hello@mentixy.in")
FROM_NAME = os.getenv("FROM_NAME", "Mentixy")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://mentixy.vercel.app")


def _send_via_resend(to_email: str, subject: str, html_body: str) -> bool:
    """Send email via Resend API."""
    try:
        import urllib.request
        data = json.dumps({
            "from": f"{FROM_NAME} <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        }).encode()
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=data,
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read().decode())
        print(f"[Email/Resend] Sent to {to_email}: {subject} (id={result.get('id')})")
        return True
    except Exception as e:
        print(f"[Email/Resend] Failed to send to {to_email}: {e}")
        return False


def _send_via_smtp(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """Send email via SMTP (fallback)."""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email
        msg["Reply-To"] = FROM_EMAIL
        if text_body:
            msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        print(f"[Email/SMTP] Sent to {to_email}: {subject}")
        return True
    except Exception as e:
        print(f"[Email/SMTP] Failed to send to {to_email}: {e}")
        return False


def _send_email(to_email: str, subject: str, html_body: str, text_body: str = "") -> bool:
    """Send an email. Uses Resend (primary) or SMTP (fallback)."""
    if RESEND_API_KEY:
        return _send_via_resend(to_email, subject, html_body)
    elif SMTP_USER and SMTP_PASSWORD:
        return _send_via_smtp(to_email, subject, html_body, text_body)
    else:
        print(f"[Email] No email provider configured. Would send to {to_email}: {subject}")
        return False


def _base_template(content: str, cta_text: str = "", cta_url: str = "") -> str:
    """Wrap content in the Mentixy email template."""
    cta_html = ""
    if cta_text and cta_url:
        cta_html = f"""
        <div style="text-align:center;margin:24px 0">
            <a href="{cta_url}" style="display:inline-block;background:linear-gradient(135deg,#6366F1,#7C3AED);color:#fff;
            padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">{cta_text}</a>
        </div>"""

    return f"""
    <!DOCTYPE html>
    <html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{{margin:0;padding:0;font-family:'Inter',system-ui,-apple-system,sans-serif;background:#f8fafc}}</style></head>
    <body style="background:#f8fafc;padding:20px 0">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#6366F1,#7C3AED);padding:28px 32px;text-align:center">
            <div style="display:inline-block;background:rgba(255,255,255,.2);border-radius:12px;padding:8px 16px">
                <span style="color:#fff;font-weight:800;font-size:18px;letter-spacing:0.5px">Skill<span style="opacity:.9">Ten</span></span>
            </div>
        </div>
        <!-- Content -->
        <div style="padding:32px">
            {content}
            {cta_html}
        </div>
        <!-- Footer -->
        <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
            <p style="color:#94a3b8;font-size:11px;margin:0">
                Mentixy — AI Career Intelligence for Indian Students<br>
                <a href="{FRONTEND_URL}/settings" style="color:#6366F1;text-decoration:none">Manage preferences</a> ·
                <a href="{FRONTEND_URL}/privacy" style="color:#6366F1;text-decoration:none">Privacy</a> ·
                <a href="{FRONTEND_URL}/help" style="color:#6366F1;text-decoration:none">Help</a>
            </p>
        </div>
    </div>
    </body></html>"""


# ─── Email Types ───

def send_welcome_email(to_email: str, name: str) -> bool:
    """Welcome email sent after signup."""
    content = f"""
    <h1 style="color:#0f172a;font-size:24px;margin:0 0 12px">Welcome to Mentixy, {name}! 🎉</h1>
    <p style="color:#475569;font-size:14px;line-height:1.7">
        You just took the first step toward discovering your career DNA.
        Here's what to do next:
    </p>
    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:16px 0">
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center">
            <span style="font-size:20px">🧬</span>
            <div>
                <p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Take the 4D Assessment</p>
                <p style="margin:2px 0 0;color:#64748b;font-size:12px">25 minutes. Discover your career archetype.</p>
            </div>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:12px;align-items:center">
            <span style="font-size:20px">💻</span>
            <div>
                <p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Solve your first coding challenge</p>
                <p style="margin:2px 0 0;color:#64748b;font-size:12px">Start building your activity heatmap today.</p>
            </div>
        </div>
        <div style="display:flex;gap:12px;align-items:center">
            <span style="font-size:20px">🤖</span>
            <div>
                <p style="margin:0;font-weight:600;color:#0f172a;font-size:14px">Chat with AI Career Counselor</p>
                <p style="margin:2px 0 0;color:#64748b;font-size:12px">Ask anything about your career path. Hindi supported.</p>
            </div>
        </div>
    </div>"""

    html = _base_template(content, "Start Your Assessment →", f"{FRONTEND_URL}/assessment")
    return _send_email(to_email, "Welcome to Mentixy! 🧬 Your career journey starts now", html,
                       f"Welcome to Mentixy, {name}! Start your career assessment at {FRONTEND_URL}/assessment")


def send_streak_reminder(to_email: str, name: str, streak_days: int, hours_left: int) -> bool:
    """Streak at risk notification (23 hours without activity)."""
    content = f"""
    <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px">🔥 Your {streak_days}-day streak is at risk!</h1>
    <p style="color:#475569;font-size:14px;line-height:1.6">
        Hey {name}, you have <strong style="color:#DC2626">{hours_left} hours left</strong> to maintain your streak.
        Don't let {streak_days} days of hard work go to waste!
    </p>
    <p style="color:#475569;font-size:13px;line-height:1.6">
        Just solve one quick problem or complete a mini quiz — it takes only 5 minutes.
    </p>"""

    html = _base_template(content, "Save Your Streak 🔥", f"{FRONTEND_URL}/daily")
    return _send_email(to_email, f"🔥 Your {streak_days}-day streak is about to break!", html,
                       f"Your {streak_days}-day streak is at risk! {hours_left}h left. Visit {FRONTEND_URL}/daily")


def send_weekly_digest(to_email: str, name: str, stats: dict) -> bool:
    """Weekly progress digest sent every Sunday."""
    score = stats.get("mentixy_score", 0)
    problems_solved = stats.get("problems_solved", 0)
    streak = stats.get("streak_days", 0)
    rank_change = stats.get("rank_change", 0)
    rank_arrow = "🔼" if rank_change > 0 else "🔽" if rank_change < 0 else "➡️"

    content = f"""
    <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px">Your Weekly Progress 📊</h1>
    <p style="color:#475569;font-size:14px;margin:0 0 20px">Hey {name}, here's your week in review:</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="background:#EEF2FF;border-radius:12px;padding:16px;text-align:center">
            <p style="font-size:28px;font-weight:800;color:#4F46E5;margin:0">{score}</p>
            <p style="font-size:11px;color:#6366F1;margin:4px 0 0;font-weight:600">MENTIXY SCORE</p>
        </div>
        <div style="background:#ECFDF5;border-radius:12px;padding:16px;text-align:center">
            <p style="font-size:28px;font-weight:800;color:#059669;margin:0">{streak}</p>
            <p style="font-size:11px;color:#10B981;margin:4px 0 0;font-weight:600">DAY STREAK 🔥</p>
        </div>
        <div style="background:#FFF7ED;border-radius:12px;padding:16px;text-align:center">
            <p style="font-size:28px;font-weight:800;color:#D97706;margin:0">{problems_solved}</p>
            <p style="font-size:11px;color:#F59E0B;margin:4px 0 0;font-weight:600">PROBLEMS SOLVED</p>
        </div>
        <div style="background:#F0F9FF;border-radius:12px;padding:16px;text-align:center">
            <p style="font-size:28px;font-weight:800;color:#0284C7;margin:0">{rank_arrow} {abs(rank_change) if rank_change else '—'}</p>
            <p style="font-size:11px;color:#0EA5E9;margin:4px 0 0;font-weight:600">RANK CHANGE</p>
        </div>
    </div>"""

    html = _base_template(content, "View Full Analytics →", f"{FRONTEND_URL}/analytics")
    return _send_email(to_email, f"📊 Your Mentixy Weekly Digest — Score: {score}", html,
                       f"Your weekly stats: Score {score}, Streak {streak}, Problems {problems_solved}")


def send_achievement_email(to_email: str, name: str, badge_name: str, xp: int) -> bool:
    """Achievement unlocked notification."""
    content = f"""
    <div style="text-align:center;margin-bottom:16px">
        <span style="font-size:56px;display:block;margin-bottom:8px">🏅</span>
        <h1 style="color:#0f172a;font-size:22px;margin:0 0 4px">Achievement Unlocked!</h1>
        <p style="color:#475569;font-size:14px;margin:0">Congratulations, {name}!</p>
    </div>
    <div style="background:#FEF3C7;border:2px solid #FCD34D;border-radius:12px;padding:20px;text-align:center;margin:16px 0">
        <p style="font-size:20px;font-weight:800;color:#92400E;margin:0">{badge_name}</p>
        <p style="font-size:13px;color:#B45309;margin:4px 0 0">+{xp} XP earned</p>
    </div>"""

    html = _base_template(content, "View All Achievements →", f"{FRONTEND_URL}/achievements")
    return _send_email(to_email, f"🏅 Achievement Unlocked: {badge_name}!", html,
                       f"Congrats {name}! You unlocked {badge_name} and earned +{xp} XP.")


def send_placement_match(to_email: str, name: str, company: str, role: str, match_pct: int) -> bool:
    """New job/internship match notification."""
    content = f"""
    <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px">New Career Match! 🎯</h1>
    <p style="color:#475569;font-size:14px;margin:0 0 16px">Hey {name}, we found a great match for your profile:</p>
    <div style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:12px;padding:20px">
        <p style="font-size:18px;font-weight:700;color:#166534;margin:0">{role}</p>
        <p style="font-size:14px;color:#15803D;margin:4px 0 0">{company}</p>
        <div style="margin-top:12px;display:inline-block;background:#DCFCE7;padding:4px 12px;border-radius:8px">
            <span style="font-weight:700;color:#166534;font-size:13px">{match_pct}% Match</span>
        </div>
    </div>"""

    html = _base_template(content, "View Opportunity →", f"{FRONTEND_URL}/jobs")
    return _send_email(to_email, f"🎯 {match_pct}% match: {role} at {company}", html,
                       f"New job match: {role} at {company} ({match_pct}% match). View at {FRONTEND_URL}/jobs")


def send_password_reset(to_email: str, name: str, reset_token: str) -> bool:
    """Password reset email."""
    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    content = f"""
    <h1 style="color:#0f172a;font-size:22px;margin:0 0 8px">Reset Your Password</h1>
    <p style="color:#475569;font-size:14px;line-height:1.6">
        Hi {name}, we received a request to reset your password. Click the button below to set a new one.
        This link expires in 1 hour.
    </p>
    <p style="color:#94a3b8;font-size:12px;margin-top:16px">
        If you didn't request this, please ignore this email. Your password will remain unchanged.
    </p>"""

    html = _base_template(content, "Reset Password →", reset_url)
    return _send_email(to_email, "🔐 Reset your Mentixy password", html,
                       f"Reset your password: {reset_url}")
