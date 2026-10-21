@echo off
echo Compiling Fund Nexus Modular C++ Engine...
g++ -O2 -std=c++11 main.cpp User.cpp Transaction.cpp LinkedList.cpp Queue.cpp Campaign.cpp RiskAnalyzer.cpp SimilarityDetector.cpp -o engine.exe
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] engine.exe compiled successfully!
) else (
    echo [ERROR] Compilation failed.
)
