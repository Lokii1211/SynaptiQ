import requests
r = requests.get("http://localhost:8000/openapi.json")
data = r.json()
paths = sorted(data["paths"].keys())
tags_seen = set()
print(f"VIYA API — {data['info']['title']} v{data['info']['version']}")
print(f"Total endpoints: {len(paths)}")
print("=" * 60)
for p in paths:
    methods = data["paths"][p]
    for method, spec in methods.items():
        tags = spec.get("tags", ["untagged"])
        tag = tags[0]
        if tag not in tags_seen:
            tags_seen.add(tag)
            print(f"\n[{tag}]")
        print(f"  {method.upper():6s} {p}")
