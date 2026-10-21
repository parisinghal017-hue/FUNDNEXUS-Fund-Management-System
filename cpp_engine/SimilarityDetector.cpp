#include "SimilarityDetector.h"
#include <sstream>
#include <algorithm>

set<string> SimilarityDetector::tokenize(const string& str) {
    set<string> tokens;
    stringstream ss(str);
    string word;
    while (ss >> word) {
        string clean = "";
        for (char c : word) {
            if (isalnum(c)) clean += tolower(c);
        }
        if (clean.length() > 2) {
            tokens.insert(clean);
        }
    }
    return tokens;
}

double SimilarityDetector::computeSimilarity(const string& textA, const string& textB) {
    set<string> setA = tokenize(textA);
    set<string> setB = tokenize(textB);

    if (setA.empty() || setB.empty()) return 0.0;

    vector<string> intersection;
    set_intersection(setA.begin(), setA.end(), setB.begin(), setB.end(), back_inserter(intersection));

    vector<string> unionSet;
    set_union(setA.begin(), setA.end(), setB.begin(), setB.end(), back_inserter(unionSet));

    if (unionSet.empty()) return 0.0;
    return (double)intersection.size() / (double)unionSet.size();
}

bool SimilarityDetector::isDuplicate(const string& textA, const string& textB, double threshold) {
    return computeSimilarity(textA, textB) >= threshold;
}
