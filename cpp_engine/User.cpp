#include "User.h"

// User Implementation
User::User(string id, string n, string e, string role)
    : userId(id), name(n), email(e), roleName(role) {}

User::~User() {}

string User::getId() const { return userId; }
string User::getName() const { return name; }
string User::getEmail() const { return email; }
string User::getRole() const { return roleName; }

void User::displayProfile() const {
    cout << "[" << roleName << "] " << name << " (" << email << ") ID: " << userId << endl;
}

// Donor Implementation
Donor::Donor(string id, string n, string e)
    : User(id, n, e, "Donor"), totalContributed(0.0) {}

void Donor::addContribution(double amt) {
    if (amt > 0) totalContributed += amt;
}

double Donor::getTotalContributed() const {
    return totalContributed;
}

void Donor::displayProfile() const {
    cout << "[Donor Profile] " << name << " (" << email << ") | Total Contributed: Rs. " << totalContributed << endl;
}

// Fundraiser Implementation
Fundraiser::Fundraiser(string id, string n, string e, string org, bool verified)
    : User(id, n, e, "Fundraiser"), organizationName(org), isTrustVerified(verified) {}

string Fundraiser::getOrg() const { return organizationName; }
bool Fundraiser::getVerifiedStatus() const { return isTrustVerified; }

void Fundraiser::displayProfile() const {
    cout << "[Fundraiser Profile] " << name << " | Organization: " << organizationName 
         << " | Trust Verified: " << (isTrustVerified ? "YES" : "NO") << endl;
}

// Admin Implementation
Admin::Admin(string id, string n, string e)
    : User(id, n, e, "Admin"), auditsCompleted(0) {}

void Admin::recordAudit() {
    auditsCompleted++;
}

int Admin::getAuditsCompleted() const {
    return auditsCompleted;
}

void Admin::displayProfile() const {
    cout << "[Admin Auditor Profile] " << name << " | Audits Conducted: " << auditsCompleted << endl;
}
