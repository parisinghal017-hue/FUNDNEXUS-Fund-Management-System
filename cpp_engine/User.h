#ifndef USER_H
#define USER_H

#include <string>
#include <iostream>

using namespace std;

// Base User Class (Demonstrating Abstraction & Base Entity)
class User {
protected:
    string userId;
    string name;
    string email;
    string roleName;

public:
    User(string id, string n, string e, string role);
    virtual ~User();

    string getId() const;
    string getName() const;
    string getEmail() const;
    string getRole() const;

    virtual void displayProfile() const; // Virtual function for polymorphism
};

// Derived Class: Donor (Inheritance)
class Donor : public User {
private:
    double totalContributed;

public:
    Donor(string id, string n, string e);
    void addContribution(double amt);
    double getTotalContributed() const;
    void displayProfile() const override;
};

// Derived Class: Fundraiser (Inheritance)
class Fundraiser : public User {
private:
    string organizationName;
    bool isTrustVerified;

public:
    Fundraiser(string id, string n, string e, string org, bool verified = true);
    string getOrg() const;
    bool getVerifiedStatus() const;
    void displayProfile() const override;
};

// Derived Class: Admin Auditor (Inheritance)
class Admin : public User {
private:
    int auditsCompleted;

public:
    Admin(string id, string n, string e);
    void recordAudit();
    int getAuditsCompleted() const;
    void displayProfile() const override;
};

#endif // USER_H
