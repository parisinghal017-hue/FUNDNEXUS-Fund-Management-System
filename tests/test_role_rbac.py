import re
import os

with open('js/campaigns-ui.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

ids = set(re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", js_content))

with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

missing = []
for el_id in sorted(ids):
    if f'id="{el_id}"' not in html_content and f"id='{el_id}'" not in html_content:
        missing.append(el_id)

print(f"Total IDs checked: {len(ids)}")
print(f"Missing IDs: {missing}")

# Check RBAC elements
assert 'id="user-role-btn"' in html_content
assert 'id="role-login-modal"' in html_content
assert 'id="admin-passcode-input"' in html_content
assert 'id="tab-btn-admin"' in html_content
assert 'switchUserRole' in js_content
assert 'attemptAdminLogin' in js_content
assert 'updateUserUI' in js_content

print("[SUCCESS] All RBAC elements and functions verified!")
