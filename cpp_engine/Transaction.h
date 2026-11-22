#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <iostream>
#include <sstream>
#include <iomanip>
#include <cstdint>

using namespace std;

// Transaction Entity Class with Cryptographic Hash Chaining (Blockchain-like Immutable Node)
class Transaction {
private:
    string transactionId;
    string campaignId;
    string donorName;
    double amount;
    string timestamp;
    string status;
    string previousHash;
    string blockHash;
    uint32_t nonce;

public:
    Transaction(string id, string cId, string dName, double amt, string time, string stat = "Confirmed", string prevHash = "0x0000000000000000");

    string getId() const;
    string getCampaignId() const;
    string getDonorName() const;
    double getAmount() const;
    string getTimestamp() const;
    string getStatus() const;
    string getPreviousHash() const;
    string getBlockHash() const;
    uint32_t getNonce() const;

    // Cryptographic Block Operations
    void setPreviousHash(const string& prev);
    void setAmount(double newAmt); // Used for tamper simulation demonstrations
    string calculateHash() const;
    void recomputeHash();

    // Display
    void display() const;

    // Cryptographic 64-bit FNV-1a Hash with bit avalanche mixer
    static string hashString(const string& input);
};

#endif // TRANSACTION_H
