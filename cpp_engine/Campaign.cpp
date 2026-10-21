#include "Campaign.h"
#include <iomanip>
#include <algorithm>

Campaign::Campaign(string id, string t, string cat, double target, double collected)
    : campaignId(id), title(t), category(cat), targetAmount(target),
      collectedAmount(collected), verifiedExpenses(0.0), reportedExpenses(0.0) {}

string Campaign::getId() const { return campaignId; }
string Campaign::getTitle() const { return title; }
string Campaign::getCategory() const { return category; }
double Campaign::getTarget() const { return targetAmount; }
double Campaign::getCollected() const { return collectedAmount; }
double Campaign::getVerifiedExpenses() const { return verifiedExpenses; }
double Campaign::getReportedExpenses() const { return reportedExpenses; }

void Campaign::addDonation(double amt) {
    if (amt > 0) {
        collectedAmount += amt;
    }
}

void Campaign::addExpense(string expId, string title, double amt, string date, string status, string evidence) {
    ExpenseRecord exp = { expId, title, amt, date, status, evidence };
    expenses.push_back(exp);
    reportedExpenses += amt;
    if (status == "verified") {
        verifiedExpenses += amt;
    }
}

void Campaign::verifyExpense(string expId, bool approve) {
    for (auto& exp : expenses) {
        if (exp.id == expId) {
            if (approve && exp.status != "verified") {
                exp.status = "verified";
                verifiedExpenses += exp.amount;
            } else if (!approve && exp.status == "verified") {
                verifiedExpenses -= exp.amount;
                exp.status = "rejected";
            }
            break;
        }
    }
}

double Campaign::getRecordedRemainingBalance() const {
    return collectedAmount - verifiedExpenses;
}

double Campaign::getFundingProgressPercentage() const {
    if (targetAmount <= 0) return 0.0;
    return min(100.0, (collectedAmount / targetAmount) * 100.0);
}

void Campaign::displayFinancialSummary() const {
    cout << "\n-------------------------------------------------------\n";
    cout << "CAMPAIGN: " << title << " [" << campaignId << "]\n";
    cout << "Target Goal:               Rs. " << fixed << setprecision(2) << targetAmount << "\n";
    cout << "Total Recorded Donations:  Rs. " << collectedAmount << " (" << getFundingProgressPercentage() << "% funded)\n";
    cout << "Self-Reported Expenses:    Rs. " << reportedExpenses << "\n";
    cout << "Admin-Verified Expenses:   Rs. " << verifiedExpenses << "\n";
    cout << "RECORDED REMAINING BALANCE:Rs. " << getRecordedRemainingBalance() << "\n";
    cout << "-------------------------------------------------------\n";
}
