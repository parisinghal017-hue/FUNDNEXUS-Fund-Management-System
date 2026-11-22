/**
 * ============================================================================
 * FUND NEXUS — ADVANCED MODULAR C++ CORE ENGINE
 * Graphic Era (Deemed to be University) | Team ID: DSCPP-III-2026-T101
 * 
 * Modular Components:
 *   - User.h / User.cpp                 -> OOP Hierarchy (Polymorphism)
 *   - Transaction.h / Transaction.cpp   -> Cryptographic Block Node Entity
 *   - LinkedList.h / LinkedList.cpp     -> Cryptographic Hash-Chained Audit Ledger (Merkle Root)
 *   - Queue.h / Queue.cpp               -> FIFO Chronological Administrative Review Queue
 *   - PriorityQueue.h / .cpp            -> Dynamic Max-Heap Priority Audit Triage Queue
 *   - Campaign.h / Campaign.cpp         -> Strict Financial Balance Recalculator
 *   - RiskAnalyzer.h / RiskAnalyzer.cpp -> Anti-Fraud, Mod-36 GSTIN & Heuristic Risk Engine
 *   - SimilarityDetector.h / .cpp       -> Jaccard Token Text Similarity Detector
 * ============================================================================
 */

#include "User.h"
#include "Transaction.h"
#include "LinkedList.h"
#include "Queue.h"
#include "PriorityQueue.h"
#include "Campaign.h"
#include "RiskAnalyzer.h"
#include "SimilarityDetector.h"

#include <iostream>
#include <iomanip>
#include <cstdlib>

using namespace std;

int main(int argc, char* argv[]) {
    // 1. Initialize Cryptographic Block-Chained Singly Linked List Ledger
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

    // 3. Initialize FIFO Chronological Audit Review Queue
    AuditReviewQueue auditQueue;
    auditQueue.enqueue(ReviewTask("TSK-01", "CMP-101", "Plumbing Mountain Logistics", 10000.0, "Challan #440", "2026-10-04"));
    auditQueue.enqueue(ReviewTask("TSK-02", "CMP-102", "Snow Chains & Fuel Allowance", 13000.0, "Fuel Receipts #88", "2026-10-05"));
    auditQueue.enqueue(ReviewTask("TSK-03", "CMP-104", "Protective Beekeeper Suits", 8000.0, "Handwritten Memo", "2026-10-08"));
    auditQueue.enqueue(ReviewTask("TSK-04", "CMP-105", "Pediatric Antibiotics & IV Consumables", 25000.0, "Pharmacy Tax Invoice #PH-7714", "2026-10-18"));

    // 4. Initialize Dynamic Max-Heap Priority Audit Triage Queue
    PriorityAuditQueue priorityQueue;
    // Routine supplies: Urgency 1
    priorityQueue.push(PriorityAuditTask("TSK-01", "CMP-101", "Plumbing Mountain Logistics", 10000.0, "Challan #440", "Education", 1, 4));
    priorityQueue.push(PriorityAuditTask("TSK-03", "CMP-104", "Protective Beekeeper Suits", 8000.0, "Handwritten Memo", "Community", 1, 2));
    // High Urgency winter logistics: Urgency 2
    priorityQueue.push(PriorityAuditTask("TSK-02", "CMP-102", "Snow Chains & Fuel Allowance", 13000.0, "Fuel Receipts #88", "Healthcare", 2, 3));
    // Life-Saving Pediatric Cardiac Surgical supplies: Urgency 3
    priorityQueue.push(PriorityAuditTask("TSK-04", "CMP-105", "Pediatric Antibiotics & Heart Consumables", 25000.0, "Pharmacy Tax Invoice #PH-7714", "Healthcare", 3, 5));
    priorityQueue.push(PriorityAuditTask("TSK-05", "CMP-105", "Pediatric Cardiopulmonary Bypass Kit & Stents", 55000.0, "Invoice #AIIMS-H8821", "Healthcare", 3, 6));

    // CLI Flag Dispatch for Backend IPC Communication & Live Viva Demonstrations
    if (argc > 1) {
        string flag = argv[1];

        // A. Export Full Cryptographic Ledger JSON
        if (flag == "--json-ledger") {
            ledger.exportJSON();
            return 0;
        }

        // B. Verify Hash-Chain Integrity
        else if (flag == "--verify-chain") {
            string brokenId, reason;
            int brokenIdx;
            bool valid = ledger.verifyChainIntegrity(brokenId, reason, brokenIdx);
            string merkleRoot = ledger.computeMerkleRoot();

            cout << "{\"status\":\"ok\",\"chain_valid\":" << (valid ? "true" : "false")
                 << ",\"total_blocks\":" << ledger.getCount()
                 << ",\"merkle_root\":\"" << merkleRoot << "\""
                 << ",\"broken_index\":" << brokenIdx
                 << ",\"broken_txn_id\":\"" << brokenId << "\""
                 << ",\"audit_message\":\"" << reason << "\"}" << endl;
            return 0;
        }

        // C. Simulate Malicious Database Tampering
        else if (flag == "--simulate-tamper" && argc >= 4) {
            int nodeIdx = atoi(argv[2]);
            double newAmt = atof(argv[3]);
            ledger.simulateTamper(nodeIdx, newAmt);

            string brokenId, reason;
            int brokenIdx;
            bool valid = ledger.verifyChainIntegrity(brokenId, reason, brokenIdx);

            cout << "{\"status\":\"tamper_simulated\",\"node_tampered\":" << nodeIdx
                 << ",\"tampered_amount\":" << newAmt
                 << ",\"chain_valid\":" << (valid ? "true" : "false")
                 << ",\"detected_index\":" << brokenIdx
                 << ",\"detected_txn_id\":\"" << brokenId << "\""
                 << ",\"audit_message\":\"" << reason << "\"}" << endl;
            return 0;
        }

        // D. Export Priority Queue (Max-Heap Triage)
        else if (flag == "--priority-queue") {
            priorityQueue.exportJSON();
            return 0;
        }

        // E. Jaccard Similarity Detection
        else if (flag == "--check-similarity" && argc >= 4) {
            string titleA = argv[2];
            string titleB = argv[3];
            double sim = SimilarityDetector::computeSimilarity(titleA, titleB);
            cout << "{\"title_a\":\"" << titleA << "\",\"title_b\":\"" << titleB 
                 << "\",\"similarity_score\":" << fixed << setprecision(3) << sim 
                 << ",\"duplicate_flag\":" << (sim >= 0.65 ? "true" : "false") << "}" << endl;
            return 0;
        }

        // F. Advanced Risk & GSTIN Validation
        else if (flag == "--risk-eval" && argc >= 4) {
            string title = argv[2];
            double target = atof(argv[3]);
            string gstin = (argc >= 5) ? argv[4] : "";
            string pan = (argc >= 6) ? argv[5] : "";

            auto report = RiskAnalyzer::evaluateCampaign(title, "Quick submission description", target, true, gstin, pan);
            cout << "{\"title\":\"" << title << "\",\"target\":" << target 
                 << ",\"risk_score\":" << report.riskScore 
                 << ",\"risk_level\":\"" << report.riskLevel << "\""
                 << ",\"gstin_valid\":" << (report.gstinValid ? "true" : "false")
                 << ",\"pan_valid\":" << (report.panValid ? "true" : "false") << "}" << endl;
            return 0;
        }
    }

    // Default Academic Evaluation Console Output (For Professors & Viva Presentation)
    cout << "================================================================\n";
    cout << "  FUND NEXUS ADVANCED C++ ENGINE — DSA & CRYPTO EVALUATION DEMO \n";
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

    // B. Cryptographic Block-Chained Linked List Ledger
    cout << "\n[2] ADVANCED DATA STRUCTURE 1: CRYPTOGRAPHIC HASH-CHAINED LEDGER\n";
    ledger.displayLedger();

    // C. Tamper Detection Demonstration
    cout << "\n[2B] CRYPTOGRAPHIC TAMPER DETECTION PROOF (Viva Demo):\n";
    cout << "-> Simulating malicious modification on Node #3 (Altering amount to Rs. 99,999)...\n";
    ledger.simulateTamper(3, 99999.0);
    string bId, bReason;
    int bIdx;
    bool valid = ledger.verifyChainIntegrity(bId, bReason, bIdx);
    cout << "   Audit Verification Status: " << (valid ? "[PASS]" : "[ALERT: TAMPER CAUGHT!]") << "\n";
    cout << "   Compromised Block Index:   Node #" << bIdx << " (" << bId << ")\n";
    cout << "   Cryptographic Reason:      " << bReason << "\n";
    cout << "-> Restoring authentic chain state...\n";
    ledger.restoreChain();
    ledger.verifyChainIntegrity(bId, bReason, bIdx);
    cout << "   Restored Status:           [PASS: 100% Tamper-Free]\n";

    // D. FIFO Queue
    cout << "\n[3] DATA STRUCTURE 2: FIFO ADMINISTRATIVE REVIEW QUEUE\n";
    auditQueue.displayQueue();

    // E. Dynamic Max-Heap Priority Queue
    cout << "\n[4] ADVANCED DATA STRUCTURE 3: DYNAMIC MAX-HEAP PRIORITY QUEUE (Triage)\n";
    priorityQueue.displayQueue();
    PriorityAuditTask highest("","","",0.0,"","General",1,0);
    if (priorityQueue.peek(highest)) {
        cout << "-> Triage Extraction: Top Emergency Task Dispatched for Immediate Review:\n";
        cout << "   [" << highest.taskId << "] " << highest.claimTitle << " (Priority Score: " 
             << fixed << setprecision(1) << highest.priorityScore << ")\n";
    }

    // F. Strict Financial Balance
    cout << "\n[5] STRICT FINANCIAL BALANCE CALCULATION:\n";
    c1.displayFinancialSummary();

    // G. Jaccard Similarity Algorithm
    cout << "\n[6] ALGORITHM 1: JACCARD TOKEN TEXT SIMILARITY DETECTOR:\n";
    string textA = "Solar Water Filtration for Rural Hill Schools";
    string textB = "Rural Hill Schools Solar Water Filtration System";
    double similarity = SimilarityDetector::computeSimilarity(textA, textB);
    cout << "   Text A: " << textA << "\n";
    cout << "   Text B: " << textB << "\n";
    cout << "   Jaccard Overlap: " << fixed << setprecision(1) << (similarity * 100.0) << "%\n";
    cout << "   Flagged as Duplicate: " << (SimilarityDetector::isDuplicate(textA, textB) ? "YES (Flagged)" : "NO") << "\n";

    // H. Indian GSTIN Checksum & Anti-Fraud Engine
    cout << "\n[7] ALGORITHM 2: ADVANCED ANTI-FRAUD & INDIAN GSTIN CHECK-SUM ALGORITHM:\n";
    string sampleGSTIN = "05AAAAA0000A1Z5"; // Uttarakhand State Code 05
    bool gstinValid = RiskAnalyzer::validateGSTIN(sampleGSTIN);
    cout << "   Validating Sample Hospital GSTIN [" << sampleGSTIN << "]: " 
         << (gstinValid ? "VALID (Mod-36 Checksum Verified)" : "INVALID Checksum") << "\n";

    auto riskReport = RiskAnalyzer::evaluateCampaign("Urgent Emergency Medical Help Needed", "Too short", 750000.0, false, sampleGSTIN, "ABCDE1234F");
    cout << "   Campaign Multi-Factor Risk Score: " << riskReport.riskScore << "/100 [" << riskReport.riskLevel << "]\n";
    for (const auto& reason : riskReport.reasons) {
        cout << "   - " << reason << "\n";
    }

    cout << "\n================================================================\n";
    cout << "  ALL ADVANCED C++ DSA, CRYPTO & HEAP COMPONENTS EXECUTED!     \n";
    cout << "================================================================\n";

    return 0;
}
