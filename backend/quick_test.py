import httpx, asyncio, json

async def quick_test():
    async with httpx.AsyncClient(base_url="http://localhost:8000", timeout=30) as c:
        # Health
        r = await c.get("/api/health")
        print("1. Health:", r.status_code)

        # Register
        r = await c.post("/api/auth/register", json={"email":"q2@q.com","username":"qtester2","password":"pass1234","full_name":"Q"})
        print("2. Register:", r.status_code)

        # Login
        r = await c.post("/api/auth/login", json={"email":"q2@q.com","password":"pass1234"})
        print("3. Login:", r.status_code)
        token = r.json()["access_token"]
        h = {"Authorization": "Bearer " + token}

        # Profile
        r = await c.get("/api/auth/me", headers=h)
        print("4. Profile:", r.status_code, "->", r.json().get("username", r.text[:80]))

        # Memory
        r = await c.post("/api/memoria/memories", headers=h, json={"content":"Met Sarah at park, discussed project deadline Friday"})
        print("5. Memory:", r.status_code, "-> people=", r.json().get("entities_people", r.text[:80]))

        # Cognitive
        r = await c.post("/api/memoria/cognitive/assess", headers=h, json={"word_recall":{"total_words":10,"recalled_count":7},"pattern":{"correct":4,"total":5},"reaction_time_ms":340})
        print("6. Cognitive:", r.status_code, "-> score=", r.json().get("overall_score", r.text[:80]))

        # Chat
        r = await c.post("/api/memoria/chat", headers=h, json={"message":"Hello Memoria"})
        reply = r.json().get("reply", r.text[:80])
        print("7. Chat:", r.status_code, "->", reply[:100])

        # Translation
        r = await c.post("/api/echo/translate", headers=h, json={"text":"My chest hurts","source_language":"en","target_language":"hi","is_medical":True})
        print("8. Translate:", r.status_code, "->", r.json().get("translated_text", r.text[:80])[:80])

        # Emotion
        r = await c.post("/api/echo/emotion/analyze", headers=h, json={"text":"Im fine dont worry about me"})
        print("9. Emotion:", r.status_code, "-> incongruence=", r.json().get("incongruence_detected", r.text[:80]))

        # AAC
        r = await c.post("/api/echo/aac/predict", headers=h, json={"symbols":["Pain","Help"],"input_method":"eye_tracking"})
        print("10. AAC:", r.status_code, "->", r.json().get("predicted_sentence", r.text[:80]))

        # Languages
        r = await c.get("/api/echo/languages/endangered")
        print("11. Languages:", r.status_code, "->", len(r.json()), "languages")

        # Stats
        r = await c.get("/api/memoria/stats", headers=h)
        print("12. Stats:", r.status_code, "->", r.json())

        print("\nALL 12 TESTS DONE!")

asyncio.run(quick_test())
