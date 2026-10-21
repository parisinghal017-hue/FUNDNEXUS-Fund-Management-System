#ifndef CAMPAIGN_H
#define CAMPAIGN_H

#include <string>
#include <vector>
#include <iostream>

using namespace std;

struct ExpenseRecord {
    string id;
    string title;
    double amount;
    string date;
    string status; // "reported", "evidence_submitted", "verified", "rejected"
    string evidenceDoc;
};

// Campaign Class (Encapsulating Financial Ledger & Audited Balances)
class Campaign {
private:
    string campaignId;
    string title;
    string category;
    double targetAmount;
    double collectedAmount;
    double verifiedExpenses;
    double reportedExpenses;
    vector<ExpenseRecord> expenses;

public:
    Campaign(string id, string t, string cat, double target, double collected = 0.0);

    string getId() const;
    string getTitle() const;
    string getCategory() const;
    double getTarget() const;
    double getCollected() const;
    double getVerifiedExpenses() const;
    double getReportedExpenses() const;

    void addDonation(double amt);
    void addExpense(string expId, string title, double amt, string date, string status, string evidence);
    void verifyExpense(string expId, bool approve);

    // Core Project Formula:
    // Recorded Remaining Balance = Recorded Donations - Admin-Verified Expenses
    double getRecordedRemainingBalance() const;
    double getFundingProgressPercentage() const;

    void displayFinancialSummary() const;
};

#endif // CAMPAIGN_H
