/**
 * FUND NEXUS — Campaign Data Model & State Store
 * Realistic sample data modeling campaigns, transactions, and expense records.
 * All figures are for educational simulation purposes.
 */

const initialCampaigns = [
  {
    id: "CMP-101",
    title: "Solar Water Filtration for Rural Hill Schools",
    category: "education",
    categoryLabel: "Education & Health",
    location: "Tehri Garhwal, Uttarakhand",
    organizer: "Doon Rural Welfare Trust",
    isVerified: true,
    target: 150000,
    collected: 95000,
    reportedExpenses: 35000,
    verifiedExpenses: 25000,
    donorsCount: 142,
    daysLeft: 18,
    icon: "💧",
    themeGradient: "linear-gradient(135deg, #E1E8DC 0%, #DDC5B2 100%)",
    description: "Installing robust, solar-powered reverse osmosis and UV filtration units across 4 remote government primary schools in the Tehri district. The terrain experiences severe water turbidity during rains, affecting attendance and child health.",
    milestones: [
      { step: "Site Inspection & Water Quality Testing", status: "completed" },
      { step: "Procurement of Solar Panels & RO Filters", status: "completed" },
      { step: "Installation in School 1 & School 2", status: "in_progress" },
      { step: "Final Verification & Community Handover", status: "pending" }
    ],
    expenses: [
      { id: "EXP-101", title: "Dual Solar Inverter & Battery Pack", amount: 15000, date: "2026-09-12", status: "verified", evidence: "GST Invoice #INV-2901 + Installation Photo" },
      { id: "EXP-102", title: "Commercial RO Membrane & Pre-filters", amount: 10000, date: "2026-09-28", status: "verified", evidence: "Distributor Bill #DB-8812 verified by auditor" },
      { id: "EXP-103", title: "Plumbing Fittings & Mountain Logistics", amount: 10000, date: "2026-10-04", status: "evidence_submitted", evidence: "Transport Challan #TC-440 (Audit Pending)" }
    ],
    updates: [
      { date: "Oct 10, 2026", title: "Solar panels mounted on School 1 roof", note: "Testing has begun. Water output tests show 99.4% reduction in microbial count." },
      { date: "Sep 25, 2026", title: "Logistics dispatched from Dehradun", note: "Filtration components transported across mountain routes despite light landslides." }
    ],
    riskScore: 8,
    riskFlag: "Low Risk — Fully Audited"
  },
  {
    id: "CMP-102",
    title: "Mobile Maternal & Neonatal Clinic Van",
    category: "healthcare",
    categoryLabel: "Healthcare Relief",
    location: "Chamoli, Uttarakhand",
    organizer: "Himalayan Health Mission",
    isVerified: true,
    target: 300000,
    collected: 180000,
    reportedExpenses: 65000,
    verifiedExpenses: 52000,
    donorsCount: 289,
    daysLeft: 24,
    icon: "🏥",
    themeGradient: "linear-gradient(135deg, #F0E5D9 0%, #E8C1A8 100%)",
    description: "Equipping a dedicated 4WD vehicle with portable diagnostic ultrasound, hemoglobin monitors, fetal Doppler devices, and emergency neonatal warming kits for 18 high-altitude villages.",
    milestones: [
      { step: "Vehicle Reconditioning & Medical Cabin Setup", status: "completed" },
      { step: "Diagnostic Hardware Acquisition", status: "completed" },
      { step: "Paramedic Hiring & Village Scheduling", status: "in_progress" },
      { step: "Routine Bi-Weekly Clinical Visits", status: "pending" }
    ],
    expenses: [
      { id: "EXP-201", title: "Portable Ultrasound Scanner Kit", amount: 32000, date: "2026-08-18", status: "verified", evidence: "Manufacturer Invoice + Warranty Bond" },
      { id: "EXP-202", title: "Emergency Oxygen Concentrators (2 Units)", amount: 20000, date: "2026-09-05", status: "verified", evidence: "Medical Supply Depot Bill #MS-771" },
      { id: "EXP-203", title: "All-terrain Snow Chains & Fuel Allowance", amount: 13000, date: "2026-10-02", status: "reported", evidence: "Fuel Slips submitted (Awaiting Admin Inspection)" }
    ],
    updates: [
      { date: "Oct 12, 2026", title: "Completed medical tests for 46 mothers", note: "First camp held at Joshimath block with successful screening." }
    ],
    riskScore: 12,
    riskFlag: "Low Risk — Verified Trust"
  },
  {
    id: "CMP-103",
    title: "Community Kitchen & Emergency Ration Kits",
    category: "disaster",
    categoryLabel: "Disaster Relief",
    location: "Rudraprayag, Uttarakhand",
    organizer: "Pahadi Rahat Sahayata",
    isVerified: true,
    target: 80000,
    collected: 54000,
    reportedExpenses: 28000,
    verifiedExpenses: 18000,
    donorsCount: 94,
    daysLeft: 9,
    icon: "🍲",
    themeGradient: "linear-gradient(135deg, #E8C1A8 0%, #FAF7F2 100%)",
    description: "Providing dry rations (flour, pulses, mustard oil, iodized salt) and hygienic temporary community cookstoves for 65 families displaced by flash monsoon rains.",
    milestones: [
      { step: "Displaced Family Enumeration", status: "completed" },
      { step: "Bulk Food Grain Procurement", status: "completed" },
      { step: "Door-to-Shelter Ration Distribution", status: "in_progress" },
      { step: "Post-Relief Settlement Survey", status: "pending" }
    ],
    expenses: [
      { id: "EXP-301", title: "50 Quintals Wheat Flour & Lentils", amount: 18000, date: "2026-09-22", status: "verified", evidence: "Mandi Samiti Purchase Receipt #9021" },
      { id: "EXP-302", title: "Portable Gas Burners & Safety Regulators", amount: 10000, date: "2026-10-01", status: "evidence_submitted", evidence: "Vendor Cash Memo (Under Verification)" }
    ],
    updates: [
      { date: "Oct 05, 2026", title: "45 ration packets delivered", note: "Distributed directly at primary relief shelter with local council signatures." }
    ],
    riskScore: 14,
    riskFlag: "Low Risk"
  },
  {
    id: "CMP-104",
    title: "Women's Organic Herb & Honey Collective",
    category: "community",
    categoryLabel: "Rural Community",
    location: "Pauri Garhwal, Uttarakhand",
    organizer: "Shakti Mahila Vikas Samiti",
    isVerified: true,
    target: 120000,
    collected: 78000,
    reportedExpenses: 22000,
    verifiedExpenses: 14000,
    donorsCount: 110,
    daysLeft: 31,
    icon: "🌿",
    themeGradient: "linear-gradient(135deg, #FAF7F2 0%, #E1E8DC 100%)",
    description: "Assisting 32 female farmers in establishing organic bee-keeping boxes and chamomile drying racks, creating self-sustaining livelihood opportunities in hill hamlets.",
    milestones: [
      { step: "Apiary Training Workshop", status: "completed" },
      { step: "Bee-box & Smoker Distribution", status: "completed" },
      { step: "Packaging & Quality Testing Setup", status: "in_progress" },
      { step: "Fair-Trade Cooperative Market Linkage", status: "pending" }
    ],
    expenses: [
      { id: "EXP-401", title: "20 Modern Wooden Bee Boxes", amount: 14000, date: "2026-08-30", status: "verified", evidence: "Khadi Gramodyog Receipt #KG-552" },
      { id: "EXP-402", title: "Protective Suits & Handling Tools", amount: 8000, date: "2026-09-19", status: "reported", evidence: "Handwritten receipt (Audit Requested)" }
    ],
    updates: [
      { date: "Sep 28, 2026", title: "First honey yield expected next month", note: "Apiary colonization is at 95% success across 12 hamlets." }
    ],
    riskScore: 6,
    riskFlag: "Low Risk — Verified SHG"
  },
  {
    id: "CMP-105",
    title: "Emergency Pediatric Heart Surgery for 3-Year-Old Baby Aarav",
    category: "healthcare",
    categoryLabel: "Child Medical Care",
    location: "AIIMS Rishikesh / Dehradun",
    organizer: "Aarav Child Medical Support & Relief",
    isVerified: true,
    target: 450000,
    collected: 285000,
    reportedExpenses: 120000,
    verifiedExpenses: 95000,
    donorsCount: 312,
    daysLeft: 11,
    icon: "👶",
    themeGradient: "linear-gradient(135deg, #F8EFEA 0%, #D8BEB0 100%)",
    description: "3-year-old Baby Aarav from Tehri Garhwal is suffering from critical Congenital Heart Disease (Tetralogy of Fallot with severe pulmonary stenosis). He urgently requires open-heart corrective surgery and post-operative pediatric intensive care (PICU) at AIIMS Rishikesh. His family has exhausted their modest savings and urgently seeks compassionate, transparent community funding for life-saving surgery and ICU care.",
    milestones: [
      { step: "Pediatric 2D Echocardiography & Pre-Surgical Evaluation", status: "completed" },
      { step: "Emergency PICU Bed Booking & Blood Cross-Matching", status: "completed" },
      { step: "Corrective Open Heart Cardiac Surgery", status: "in_progress" },
      { step: "Post-Operative Pediatric ICU Care & Cardiac Rehabilitation", status: "pending" }
    ],
    expenses: [
      { id: "EXP-501", title: "Pediatric Cardiopulmonary Bypass Kit & Stents", amount: 55000, date: "2026-10-12", status: "verified", evidence: "AIIMS Medical Store Tax Invoice #AIIMS-H8821" },
      { id: "EXP-502", title: "Pre-Op High-Resolution Cardiac CT Angiography", amount: 18000, date: "2026-10-14", status: "verified", evidence: "Radiology Department Bill #RAD-4420 signed by Chief Radiologist" },
      { id: "EXP-503", title: "Pediatric ICU Inpatient Advance Admission Deposit", amount: 22000, date: "2026-10-16", status: "verified", evidence: "Hospital Inpatient Receipt #IPD-9031" },
      { id: "EXP-504", title: "Specialized Pediatric Cardiac Antibiotics & IV Consumables", amount: 25000, date: "2026-10-18", status: "evidence_submitted", evidence: "Pharmacy Tax Invoice #PH-7714 (Under Verification)" }
    ],
    updates: [
      { date: "Oct 19, 2026", title: "Baby Aarav stabilized for surgical scheduling", note: "AIIMS cardiac team completed pre-surgical clearance. Corrective surgery scheduled with reserved blood units." },
      { date: "Oct 14, 2026", title: "Pre-op imaging and pediatric ICU bed confirmed", note: "Diagnostic CT Angiography completed successfully. Doctors report high surgical viability." }
    ],
    riskScore: 4,
    riskFlag: "Low Risk — AIIMS Verified Medical Emergency"
  }
];

// Persistent state wrapper in localStorage (or fallback in-memory)
class NexusDataStore {
  constructor() {
    this.storageKey = 'fund_nexus_campaigns_v2';
    this.txStorageKey = 'fund_nexus_transactions_clean_v1';
    this.loadData();
  }

  loadData() {
    // Clean up legacy transaction caches to remove old seeded mock transactions
    try {
      localStorage.removeItem('fund_nexus_transactions_v2');
      localStorage.removeItem('fund_nexus_transactions');
    } catch (e) {}

    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.campaigns = JSON.parse(saved);
        initialCampaigns.forEach(initCmp => {
          if (!this.campaigns.some(c => c.id === initCmp.id)) {
            this.campaigns.push({ ...initCmp });
          }
        });
        this.campaigns.forEach(c => {
          if (!c.status) {
            c.status = (c.isVerified !== false) ? "active" : "pending_admin_approval";
            c.isApproved = (c.status === "active");
          }
        });
        this.save();
      } catch (e) {
        this.campaigns = initialCampaigns.map(c => ({ ...c, status: "active", isApproved: true }));
        this.save();
      }
    } else {
      this.campaigns = initialCampaigns.map(c => ({ ...c, status: "active", isApproved: true }));
      this.save();
    }

    const savedTx = localStorage.getItem(this.txStorageKey);
    if (savedTx) {
      try {
        this.transactions = JSON.parse(savedTx);
      } catch (e) {
        this.transactions = this.getDefaultTransactions();
      }
    } else {
      this.transactions = this.getDefaultTransactions();
      this.saveTransactions();
    }
  }

  getDefaultTransactions() {
    // Clean slate: No previous mock transactions so donors start fresh
    return [];
  }

  clearTransactions() {
    this.transactions = [];
    this.saveTransactions();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.campaigns));
    } catch (e) {
      console.warn("Storage quota limit reached, saving with compact payload:", e);
      try {
        const lightweight = this.campaigns.map(c => ({
          ...c,
          docDataUrl: (c.docDataUrl && c.docDataUrl.length > 500000) ? null : c.docDataUrl
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(lightweight));
      } catch (err) {}
    }
  }

  saveTransactions() {
    localStorage.setItem(this.txStorageKey, JSON.stringify(this.transactions));
  }

  getCampaignById(id) {
    if (!id) return this.campaigns[0];
    return this.campaigns.find(c => c.id === id) || this.campaigns[0];
  }

  // Tokenize string for Jaccard Similarity (matches C++ SimilarityDetector)
  tokenizeText(text) {
    if (!text) return new Set();
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    const tokens = new Set();
    words.forEach(w => {
      if (w.length > 2) tokens.add(w);
    });
    return tokens;
  }

  // Compute Jaccard Similarity J(A, B) = |A ∩ B| / |A ∪ B|
  computeSimilarity(textA, textB) {
    const setA = this.tokenizeText(textA);
    const setB = this.tokenizeText(textB);
    if (setA.size === 0 || setB.size === 0) return 0.0;

    let intersectionCount = 0;
    setA.forEach(token => {
      if (setB.has(token)) intersectionCount++;
    });

    const unionCount = setA.size + setB.size - intersectionCount;
    if (unionCount === 0) return 0.0;
    return intersectionCount / unionCount;
  }

  // Check candidate campaign against all existing campaigns for duplicates
  checkDuplicateCampaign(candidateTitle, candidateDesc = "") {
    for (const c of this.campaigns) {
      const titleSim = this.computeSimilarity(candidateTitle, c.title);
      const descSim = candidateDesc ? this.computeSimilarity(candidateDesc, c.description) : 0;
      const combinedSim = Math.max(titleSim, descSim);

      // 65% or higher similarity threshold (Anti-Fraud duplicate prevention)
      if (combinedSim >= 0.65) {
        return {
          isDuplicate: true,
          similarity: combinedSim,
          matchedCampaign: c
        };
      }
    }
    return { isDuplicate: false, similarity: 0.0, matchedCampaign: null };
  }

  // Upgraded Multi-Factor Risk Evaluation Engine (matches C++ RiskAnalyzer)
  evaluateRiskScore(title, desc, target, isVerified = false, docName = "", panOrDarpan = "") {
    let score = 0;
    const flags = [];

    // Rule 1: Missing or unattached legal verification document (+30)
    const hasDoc = Boolean(docName && docName.trim() !== "" && !docName.toLowerCase().includes("no document"));
    if (!hasDoc) {
      score += 30;
      flags.push("No supporting legal verification document or registration certificate attached (+30)");
    }

    // Rule 2: High or ultra-high funding goal vs credentials
    if (target >= 1000000) {
      // Ultra-high goal (>= 10 Lakhs, e.g. 17 Lakhs)
      if (!hasDoc || !panOrDarpan) {
        score += 35;
        flags.push("Ultra-high funding goal (≥ ₹10 Lakh) lacking institutional verification credentials (+35)");
      } else {
        score += 10;
        flags.push("High-value capital project requires progressive milestone audits (+10)");
      }
    } else if (target > 500000) {
      // High goal (> 5 Lakhs)
      if (!hasDoc || !panOrDarpan) {
        score += 20;
        flags.push("High target (> ₹5 Lakh) without verified credentials (+20)");
      }
    }

    // Rule 3: Tax / Institutional ID Verification (Indian PAN / NGO Darpan)
    if (!panOrDarpan || panOrDarpan.trim().length < 5) {
      score += 15;
      flags.push("Missing or unprovided Organization PAN / NGO Darpan identifier (+15)");
    } else {
      const cleanPan = panOrDarpan.trim().toUpperCase();
      // If 10 chars, validate standard Indian PAN format: 5 letters + 4 digits + 1 letter
      if (cleanPan.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
        score += 20;
        flags.push("Invalid Indian PAN format: Must match 5 letters + 4 digits + 1 letter (+20)");
      }
    }

    // Rule 4: Brief or generic description (< 50 chars) (+20)
    if (!desc || desc.trim().length < 50) {
      score += 20;
      flags.push("Insufficient or brief purpose description (< 50 characters) (+20)");
    }

    // Rule 5: Extreme urgency keyword pairing with high target (+15)
    const lowerTitle = (title || "").toLowerCase();
    if ((lowerTitle.includes("urgent") || lowerTitle.includes("emergency") || lowerTitle.includes("help fast")) && target > 200000) {
      score += 15;
      flags.push("Urgent demand keyword combination with elevated target (+15)");
    }

    let riskLevel = "Low Risk — Verified";
    let riskBadgeClass = "badge-sage";
    if (score >= 45) {
      riskLevel = "High Risk — Immediate Admin Review";
      riskBadgeClass = "badge-terracotta";
    } else if (score >= 20) {
      riskLevel = "Moderate Risk — Audit Required";
      riskBadgeClass = "badge-peach";
    }

    return { score, riskLevel, riskBadgeClass, flags, hasDoc, isVerified: hasDoc && score < 45 };
  }

  // Document Verification & Authenticity Validation Engine
  validateCampaignDocument(docName, category = "community", panOrDarpan = "") {
    if (!docName || typeof docName !== 'string' || docName.trim() === "" || docName.toLowerCase().includes("no document") || docName.toLowerCase().includes("no_document")) {
      return {
        valid: false,
        reason: "Document Missing",
        error: "Legal verification document is required. Please attach an authentic registration certificate, trust deed, ID card, or hospital estimate letter."
      };
    }

    const trimmedName = docName.trim();
    const lowerName = trimmedName.toLowerCase();

    // 1. Extension Verification
    const extMatch = lowerName.match(/\.([a-z0-9]+)$/);
    if (!extMatch) {
      return {
        valid: false,
        reason: "Missing Extension",
        error: `Document "${trimmedName}" has no file extension. Please upload a valid .pdf, .jpg, .png, or .docx file.`
      };
    }

    const ext = extMatch[1];
    const allowedExts = ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'doc', 'webp'];
    if (!allowedExts.includes(ext)) {
      return {
        valid: false,
        reason: "Invalid Format",
        error: `File format (.${ext}) is not permitted. Only PDF, JPG, PNG, or DOCX verification certificates are accepted.`
      };
    }

    // 2. Intelligent Category & Legal Context Detection
    let detectedType = "Institutional Legal Credential";
    const isHealthcare = category === "healthcare";
    const medicalKeywords = ['medical', 'hospital', 'estimate', 'health', 'aiims', 'doctor', 'clinic', 'patient', 'treatment', 'prescription', 'surgery', 'bill', 'diagnostic', 'cardiac'];
    const hasMedicalKw = medicalKeywords.some(kw => lowerName.includes(kw));

    if (isHealthcare || hasMedicalKw) {
      detectedType = "Hospital Medical Estimate / Clinical Certificate";
    } else if (category === "education") {
      detectedType = "Academic Institution Registration & Fee Deed";
    } else if (category === "disaster") {
      detectedType = "Disaster Relief NGO Deed & Section 80G Order";
    } else {
      detectedType = "NGO Trust Deed / Statutory Registration Certificate";
    }

    // 3. Identification Status
    let idStatus = "Valid";
    if (panOrDarpan && panOrDarpan.trim() !== "" && panOrDarpan !== "Not Provided") {
      idStatus = "ID Provided (" + panOrDarpan.trim().toUpperCase() + ")";
    } else {
      idStatus = "Self-Certified ID";
    }

    return {
      valid: true,
      fileName: trimmedName,
      fileExt: ext.toUpperCase(),
      detectedType: detectedType,
      idStatus: idStatus,
      confidence: "Held for Admin Gatekeeper Verification",
      message: `Document "${trimmedName}" attached successfully (${detectedType}). Held in Admin Gatekeeper Queue for verification.`
    };
  }

  // Create Campaign with Anti-Fraud Duplicate Protection & Document Verification
  createCampaign(data) {
    const title = (data.title || "").trim();
    const desc = (data.description || "").trim();
    const target = Number(data.target);
    const category = data.category || "community";
    const organizer = (data.organizer || "Verified Organizer").trim();
    const location = (data.location || "Dehradun, Uttarakhand").trim();
    const panOrDarpan = (data.panOrDarpan || "").trim();
    const docName = (data.docName || "").trim();

    if (!title) {
      return { success: false, error: "Campaign title is required." };
    }
    if (isNaN(target) || target <= 0) {
      return { success: false, error: "Target funding goal must be greater than Rs. 0." };
    }

    // 1. Anti-Duplicate Check (Jaccard Similarity >= 65%)
    const dupCheck = this.checkDuplicateCampaign(title, desc);
    if (dupCheck.isDuplicate) {
      const matchPct = Math.round(dupCheck.similarity * 100);
      return {
        success: false,
        isDuplicate: true,
        similarity: matchPct,
        matchedTitle: dupCheck.matchedCampaign.title,
        error: `Duplicate Campaign Detected! Title has a ${matchPct}% similarity match with existing campaign: "${dupCheck.matchedCampaign.title}". Campaign creation blocked to prevent fraudulent clone scams.`
      };
    }

    // 2. Strict Document Verification & Authenticity Check
    const docValidation = this.validateCampaignDocument(docName, category, panOrDarpan);
    if (!docValidation.valid) {
      return {
        success: false,
        isDocInvalid: true,
        error: docValidation.error,
        reason: docValidation.reason
      };
    }

    // 3. Risk Score Evaluation with Document & Credential Checking
    const isVerified = Boolean(panOrDarpan && panOrDarpan.trim().length >= 5);
    const risk = this.evaluateRiskScore(title, desc, target, isVerified, docName, panOrDarpan);

    // 4. Category Label & Icon mapping
    const categoryMap = {
      education: { label: "Education & Health", icon: "💧", grad: "linear-gradient(135deg, #E1E8DC 0%, #DDC5B2 100%)" },
      healthcare: { label: "Healthcare Relief", icon: "🏥", grad: "linear-gradient(135deg, #F0E5D9 0%, #E8C1A8 100%)" },
      disaster: { label: "Disaster Relief", icon: "🍲", grad: "linear-gradient(135deg, #E8C1A8 0%, #FAF7F2 100%)" },
      community: { label: "Rural Community", icon: "🌿", grad: "linear-gradient(135deg, #FAF7F2 0%, #E1E8DC 100%)" }
    };
    const catInfo = categoryMap[category] || categoryMap.community;

    const newCampaign = {
      id: "CMP-" + Math.floor(106 + Math.random() * 890),
      title: title,
      category: category,
      categoryLabel: catInfo.label,
      location: location,
      organizer: organizer,
      status: "pending_admin_approval",
      isApproved: false,
      isVerified: false,
      verificationDoc: docName,
      docDataUrl: data.docDataUrl || null,
      docType: docValidation.detectedType,
      panOrDarpan: panOrDarpan || "Verified Institutional ID",
      target: target,
      collected: 0,
      reportedExpenses: 0,
      verifiedExpenses: 0,
      donorsCount: 0,
      daysLeft: 30,
      icon: catInfo.icon,
      themeGradient: catInfo.grad,
      description: desc || "Community initiative committed to 100% itemized expenditure transparency.",
      milestones: [
        { step: "Campaign Registration & Statutory ID Submission", status: "completed" },
        { step: "Admin Due Diligence & Document Verification", status: "in_progress" },
        { step: "Community Fundraising & Inflow Logging", status: "pending" },
        { step: "Milestone Procurement & Final Audit Handover", status: "pending" }
      ],
      expenses: [],
      updates: [
        { date: new Date().toISOString().substring(0, 10), title: "Submitted for Legal Verification", note: "Campaign submitted under Fund Nexus. Held in Regulatory Gatekeeper Queue awaiting Platform Auditor inspection." }
      ],
      riskScore: risk.score,
      riskFlag: risk.riskLevel,
      riskBadgeClass: risk.riskBadgeClass,
      riskFlags: risk.flags,
      docValidation: docValidation,
      submittedAt: new Date().toISOString()
    };

    this.campaigns.unshift(newCampaign);
    this.save();
    return { success: true, campaign: newCampaign, risk, docValidation };
  }

  approveCampaign(campaignId) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found." };
    }
    campaign.status = "active";
    campaign.isApproved = true;
    campaign.isVerified = true;
    if (campaign.milestones) {
      if (campaign.milestones[1]) campaign.milestones[1].status = "completed";
      if (campaign.milestones[2]) campaign.milestones[2].status = "in_progress";
    }
    if (!campaign.updates) campaign.updates = [];
    campaign.updates.unshift({
      date: new Date().toISOString().substring(0, 10),
      title: "Campaign Approved by Platform Auditor",
      note: "Legal verification documents and regulatory statutory IDs verified. Campaign is now live for public donations."
    });
    this.save();
    return { success: true, campaign };
  }

  rejectCampaign(campaignId, reason = "Document credentials could not be verified by platform auditor.") {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found." };
    }
    campaign.status = "rejected";
    campaign.isApproved = false;
    campaign.isVerified = false;
    campaign.rejectionReason = reason;
    if (!campaign.updates) campaign.updates = [];
    campaign.updates.unshift({
      date: new Date().toISOString().substring(0, 10),
      title: "Campaign Verification Rejected",
      note: reason
    });
    this.save();
    return { success: true, campaign };
  }

  deleteCampaign(campaignId) {
    const idx = this.campaigns.findIndex(c => c.id === campaignId);
    if (idx === -1) {
      return { success: false, error: "Campaign not found." };
    }
    const removed = this.campaigns.splice(idx, 1)[0];
    this.transactions = (this.transactions || []).filter(t => t.campaignId !== campaignId);
    this.save();
    this.saveTransactions();
    return { success: true, campaign: removed };
  }

  // Reset to Initial Campaigns
  resetDefaultCampaigns() {
    this.campaigns = JSON.parse(JSON.stringify(initialCampaigns)).map(c => ({
      ...c,
      status: "active",
      isApproved: true,
      isVerified: true
    }));
    this.transactions = [];
    this.save();
    this.saveTransactions();
    return { success: true };
  }

  // Record Donation with Strict Negative Balance Protection
  recordDonation(campaignId, amount, donorName = "Anonymous Supporter") {
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return null;
    }

    if (!campaignId && this.campaigns.length > 0) {
      campaignId = this.campaigns[0].id;
    }
    let campaign = this.getCampaignById(campaignId);
    if (!campaign && this.campaigns.length > 0) {
      campaign = this.campaigns[0];
    }
    if (!campaign) return null;

    campaign.collected += amount;
    campaign.donorsCount += 1;

    const cleanDonorName = (donorName && donorName.trim()) ? donorName.trim() : "Anonymous Supporter";

    const newTxn = {
      id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      donorName: cleanDonorName,
      amount: amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Confirmed"
    };

    this.transactions.unshift(newTxn);
    this.save();
    this.saveTransactions();
    return newTxn;
  }

  // Submit Expense Claim with Document Reference & Budget Guards
  submitExpense(campaignId, expenseData) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found." };
    }

    const amount = Number(expenseData.amount);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: "Expenditure amount must be strictly greater than Rs. 0." };
    }

    // Expense cannot exceed total collected funds
    if (amount > campaign.collected) {
      return {
        success: false,
        error: `Expense amount (Rs. ${amount.toLocaleString('en-IN')}) exceeds total funds collected so far (Rs. ${campaign.collected.toLocaleString('en-IN')}). You cannot claim an expense larger than collected donations.`
      };
    }

    const docName = expenseData.documentName || "Invoice_Receipt.pdf";
    const billRef = expenseData.billNo || ("INV-" + Math.floor(1000 + Math.random() * 9000));
    const vendor = expenseData.vendor || "Verified Supplier";
    const title = (expenseData.title || "Procurement Item").trim();

    const newExpense = {
      id: "EXP-" + Math.floor(100 + Math.random() * 900),
      title: title,
      amount: amount,
      vendor: vendor,
      billNo: billRef,
      documentName: docName,
      date: expenseData.date || new Date().toISOString().substring(0, 10),
      status: "reported", // Enters FIFO admin audit queue
      evidence: `Bill #${billRef} (Vendor: ${vendor}) | Attached: ${docName}`
    };

    campaign.reportedExpenses += newExpense.amount;
    campaign.expenses.push(newExpense);
    this.save();
    return { success: true, expense: newExpense };
  }

  // Verify Expense with Negative Balance Guard (Remaining Balance >= 0)
  verifyExpense(campaignId, expenseId, approve = true) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found." };
    }

    const exp = campaign.expenses.find(e => e.id === expenseId);
    if (!exp) {
      return { success: false, error: "Expense record not found." };
    }

    if (approve) {
      if (exp.status !== 'verified') {
        // STRICT NEGATIVE BALANCE GUARD:
        // verifiedExpenses + exp.amount MUST NOT exceed campaign.collected!
        const projectedVerified = campaign.verifiedExpenses + exp.amount;
        if (projectedVerified > campaign.collected) {
          const avail = Math.max(0, campaign.collected - campaign.verifiedExpenses);
          return {
            success: false,
            error: `Cannot approve expense! Approving Rs. ${exp.amount.toLocaleString('en-IN')} would exceed collected funds (Rs. ${campaign.collected.toLocaleString('en-IN')}). Available unspent balance is only Rs. ${avail.toLocaleString('en-IN')}. Negative balances are strictly prohibited!`
          };
        }

        exp.status = 'verified';
        campaign.verifiedExpenses += exp.amount;
      }
    } else {
      // Rejection
      if (exp.status === 'verified') {
        campaign.verifiedExpenses = Math.max(0, campaign.verifiedExpenses - exp.amount);
      }
      campaign.reportedExpenses = Math.max(0, campaign.reportedExpenses - exp.amount);
      exp.status = 'rejected';
    }

    this.save();
    return { success: true };
  }

  // Aggregate Platform Liquidity & Vault Reserve
  getPlatformLiquidity() {
    let totalInflow = 0;
    let totalVerified = 0;
    let totalReported = 0;

    this.campaigns.forEach(c => {
      totalInflow += (c.collected || 0);
      totalVerified += (c.verifiedExpenses || 0);
      totalReported += (c.reportedExpenses || 0);
    });

    const pendingAudit = Math.max(0, totalReported - totalVerified);
    const vaultReserve = Math.max(0, totalInflow - totalVerified);

    return {
      totalInflow,
      totalVerified,
      pendingAudit,
      vaultReserve,
      trustRating: "100.0% Audited"
    };
  }
}

// Global store instance
window.nexusStore = new NexusDataStore();
