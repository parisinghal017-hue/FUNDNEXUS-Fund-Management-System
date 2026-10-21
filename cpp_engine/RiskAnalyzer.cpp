#include "RiskAnalyzer.h"
#include <algorithm>

RiskAnalyzer::RiskReport RiskAnalyzer::evaluateCampaign(const string& title, const string& desc, double target, bool isVerified) {
    int score = 0;
    vector<string> flags;

    // Rule 1: Insufficient description (+20)
    if (desc.length() < 30) {
        score += 20;
        flags.push_back("Insufficient or very brief purpose description (+20)");
    }

    // Rule 2: High target without verified organizer credential (+15)
    if (target > 500000.0 && !isVerified) {
        score += 15;
        flags.push_back("High funding target (> Rs. 5 Lakh) from unverified organizer (+15)");
    }

    // Rule 3: Extreme urgency keyword pairing (+10)
    string lowerTitle = title;
    transform(lowerTitle.begin(), lowerTitle.end(), lowerTitle.begin(), ::tolower);
    if (lowerTitle.find("urgent") != string::npos && lowerTitle.find("help") != string::npos && target > 200000.0) {
        score += 10;
        flags.push_back("Urgent financial demand keyword combination (+10)");
    }

    string level = "Low Risk — Verified";
    if (score >= 35) level = "High Risk — Immediate Admin Review";
    else if (score >= 15) level = "Moderate Risk — Audit Required";

    return { score, level, flags };
}
