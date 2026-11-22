#ifndef PRIORITYQUEUE_H
#define PRIORITYQUEUE_H

#include <string>
#include <vector>
#include <iostream>
#include <iomanip>

using namespace std;

// Priority Task for Triage Auditing
struct PriorityAuditTask {
    string taskId;
    string campaignId;
    string claimTitle;
    double amount;
    string evidenceDoc;
    string category;      // e.g., "Healthcare", "Disaster", "Education", "Community"
    int urgencyLevel;     // 1 = Routine, 2 = High, 3 = Critical / Life-Saving
    int daysWaiting;
    double priorityScore; // Dynamically computed

    PriorityAuditTask(string tId, string cId, string title, double amt, string evidence, string cat, int urgency, int days = 1);

    void computePriorityScore();
    void display() const;
};

// Max-Heap Priority Queue Implementation for Emergency Audit Scheduling
class PriorityAuditQueue {
private:
    vector<PriorityAuditTask> heap;

    void heapifyUp(int index);
    void heapifyDown(int index);

public:
    PriorityAuditQueue();

    void push(const PriorityAuditTask& task);
    bool pop(PriorityAuditTask& topTask);
    bool peek(PriorityAuditTask& topTask) const;

    bool isEmpty() const;
    int size() const;
    void displayQueue() const;
    void exportJSON() const;
};

#endif // PRIORITYQUEUE_H
