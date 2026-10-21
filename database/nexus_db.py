# ============================================================================
# FUND NEXUS - Database Integration & Query Engine
# Provides persistent relational storage, atomic financial balance updates,
# and prepared statements to prevent injection.
# ============================================================================

import sqlite3
import os
import json

DB_FILE = os.path.join(os.path.dirname(__file__), "fund_nexus.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'donor',
        organization_name TEXT,
        is_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS campaigns (
        campaign_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        organizer_id TEXT,
        target_amount REAL NOT NULL,
        collected_amount REAL DEFAULT 0.0,
        verified_expenses REAL DEFAULT 0.0,
        reported_expenses REAL DEFAULT 0.0,
        status TEXT DEFAULT 'active',
        days_left INTEGER DEFAULT 30,
        description TEXT NOT NULL,
        risk_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        transaction_id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        donor_id TEXT,
        donor_name TEXT NOT NULL,
        amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'Simulated UPI',
        status TEXT DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        expense_id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'reported',
        evidence_document TEXT,
        reviewed_by TEXT,
        reviewed_at TIMESTAMP
    );
    """)

    conn.commit()

    # Seed data if empty
    cur.execute("SELECT COUNT(*) FROM campaigns")
    if cur.fetchone()[0] == 0:
        seed_data(conn)
    else:
        sync_missing_campaigns(conn)

    conn.close()

def sync_missing_campaigns(conn):
    cur = conn.cursor()
    cur.execute("SELECT campaign_id FROM campaigns")
    existing_ids = {row[0] for row in cur.fetchall()}

    campaigns = [
        ("CMP-101", "Solar Water Filtration for Rural Hill Schools", "education", "Tehri Garhwal, Uttarakhand", "USR-201", 150000.0, 95000.0, 25000.0, 35000.0, "active", 18, "Solar-powered clean drinking water facilities for 4 government primary schools in Tehri.", 8),
        ("CMP-102", "Mobile Maternal & Neonatal Clinic Van", "healthcare", "Chamoli, Uttarakhand", "USR-201", 300000.0, 180000.0, 52000.0, 65000.0, "active", 24, "Equipping a mobile healthcare van with diagnostic kits for remote villages.", 12),
        ("CMP-103", "Community Kitchen & Emergency Ration Kits", "disaster", "Rudraprayag, Uttarakhand", "USR-201", 80000.0, 54000.0, 18000.0, 28000.0, "active", 9, "Providing dry rations and portable cooking stations for families displaced by rains.", 14),
        ("CMP-104", "Women's Organic Herb & Honey Collective", "community", "Pauri Garhwal, Uttarakhand", "USR-201", 120000.0, 78000.0, 14000.0, 22000.0, "active", 31, "Empowering women farmers through modern apiary and chamomile drying equipment.", 6),
        ("CMP-105", "Emergency Pediatric Heart Surgery for 3-Year-Old Baby Aarav", "healthcare", "AIIMS Rishikesh / Dehradun", "USR-201", 450000.0, 285000.0, 95000.0, 120000.0, "active", 11, "Urgent life-saving corrective open heart surgery and post-operative PICU care at AIIMS Rishikesh for 3-year-old Baby Aarav.", 4)
    ]

    for c in campaigns:
        if c[0] not in existing_ids:
            cur.execute("INSERT INTO campaigns VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", c)

    # Also check expenses for CMP-105
    cur.execute("SELECT expense_id FROM expenses")
    existing_exp_ids = {row[0] for row in cur.fetchall()}

    aarav_expenses = [
        ("EXP-501", "CMP-105", "Pediatric Cardiopulmonary Bypass Kit & Stents", 55000.0, "2026-10-12", "verified", "Invoice #AIIMS-H8821", "USR-901", "2026-10-13 14:00:00"),
        ("EXP-502", "CMP-105", "Pre-Op High-Resolution Cardiac CT Angiography", 18000.0, "2026-10-14", "verified", "Bill #RAD-4420", "USR-901", "2026-10-15 09:30:00"),
        ("EXP-503", "CMP-105", "Pediatric ICU Inpatient Advance Admission Deposit", 22000.0, "2026-10-16", "verified", "Receipt #IPD-9031", "USR-901", "2026-10-17 11:00:00"),
        ("EXP-504", "CMP-105", "Specialized Pediatric Cardiac Antibiotics & IV Consumables", 25000.0, "2026-10-18", "evidence_submitted", "Tax Invoice #PH-7714", None, None)
    ]

    for exp in aarav_expenses:
        if exp[0] not in existing_exp_ids:
            cur.execute("INSERT INTO expenses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", exp)

    conn.commit()

def seed_data(conn):
    cur = conn.cursor()
    
    # Seed Users
    users = [
        ("USR-101", "Margaret Sharma", "margaret@gmail.com", "donor", None, 1),
        ("USR-102", "Aarav Patel", "aarav@gmail.com", "donor", None, 1),
        ("USR-201", "Doon Rural Welfare Trust", "contact@doonrural.org", "fundraiser", "Doon Welfare", 1),
        ("USR-901", "Platform Auditor", "audit@fundnexus.org", "admin", "Fund Nexus Board", 1)
    ]
    cur.executemany("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", users)

    # Seed Campaigns
    campaigns = [
        ("CMP-101", "Solar Water Filtration for Rural Hill Schools", "education", "Tehri Garhwal, Uttarakhand", "USR-201", 150000.0, 95000.0, 25000.0, 35000.0, "active", 18, "Solar-powered clean drinking water facilities for 4 government primary schools in Tehri.", 8),
        ("CMP-102", "Mobile Maternal & Neonatal Clinic Van", "healthcare", "Chamoli, Uttarakhand", "USR-201", 300000.0, 180000.0, 52000.0, 65000.0, "active", 24, "Equipping a mobile healthcare van with diagnostic kits for remote villages.", 12),
        ("CMP-103", "Community Kitchen & Emergency Ration Kits", "disaster", "Rudraprayag, Uttarakhand", "USR-201", 80000.0, 54000.0, 18000.0, 28000.0, "active", 9, "Providing dry rations and portable cooking stations for families displaced by rains.", 14),
        ("CMP-104", "Women's Organic Herb & Honey Collective", "community", "Pauri Garhwal, Uttarakhand", "USR-201", 120000.0, 78000.0, 14000.0, 22000.0, "active", 31, "Empowering women farmers through modern apiary and chamomile drying equipment.", 6),
        ("CMP-105", "Emergency Pediatric Heart Surgery for 3-Year-Old Baby Aarav", "healthcare", "AIIMS Rishikesh / Dehradun", "USR-201", 450000.0, 285000.0, 95000.0, 120000.0, "active", 11, "Urgent life-saving corrective open heart surgery and post-operative PICU care at AIIMS Rishikesh for 3-year-old Baby Aarav.", 4)
    ]
    cur.executemany("INSERT INTO campaigns VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", campaigns)

    # Seed Transactions
    txns = [
        ("TXN-782104", "CMP-101", "USR-101", "Margaret Sharma", 5000.0, "Simulated UPI", "Confirmed"),
        ("TXN-654129", "CMP-102", "USR-102", "Aarav Patel", 2500.0, "Simulated Card", "Confirmed"),
        ("TXN-910482", "CMP-103", "USR-101", "Margaret Sharma", 1500.0, "Simulated NetBanking", "Confirmed"),
        ("TXN-419820", "CMP-105", "USR-102", "Rohan & Sneha Joshi", 7500.0, "Simulated UPI", "Confirmed")
    ]
    cur.executemany("INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", txns)

    # Seed Expenses
    expenses = [
        ("EXP-101", "CMP-101", "Dual Solar Inverter & Battery Pack", 15000.0, "2026-09-12", "verified", "Invoice #2901", "USR-901", "2026-09-14 10:00:00"),
        ("EXP-102", "CMP-101", "Commercial RO Membrane", 10000.0, "2026-09-28", "verified", "Bill #DB-8812", "USR-901", "2026-09-30 11:30:00"),
        ("EXP-103", "CMP-101", "Plumbing Mountain Logistics", 10000.0, "2026-10-04", "evidence_submitted", "Challan #440", None, None),
        ("EXP-501", "CMP-105", "Pediatric Cardiopulmonary Bypass Kit & Stents", 55000.0, "2026-10-12", "verified", "Invoice #AIIMS-H8821", "USR-901", "2026-10-13 14:00:00"),
        ("EXP-502", "CMP-105", "Pre-Op High-Resolution Cardiac CT Angiography", 18000.0, "2026-10-14", "verified", "Bill #RAD-4420", "USR-901", "2026-10-15 09:30:00"),
        ("EXP-503", "CMP-105", "Pediatric ICU Inpatient Advance Admission Deposit", 22000.0, "2026-10-16", "verified", "Receipt #IPD-9031", "USR-901", "2026-10-17 11:00:00"),
        ("EXP-504", "CMP-105", "Specialized Pediatric Cardiac Antibiotics & IV Consumables", 25000.0, "2026-10-18", "evidence_submitted", "Tax Invoice #PH-7714", None, None)
    ]
    cur.executemany("INSERT INTO expenses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", expenses)

    conn.commit()

# Database Operations
def record_donation(campaign_id, amount, donor_name="Anonymous Supporter"):
    conn = get_connection()
    cur = conn.cursor()
    txn_id = f"TXN-{os.urandom(3).hex().upper()}"

    try:
        cur.execute("BEGIN TRANSACTION")
        # Update Campaign
        cur.execute("UPDATE campaigns SET collected_amount = collected_amount + ? WHERE campaign_id = ?", (amount, campaign_id))
        # Insert Transaction
        cur.execute("""
            INSERT INTO transactions (transaction_id, campaign_id, donor_name, amount, status)
            VALUES (?, ?, ?, ?, 'Confirmed (Simulated)')
        """, (txn_id, campaign_id, donor_name, amount))
        conn.commit()
        return {"status": "success", "transaction_id": txn_id, "amount": amount, "campaign_id": campaign_id}
    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized and verified successfully at:", DB_FILE)
