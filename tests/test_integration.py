import urllib.request
import threading
import time
import json
import subprocess
import sys
import os

PORT = 5005
BASE_DIR = r"c:\Users\HP\Desktop\nexus"
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))
import server
import socketserver

server.PORT = PORT
server.nexus_db.init_db()

httpd = socketserver.TCPServer(("127.0.0.1", PORT), server.NexusAPIHandler)
t = threading.Thread(target=httpd.serve_forever)
t.daemon = True
t.start()
time.sleep(0.5)

tests = []

# 1. Test Static Index
try:
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/")
    tests.append(("GET / (Static HTML)", res.status == 200, f"Status {res.status}"))
except Exception as e:
    tests.append(("GET / (Static HTML)", False, str(e)))

# 2. Test API Status
try:
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/status")
    data = json.loads(res.read().decode("utf-8"))
    tests.append(("GET /api/status", data.get("status") == "online", data))
except Exception as e:
    tests.append(("GET /api/status", False, str(e)))

# 3. Test API Campaigns
try:
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/campaigns")
    data = json.loads(res.read().decode("utf-8"))
    tests.append(("GET /api/campaigns", data.get("count", 0) > 0, f"{data.get('count')} campaigns in DB"))
except Exception as e:
    tests.append(("GET /api/campaigns", False, str(e)))

# 4. Test API C++ Ledger Bridge
try:
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/cpp/ledger")
    data = json.loads(res.read().decode("utf-8"))
    tests.append(("GET /api/cpp/ledger (C++ Linked List Ledger)", data.get("status") == "ok", f"Total: Rs. {data.get('total_amount')}"))
except Exception as e:
    tests.append(("GET /api/cpp/ledger (C++ Linked List Ledger)", False, str(e)))

# 5. Test API C++ Similarity Bridge
try:
    res = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/api/cpp/similarity?a=Solar+Water+School&b=School+Solar+Water")
    data = json.loads(res.read().decode("utf-8"))
    tests.append(("GET /api/cpp/similarity (C++ Jaccard Overlap)", data.get("similarity_score", 0) > 0.5, data))
except Exception as e:
    tests.append(("GET /api/cpp/similarity (C++ Jaccard Overlap)", False, str(e)))

# 6. Test POST /api/donate
try:
    payload = json.dumps({"campaign_id": "CMP-101", "amount": 1500, "donor_name": "Prof Evaluator"}).encode("utf-8")
    req = urllib.request.Request(f"http://127.0.0.1:{PORT}/api/donate", data=payload, headers={"Content-Type": "application/json"})
    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode("utf-8"))
    tests.append(("POST /api/donate (Atomic Balance Update)", data.get("status") == "success", data))
except Exception as e:
    tests.append(("POST /api/donate (Atomic Balance Update)", False, str(e)))

httpd.shutdown()

all_pass = all(t[1] for t in tests)
print("INTEGRATION_TEST_PASSED =", all_pass)
for t in tests:
    status_str = "PASS" if t[1] else "FAIL"
    print(f"  [{status_str}] {t[0]}: {t[2]}")
