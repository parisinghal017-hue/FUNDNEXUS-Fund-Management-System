#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include "Transaction.h"
#include <string>
#include <iostream>

using namespace std;

// Node structure matching student's class notebook
// struct node { Transaction data; struct node *next; };
struct TransactionNode {
    Transaction data;
    TransactionNode* next;

    TransactionNode(const Transaction& tx) : data(tx), next(nullptr) {}
};

// Singly Linked List for the Immutable Transaction Ledger
class TransactionLedgerList {
private:
    TransactionNode* head;
    int count;
    double totalFunds;

public:
    TransactionLedgerList();
    ~TransactionLedgerList();

    // Core Linked List operations as taught in 3rd Semester Data Structures
    void insertAtBegin(const Transaction& tx);
    void insertAtEnd(const Transaction& tx);
    void insertAfterKey(const string& keyTxnId, const Transaction& tx);
    
    int getCount() const;
    double getTotalFunds() const;
    bool isEmpty() const;

    void displayLedger() const;
    void exportJSON() const;
};

#endif // LINKEDLIST_H
