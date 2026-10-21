/**
 * ============================================================================
 * FUND NEXUS — MODULAR C++ CORE ENGINE
 * Graphic Era (Deemed to be University) | Team ID: DSCPP-III-2026-T101
 * 
 * Modular Components:
 *   - User.h / User.cpp                 -> OOP Hierarchy (Polymorphism)
 *   - Transaction.h / Transaction.cpp   -> Transaction Entity
 *   - LinkedList.h / LinkedList.cpp     -> Singly Linked List Ledger
 *   - Queue.h / Queue.cpp               -> FIFO Pending Admin Audit Queue
 *   - Campaign.h / Campaign.cpp         -> Campaign Balance Engine
 *   - RiskAnalyzer.h / RiskAnalyzer.cpp -> Rule-Based Risk Scoring
 *   - SimilarityDetector.h / .cpp       -> Duplicate Text Similarity
 * ============================================================================
 */

#include "User.h"
#include "Transaction.h"
#include "LinkedList.h"
#include "Queue.h"
#include "Campaign.h"
#include "RiskAnalyzer.h"
#include "SimilarityDetector.h"

#include <iostream>
#include <iomanip>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    // 1. Initialize Singly Linked List Ledger
    TransactionLedgerList ledger;
    ledger.insertAtEnd(Transaction("TXN-782104", "CMP-101", "Margaret Sharma", 5000.0, "2026-10-14 11:20", "Confirmed"));
    ledger.insertAtEnd(Transaction("TXN-654129", "CMP-102", "Aarav Patel", 2500.0, "2026-10-15 14:45", "Confirmed"));
    ledger.insertAtEnd(Transaction("TXN-910482", "CMP-103", "Pari Singhal", 1500.0, "2026-10-16 09:12", "Confirmed"));
    ledger.insertAtEnd(Transaction("TXN-342890", "CMP-104", "Yashasvi Sharma", 3000.0, "2026-10-17 16:30", "Confirmed"));
    ledger.insertAtEnd(Transaction("TXN-419820", "CMP-105", "Rohan & Sneha Joshi", 7500.0, "2026-10-19 14:10", "Confirmed"));

    // 2. Initialize Core Campaign
    Campaign c1("CMP-101", "Solar Water Filtration for Rural Hill Schools", "Education", 150000.0, 95000.0);
    c1.addExpense("EXP-101", "Dual Solar Inverter & Battery Pack", 15000.0, "2026-09-12", "verified", "Invoice #2901");
    c1.addExpense("EXP-102", "Commercial RO Membrane", 10000.0, "2026-09-28", "verified", "Bill #DB-8812");
    c1.addExpense("EXP-103", "Plumbing Fittings", 10000.0, "2026-10-04", "evidence_submitted", "Challan #440");

    // 3. Initialize FIFO Audit Review Queue
    AuditReviewQueue auditQueue;
    auditQueue.enqueue(ReviewTask("TSK-01", "CMP-101", "Plumbing Mountain Logistics", 10000.0, "Challan #440", "2026-10-04"));
    auditQueue.enqueue(ReviewTask("TSK-02", "CMP-102", "Snow Chains & Fuel Allowance", 13000.0, "Fuel Receipts #88", "2026-10-05"));
    auditQueue.enqueue(ReviewTask("TSK-03", "CMP-104", "Protective Beekeeper Suits", 8000.0, "Handwritten Memo", "2026-10-08"));
    auditQueue.enqueue(ReviewTask("TSK-04", "CMP-105", "Pediatric Antibiotics & IV Consumables", 25000.0, "Pharmacy Tax Invoice #PH-7714", "2026-10-18"));

    // CLI Flag Dispatch for Backend Communication & Viva Demos
    if (argc > 1) {
        string flag = argv[1];
        if (flag == "--json-ledger") {
            ledger.exportJSON();
            return 0;
        } else if (flag == "--check-similarity" && argc >= 4) {
            string titleA = argv[2];
            string titleB = argv[3];
            double sim = SimilarityDetector::computeSimilarity(titleA, titleB);
            cout << "{\"title_a\":\"" << titleA << "\",\"title_b\":\"" << titleB 
                 << "\",\"similarity_score\":" << fixed << setprecision(3) << sim 
                 << ",\"duplicate_flag\":" << (sim >= 0.65 ? "true" : "false") << "}" << endl;
            return 0;
        } else if (flag == "--risk-eval" && argc >= 4) {
            string title = argv[2];
            double target = atof(argv[3]);
            auto report = RiskAnalyzer::evaluateCampaign(title, "Quick submission description", target, true);
            cout << "{\"title\":\"" << title << "\",\"target\":" << target 
                 << ",\"risk_score\":" << report.riskScore 
                 << ",\"risk_level\":\"" << report.riskLevel << "\"}" << endl;
            return 0;
        }
    }

    // Default Academic Evaluation Console Output (For Viva & Presentation)
    cout << "================================================================\n";
    cout << "  FUND NEXUS MODULAR C++ ENGINE — DSA & OOP EVALUATION DEMO     \n";
    cout << "  Graphic Era (Deemed to be University) | Team: DSCPP-III-2026 \n";
    cout << "================================================================\n";

    // A. OOP Polymorphism
    cout << "\n[1] OBJECT-ORIENTED PROGRAMMING: USER INHERITANCE & POLYMORPHISM\n";
    Donor donor("DNR-101", "Pari Singhal", "pari.singhal@geu.ac.in");
    donor.addContribution(12500.0);
    donor.displayProfile();

    Fundraiser fundraiser("FND-202", "Divyanka Kumari", "divyanka.kumari@geu.ac.in", "Uttarakhand Seva Samiti", true);
    fundraiser.displayProfile();

    Admin admin("ADM-001", "Prof. Auditor", "evaluator@geu.ac.in");
    admin.recordAudit();
    admin.displayProfile();

    // B. Data Structure 1: Singly Linked List Ledger
    cout << "\n[2] DATA STRUCTURE 1: IMMUTABLE SINGLY LINKED LIST LEDGER\n";
    ledger.displayLedger();

    // C. Data Structure 2: FIFO Queue
    cout << "\n[3] DATA STRUCTURE 2: FIFO ADMINISTRATIVE REVIEW QUEUE\n";
    auditQueue.displayQueue();

    cout << "\n-> Demonstrating Dequeue (First-In, First-Out Action by Admin):\n";
    ReviewTask processedTask("","","",0,"","");
    if (auditQueue.dequeue(processedTask)) {
        cout << "   Successfully processed task [" << processedTask.taskId << "]: " 
             << processedTask.claimTitle << " (Rs. " << processedTask.amount << ")\n";
    }
    cout << "   Remaining tasks in queue: " << auditQueue.size() << "\n";

    // D. Financial Balance Calculation
    cout << "\n[4] STRICT FINANCIAL BALANCE CALCULATION:\n";
    c1.displayFinancialSummary();

    // E. Duplicate Text Similarity Algorithm
    cout << "\n[5] ALGORITHM 1: DUPLICATE SIMILARITY DETECTION (Jaccard Token):\n";
    string textA = "Solar Water Filtration for Rural Hill Schools";
    string textB = "Rural Hill Schools Solar Water Filtration System";
    double similarity = SimilarityDetector::computeSimilarity(textA, textB);
    cout << "   Text A: " << textA << "\n";
    cout << "   Text B: " << textB << "\n";
    cout << "   Jaccard Overlap: " << fixed << setprecision(1) << (similarity * 100.0) << "%\n";
    cout << "   Flagged as Duplicate: " << (SimilarityDetector::isDuplicate(textA, textB) ? "YES (Flagged)" : "NO") << "\n";

    // F. Rule-Based Risk Scoring Algorithm
    cout << "\n[6] ALGORITHM 2: RULE-BASED RISK FLAGGING ENGINE:\n";
    auto riskReport = RiskAnalyzer::evaluateCampaign("Urgent Emergency Medical Help Needed", "Too short", 750000.0, false);
    cout << "   Risk Score: " << riskReport.riskScore << "/100 [" << riskReport.riskLevel << "]\n";
    for (const auto& reason : riskReport.reasons) {
        cout << "   - " << reason << "\n";
    }

    cout << "\n================================================================\n";
    cout << "  ALL MODULAR C++ DSA & OOP COMPONENTS EXECUTED CLEANLY!       \n";
    cout << "================================================================\n";

    return 0;
}
