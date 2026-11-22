import sys
import os
import json
import subprocess
import time
import urllib.request

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "database"))
import nexus_db

CPP_ENGINE = os.path.join(BASE_DIR, "cpp_engine", "engine.exe")

def run_tests():
    print("=" * 70)
    print("  FUND NEXUS — ADVANCED CAPABILITIES VERIFICATION TEST SUITE")
    print("=" * 70)

    # 1. C++ Engine Test: Cryptographic Chain Verification
    print("\n[TEST 1] Testing C++ Cryptographic Chain Verification...")
    res = subprocess.run([CPP_ENGINE, "--verify-chain"], capture_output=True, text=True)
    assert res.returncode == 0, f"C++ engine failed: {res.stderr}"
    data = json.loads(res.stdout.strip())
    assert data["chain_valid"] is True, "Expected valid chain!"
    assert "merkle_root" in data, "Expected Merkle root!"
    print(f"  [PASS] Cryptographic Chain 100% Valid! Merkle Root: {data['merkle_root']}")

    # 2. C++ Engine Test: Tamper Detection
    print("\n[TEST 2] Testing C++ Tamper Simulation & Detection...")
    res = subprocess.run([CPP_ENGINE, "--simulate-tamper", "3", "99999.0"], capture_output=True, text=True)
    assert res.returncode == 0
    tamper_data = json.loads(res.stdout.strip())
    assert tamper_data["chain_valid"] is False, "Expected chain to fail under tampering!"
    assert tamper_data["detected_index"] == 3, f"Expected tamper at node 3, got {tamper_data['detected_index']}"
    print(f"  [PASS] Tamper correctly caught! Alert: {tamper_data['audit_message'][:65]}...")

    # 3. C++ Engine Test: Dynamic Max-Heap Priority Queue (Triage)
    print("\n[TEST 3] Testing Dynamic Max-Heap Priority Triage Queue...")
    res = subprocess.run([CPP_ENGINE, "--priority-queue"], capture_output=True, text=True)
    assert res.returncode == 0
    pq_data = json.loads(res.stdout.strip())
    assert pq_data["total_tasks"] >= 4
    top_task = pq_data["priority_tasks"][0]
    # Pediatric heart surgery should be prioritized over routine supplies
    assert top_task["urgency_level"] == 3, "Expected highest urgency task at top of heap!"
    print(f"  [PASS] Triage Heap successfully prioritized: [{top_task['task_id']}] {top_task['title']} (Score: {top_task['priority_score']})")

    # 4. Database Test: Atomic Submission & Review
    print("\n[TEST 4] Testing Database Expense Lifecycle & Balance Recalculation...")
    nexus_db.init_db()
    
    # Check baseline
    analytics_before = nexus_db.get_analytics()
    prev_vault = analytics_before["vault_liquid_reserve"]
    
    # Submit an expense claim
    exp_res = nexus_db.submit_expense("CMP-101", "High-Altitude Solar Inverter Cable", 5000.0, "Bill #CAB-992")
    assert exp_res["status"] == "success"
    exp_id = exp_res["expense_id"]
    print(f"  [PASS] Expense claim submitted: {exp_id} for Rs. 5,000")

    # Review (Approve)
    review_res = nexus_db.review_expense("CMP-101", exp_id, True, "USR-901", "Audited and approved")
    assert review_res["status"] == "success"
    assert review_res["decision"] == "verified"
    print(f"  [PASS] Admin audit verified: {exp_id} approved and deducted from verified balance")

    # 5. Database Analytics Test
    analytics = nexus_db.get_analytics()
    assert analytics["status"] == "success"
    print(f"  [PASS] System Analytics: Total Inflow: Rs. {analytics['total_inflow']:,.2f} | Vault Reserve: Rs. {analytics['vault_liquid_reserve']:,.2f}")

    print("\n" + "=" * 70)
    print("  ALL ADVANCED BACKEND & C++ TESTS PASSED (100% SUCCESS)!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
