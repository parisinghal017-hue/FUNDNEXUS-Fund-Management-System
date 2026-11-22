#ifndef RISKANALYZER_H
#define RISKANALYZER_H

#include <string>
#include <vector>
#include <iostream>

using namespace std;

// Advanced Multi-Factor Anti-Fraud & Risk Scoring Module
class RiskAnalyzer {
public:
    struct RiskReport {
        int riskScore;
        string riskLevel;
        vector<string> reasons;
        bool gstinValid;
        bool panValid;
        bool velocityAnomaly;
    };

    // Indian GSTIN (Goods & Services Tax Identification Number) Checksum Algorithm (Mod 36)
    static bool validateGSTIN(const string& gstin);

    // Indian PAN (Permanent Account Number) Format Validator
    static bool validatePAN(const string& pan);

    // Smurfing / Micro-Donation Velocity Anomaly Detection
    static bool detectSmurfingAnomaly(int transactionCount, double totalInflow, double hoursElapsed);

    // Comprehensive Risk Assessment
    static RiskReport evaluateCampaign(const string& title, const string& desc, double target, bool isVerified, const string& gstin = "", const string& pan = "");
};

#endif // RISKANALYZER_H
