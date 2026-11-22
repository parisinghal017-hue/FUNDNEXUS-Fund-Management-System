#include "PriorityQueue.h"
#include <algorithm>

PriorityAuditTask::PriorityAuditTask(string tId, string cId, string title, double amt, string evidence, string cat, int urgency, int days)
    : taskId(tId), campaignId(cId), claimTitle(title), amount(amt), evidenceDoc(evidence), category(cat), urgencyLevel(urgency), daysWaiting(days) {
    computePriorityScore();
}

void PriorityAuditTask::computePriorityScore() {
    // Dynamic Triage Formula:
    // Urgency weight: 40 points per level (1=40, 2=80, 3=120)
    // Category factor: Healthcare & Disaster receive bonus urgency
    double catBonus = 0.0;
    if (category == "Healthcare" || category == "healthcare") catBonus = 25.0;
    else if (category == "Disaster" || category == "disaster") catBonus = 20.0;
    else if (category == "Education" || category == "education") catBonus = 10.0;

    // Amount weight: high financial exposure warrants faster review (up to 30 pts)
    double amtWeight = min(30.0, (amount / 5000.0) * 5.0);

    // Aging factor: prevent starvation for older claims (3 pts per day waiting)
    double agingWeight = daysWaiting * 3.5;

    priorityScore = (urgencyLevel * 35.0) + catBonus + amtWeight + agingWeight;
}

void PriorityAuditTask::display() const {
    string urgencyTag = "ROUTINE";
    if (urgencyLevel == 3) urgencyTag = "CRITICAL / LIFE-SAVING";
    else if (urgencyLevel == 2) urgencyTag = "URGENT";

    cout << "[" << taskId << "] " << claimTitle << " | Rs. " << fixed << setprecision(2) << amount 
         << " | Cat: " << category << " | Urgency: " << urgencyTag 
         << " | Priority Score: " << setprecision(1) << priorityScore 
         << " (Awaiting: " << daysWaiting << " days)" << endl;
}

// ==================== MAX-HEAP PRIORITY QUEUE ====================

PriorityAuditQueue::PriorityAuditQueue() {}

void PriorityAuditQueue::heapifyUp(int index) {
    while (index > 0) {
        int parent = (index - 1) / 2;
        if (heap[index].priorityScore > heap[parent].priorityScore) {
            swap(heap[index], heap[parent]);
            index = parent;
        } else {
            break;
        }
    }
}

void PriorityAuditQueue::heapifyDown(int index) {
    int n = heap.size();
    while (true) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int largest = index;

        if (left < n && heap[left].priorityScore > heap[largest].priorityScore) {
            largest = left;
        }
        if (right < n && heap[right].priorityScore > heap[largest].priorityScore) {
            largest = right;
        }

        if (largest != index) {
            swap(heap[index], heap[largest]);
            index = largest;
        } else {
            break;
        }
    }
}

void PriorityAuditQueue::push(const PriorityAuditTask& task) {
    heap.push_back(task);
    heapifyUp(heap.size() - 1);
}

bool PriorityAuditQueue::pop(PriorityAuditTask& topTask) {
    if (heap.empty()) return false;

    topTask = heap[0];
    heap[0] = heap.back();
    heap.pop_back();

    if (!heap.empty()) {
        heapifyDown(0);
    }
    return true;
}

bool PriorityAuditQueue::peek(PriorityAuditTask& topTask) const {
    if (heap.empty()) return false;
    topTask = heap[0];
    return true;
}

bool PriorityAuditQueue::isEmpty() const { return heap.empty(); }
int PriorityAuditQueue::size() const { return heap.size(); }

void PriorityAuditQueue::displayQueue() const {
    cout << "\n=======================================================\n";
    cout << "  EMERGENCY AUDIT TRIAGE (Dynamic Max-Heap Priority)   \n";
    cout << "=======================================================\n";
    if (heap.empty()) {
        cout << "Priority queue is empty.\n";
        return;
    }

    // Copy heap to sort and display in decreasing priority order
    vector<PriorityAuditTask> temp = heap;
    sort(temp.begin(), temp.end(), [](const PriorityAuditTask& a, const PriorityAuditTask& b) {
        return a.priorityScore > b.priorityScore;
    });

    int rank = 1;
    for (const auto& task : temp) {
        cout << "Priority Rank #" << rank++ << " -> ";
        task.display();
    }
    cout << "-------------------------------------------------------\n";
    cout << "Total High-Priority Tasks in Triage Queue: " << heap.size() << "\n";
    cout << "=======================================================\n";
}

void PriorityAuditQueue::exportJSON() const {
    vector<PriorityAuditTask> temp = heap;
    sort(temp.begin(), temp.end(), [](const PriorityAuditTask& a, const PriorityAuditTask& b) {
        return a.priorityScore > b.priorityScore;
    });

    cout << "{\"status\":\"ok\",\"total_tasks\":" << temp.size() << ",\"priority_tasks\":[";
    bool first = true;
    for (const auto& t : temp) {
        if (!first) cout << ",";
        cout << "{\"task_id\":\"" << t.taskId << "\",\"campaign_id\":\"" << t.campaignId 
             << "\",\"title\":\"" << t.claimTitle << "\",\"amount\":" << t.amount 
             << ",\"category\":\"" << t.category << "\",\"urgency_level\":" << t.urgencyLevel 
             << ",\"days_waiting\":" << t.daysWaiting << ",\"priority_score\":" << fixed << setprecision(1) << t.priorityScore 
             << ",\"evidence\":\"" << t.evidenceDoc << "\"}";
        first = false;
    }
    cout << "]}" << endl;
}
