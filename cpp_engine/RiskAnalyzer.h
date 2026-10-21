#ifndef RISKANALYZER_H
#define RISKANALYZER_H

#include <string>
#include <vector>
#include <iostream>

using namespace std;

// Rule-Based Risk Scoring Module
class RiskAnalyzer {
public:
    struct RiskReport {
        int riskScore;
        string riskLevel;
        vector<string> reasons;
    };

    static RiskReport evaluateCampaign(const string& title, const string& desc, double target, bool isVerified);
};

#endif // RISKANALYZER_H
