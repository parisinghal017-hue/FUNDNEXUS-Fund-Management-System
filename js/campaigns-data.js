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
    this.txStorageKey = 'fund_nexus_transactions_v2';
    this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.campaigns = JSON.parse(saved);
        // Ensure any newly added initial campaigns (like child treatment) are merged in
        initialCampaigns.forEach(initCmp => {
          if (!this.campaigns.some(c => c.id === initCmp.id)) {
            this.campaigns.push({ ...initCmp });
          }
        });
        this.save();
      } catch (e) {
        this.campaigns = [...initialCampaigns];
        this.save();
      }
    } else {
      // Also check if v1 had user data to preserve
      const v1Saved = localStorage.getItem('fund_nexus_campaigns_v1');
      if (v1Saved) {
        try {
          this.campaigns = JSON.parse(v1Saved);
          initialCampaigns.forEach(initCmp => {
            if (!this.campaigns.some(c => c.id === initCmp.id)) {
              this.campaigns.push({ ...initCmp });
            }
          });
          this.save();
        } catch (e) {
          this.campaigns = [...initialCampaigns];
          this.save();
        }
      } else {
        this.campaigns = [...initialCampaigns];
        this.save();
      }
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
    return [
      { id: "TXN-782104", campaignId: "CMP-101", campaignTitle: "Solar Water Filtration for Hill Schools", donorName: "Margaret Sharma", amount: 5000, date: "2026-10-14 11:20", status: "Confirmed" },
      { id: "TXN-654129", campaignId: "CMP-102", campaignTitle: "Mobile Maternal & Neonatal Clinic Van", donorName: "Aarav Patel", amount: 2500, date: "2026-10-15 14:45", status: "Confirmed" },
      { id: "TXN-910482", campaignId: "CMP-103", campaignTitle: "Community Kitchen Emergency Packs", donorName: "Pari Singhal", amount: 1500, date: "2026-10-16 09:12", status: "Confirmed" },
      { id: "TXN-342890", campaignId: "CMP-104", campaignTitle: "Women's Organic Herb Collective", donorName: "Yashasvi Sharma", amount: 3000, date: "2026-10-17 16:30", status: "Confirmed" },
      { id: "TXN-419820", campaignId: "CMP-105", campaignTitle: "Emergency Pediatric Heart Surgery for Baby Aarav", donorName: "Rohan & Sneha Joshi", amount: 7500, date: "2026-10-19 14:10", status: "Confirmed" }
    ];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.campaigns));
  }

  saveTransactions() {
    localStorage.setItem(this.txStorageKey, JSON.stringify(this.transactions));
  }

  getCampaignById(id) {
    if (!id) return this.campaigns[0];
    return this.campaigns.find(c => c.id === id) || this.campaigns[0];
  }

  recordDonation(campaignId, amount, donorName = "Anonymous Supporter") {
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

    const newTxn = {
      id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      donorName: donorName,
      amount: amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Confirmed (Simulated)"
    };

    this.transactions.unshift(newTxn);
    this.save();
    this.saveTransactions();
    return newTxn;
  }

  submitExpense(campaignId, expenseData) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) return false;

    const newExpense = {
      id: "EXP-" + Math.floor(100 + Math.random() * 900),
      title: expenseData.title,
      amount: Number(expenseData.amount),
      date: new Date().toISOString().substring(0, 10),
      status: "reported", // starts as reported
      evidence: expenseData.evidence || "Proof document attached for review"
    };

    campaign.reportedExpenses += newExpense.amount;
    campaign.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  verifyExpense(campaignId, expenseId, approve = true) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) return false;

    const exp = campaign.expenses.find(e => e.id === expenseId);
    if (!exp) return false;

    if (approve) {
      if (exp.status !== 'verified') {
        exp.status = 'verified';
        campaign.verifiedExpenses += exp.amount;
      }
    } else {
      if (exp.status === 'verified') {
        campaign.verifiedExpenses -= exp.amount;
      }
      exp.status = 'rejected';
    }
    this.save();
    return true;
  }
}

// Global store instance
window.nexusStore = new NexusDataStore();
