# 🌐 Fund Nexus — Transparent Crowdfunding & Multi-Stage Financial Auditing System

> **Academic Project:** Graphic Era (Deemed to be University)  
> **Team ID:** DSCPP-III-2026-T101  
> **Core Focus:** Advanced Data Structures (C++), REST API Architecture (Python), Relational Persistence (SQLite), and Responsive Interactive Frontend (HTML5/CSS3/ES6+).

---

## 👥 Project Team & Departmental Contributions

| Team Member | GitHub Username | Role & Departmental Responsibilities |
| :--- | :--- | :--- |
| **Pari Singhal** | [@parisinghal017-hue](https://github.com/parisinghal017-hue) | **C++ Core Engine & Data Structures Lead**<br>• Custom Singly Linked List for Immutable Audit Ledger<br>• FIFO Administrative Review Queue<br>• Jaccard Token Text Similarity Algorithm<br>• Rule-based Heuristic Campaign Risk Analyzer |
| **Divyanka** | [@ByteByDivyanka](https://github.com/ByteByDivyanka) | **Backend Architecture & Database Engineer**<br>• Multi-threaded HTTP Server & REST APIs<br>• Relational Database Schema (`campaigns`, `transactions`, `expenses`)<br>• SQLite Atomic Persistence Manager (`nexus_db.py`)<br>• Subprocess C++ IPC Engine Bridge |
| **Yashasvi Sharma** | [@sharmayashasvi707](https://github.com/sharmayashasvi707) | **Frontend Application & Interactive Client Lead**<br>• Semantic Single-Page Application Layout (`index.html`)<br>• 4-Tier Role Dashboards (Guest, Donor, Fundraiser, Admin)<br>• Dynamic DOM Rendering Engine (`campaigns-ui.js`)<br>• Simulated Donation Checkout Flow & 80G Tax Receipt Generator |
| **Shreya Sinha** | [@shreya25codes](https://github.com/shreya25codes) | **UI/UX Design System, QA & Documentation Lead**<br>• Warm Editorial UI Design System (`style.css`)<br>• Automated Role-Based Access Control (RBAC) Test Suite<br>• Automated Real-Time Donation & Balance Update Test Suite<br>• End-to-End Multi-Tier Integration Test Suite<br>• Complete Technical Documentation & Specifications |

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

## 🔒 Role-Based Access Control (RBAC) Credentials

* **Guest (Public):** Explore causes, inspect verified ledger, calculate balances.
* **Donor (`USR-101`):** Simulated donation checkout, view personal history, generate 80G tax receipt.
* **Fundraiser (`USR-201`):** Submit expense claims, upload invoice references.
* **Admin Auditor (`USR-901`):** Password-protected (`admin123` or `9010`), review proof, authorize disbursements.
