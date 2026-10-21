#include "Transaction.h"
#include <iomanip>

Transaction::Transaction(string id, string cId, string dName, double amt, string time, string stat)
    : transactionId(id), campaignId(cId), donorName(dName), amount(amt), timestamp(time), status(stat) {}

string Transaction::getId() const { return transactionId; }
string Transaction::getCampaignId() const { return campaignId; }
string Transaction::getDonorName() const { return donorName; }
double Transaction::getAmount() const { return amount; }
string Transaction::getTimestamp() const { return timestamp; }
string Transaction::getStatus() const { return status; }

void Transaction::display() const {
    cout << "[" << timestamp << "] " << transactionId << " | " << donorName 
         << " -> Rs. " << fixed << setprecision(2) << amount 
         << " (" << status << ") [Campaign: " << campaignId << "]" << endl;
}
