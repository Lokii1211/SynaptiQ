# ─── VIYA Backend — Hugging Face Spaces Dockerfile ───
FROM python:3.11-slim

# System deps for psycopg2 (PostgreSQL driver)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# HF Spaces runs as user with limited permissions
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Install Python deps (cached layer)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# HF Spaces uses port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Switch to non-root user (HF requirement)
USER appuser

CMD uvicorn main:app --host 0.0.0.0 --port 7860 --workers 2
