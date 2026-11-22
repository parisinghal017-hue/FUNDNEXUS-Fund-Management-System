#include "Transaction.h"

string Transaction::hashString(const string& input) {
    uint64_t hash = 14695981039346656037ULL; // 64-bit FNV offset basis
    for (char c : input) {
        hash ^= static_cast<uint64_t>(c);
        hash *= 1099511628211ULL; // 64-bit FNV prime
    }
    // Avalanche mixer
    hash ^= hash >> 33;
    hash *= 0xff51afd7ed558ccdULL;
    hash ^= hash >> 33;
    hash *= 0xc4ceb9fe1a85ec53ULL;
    hash ^= hash >> 33;

    stringstream ss;
    ss << hex << setfill('0') << setw(16) << uppercase << hash;
    return "0x" + ss.str();
}

Transaction::Transaction(string id, string cId, string dName, double amt, string time, string stat, string prevHash)
    : transactionId(id), campaignId(cId), donorName(dName), amount(amt), timestamp(time), status(stat),
      previousHash(prevHash), nonce(101) {
    blockHash = calculateHash();
}

string Transaction::getId() const { return transactionId; }
string Transaction::getCampaignId() const { return campaignId; }
string Transaction::getDonorName() const { return donorName; }
double Transaction::getAmount() const { return amount; }
string Transaction::getTimestamp() const { return timestamp; }
string Transaction::getStatus() const { return status; }
string Transaction::getPreviousHash() const { return previousHash; }
string Transaction::getBlockHash() const { return blockHash; }
uint32_t Transaction::getNonce() const { return nonce; }

void Transaction::setPreviousHash(const string& prev) {
    previousHash = prev;
    blockHash = calculateHash();
}

void Transaction::setAmount(double newAmt) {
    amount = newAmt;
    // Deliberately do NOT update blockHash to allow tamper-detection demonstrations
}

string Transaction::calculateHash() const {
    stringstream ss;
    ss << previousHash << ":" << transactionId << ":" << campaignId << ":" 
       << donorName << ":" << fixed << setprecision(2) << amount << ":" 
       << timestamp << ":" << nonce;
    return hashString(ss.str());
}

void Transaction::recomputeHash() {
    blockHash = calculateHash();
}

void Transaction::display() const {
    cout << "[" << timestamp << "] " << transactionId << " | " << donorName 
         << " -> Rs. " << fixed << setprecision(2) << amount 
         << " (" << status << ") [Campaign: " << campaignId << "]\n"
         << "       [PrevHash: " << previousHash.substr(0, 10) << "... | Hash: " << blockHash.substr(0, 10) << "...]" << endl;
}
