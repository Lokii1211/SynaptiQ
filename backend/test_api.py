"""Mentixy — Full API Test Suite"""
import requests

BASE = "http://localhost:8000"

def test(name, url, method="get", json_data=None, headers=None):
    try:
        if method == "post":
            r = requests.post(url, json=json_data, headers=headers)
        elif method == "patch":
            r = requests.patch(url, json=json_data, headers=headers)
        else:
            r = requests.get(url, headers=headers)
        data = r.json()
        status = r.status_code
        if status == 200:
            if "total" in data:
                print(f"  OK  {name}: {status} total={data['total']}")
            elif isinstance(data, dict):
                for k, v in data.items():
                    if isinstance(v, list):
                        print(f"  OK  {name}: {status} {k}={len(v)} items")
                        break
                else:
                    keys = list(data.keys())[:4]
                    print(f"  OK  {name}: {status} keys={keys}")
            else:
                print(f"  OK  {name}: {status}")
        else:
            detail = data.get("detail", str(data)[:60])
            print(f"  {status}  {name}: {detail}")
    except Exception as e:
        print(f"  ERR {name}: {e}")

print("=" * 60)
print("  Mentixy Backend API — Full Test Suite")
print("=" * 60)

# Public endpoints
print("\n--- Public Endpoints ---")
test("Root", f"{BASE}/")
test("Health", f"{BASE}/health")
test("Careers", f"{BASE}/api/careers/")
test("Career Detail", f"{BASE}/api/careers/software-engineer")
test("Jobs", f"{BASE}/api/jobs/")
test("Internships", f"{BASE}/api/internships/")
test("Coding Problems", f"{BASE}/api/coding/problems")
test("Problem Detail", f"{BASE}/api/coding/problems/two-sum")
test("Challenges", f"{BASE}/api/challenges/")
test("Companies", f"{BASE}/api/companies/")
test("Company Detail", f"{BASE}/api/companies/google-india")
test("Company Reviews", f"{BASE}/api/companies/google-india/reviews")
test("Market Insights", f"{BASE}/api/market/insights")
test("Trending Skills", f"{BASE}/api/market/trending-skills")
test("Campus Colleges", f"{BASE}/api/campus/colleges")
test("Campus Placements", f"{BASE}/api/campus/placements")
test("Campus Interviews", f"{BASE}/api/campus/interviews")
test("Community Posts", f"{BASE}/api/network/community/posts")

# Auth flow
print("\n--- Auth Flow ---")
test("Signup", f"{BASE}/api/auth/signup", "post", {
    "email": "test@mentixy.ai", "password": "test123456",
    "display_name": "Test User", "username": "testuser"
})
r = requests.post(f"{BASE}/api/auth/login", json={"email": "test@mentixy.ai", "password": "test123456"})
if r.status_code == 200:
    token = r.json()["token"]
    h = {"Authorization": f"Bearer {token}"}
    print(f"  OK  Login: 200 token={token[:20]}...")
else:
    print(f"  {r.status_code}  Login: FAILED")
    h = {}

if h:
    # Authenticated endpoints
    print("\n--- Authenticated Endpoints ---")
    test("Me", f"{BASE}/api/auth/me", headers=h)
    test("Update Profile", f"{BASE}/api/auth/profile", "patch", {"tagline": "AI Engineer"}, h)
    test("Notifications", f"{BASE}/api/notifications/", headers=h)
    test("Chat Sessions", f"{BASE}/api/chat/sessions", headers=h)
    test("My Roadmaps", f"{BASE}/api/learning/roadmaps", headers=h)
    test("My Job Apps", f"{BASE}/api/jobs/applications/me", headers=h)
    test("My Coding Stats", f"{BASE}/api/coding/stats/me", headers=h)
    test("My Connections", f"{BASE}/api/network/connections", headers=h)
    test("Find Peers", f"{BASE}/api/network/peers", headers=h)
    test("My Resumes", f"{BASE}/api/resume/", headers=h)
    test("My Challenge Regs", f"{BASE}/api/challenges/my/registrations", headers=h)

    # AI-powered endpoints
    print("\n--- AI Engine ---")
    test("AI Chat", f"{BASE}/api/chat/", "post", {"message": "What salary can I expect as a fresher?"}, h)
    test("AI Skill Gap", f"{BASE}/api/ai/skill-gap", "post", {
        "current_skills": ["Python", "HTML"], "target_career": "Data Scientist"
    }, h)
    test("AI Resume Review", f"{BASE}/api/ai/resume-review", "post", {
        "resume_data": {"name": "Test User", "skills": ["Python", "React"]},
        "target_role": "Software Engineer"
    }, h)
    test("AI Code Review", f"{BASE}/api/ai/code-review", "post", {
        "code": "def two_sum(nums, target):\n  for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n      if nums[i]+nums[j]==target: return [i,j]",
        "language": "python", "problem_title": "Two Sum"
    }, h)
    test("AI Interview Prep", f"{BASE}/api/ai/interview-prep", "post", {
        "company": "Google", "role": "SDE-1"
    }, h)
    test("AI Generate Roadmap", f"{BASE}/api/ai/generate-roadmap", "post", {
        "target_career": "Software Engineer", "current_skills": ["Python"],
        "hours_per_week": 15
    }, h)

    # Assessment flow
    print("\n--- Assessment 4D ---")
    r2 = requests.post(f"{BASE}/api/assessment/start", json={"device_type": "web"}, headers=h)
    if r2.status_code == 200:
        data = r2.json()
        sid = data["session_id"]
        qs = data.get("questions", [])
        print(f"  OK  Start Assessment: session={sid[:12]}... questions={len(qs)}")
        if qs:
            answers = [{"question_id": q["id"], "selected_option": "A", "time_spent_ms": 3000, "question_order": i+1} for i, q in enumerate(qs)]
            test("Submit Assessment", f"{BASE}/api/assessment/submit", "post", {"session_id": sid, "answers": answers}, h)
    test("Get 4D Profile", f"{BASE}/api/assessment/profile", headers=h)

    # Create resume
    print("\n--- Resume ---")
    test("Create Resume", f"{BASE}/api/resume/", "post", {
        "title": "My SDE Resume", "template": "fresher",
        "content": {"name": "Test User", "skills": ["Python", "React", "SQL"]},
        "target_role": "Software Engineer"
    }, h)

print("\n" + "=" * 60)
print("  All tests complete!")
print("=" * 60)
