#include "LinkedList.h"
#include <iomanip>
#include <vector>

TransactionLedgerList::TransactionLedgerList()
    : head(nullptr), tail(nullptr), count(0), totalFunds(0.0) {}

TransactionLedgerList::~TransactionLedgerList() {
    TransactionNode* curr = head;
    while (curr != nullptr) {
        TransactionNode* temp = curr;
        curr = curr->next;
        delete temp;
    }
}

string TransactionLedgerList::getLastHash() const {
    if (tail != nullptr) {
        return tail->data.getBlockHash();
    }
    return "0x0000000000000000"; // Genesis anchor
}

// Insert at beginning: O(1) time complexity (Requires chain re-anchoring)
void TransactionLedgerList::insertAtBegin(Transaction tx) {
    tx.setPreviousHash("0x0000000000000000");
    TransactionNode* newNode = new TransactionNode(tx);
    newNode->next = head;
    head = newNode;
    if (tail == nullptr) tail = newNode;
    count++;
    totalFunds += tx.getAmount();

    // Re-anchor subsequent node if exists
    if (newNode->next != nullptr) {
        newNode->next->data.setPreviousHash(newNode->data.getBlockHash());
    }
}

// Insert at end: O(1) with tail pointer (maintains chronological sequence & cryptographic hash chain)
void TransactionLedgerList::insertAtEnd(Transaction tx) {
    string prev = getLastHash();
    tx.setPreviousHash(prev);
    TransactionNode* newNode = new TransactionNode(tx);

    if (head == nullptr) {
        head = newNode;
        tail = newNode;
    } else {
        tail->next = newNode;
        tail = newNode;
    }
    count++;
    totalFunds += tx.getAmount();
}

// Insert after a specific transaction key 
void TransactionLedgerList::insertAfterKey(const string& keyTxnId, Transaction tx) {
    TransactionNode* curr = head;
    while (curr != nullptr && curr->data.getId() != keyTxnId) {
        curr = curr->next;
    }
    if (curr != nullptr) {
        tx.setPreviousHash(curr->data.getBlockHash());
        TransactionNode* newNode = new TransactionNode(tx);
        newNode->next = curr->next;
        curr->next = newNode;
        if (curr == tail) tail = newNode;
        count++;
        totalFunds += tx.getAmount();

        // Re-anchor next node's previousHash
        if (newNode->next != nullptr) {
            newNode->next->data.setPreviousHash(newNode->data.getBlockHash());
        }
    }
}

int TransactionLedgerList::getCount() const { return count; }
double TransactionLedgerList::getTotalFunds() const { return totalFunds; }
bool TransactionLedgerList::isEmpty() const { return head == nullptr; }

// Verify Cryptographic Hash Chain Integrity
bool TransactionLedgerList::verifyChainIntegrity(string& outBrokenTxnId, string& outReason, int& outIndex) const {
    if (head == nullptr) return true;

    TransactionNode* curr = head;
    string expectedPrevHash = "0x0000000000000000";
    int idx = 1;

    while (curr != nullptr) {
        // 1. Check link to previous hash
        if (curr->data.getPreviousHash() != expectedPrevHash) {
            outBrokenTxnId = curr->data.getId();
            outIndex = idx;
            outReason = "Broken chain pointer! Node previousHash (" + curr->data.getPreviousHash().substr(0, 10) + 
                        "...) does not match actual preceding block hash (" + expectedPrevHash.substr(0, 10) + "...)";
            return false;
        }

        // 2. Check internal block integrity (recalculate hash from node fields)
        string recalculated = curr->data.calculateHash();
        if (recalculated != curr->data.getBlockHash()) {
            outBrokenTxnId = curr->data.getId();
            outIndex = idx;
            outReason = "Tampered transaction payload! Recalculated hash (" + recalculated.substr(0, 10) + 
                        "...) does not match stored block hash (" + curr->data.getBlockHash().substr(0, 10) + "...)";
            return false;
        }

        expectedPrevHash = curr->data.getBlockHash();
        curr = curr->next;
        idx++;
    }

    outBrokenTxnId = "";
    outReason = "All blocks cryptographically valid. Zero tampering detected.";
    outIndex = 0;
    return true;
}

// Compute Merkle Root of all transactions
string TransactionLedgerList::computeMerkleRoot() const {
    if (head == nullptr) return "0x0000000000000000";

    vector<string> currentLevel;
    TransactionNode* curr = head;
    while (curr != nullptr) {
        currentLevel.push_back(curr->data.getBlockHash());
        curr = curr->next;
    }

    // Build Merkle Tree upwards
    while (currentLevel.size() > 1) {
        vector<string> nextLevel;
        for (size_t i = 0; i < currentLevel.size(); i += 2) {
            if (i + 1 < currentLevel.size()) {
                nextLevel.push_back(Transaction::hashString(currentLevel[i] + "+" + currentLevel[i + 1]));
            } else {
                // Odd count: hash with itself
                nextLevel.push_back(Transaction::hashString(currentLevel[i] + "+" + currentLevel[i]));
            }
        }
        currentLevel = nextLevel;
    }

    return currentLevel[0];
}

// Simulate unauthorized tampering on a specific node (for live evaluation & viva demo)
bool TransactionLedgerList::simulateTamper(int nodeIndex, double newAmount) {
    if (nodeIndex <= 0 || nodeIndex > count) return false;

    TransactionNode* curr = head;
    int idx = 1;
    while (curr != nullptr && idx < nodeIndex) {
        curr = curr->next;
        idx++;
    }

    if (curr != nullptr) {
        curr->data.setAmount(newAmount); // Modifies amount WITHOUT updating hash
        return true;
    }
    return false;
}

// Re-anchor and restore legitimate cryptographic hashes
void TransactionLedgerList::restoreChain() {
    TransactionNode* curr = head;
    string prev = "0x0000000000000000";

    totalFunds = 0.0;
    while (curr != nullptr) {
        curr->data.setPreviousHash(prev);
        curr->data.recomputeHash();
        totalFunds += curr->data.getAmount();
        prev = curr->data.getBlockHash();
        curr = curr->next;
    }
}

void TransactionLedgerList::displayLedger() const {
    cout << "\n=======================================================\n";
    cout << "  CRYPTOGRAPHIC AUDIT LEDGER (Hash-Chained Singly List)\n";
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
    cout << "Merkle Root Hash:             " << computeMerkleRoot() << "\n";
    
    string brokenId, reason;
    int bIdx;
    bool isValid = verifyChainIntegrity(brokenId, reason, bIdx);
    cout << "Cryptographic Verification:   " << (isValid ? "[PASS] 100% SECURE & VERIFIED" : "[FAIL] CORRUPTED AT NODE " + to_string(bIdx)) << "\n";
    cout << "=======================================================\n";
}

void TransactionLedgerList::exportJSON() const {
    string brokenId, reason;
    int brokenIdx;
    bool isValid = verifyChainIntegrity(brokenId, reason, brokenIdx);
    string merkleRoot = computeMerkleRoot();

    cout << "{\"status\":\"ok\",\"total_records\":" << count 
         << ",\"total_amount\":" << totalFunds 
         << ",\"is_chain_valid\":" << (isValid ? "true" : "false")
         << ",\"merkle_root\":\"" << merkleRoot << "\""
         << ",\"tamper_info\":{\"broken_index\":" << brokenIdx << ",\"broken_id\":\"" << brokenId << "\",\"reason\":\"" << reason << "\"}"
         << ",\"transactions\":[";
         
    TransactionNode* curr = head;
    bool first = true;
    while (curr != nullptr) {
        if (!first) cout << ",";
        cout << "{\"id\":\"" << curr->data.getId() << "\",\"campaign\":\"" << curr->data.getCampaignId() 
             << "\",\"donor\":\"" << curr->data.getDonorName() << "\",\"amount\":" << curr->data.getAmount() 
             << ",\"time\":\"" << curr->data.getTimestamp() << "\",\"status\":\"" << curr->data.getStatus() << "\""
             << ",\"previous_hash\":\"" << curr->data.getPreviousHash() << "\""
             << ",\"block_hash\":\"" << curr->data.getBlockHash() << "\""
             << ",\"is_valid\":" << (curr->data.calculateHash() == curr->data.getBlockHash() ? "true" : "false") << "}";
        first = false;
        curr = curr->next;
    }
    cout << "]}" << endl;
}
