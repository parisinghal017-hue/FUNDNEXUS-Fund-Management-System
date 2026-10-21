#ifndef QUEUE_H
#define QUEUE_H

#include <string>
#include <iostream>

using namespace std;

// Review Task Node for FIFO processing
struct ReviewTask {
    string taskId;
    string campaignId;
    string claimTitle;
    double amount;
    string evidenceDoc;
    string timestamp;

    ReviewTask(string tId, string cId, string title, double amt, string evidence, string time)
        : taskId(tId), campaignId(cId), claimTitle(title), amount(amt), evidenceDoc(evidence), timestamp(time) {}
};

struct ReviewTaskNode {
    ReviewTask task;
    ReviewTaskNode* next;

    ReviewTaskNode(const ReviewTask& t) : task(t), next(nullptr) {}
};

// Custom FIFO Queue for Pending Administrative Audits (Data Structures Requirement)
class AuditReviewQueue {
private:
    ReviewTaskNode* front;
    ReviewTaskNode* rear;
    int queueSize;

public:
    AuditReviewQueue();
    ~AuditReviewQueue();

    // Core Queue Operations (FIFO)
    void enqueue(const ReviewTask& task); // Enqueue at rear (O(1))
    bool dequeue(ReviewTask& poppedTask); // Dequeue from front (O(1))
    bool peek(ReviewTask& frontTask) const;
    
    bool isEmpty() const;
    int size() const;
    void displayQueue() const;
};

#endif // QUEUE_H
