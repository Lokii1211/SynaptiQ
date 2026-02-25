"""
SkillTen — Database Configuration
Supports: Supabase PostgreSQL (production) + SQLite (local dev)
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

# ─── Database URL Resolution ───
# Priority: DATABASE_URL env var → Supabase connection string → SQLite fallback
_supabase_url = os.getenv("SUPABASE_DB_URL", "")  # postgresql://...
_database_url = os.getenv("DATABASE_URL", "")

if _database_url:
    DATABASE_URL = _database_url
elif _supabase_url:
    DATABASE_URL = _supabase_url
elif os.getenv("VERCEL"):
    DATABASE_URL = "sqlite:///tmp/skillten.db"
else:
    DATABASE_URL = "sqlite:///./skillten.db"

# ─── Engine Configuration ───
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

# Fix Supabase URL format if needed (supabase uses postgres:// but SQLAlchemy needs postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,
    pool_pre_ping=True,  # auto-reconnect stale connections
    pool_size=5 if "postgresql" in DATABASE_URL else 0,
    max_overflow=10 if "postgresql" in DATABASE_URL else 0,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency: yields a database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
