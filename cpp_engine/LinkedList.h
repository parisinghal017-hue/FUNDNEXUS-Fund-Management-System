#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include "Transaction.h"
#include <string>
#include <iostream>
#include <vector>

using namespace std;

// struct node { Transaction data; struct node *next; };
struct TransactionNode {
    Transaction data;
    TransactionNode* next;

    TransactionNode(const Transaction& tx) : data(tx), next(nullptr) {}
};

// Cryptographically Verified Singly Linked List (Hash-Chained Audit Ledger)
class TransactionLedgerList {
private:
    TransactionNode* head;
    TransactionNode* tail;
    int count;
    double totalFunds;

public:
    TransactionLedgerList();
    ~TransactionLedgerList();

    // Core Linked List operations 
    void insertAtBegin(Transaction tx);
    void insertAtEnd(Transaction tx);
    void insertAfterKey(const string& keyTxnId, Transaction tx);
    
    int getCount() const;
    double getTotalFunds() const;
    bool isEmpty() const;
    string getLastHash() const;

    // Cryptographic Blockchain-like Verification
    bool verifyChainIntegrity(string& outBrokenTxnId, string& outReason, int& outIndex) const;
    string computeMerkleRoot() const;

    // Tamper Demonstration Operations
    bool simulateTamper(int nodeIndex, double newAmount);
    void restoreChain();

    // Display & Serialization
    void displayLedger() const;
    void exportJSON() const;
};

#endif // LINKEDLIST_H
