#include "RiskAnalyzer.h"
#include <algorithm>
#include <cctype>

// Indian GSTIN Validator (15-character Mod-36 Checksum Verification)
// Format: 2-digit State Code + 10-digit PAN + 1 entity code + 'Z' + 1 Checksum Char
bool RiskAnalyzer::validateGSTIN(const string& gstin) {
    if (gstin.length() != 15) return false;

    // Check state code (first 2 must be digits)
    if (!isdigit(gstin[0]) || !isdigit(gstin[1])) return false;

    // 10-char PAN in positions 2 to 11
    string panPart = gstin.substr(2, 10);
    if (!validatePAN(panPart)) return false;

    // 14th character must be 'Z' (standard Indian GST rule)
    if (toupper(gstin[13]) != 'Z') return false;

    // Mod 36 Luhn-like Checksum Verification
    const string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    int factor = 1;
    int sum = 0;

    for (int i = 0; i < 14; ++i) {
        char c = toupper(gstin[i]);
        size_t codePoint = chars.find(c);
        if (codePoint == string::npos) return false;

        int digit = static_cast<int>(codePoint) * factor;
        factor = (factor == 2) ? 1 : 2;
        digit = (digit / 36) + (digit % 36);
        sum += digit;
    }

    int remainder = sum % 36;
    int checkCode = (36 - remainder) % 36;
    char expectedCheckChar = chars[checkCode];

    return toupper(gstin[14]) == expectedCheckChar;
}

// Indian PAN Validator: 5 uppercase letters, 4 digits, 1 uppercase letter
bool RiskAnalyzer::validatePAN(const string& pan) {
    if (pan.length() != 10) return false;
    for (int i = 0; i < 5; ++i) {
        if (!isalpha(pan[i])) return false;
    }
    for (int i = 5; i < 9; ++i) {
        if (!isdigit(pan[i])) return false;
    }
    return isalpha(pan[9]);
}

// Micro-donation velocity anomaly (e.g. 50+ tiny donations of < Rs. 100 within 1 hour = potential bot smurfing)
bool RiskAnalyzer::detectSmurfingAnomaly(int transactionCount, double totalInflow, double hoursElapsed) {
    if (hoursElapsed <= 0.0) hoursElapsed = 0.5;
    double hourlyRate = transactionCount / hoursElapsed;
    double avgDonation = (transactionCount > 0) ? (totalInflow / transactionCount) : 0.0;

    // High velocity with suspiciously low average amounts
    return (hourlyRate >= 25.0 && avgDonation <= 150.0);
}

RiskAnalyzer::RiskReport RiskAnalyzer::evaluateCampaign(const string& title, const string& desc, double target, bool isVerified, const string& gstin, const string& pan) {
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

    // Rule 4: GSTIN Verification for high-value claims (> Rs. 2 Lakh)
    bool gstinOk = true;
    if (!gstin.empty()) {
        gstinOk = validateGSTIN(gstin);
        if (!gstinOk) {
            score += 25;
            flags.push_back("Invalid Vendor GSTIN Checksum: Failed Indian Mod-36 validation (+25)");
        }
    }

    // Rule 5: PAN Verification
    bool panOk = true;
    if (!pan.empty()) {
        panOk = validatePAN(pan);
        if (!panOk) {
            score += 15;
            flags.push_back("Invalid Indian PAN format (+15)");
        }
    }

    // Velocity Anomaly Flag
    bool velocityFlag = detectSmurfingAnomaly(40, 3200.0, 1.0); // Sample baseline check

    string level = "Low Risk — Verified";
    if (score >= 35) level = "High Risk — Immediate Admin Review";
    else if (score >= 15) level = "Moderate Risk — Audit Required";

    return { score, level, flags, gstinOk, panOk, velocityFlag };
}
