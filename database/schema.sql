-- ============================================================================
-- FUND NEXUS — RELATIONAL DATABASE SCHEMA (MySQL & SQLite Compatible)
-- Domain: FinTech / Fund Management & Donation Tracking
-- Academic Session: 2026-27 | Graphic Era (Deemed to be University)
-- Team ID: DSCPP-III-2026-T101
-- ============================================================================

-- 1. Users Table (Role-based access: donor, fundraiser, admin)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'donor', -- 'donor', 'fundraiser', 'admin'
    organization_name VARCHAR(150),
    is_verified BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    campaign_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    organizer_id VARCHAR(50),
    target_amount DECIMAL(12, 2) NOT NULL,
    collected_amount DECIMAL(12, 2) DEFAULT 0.00,
    verified_expenses DECIMAL(12, 2) DEFAULT 0.00,
    reported_expenses DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'active', -- 'pending', 'active', 'completed', 'flagged'
    days_left INT DEFAULT 30,
    description TEXT NOT NULL,
    risk_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id)
);

-- 3. Transactions Table (Immutable Donation Ledger)
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(60) PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL,
    donor_id VARCHAR(50),
    donor_name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Simulated UPI',
    status VARCHAR(30) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id)
);

-- 4. Expenses Table (3-Stage Audited Disbursements)
CREATE TABLE IF NOT EXISTS expenses (
    expense_id VARCHAR(50) PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'reported', -- 'reported', 'evidence_submitted', 'verified', 'rejected'
    evidence_document TEXT,
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id),
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

-- 5. Audit Logs Table (Tracking Administrative Decisions)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id VARCHAR(50),
    action_type VARCHAR(80) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
