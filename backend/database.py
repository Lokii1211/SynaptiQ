"""
SkillTen — Database Configuration
Supports: Supabase PostgreSQL (production) + SQLite (local dev)
"""

from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env before reading env vars

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

# Fix Supabase URL format (supabase uses postgres:// but SQLAlchemy needs postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

_is_postgres = "postgresql" in DATABASE_URL
_is_serverless = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

print(f"[DB] Using {'PostgreSQL' if _is_postgres else 'SQLite'} | Serverless: {_is_serverless}")

# ─── Engine Configuration ───
connect_args = {}
if not _is_postgres:
    connect_args["check_same_thread"] = False

if _is_postgres and _is_serverless:
    # Serverless: use NullPool — each request gets a fresh connection, no leak risk
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        echo=False,
        poolclass=NullPool,
        pool_pre_ping=True,
    )
elif _is_postgres:
    # Long-running server: use connection pool
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
else:
    # SQLite (local dev)
    engine = create_engine(
        DATABASE_URL,
        connect_args=connect_args,
        echo=False,
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
    """Create tables — safe to call when tables already exist (uses IF NOT EXISTS)"""
    try:
        Base.metadata.create_all(bind=engine)
        print("[DB] ✅ Tables verified/created")
    except Exception as e:
        # On Supabase, tables already exist from SQL Editor — this is fine
        print(f"[DB] ⚠️ Table creation note: {e}")
