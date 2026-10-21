#include "Queue.h"
#include <iomanip>

AuditReviewQueue::AuditReviewQueue()
    : front(nullptr), rear(nullptr), queueSize(0) {}

AuditReviewQueue::~AuditReviewQueue() {
    ReviewTask temp("","","",0,"","");
    while (!isEmpty()) {
        dequeue(temp);
    }
}

// Enqueue at rear (O(1))
void AuditReviewQueue::enqueue(const ReviewTask& task) {
    ReviewTaskNode* newNode = new ReviewTaskNode(task);
    if (rear == nullptr) {
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
    queueSize++;
}

// Dequeue from front (O(1) - FIFO)
bool AuditReviewQueue::dequeue(ReviewTask& poppedTask) {
    if (isEmpty()) return false;

    ReviewTaskNode* temp = front;
    poppedTask = front->task;
    front = front->next;

    if (front == nullptr) {
        rear = nullptr;
    }

    delete temp;
    queueSize--;
    return true;
}

bool AuditReviewQueue::peek(ReviewTask& frontTask) const {
    if (isEmpty()) return false;
    frontTask = front->task;
    return true;
}

bool AuditReviewQueue::isEmpty() const {
    return front == nullptr;
}

int AuditReviewQueue::size() const {
    return queueSize;
}

void AuditReviewQueue::displayQueue() const {
    cout << "\n=======================================================\n";
    cout << "   FIFO PENDING AUDIT QUEUE (First-In, First-Out)      \n";
    cout << "=======================================================\n";
    if (isEmpty()) {
        cout << "No pending audit tasks in queue.\n";
        return;
    }

    ReviewTaskNode* curr = front;
    int pos = 1;
    while (curr != nullptr) {
        cout << "Queue Position #" << pos++ << " -> [" << curr->task.taskId << "] "
             << curr->task.claimTitle << " (Rs. " << fixed << setprecision(2) << curr->task.amount 
             << ") | Campaign: " << curr->task.campaignId 
             << " | Evidence: " << curr->task.evidenceDoc << "\n";
        curr = curr->next;
    }
    cout << "Total Tasks Awaiting Admin Action: " << queueSize << "\n";
    cout << "=======================================================\n";
}
