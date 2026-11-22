@echo off
echo Compiling Fund Nexus Advanced Modular C++ Engine...
C:\MinGW\bin\g++.exe -O2 -std=c++11 main.cpp User.cpp Transaction.cpp LinkedList.cpp Queue.cpp PriorityQueue.cpp Campaign.cpp RiskAnalyzer.cpp SimilarityDetector.cpp -o engine.exe
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Advanced engine.exe compiled successfully!
) else (
    echo [ERROR] Compilation failed.
)
