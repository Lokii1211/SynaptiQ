# ============================================
# Vercel Serverless Entry Point
# ============================================
import sys
import os

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set environment for Vercel (use /tmp for writable storage)
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///tmp/memoria_echo.db")
os.environ.setdefault("VERCEL", "1")

# Import the FastAPI app
from main import app

# Vercel expects the app to be accessible as `app`
# The @vercel/python runtime will automatically wrap it
