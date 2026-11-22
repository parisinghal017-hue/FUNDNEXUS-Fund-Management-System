# ============================================================================
# FUND NEXUS — ADVANCED BACKEND API SERVER & C++ ENGINE CONNECTOR
# Technology: Python 3 Standard Library (Zero third-party bloat)
# Bridges Frontend Web UI, SQLite Database, and Compiled C++ Engine
# Academic Session: 2026-27 | Graphic Era (Deemed to be University)
# Team ID: DSCPP-III-2026-T101
# ============================================================================

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
import subprocess

# Add database folder to python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "database"))
import nexus_db

PORT = 5000
CPP_ENGINE_PATH = os.path.join(BASE_DIR, "cpp_engine", "engine.exe")

class NexusAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stderr.write(f"[FundNexus Server] {self.address_string()} - {format % args}\n")

    def send_json(self, data, status_code=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        # 1. API: Health & Status
        if path == "/api/status":
            engine_exists = os.path.exists(CPP_ENGINE_PATH)
            self.send_json({
                "platform": "Fund Nexus Advanced",
                "status": "online",
                "database": "SQLite (fund_nexus.db)",
                "cpp_engine_active": engine_exists,
                "cryptographic_ledger": "Enabled (Merkle Root + SHA Hashing)",
                "triage_heap": "Enabled (Dynamic Max-Heap Priority)"
            })
            return

        # 2. API: Get Campaigns
        elif path == "/api/campaigns":
            conn = nexus_db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT * FROM campaigns")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            self.send_json({"status": "success", "count": len(rows), "campaigns": rows})
            return

        # 2b. API: Get Users & Roles (RBAC)
        elif path == "/api/users":
            conn = nexus_db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT user_id, name, email, role, organization_name, is_verified FROM users")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            self.send_json({"status": "success", "count": len(rows), "users": rows})
            return

        # 2c. API: Get All Expenses
        elif path == "/api/expenses":
            conn = nexus_db.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT * FROM expenses ORDER BY date DESC")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            self.send_json({"status": "success", "count": len(rows), "expenses": rows})
            return

        # 2d. API: Live Platform Financial Analytics
        elif path == "/api/analytics":
            analytics = nexus_db.get_analytics()
            self.send_json(analytics)
            return

        # 3. API: Get Cryptographic Ledger directly from C++ Engine
        elif path == "/api/cpp/ledger":
            if not os.path.exists(CPP_ENGINE_PATH):
                self.send_json({"status": "error", "message": "C++ engine executable not found"}, 500)
                return
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--json-ledger"], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # 4. API: Verify Hash-Chain Cryptographic Integrity
        elif path == "/api/cpp/verify-chain":
            if not os.path.exists(CPP_ENGINE_PATH):
                self.send_json({"status": "error", "message": "C++ engine executable not found"}, 500)
                return
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--verify-chain"], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # 5. API: Simulate Malicious Database Tampering (Live Viva Demo)
        elif path == "/api/cpp/simulate-tamper":
            node_idx = params.get("node", ["2"])[0]
            amount = params.get("amount", ["99999.0"])[0]
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--simulate-tamper", node_idx, amount], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # 6. API: Get Dynamic Triage Priority Queue (Max-Heap)
        elif path == "/api/cpp/priority-queue":
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--priority-queue"], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # 7. API: Execute C++ Similarity Check
        elif path == "/api/cpp/similarity":
            title_a = params.get("a", [""])[0]
            title_b = params.get("b", [""])[0]
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--check-similarity", title_a, title_b], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # 8. API: Advanced Anti-Fraud & GSTIN/PAN Evaluator
        elif path == "/api/cpp/risk-eval":
            title = params.get("title", ["Emergency Project"])[0]
            target = params.get("target", ["100000"])[0]
            gstin = params.get("gstin", [""])[0]
            pan = params.get("pan", [""])[0]
            try:
                proc = subprocess.run([CPP_ENGINE_PATH, "--risk-eval", title, target, gstin, pan], capture_output=True, text=True, timeout=5)
                self.send_json(json.loads(proc.stdout.strip()))
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, 500)
            return

        # Default: Serve static files from workspace root (index.html, css/, js/)
        else:
            return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"

        try:
            payload = json.loads(raw_body)
        except Exception:
            payload = {}

        # 1. API: Process Simulated Donation
        if path == "/api/donate":
            campaign_id = payload.get("campaign_id")
            amount = payload.get("amount")
            donor_name = payload.get("donor_name", "Anonymous Supporter")
            donor_id = payload.get("donor_id", "USR-101")

            if not campaign_id or not amount or float(amount) <= 0:
                self.send_json({"status": "error", "message": "Invalid donation parameters"}, 400)
                return

            result = nexus_db.record_donation(campaign_id, float(amount), donor_name, donor_id)
            self.send_json(result)
            return

        # 2. API: Submit Expense Claim (Fundraiser)
        elif path == "/api/expenses/submit":
            campaign_id = payload.get("campaign_id")
            title = payload.get("title")
            amount = payload.get("amount")
            evidence = payload.get("evidence", "Proof attached for audit")

            if not campaign_id or not title or not amount or float(amount) <= 0:
                self.send_json({"status": "error", "message": "Invalid expense parameters"}, 400)
                return

            result = nexus_db.submit_expense(campaign_id, title, float(amount), evidence)
            self.send_json(result)
            return

        # 3. API: Review Expense Claim (Admin)
        elif path == "/api/expenses/review":
            campaign_id = payload.get("campaign_id")
            expense_id = payload.get("expense_id")
            decision = payload.get("decision", True)
            auditor_id = payload.get("auditor_id", "USR-901")
            remarks = payload.get("remarks", "Audited via Admin Transparency Portal")

            if not campaign_id or not expense_id:
                self.send_json({"status": "error", "message": "Missing campaign or expense identifier"}, 400)
                return

            result = nexus_db.review_expense(campaign_id, expense_id, decision, auditor_id, remarks)
            self.send_json(result)
            return

        # 4. API: Delete Campaign (Database Deletion)
        elif path == "/api/campaigns/delete":
            campaign_id = payload.get("campaign_id")
            if not campaign_id:
                self.send_json({"status": "error", "message": "Missing campaign_id identifier"}, 400)
                return

            result = nexus_db.delete_campaign(campaign_id)
            status_code = 200 if result.get("status") == "success" else 400
            self.send_json(result, status_code)
            return

        else:
            self.send_json({"status": "error", "message": "Endpoint not found"}, 404)

def run_server():
    nexus_db.init_db()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), NexusAPIHandler) as httpd:
        print(f"============================================================")
        print(f"  FUND NEXUS ADVANCED UNIFIED SERVER RUNNING               ")
        print(f"  Local Address: http://127.0.0.1:{PORT}                    ")
        print(f"  C++ Engine:    {CPP_ENGINE_PATH}                          ")
        print(f"  Database:      {nexus_db.DB_FILE}                         ")
        print(f"============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Fund Nexus server cleanly.")

if __name__ == "__main__":
    run_server()
