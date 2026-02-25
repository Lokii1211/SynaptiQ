# ─── VIYA Backend — Koyeb Production Dockerfile ───
FROM python:3.11-slim

# System deps for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (cached layer)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Koyeb sets PORT env var automatically (default 8000)
ENV PORT=8000
EXPOSE 8000

# Health check for Koyeb
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

# Start with production settings
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 2
