#include "LinkedList.h"
#include <iomanip>

TransactionLedgerList::TransactionLedgerList()
    : head(nullptr), count(0), totalFunds(0.0) {}

TransactionLedgerList::~TransactionLedgerList() {
    TransactionNode* curr = head;
    while (curr != nullptr) {
        TransactionNode* temp = curr;
        curr = curr->next;
        delete temp;
    }
}

// Insert at beginning: O(1) time complexity
void TransactionLedgerList::insertAtBegin(const Transaction& tx) {
    TransactionNode* newNode = new TransactionNode(tx);
    newNode->next = head;
    head = newNode;
    count++;
    totalFunds += tx.getAmount();
}

// Insert at end: O(n) time complexity (maintains chronological sequence)
void TransactionLedgerList::insertAtEnd(const Transaction& tx) {
    TransactionNode* newNode = new TransactionNode(tx);
    if (head == nullptr) {
        head = newNode;
    } else {
        TransactionNode* curr = head;
        while (curr->next != nullptr) {
            curr = curr->next;
        }
        curr->next = newNode;
    }
    count++;
    totalFunds += tx.getAmount();
}

// Insert after a specific transaction key (demonstrating notebook's insertafterk)
void TransactionLedgerList::insertAfterKey(const string& keyTxnId, const Transaction& tx) {
    TransactionNode* curr = head;
    while (curr != nullptr && curr->data.getId() != keyTxnId) {
        curr = curr->next;
    }
    if (curr != nullptr) {
        TransactionNode* newNode = new TransactionNode(tx);
        newNode->next = curr->next;
        curr->next = newNode;
        count++;
        totalFunds += tx.getAmount();
    }
}

int TransactionLedgerList::getCount() const { return count; }
double TransactionLedgerList::getTotalFunds() const { return totalFunds; }
bool TransactionLedgerList::isEmpty() const { return head == nullptr; }

void TransactionLedgerList::displayLedger() const {
    cout << "\n=======================================================\n";
    cout << "   IMMUTABLE AUDIT LEDGER (Singly Linked List Chain)   \n";
    cout << "=======================================================\n";
    if (head == nullptr) {
        cout << "Ledger is currently empty.\n";
        return;
    }
    TransactionNode* curr = head;
    int index = 1;
    while (curr != nullptr) {
        cout << "#" << index++ << " ";
        curr->data.display();
        curr = curr->next;
    }
    cout << "-------------------------------------------------------\n";
    cout << "Total Ledger Recorded Inflow: Rs. " << fixed << setprecision(2) << totalFunds << "\n";
    cout << "Total Transaction Nodes:      " << count << "\n";
    cout << "=======================================================\n";
}

void TransactionLedgerList::exportJSON() const {
    cout << "{\"status\":\"ok\",\"total_records\":" << count 
         << ",\"total_amount\":" << totalFunds << ",\"transactions\":[";
    TransactionNode* curr = head;
    bool first = true;
    while (curr != nullptr) {
        if (!first) cout << ",";
        cout << "{\"id\":\"" << curr->data.getId() << "\",\"campaign\":\"" << curr->data.getCampaignId() 
             << "\",\"donor\":\"" << curr->data.getDonorName() << "\",\"amount\":" << curr->data.getAmount() 
             << ",\"time\":\"" << curr->data.getTimestamp() << "\",\"status\":\"" << curr->data.getStatus() << "\"}";
        first = false;
        curr = curr->next;
    }
    cout << "]}" << endl;
}
