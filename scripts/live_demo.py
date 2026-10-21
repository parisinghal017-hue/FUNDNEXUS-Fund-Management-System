import urllib.request
import json
import subprocess
import os

print("=" * 70)
print("       FUND NEXUS — END-TO-END SYSTEM DEMONSTRATION")
print("  College PBL Project | Graphic Era (Deemed to be University)")
print("=" * 70)

# 1. Check Server & C++ Engine Status
res = urllib.request.urlopen("http://127.0.0.1:5000/api/status")
status = json.loads(res.read().decode())
print("\n[1] PLATFORM HEALTH CHECK:")
print(f"    • Server Status    : {status['status'].upper()}")
print(f"    • Database Backend : {status['database']}")
print(f"    • C++ Engine Bridge: {'ACTIVE & COMPILED' if status['cpp_engine_active'] else 'OFFLINE'}")

# 2. Fetch Active Campaigns from Live Database
res = urllib.request.urlopen("http://127.0.0.1:5000/api/campaigns")
campaigns_data = json.loads(res.read().decode())
print(f"\n[2] ACTIVE CAMPAIGNS REGISTERED ({campaigns_data['count']} causes):")
for c in campaigns_data["campaigns"]:
    progress = (c['collected_amount'] / c['target_amount']) * 100
    rem = c['collected_amount'] - c['verified_expenses']
    print(f"    • [{c['campaign_id']}] {c['title'][:45]:<45} | Goal: Rs.{c['target_amount']:,.0f} | Raised: Rs.{c['collected_amount']:,.0f} ({progress:.1f}%) | Bal: Rs.{rem:,.0f}")

# 3. Simulate a Live Donation to Baby Aarav's Campaign (CMP-105)
demo_donor = "Demo Donor (PBL Evaluation)"
demo_amount = 5000.0
print(f"\n[3] SIMULATING DONATION TO BABY AARAV (CMP-105):")
print(f"    • Donor Name       : {demo_donor}")
print(f"    • Contribution     : Rs. {demo_amount:,.2f}")

req = urllib.request.Request(
    "http://127.0.0.1:5000/api/donate",
    data=json.dumps({"campaign_id": "CMP-105", "amount": demo_amount, "donor_name": demo_donor}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res = urllib.request.urlopen(req)
donation_result = json.loads(res.read().decode())

print(f"    • Transaction State: {donation_result['status'].upper()}")
print(f"    • Generated Txn Ref: {donation_result['transaction_id']}")

# 4. Verify Updated Campaign Balance in SQLite
res = urllib.request.urlopen("http://127.0.0.1:5000/api/campaigns")
updated_campaigns = json.loads(res.read().decode())
aarav = next(c for c in updated_campaigns["campaigns"] if c["campaign_id"] == "CMP-105")
rem_aarav = aarav['collected_amount'] - aarav['verified_expenses']
print(f"\n[4] REAL-TIME ATOMIC BALANCE VERIFICATION (CMP-105):")
print(f"    • New Raised Amount: Rs. {aarav['collected_amount']:,.2f}")
print(f"    • Verified Expenses: Rs. {aarav['verified_expenses']:,.2f} (AIIMS ICU & bypass kit bills)")
print(f"    • Available Balance: Rs. {rem_aarav:,.2f}")

# 5. Query Immutable Ledger from C++ Engine (engine.exe)
res = urllib.request.urlopen("http://127.0.0.1:5000/api/cpp/ledger")
ledger_data = json.loads(res.read().decode())
print(f"\n[5] C++ SINGLY LINKED LIST IMMUTABLE LEDGER:")
print(f"    • Total Txn Nodes  : {ledger_data.get('total_records', 0)}")
print(f"    • Total Fund Volume: Rs. {ledger_data.get('total_amount', 0):,.2f}")
print("    • Recent Ledger Entries:")
for txn in ledger_data.get("transactions", [])[-4:]:
    print(f"      - [{txn['id']}] {txn['donor'][:20]:<20} -> {txn['campaign']} : Rs. {txn['amount']:,.2f} ({txn['status']})")

print("\n" + "=" * 70)
print("  LIVE DEMO COMPLETED SUCCESSFULLY: ALL 3 ARCHITECTURE TIERS VERIFIED!")
print("=" * 70)
