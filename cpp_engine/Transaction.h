#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <iostream>

using namespace std;

// Transaction Entity Class (Models a verified simulated donation)
class Transaction {
private:
    string transactionId;
    string campaignId;
    string donorName;
    double amount;
    string timestamp;
    string status;

public:
    Transaction(string id, string cId, string dName, double amt, string time, string stat = "Confirmed");

    string getId() const;
    string getCampaignId() const;
    string getDonorName() const;
    double getAmount() const;
    string getTimestamp() const;
    string getStatus() const;

    void display() const;
};

#endif // TRANSACTION_H
