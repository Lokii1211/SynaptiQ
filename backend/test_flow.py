import requests
import json

BASE = 'http://localhost:8000/api'

# Login 
r = requests.post(f'{BASE}/auth/login', json={'email': 'flow@mentixy.in', 'password': 'Test1234!'})
print(f'Login: {r.status_code}')
login_data = r.json()
print(f'Login keys: {list(login_data.keys())}')

token = login_data.get('access_token') or login_data.get('token') or ''
if not token:
    print('No token found in response, trying to signup fresh...')
    r = requests.post(f'{BASE}/auth/signup', json={'email': 'flow2@mentixy.in', 'password': 'Test1234!', 'display_name': 'Flow Test 2', 'username': 'flowtest2'})
    print(f'Signup: {r.status_code}')
    signup_data = r.json()
    print(f'Signup keys: {list(signup_data.keys())}')
    token = signup_data.get('access_token') or signup_data.get('token') or ''

if not token:
    print('FATAL: Cannot get auth token')
    exit()

h = {'Authorization': f'Bearer {token}'}
print(f'Token obtained: {token[:20]}...')

endpoints = [
    ('GET', '/auth/me', None),
    ('POST', '/assessment/start', {'device_type': 'web'}),
    ('GET', '/careers/', None),
    ('GET', '/coding/problems', None),
    ('GET', '/notifications/?unread_only=false', None),
    ('GET', '/market/insights', None),
    ('GET', '/resume/', None),
    ('GET', '/internships/', None),
    ('POST', '/chat/', {'message': 'Hello Mentixy!'}),
    ('GET', '/learning/roadmaps', None),
    ('GET', '/challenges/', None),
    ('GET', '/companies/', None),
    ('GET', '/campus/colleges', None),
    ('GET', '/network/connections', None),
    ('GET', '/market/trending-skills', None),
]

for method, path, body in endpoints:
    try:
        if method == 'GET':
            r = requests.get(f'{BASE}{path}', headers=h, timeout=10)
        else:
            r = requests.post(f'{BASE}{path}', json=body, headers=h, timeout=10)
        status = 'OK' if r.status_code == 200 else f'WARN({r.status_code})'
        print(f'  {status:10s} {method} {path}')
    except Exception as e:
        print(f'  ERROR      {method} {path} - {e}')

print('\n=== ALL ENDPOINTS TESTED ===')
