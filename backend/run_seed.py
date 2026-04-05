"""Run this script to fully seed the local database."""
import sys, os, json, traceback
sys.stdout.reconfigure(encoding='utf-8')

# Import all models
import models
from database import Base, engine, SessionLocal

# Recreate all tables
print("[1/3] Recreating database tables...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("      Tables created successfully!")

# Seed everything
print("[2/3] Seeding data...")
db = SessionLocal()
try:
    from seed_data import seed_all
    seed_all(db)
    print("      Core data seeded!")
except Exception as e:
    traceback.print_exc()
    print(f"      ERROR during seed: {e}")
finally:
    db.close()

# Verify counts
print("[3/3] Verifying...")
db2 = SessionLocal()
try:
    from models import (CodingProblem, Question, Career, JobListing, Badge, 
                        ViyaCompany, SkillsTaxonomy, Challenge, College, MarketInsight)
    
    results = {
        "Coding Problems": db2.query(CodingProblem).count(),
        "Questions (Total)": db2.query(Question).count(),
        "  - Assessment": db2.query(Question).filter(Question.is_assessment_question==True).count(),
        "  - Aptitude": db2.query(Question).filter(Question.is_aptitude_question==True).count(),
        "  - Quiz": db2.query(Question).filter(Question.is_quiz_question==True).count(),
        "Careers": db2.query(Career).count(),
        "Jobs": db2.query(JobListing).count(),
        "Companies": db2.query(ViyaCompany).count(),
        "Skills": db2.query(SkillsTaxonomy).count(),
        "Challenges": db2.query(Challenge).count(),
        "Colleges": db2.query(College).count(),
        "Badges": db2.query(Badge).count(),
        "Market Insights": db2.query(MarketInsight).count(),
    }
    
    print("\n" + "=" * 40)
    print("DATABASE SEED RESULTS")
    print("=" * 40)
    for key, val in results.items():
        print(f"  {key:25s} {val}")
    print("=" * 40)
    
    total = sum(v for k, v in results.items() if not k.startswith("  "))
    print(f"\n  TOTAL RECORDS: {total}")
    print("\n  ALL DONE!")
    
except Exception as e:
    traceback.print_exc()
finally:
    db2.close()
