"""
MEMORIA x ECHO - API Test Script
Tests all endpoints end-to-end.
"""
import httpx
import json
import sys
import asyncio
import os

# Fix Windows console encoding
os.environ["PYTHONIOENCODING"] = "utf-8"

BASE = "http://localhost:8000"
PASS = "[PASS]"
FAIL = "[FAIL]"


async def main():
    async with httpx.AsyncClient(base_url=BASE, timeout=30) as client:
        print("=" * 60)
        print("  MEMORIA x ECHO - Full API Test")
        print("=" * 60)

        passed = 0
        failed = 0

        # 1. Health Check
        print("\n[1] Health Check...")
        r = await client.get("/api/health")
        print(f"    Status: {r.status_code}")
        d = r.json()
        print(f"    App: {d.get('app')}, Version: {d.get('version')}")
        print(f"    DB: {d['services']['database']}, Gemini: {d['services']['gemini_ai']}")
        if r.status_code == 200:
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}"); failed += 1

        # 2. API Overview
        print("\n[2] API Overview...")
        r = await client.get("/api/overview")
        data = r.json()
        print(f"    Modules: {list(data['modules'].keys())}")
        total_endpoints = sum(len(m['endpoints']) for m in data['modules'].values())
        print(f"    Total endpoints: {total_endpoints}")
        if r.status_code == 200:
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}"); failed += 1

        # 3. Register
        print("\n[3] Register User...")
        r = await client.post("/api/auth/register", json={
            "email": "apitest@memoria.ai",
            "username": "api_tester",
            "full_name": "API Tester",
            "password": "test123456",
            "role": "user",
        })
        if r.status_code == 400:
            print("    User exists, skipping registration...")
            passed += 1
        elif r.status_code == 201:
            print(f"    Registered user ID: {r.json()['user']['id']}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 4. Login
        print("\n[4] Login...")
        r = await client.post("/api/auth/login", json={
            "email": "apitest@memoria.ai",
            "password": "test123456",
        })
        print(f"    Status: {r.status_code}")
        if r.status_code == 200:
            token = r.json()["access_token"]
            print(f"    Token obtained: {token[:30]}...")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1
            print("\n!!! Cannot continue without auth token !!!")
            return

        headers = {"Authorization": f"Bearer {token}"}

        # 5. Get Profile
        print("\n[5] Get Profile...")
        r = await client.get("/api/auth/me", headers=headers)
        print(f"    Status: {r.status_code}")
        if r.status_code == 200:
            u = r.json()
            print(f"    User: {u['username']} | Email: {u['email']} | Role: {u['role']}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 6. Create Memory
        print("\n[6] Create Memory (AI Analysis)...")
        r = await client.post("/api/memoria/memories", headers=headers, json={
            "content": "Had a great meeting with Sarah at Cafe Blue today. She mentioned the project deadline is next Friday. Need to prepare the presentation. Feeling excited but stressed.",
        })
        print(f"    Status: {r.status_code}")
        if r.status_code == 201:
            mem = r.json()
            print(f"    Title: {mem.get('title')}")
            print(f"    People: {mem.get('entities_people')}")
            print(f"    Locations: {mem.get('entities_locations')}")
            print(f"    Emotions: {mem.get('entities_emotions')}")
            print(f"    Tasks: {mem.get('entities_tasks')}")
            print(f"    Importance: {mem.get('importance_score')}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 7. List Memories
        print("\n[7] List Memories...")
        r = await client.get("/api/memoria/memories", headers=headers)
        if r.status_code == 200:
            print(f"    Total memories: {len(r.json())}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 8. Cognitive Assessment
        print("\n[8] Cognitive Assessment...")
        r = await client.post("/api/memoria/cognitive/assess", headers=headers, json={
            "memory_text": "Yesterday I went to the store and bought apples oranges and bananas. Then I met my friend John at the park.",
            "word_recall": {"total_words": 10, "recalled_count": 7},
            "pattern": {"correct": 4, "total": 5},
            "reaction_time_ms": 340,
        })
        if r.status_code == 200:
            cog = r.json()
            print(f"    Overall Score: {cog['overall_score']}/100")
            print(f"    Memory: {cog['memory_retention']} | Speed: {cog['processing_speed']} | Pattern: {cog['pattern_recognition']}")
            print(f"    Alert Zone: {cog['alert_zone'].upper()}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 9. Chat with Memoria
        print("\n[9] Chat with Memoria AI...")
        r = await client.post("/api/memoria/chat", headers=headers, json={
            "message": "What did I do today? Any follow-ups?",
        })
        if r.status_code == 200:
            chat = r.json()
            reply = chat['reply'][:200]
            print(f"    AI Reply: {reply}")
            print(f"    Conversation ID: {chat['conversation_id']}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 10. Knowledge Graph
        print("\n[10] Knowledge Graph...")
        r = await client.get("/api/memoria/knowledge-graph", headers=headers)
        if r.status_code == 200:
            kg = r.json()
            print(f"    Nodes: {len(kg['nodes'])}, Edges: {len(kg['edges'])}, Memories: {kg['total_memories']}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 11. Echo Translation
        print("\n[11] Echo - Translation (Medical)...")
        r = await client.post("/api/echo/translate", headers=headers, json={
            "text": "My chest is hurting badly and I cannot breathe",
            "source_language": "en",
            "target_language": "hi",
            "is_medical": True,
        })
        if r.status_code == 200:
            tr = r.json()
            print(f"    Translation: {tr['translated_text'][:100]}")
            print(f"    Urgency: {tr.get('urgency_level')}")
            print(f"    Emotion: {tr.get('detected_emotion')}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 12. Emotion Analysis
        print("\n[12] Echo - Emotion Analysis...")
        r = await client.post("/api/echo/emotion/analyze", headers=headers, json={
            "text": "I'm fine, don't worry about me. Everything is great.",
        })
        if r.status_code == 200:
            emo = r.json()
            print(f"    Surface: {emo['surface_emotions']}")
            print(f"    Hidden: {emo['hidden_emotions']}")
            print(f"    Incongruence: {emo['incongruence_detected']}")
            insight = emo.get('insight', '')[:150]
            print(f"    Insight: {insight}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 13. AAC Prediction
        print("\n[13] Echo - AAC Prediction...")
        r = await client.post("/api/echo/aac/predict", headers=headers, json={
            "symbols": ["Pain", "Help", "Cold"],
            "input_method": "eye_tracking",
        })
        if r.status_code == 200:
            aac = r.json()
            print(f"    Predicted: {aac['predicted_sentence']}")
            print(f"    Confidence: {aac['confidence']}")
            print(f"    Urgency: {aac['urgency']}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 14. Emergency Session
        print("\n[14] Echo - Emergency Session...")
        r = await client.post("/api/echo/emergency/start", headers=headers, json={
            "scenario_type": "cardiac",
            "patient_language": "ta",
            "doctor_language": "en",
        })
        if r.status_code == 200:
            sess = r.json()
            sid = sess["session_id"]
            print(f"    Session ID: {sid}, Status: {sess['status']}")

            r2 = await client.post("/api/echo/emergency/message", headers=headers, json={
                "session_id": sid,
                "text": "My chest hurts a lot",
                "side": "patient",
            })
            if r2.status_code == 200:
                msg = r2.json()
                print(f"    Translated: {msg['translation']['translated_text'][:80]}")
                if msg.get('alert'):
                    print(f"    Alert: {msg['alert']['type']} ({msg['alert']['urgency']})")
                    print(f"    Actions: {msg['alert']['auto_notifications'][:2]}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 15. Endangered Languages
        print("\n[15] Echo - Endangered Languages...")
        r = await client.get("/api/echo/languages/endangered")
        if r.status_code == 200:
            langs = r.json()
            print(f"    Languages: {len(langs)}")
            for lang in langs[:3]:
                print(f"      - {lang['name']} ({lang['country']}): {lang['speakers_count']} speakers [{lang['status']}]")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 16. Memoria Stats
        print("\n[16] Memoria Stats...")
        r = await client.get("/api/memoria/stats", headers=headers)
        if r.status_code == 200:
            print(f"    {r.json()}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        # 17. Echo Stats
        print("\n[17] Echo Stats...")
        r = await client.get("/api/echo/stats", headers=headers)
        if r.status_code == 200:
            print(f"    {r.json()}")
            print(f"    {PASS}"); passed += 1
        else:
            print(f"    {FAIL}: {r.text}"); failed += 1

        print("\n" + "=" * 60)
        print(f"  RESULTS: {passed} PASSED / {failed} FAILED / {passed + failed} TOTAL")
        print("=" * 60)
        print(f"\n  API Docs:  {BASE}/api/docs")
        print(f"  ReDoc:     {BASE}/api/redoc")
        print(f"  Frontend:  {BASE}/")
        print(f"  Echo:      {BASE}/echo")
        print()


if __name__ == "__main__":
    asyncio.run(main())
