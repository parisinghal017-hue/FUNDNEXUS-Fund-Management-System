#ifndef SIMILARITYDETECTOR_H
#define SIMILARITYDETECTOR_H

#include <string>
#include <set>
#include <vector>

using namespace std;

// String & Campaign Similarity Algorithm for Duplicate Detection
class SimilarityDetector {
private:
    static set<string> tokenize(const string& str);

public:
    // Computes Jaccard Token Overlap: |A ∩ B| / |A ∪ B|
    static double computeSimilarity(const string& textA, const string& textB);
    static bool isDuplicate(const string& textA, const string& textB, double threshold = 0.65);
};

#endif // SIMILARITYDETECTOR_H
