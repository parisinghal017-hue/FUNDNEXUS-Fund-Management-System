# 🌐 Fund Nexus — Transparent Crowdfunding & Multi-Stage Financial Auditing System

> **Live Production Deployment:** [https://parisinghal017-hue.github.io/FUNDNEXUS-Fund-Management-System/](https://parisinghal017-hue.github.io/FUNDNEXUS-Fund-Management-System/)  
> **Academic Project:** Graphic Era (Deemed to be University)  
> **Team Name:** HopeX | **Team ID:** DSCPP-III-2026-T101  
> **Core Focus:** Advanced Data Structures (C++), REST API Architecture (Python), Relational Persistence (SQLite), and Responsive Interactive Frontend (HTML5/CSS3/ES6+).

---

## 👥 Project Team & Departmental Contributions

| Team Member | Student ID | GitHub Profile | Verified Email | Role & Departmental Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Yashasvi Sharma** *(Lead)* | 2510010351 | [@sharmayashasvi707](https://github.com/sharmayashasvi707) | `sharmayashasvi1601@gmail.com` | **Frontend Application & Interactive Client Lead**<br>• Semantic Single-Page Application Layout (`index.html`)<br>• Dynamic DOM Rendering Engine (`campaigns-ui.js`)<br>• 4-Tier Role Dashboards & Custom Donor Registration<br>• Simulated Donation Checkout Flow & 80G Tax Receipt Generator |
| **Pari Singhal** | 2510012558 | [@parisinghal017-hue](https://github.com/parisinghal017-hue) | `parisinghal017@gmail.com` | **C++ Core Engine & Data Structures Lead**<br>• Custom Singly Linked List for Immutable Audit Ledger<br>• FIFO Administrative Review Queue & Tamper-Proof Audit<br>• Jaccard Token Text Similarity Algorithm<br>• Rule-based Heuristic Campaign Risk Analyzer |
| **Shreya Sinha** | 2510012232 | [@shreya25codes](https://github.com/shreya25codes) | `shreyasinha3602@gmail.com` | **UI/UX Design System, QA & Documentation Lead**<br>• Warm Editorial UI Design System (`style.css`)<br>• Automated Role-Based Access Control (RBAC) Test Suite<br>• Automated Real-Time Donation & Balance Update Test Suite<br>• End-to-End Multi-Tier Integration Test Suite<br>• Complete Technical Documentation & Specifications |
| **Divyanka Kumari** | 2510012306 | [@ByteByDivyanka](https://github.com/ByteByDivyanka) | `divyanka.edu@gmail.com` | **Backend Architecture & Database Engineer**<br>• Multi-threaded HTTP Server & REST APIs (`server.py`)<br>• Relational Database Schema (`campaigns`, `transactions`, `expenses`)<br>• SQLite Atomic Persistence Manager (`nexus_db.py`)<br>• Subprocess C++ IPC Engine Bridge |

---

## 💡 The Core Problem & Our Strict Financial Logic

### Traditional Platforms vs Fund Nexus
Traditional crowdfunding platforms suffer from financial opacity: self-reported expenses are often unverified, leading to donor mistrust. 

Fund Nexus enforces **Strict Verified Audit Stages**:
$$\text{Recorded Remaining Balance} = \text{Total Recorded Donations} - \text{Admin-Reviewed Expenses}$$

* **Unverified Claims:** Logged as pending documentation and do **not** deduct from the balance.
* **Verified Expenses:** Only invoices and challans audited and approved by platform administrators formally deduct from the available balance.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│              1. Presentation Layer (Frontend)               │
│   HTML5 Layout  •  Warm Editorial CSS  •  Vanilla ES6+ JS   │
│   Dynamic Modals • RBAC Dashboards • 80G Tax Receipts       │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTP / REST JSON APIs
┌──────────────────────────────▼──────────────────────────────┐
│              2. Backend Application & Middleware            │
│   Python 3 Multi-threaded Server  •  SQLite3 Persistence    │
│   Atomic Transaction Logger       •  Subprocess IPC Bridge  │
└──────────────────────────────┬──────────────────────────────┘
                               │  Compiled Native Binary IPC
┌──────────────────────────────▼──────────────────────────────┐
│              3. High-Performance C++ Core Engine            │
│   Singly Linked List Ledger       •  FIFO Audit Queue       │
│   Jaccard Token Similarity        •  Heuristic Risk Scorer  │
│   Polymorphic User Hierarchy      •  Financial Engine       │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Data Structures & Algorithms (DSA) Implementation

### 1. Singly Linked List (`TransactionLedgerList`)
* **File:** `cpp_engine/LinkedList.h` & `LinkedList.cpp`
* **Purpose:** Serves as the chronological, immutable audit transaction ledger.
* **Complexity:** Append at Tail $O(1)$, Sequential Traversal $O(N)$.
* **Advantage:** Allocates memory dynamically per transaction without fixed-size memory reallocation.

### 2. FIFO Queue (`AuditReviewQueue`)
* **File:** `cpp_engine/Queue.h` & `Queue.cpp`
* **Purpose:** Manages pending expense claims submitted by fundraisers for admin verification.
* **Discipline:** Strict First-In, First-Out (FIFO) ensures claims are audited in order of submission.
* **Complexity:** `enqueue()` $O(1)$, `dequeue()` $O(1)$.

### 3. Jaccard Token Text Similarity Detector
* **File:** `cpp_engine/SimilarityDetector.h` & `SimilarityDetector.cpp`
* **Purpose:** Anti-fraud duplicate cause detector.
* **Formula:** $J(A, B) = \frac{|A \cap B|}{|A \cup B|}$. Submissions with overlap $\ge 65\%$ are flagged as copycat risks.

### 4. Rule-Based Campaign Risk Analyzer
* **File:** `cpp_engine/RiskAnalyzer.h` & `RiskAnalyzer.cpp`
* **Purpose:** Heuristic risk scoring (0–100) assessing description clarity, unverified fundraising goals, and high-pressure keywords.

---

## 🚀 Quick Start Guide

### 1. Compile C++ Core Engine
```cmd
cd cpp_engine
build.bat
cd ..
```

### 2. Start Unified Backend Server
```bash
python backend/server.py
```
* Access the portal at: `http://127.0.0.1:5000`

### 3. Run Automated Quality Assurance Test Suites
```bash
python tests/test_role_rbac.py
python tests/test_donation_flow.py
python tests/test_integration.py
```

---

## 🔒 Zero-Trust PIN Authentication & Testing Credentials

Fund Nexus implements **Zero-Trust Role-Based & Attribute-Based Access Control (RBAC/ABAC)** complying with OWASP A01 & A07 to prevent cross-account impersonation:

| Role / Profile | Identity ID | Default PIN / Password | Capabilities & Scope |
| :--- | :--- | :--- | :--- |
| **Guest / Public** | Public Visitor | *None (Open)* | Browse causes, review transparency formulas, inspect public audit ledger & certificates. |
| **Donor: Margaret** | `USR-101` | `1010` | Personal tax receipts, private donation history, campaign donation flow. |
| **Donor: Aarav** | `USR-102` | `1020` | Personal tax receipts, private donation history, campaign donation flow. |
| **Donor: Pari** | `USR-103` | `1030` | Personal tax receipts, private donation history, campaign donation flow. |
| **Donor: Yashasvi** | `USR-104` | `1040` | Personal tax receipts, private donation history, campaign donation flow. |
| **Donor: Rohan** | `USR-105` | `1050` | Personal tax receipts, private donation history, campaign donation flow. |
| **+ Custom Donor** | `USR-CUSTOM-...` | *User Defined (4 Digits)* | Click **"+ Register New Donor Account"** to create a custom donor with persistent local storage. |
| **Fundraiser** | `USR-201` | `2010` | Create campaigns, upload legal certificates, submit itemized expenses (strictly restricted to own campaigns). |
| **Admin Gatekeeper** | `USR-901` | `admin123` or `9010` | Statutory certificate inspector, Gatekeeper verification queue, GST invoice review, campaign deletion. |

---

## 🛡️ Key Platform Highlights & Features

1. **Statutory Document & Certificate Inspector:** Inspect authentic NGO trust deeds, 80G registrations, and Darpan certificates directly in the visual inspection sheet modal (`#campaign-doc-preview-modal`).
2. **Itemized GST Tax Invoice Audit Sheet:** Admins audit vendor details, GSTIN, HSN codes, and itemized lines before deducting expenses from verified balances (`#invoice-preview-modal`).
3. **Harmonized Dark Editorial Palette:** Fully styled without glaring white backgrounds, using warm mocha, light beige (`#ECE3D4`), and terracotta accents.
4. **Dual Automated Deployments:**
   - **GitHub Pages:** Automated deployment via GitHub Actions (`.github/workflows/deploy.yml`).
   - **Vercel:** Static edge deployment configured via `vercel.json`.

