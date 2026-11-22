# B.Tech DSCPP-III-2026-T101 — PHASE-III PROJECT PROGRESS REPORT

---

## PAGE 1

**B.Tech DSCPP-III-2026-T101**  
**PHASE-III PROJECT PROGRESS**

### Graphic Era (Deemed to be University), Dehradun

---

### PROJECT AND TEAM INFORMATION

#### Project Title
*(Try to choose a catchy title. Max 20 words).*

> **FundNexus: A Unified Platform for Transparent Fund Management, Multi-Stage Expense Auditing, and Real-Time Donation Tracking**

---
*Page 1*

---

## PAGE 2

**B.Tech DSCPP-III-2026-T101**  
**PHASE-III PROJECT PROGRESS**

| Field | Details |
| :--- | :--- |
| **Team Name:**<br>**Team #** | **HopeX**<br>**B.Tech DSCPP-III-2026-T101** |
| **Team member 1 (Team Lead)**<br>*(Last Name, name: student ID: email, picture)*: | **Sharma, Yashasvi** — 2510010351<br>`sharmayashasvi1601@gmail.com`<br>*(Photo: member1.png)* |
| **Team member 2**<br>*(Last Name, name: student ID: email, picture)*: | **Singhal, Pari** — 2510012558<br>`parisinghal017@gmail.com`<br>*(Photo: member2.png)* |
| **Team member 3**<br>*(Last Name, name: student ID: email, picture)*: | **Kumari, Shreya** — 2510012232<br>`shreyasinha3602@gmail.com`<br>*(Photo: member3.png)* |
| **Team member 4**<br>*(Last Name, name: student ID: email, picture)*: | **Kumari, Divyanka** — 2510012306<br>`divyanka.edu@gmail.com`<br>*(Photo: member4.png)* |

---
*Page 2*

---

## PAGE 3

**B.Tech DSCPP-III-2026-T101**  
**PHASE-III PROJECT PROGRESS**

### PHASE-III PROJECT PROGRESS DESCRIPTION (35 pts)

#### Project Abstract (2 pts)
*(Brief restatement of your project’s main goal. Max 300 words).*

All four of us started FundNexus because of something that has always bothered us about online charity portals: once you hit 'Donate', your money basically vanishes into a black box. Platforms raise lakhs of rupees with emotional stories, but donors almost never get to see a genuine hospital bill or medicine invoice afterward. We wanted to build a system where accountability isn't optional. In FundNexus, campaign creators cannot just withdraw donations whenever they want. Every withdrawal must be backed by real medical invoices or vendor bills, which an admin verifies before a single rupee leaves the account.

During Phase 2, we built the core C++ backend, our custom linked list ledger, and SQL database tables. In this final Phase 3, we brought the entire application to life on the web. We built clean, separate dashboards for donors, fundraisers, and administrators. A donor can browse verified causes, donate through a simulated UPI or card checkout, and instantly get an 80G tax exemption receipt. Fundraisers can post progress updates and submit expense claims along with invoice pictures. Admins have an approval dashboard where they can inspect those bills and click approve or reject.

We also connected our C++ engine to the Python web server using an IPC bridge so our linked list audit trail and copycat campaign detector run automatically behind every request. The whole platform is now completely functional, tested across our laptops and phones, and ready for our final project evaluation.

*(Word count: 234 words)*

---

#### Updated Project Approach and Architecture (2 pts)
*(Describe your current approach, including system design, communication protocols, libraries used, etc. Max 300 words).*

We designed FundNexus around three simple layers: a compiled C++ engine for fast algorithms, a Python backend server that handles API routes, and a responsive web frontend. We stuck with C++ for our core data structures because raw pointers and manual memory management give us much faster execution than pure JavaScript or Python, and we wanted zero memory leaks.

Our C++ engine runs four key modules: a custom singly linked list that acts as our tamper-proof donation ledger, a FIFO queue that lines up pending expense claims in the exact order fundraisers upload them, a Jaccard token similarity check to catch copycat duplicate campaigns, and a rule-based risk scorer that flags unrealistic goals. Our Python backend runs using standard library HTTP modules to keep things lightweight. It talks directly to the compiled C++ executable (`engine.exe`) using standard input and output pipes (IPC), passing JSON data back and forth. For data storage, Divyanka set up a normalized 3NF SQLite database that keeps users, campaigns, donations, and expense receipts linked with foreign keys.

To keep the math honest, our code strictly enforces one formula: Remaining Balance = Total Verified Donations − Admin-Approved Expenses. If a fundraiser uploads a bill, the balance doesn't drop until the admin actually reviews and approves it. The frontend is built using clean HTML5, custom CSS, and vanilla JavaScript. It lets users switch between Guest, Donor, Fundraiser, and Admin views without needing heavy frameworks. Everything connects over standard REST API routes.

*(Word count: 236 words)*

---
*Page 3*

---

## PAGE 4

**B.Tech DSCPP-III-2026-T101**  
**PHASE-III PROJECT PROGRESS**

#### Tasks Completed (7 pts)
*(Describe the main tasks that have been assigned and already completed. Max 250 words).*

In Phase 3, our team finished every remaining frontend and integration task planned from Phase 2. We wired the web UI to our backend and verified all user roles.

| Task Completed | Team Member |
| :--- | :--- |
| Implemented C++ Singly Linked List transaction audit ledger and pointer cleanup | Pari Singhal |
| Built FIFO Audit Review Queue in C++ for sequential expense claim processing | Pari Singhal |
| Programmed Jaccard Token Text Similarity algorithm to catch copycat campaigns | Pari Singhal |
| Designed Admin Verification Dashboard UI and approval action controls | Pari Singhal |
| Wired Subprocess IPC pipe bridge between Python server and C++ engine | Pari Singhal |
| Built single-page web layout, navigation bar, and 4-tier role dashboards | Yashasvi Sharma |
| Created simulated checkout modal and automatic 80G tax receipt generator | Yashasvi Sharma |
| Connected frontend JavaScript fetch calls to backend REST API endpoints | Yashasvi Sharma |
| Designed 3NF Relational Database schema and SQLite persistence layer | Divyanka Kumari |
| Built Expense Receipt and Invoice Image Upload modal with image lightbox | Divyanka Kumari |
| Helped with CSS color styling and basic documentation formatting | Shreya Kumari |
| Cross-device mobile testing, automated test runs, and final user guide | All Members |

*(Word count: 188 words)*

---

#### Challenges/Roadblocks (7 pts)
*(Describe the challenges that you have faced or are facing so far and how you plan to solve them. Max 300 words).*

Connecting our compiled C++ engine to the web server gave us plenty of late-night headaches in the lab this phase. Subprocess IPC was easily our toughest technical hurdle. When Python launched `engine.exe` on Windows, the C++ output kept getting trapped in the stdout pipe buffer. Our web requests would just hang forever waiting for a response. After spending two evenings debugging, Pari realized Windows handles stream flushing differently than Linux. We fixed it by adding explicit `fflush(stdout)` calls inside C++ and reading pipe buffers cleanly in Python.

Another big pain point was keeping campaign balances accurate across user dashboards. During early tests, whenever a fundraiser uploaded an invoice, our JavaScript immediately subtracted the money from the public balance. That completely defeated our audit rule! We sat down and restructured both the SQL queries and frontend state so only expenses with an approved status actually deduct from available funds.

Mobile responsiveness was another annoying headache. When we opened the receipt image modal on our phones, Android browsers allowed the background page to keep scrolling, which broke the lightbox position. Divyanka and Pari fixed this with body scroll locks and responsive CSS media queries.

Finally, managing GitHub commits with all four of us pushing code simultaneously caused frustrating merge conflicts in week one. Yashasvi set up strict branch rules: everyone had to work on their own feature branch, test locally with our test suite, and get a pull request reviewed before merging into main. That saved us from overwriting each other's work.

*(Word count: 246 words)*

---

#### Project Outcome/Deliverables (2 pts)
*(Describe what are the key outcomes / deliverables of the project. Max 200 words).*

We are delivering a complete, fully working web application where every single rupee can be tracked from donor to beneficiary: (1) Our compiled C++ engine (`engine.exe`) featuring a custom linked list ledger, FIFO review queue, Jaccard similarity detector, and heuristic risk analyzer. (2) A lightweight Python REST server with zero third-party packages that communicates with the C++ binary via IPC pipes. (3) A 3NF SQLite database storing users, campaigns, donation entries, and uploaded receipt proofs. (4) An interactive web frontend with custom dashboards for Guests, Donors, Fundraisers, and Admins, featuring a donation checkout modal, receipt lightbox, and instant 80G tax receipt generator. (5) Automated QA test scripts covering role permissions, financial balances, and end-to-end API calls. (6) Our full GitHub repository with commit history, documentation, and a viva prep guide.

*(Word count: 138 words)*

---

#### Progress Overview (2 pts)
*(Summarize how much of the project is done, what’s behind schedule, what’s ahead of schedule. Max 200 words.)*

Our team hit 100% completion on all our Phase 3 goals and we are completely on schedule for our final evaluation. In Phase 2, we only had command-line outputs and C++ modules running in the terminal. Now, the entire platform is live in the browser. Pari finished the C++ algorithms and IPC bridge, Yashasvi built the frontend dashboards and 80G receipt generator, Divyanka completed the database and receipt upload modals, and Shreya assisted with UI styles and test documentation. We ran all our automated test scripts and everything passed with zero errors. We also spent time testing the app on our phones and laptops using Chrome and Edge to confirm there are no broken layouts or buttons. There is nothing pending or behind schedule, and we are ready for the final demo.

*(Word count: 145 words)*

---
*Page 4*

---

## PAGE 5

**B.Tech DSCPP-III-2026-T101**  
**PHASE-III PROJECT PROGRESS**

#### Codebase Information (2 pts)
*(Repository link, branch, and information about important commits.)*

* **GitHub Repository:** [https://github.com/parisinghal017-hue/FUNDNEXUS-Fund-Management-System.git](https://github.com/parisinghal017-hue/FUNDNEXUS-Fund-Management-System.git)  
* **Active Working Branch:** `main`  
We kept our project clean and divided into dedicated folders: `cpp_engine/` contains all our C++ headers, source files, and build.bat for compiling `engine.exe`; `backend/` holds our Python HTTP server and IPC connector; `database/` has `schema.sql` and SQLite helper scripts; `js/` and `css/` house our frontend views and styling; and `tests/` holds our automated test suites.

* **Important Phase 3 Commits:**
  * `657b0c0`: `feat(donor-portal): display active verified campaigns table and instant donation actions`
  * `79439dd`: `docs: add comprehensive project documentation, system architecture, and viva guide`
  * `06b2c46`: `test(integration): add end-to-end integration test across C++, Python, and UI`
  * `c84e36a`: `test(donation): add automated financial balance recalculation and ledger test suite`
  * `f50fb4c`: `test(rbac): add automated role-based access control and passcode verification test`
  * `ff3689e`: `style(ui): implement Warm Editorial design system, typography, and responsive grid`
  * `25aba30`: `feat(frontend): implement navigation, interactive tabs, and notification alerts`
  * `c6f16c8`: `feat(frontend): implement dynamic DOM rendering and donation checkout modal`

---

#### Testing and Validation Status (2 pts)
*(Provide information about any tests conducted)*

| Test Type | Status | Notes |
| :--- | :---: | :--- |
| **Role-Based Access Control (RBAC)** | **Pass** | Tested passcode login for Admin (`9010`), role switching between all 4 tabs, and button restrictions. |
| **Balance Integrity & Recalculation** | **Pass** | Tested formula: *Balance = Donations − Approved Expenses*; verified unapproved bills do not deduct. |
| **C++ Linked List Ledger** | **Pass** | Appended 15 test transactions and traversed forward/backward; confirmed 0 memory leaks in destructor. |
| **C++ FIFO Audit Queue** | **Pass** | Queued 5 mock medical bills and dequeued them in exact order of submission for admin review. |
| **Jaccard Text Similarity Detector** | **Pass** | Tested with duplicate titles ('Help Flood Victims'); correctly flagged 78% similarity and warned the user. |
| **Subprocess IPC Pipe Bridge** | **Pass** | Sent test JSON payloads from Python to `engine.exe` and verified output was returned within 15ms. |
| **Frontend Modals & 80G Receipt** | **Pass** | Tested card and UPI donation checkout; verified donor details and PAN populate on the generated 80G receipt. |
| **Cross-Device Browser Testing** | **Pass** | Tested on laptops (Chrome/Edge) and mobile phones (Android Chrome); modals and tables resize cleanly. |
| **End-to-End System Integration** | **Pass** | Automated integration script booted server, queried database, and hit C++ endpoints with 100% pass rate. |

---

#### Deliverables Progress (2 pts)
*(Summarize the current status of all key project deliverables mentioned earlier. Indicate whether each deliverable is completed, in progress, or pending.)*

All key project deliverables for FundNexus are 100% finished and tested:

• **C++ Core DSA Engine:** **Completed (100%)** — Custom Linked List, FIFO queue, Jaccard similarity detector, and risk analyzer compiled into `engine.exe`.  
• **Python REST Server & IPC Bridge:** **Completed (100%)** — Lightweight multithreaded backend handling REST routes and C++ subprocess calls.  
• **SQLite Database & 3NF Schema:** **Completed (100%)** — Fully normalized relational database with foreign keys and atomic transaction support.  
• **4-Tier Web Application:** **Completed (100%)** — Interactive single-page application with Guest, Donor, Fundraiser, and Admin dashboards.  
• **Proof Upload & Verification Modals:** **Completed (100%)** — Expense submission forms, receipt image lightboxes, and admin approval buttons.  
• **80G Tax Exemption Receipts:** **Completed (100%)** — Automatic tax receipt generation with donor name, PAN, and transaction ID.  
• **Automated Test Suites:** **Completed (100%)** — Unit, financial integrity, and end-to-end integration tests fully verified.  
• **Technical Documentation:** **Completed (100%)** — GitHub repository README, system architecture guide, and viva manual.  

**Overall Project Completion Rate: 100%.** Every single planned deliverable is finished, tested, and ready for evaluation.

---
*Page 5*
