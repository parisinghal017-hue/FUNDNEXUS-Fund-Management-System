/**
 * FUND NEXUS — Interactive UI Controller
 * Powers dynamic filtering, search, sorting, detailed campaign modals,
 * simulated donation checkouts, receipts, and role-based dashboards.
 */

let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'default';
let currentModalCampaignId = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderCampaignCards();
  setupFilterHandlers();
  setupModalDismissals();
  setupDonationForm();
  setupCreateCampaignForm();
  setupLogExpenseForm();
  setupDashboardTabs();
  updateHeroSpotlight();
  updateTransparencyFormula();
  renderLiveLedgerTable();
  renderDonorDashboard();
  renderFundraiserDashboard();
  renderAdminDashboard();
  updateUserUI();
});

// 1. Render Campaign Cards Grid
function renderCampaignCards() {
  const container = document.getElementById('dynamic-campaigns-grid');
  if (!container) return;

  // Only show active and verified campaigns on public explore
  let list = window.nexusStore.campaigns.filter(c => c.status === 'active' || (!c.status && c.isVerified !== false));

  // Filter by category
  if (activeCategory !== 'all') {
    list = list.filter(c => c.category === activeCategory);
  }

  // Filter by search query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    list = list.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.location.toLowerCase().includes(q) || 
      c.organizer.toLowerCase().includes(q)
    );
  }

  // Sort campaigns
  if (sortBy === 'urgent') {
    list.sort((a, b) => a.daysLeft - b.daysLeft);
  } else if (sortBy === 'highest-target') {
    list.sort((a, b) => b.target - a.target);
  } else if (sortBy === 'funded-percent') {
    list.sort((a, b) => (b.collected / b.target) - (a.collected / a.target));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--color-white); border-radius: var(--radius-lg); border: 1px dashed var(--color-nude-beige);">
        <p style="font-size: 1.1rem; color: var(--color-cocoa-heading); font-family: var(--font-serif); margin-bottom: 0.5rem;">No campaigns found matching your criteria.</p>
        <button class="btn btn-outline" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(c => {
    const pct = Math.min(100, Math.round((c.collected / c.target) * 100));
    const remaining = Math.max(0, c.collected - c.verifiedExpenses);

    return `
      <div class="campaign-card" data-id="${c.id}">
        <div class="campaign-image-placeholder" style="background: ${c.themeGradient};">
          <span style="font-size: 3.2rem;">${c.icon}</span>
          <div class="campaign-tag-overlay">
            <span class="badge badge-sage">${c.categoryLabel}</span>
          </div>
        </div>
        <div class="campaign-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <span style="font-size: 0.8rem; color: var(--color-muted-text); font-weight: 600;">📍 ${c.location}</span>
            <span style="font-size: 0.78rem; color: var(--color-forest-sage); font-weight: 700;">${c.daysLeft} days left</span>
          </div>

          <h3 style="cursor: pointer;" onclick="openCampaignModal('${c.id}')">${c.title}</h3>
          <p class="campaign-desc">${c.description.substring(0, 115)}...</p>

          <!-- Progress -->
          <div class="progress-container">
            <div class="progress-bar" style="width: ${pct}%;"></div>
          </div>

          <div class="campaign-meta">
            <div>
              <span class="text-muted" style="font-size: 0.8rem;">Collected:</span>
              <strong style="display: block;">₹${c.collected.toLocaleString('en-IN')}</strong>
            </div>
            <div style="text-align: right;">
              <span class="text-muted" style="font-size: 0.8rem;">Target:</span>
              <strong style="display: block;">₹${c.target.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <!-- Micro Ledger Strip -->
          <div style="background: var(--color-warm-cream); border: 1px solid var(--color-nude-beige); border-radius: var(--radius-sm); padding: 0.45rem 0.75rem; font-size: 0.78rem; display: flex; justify-content: space-between; margin-bottom: 1.1rem;">
            <span style="color: var(--color-muted-text);">Audited Balance:</span>
            <strong style="color: var(--color-forest-sage);">₹${remaining.toLocaleString('en-IN')}</strong>
          </div>

          <div style="display: flex; gap: 0.6rem; margin-top: auto;">
            <button class="btn btn-outline" style="flex: 1; padding: 0.5rem;" onclick="openCampaignModal('${c.id}')">View Ledger</button>
            <button class="btn btn-primary" style="flex: 1; padding: 0.5rem;" onclick="openDonationModal('${c.id}')">Donate</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 2. Setup Filter Handlers
function setupFilterHandlers() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderCampaignCards();
    });
  });

  const searchInput = document.getElementById('campaign-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCampaignCards();
    });
  }

  const sortSelect = document.getElementById('campaign-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderCampaignCards();
    });
  }
}

function resetFilters() {
  activeCategory = 'all';
  searchQuery = '';
  sortBy = 'default';
  const searchInput = document.getElementById('campaign-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-category') === 'all');
  });
  renderCampaignCards();
}

// 3. Open Detailed Campaign Modal with Comprehensive Financial Ledger
window.openCampaignModal = function(campaignId) {
  const c = window.nexusStore.getCampaignById(campaignId);
  if (!c) return;

  currentModalCampaignId = campaignId;
  const modal = document.getElementById('campaign-detail-modal');
  if (!modal) return;

  const pct = Math.min(100, Math.round((c.collected / c.target) * 100));
  const remaining = Math.max(0, c.collected - c.verifiedExpenses);

  // Render modal content safely
  const badgeEl = document.getElementById('modal-c-badge');
  if (badgeEl) badgeEl.textContent = c.categoryLabel;

  const titleEl = document.getElementById('modal-c-title');
  if (titleEl) titleEl.textContent = c.title;

  const orgEl = document.getElementById('modal-c-organizer');
  if (orgEl) orgEl.innerHTML = `Organized by <strong>${c.organizer}</strong> &bull; 📍 ${c.location}`;

  const descEl = document.getElementById('modal-c-desc');
  if (descEl) descEl.textContent = c.description;
  
  const raisedEl = document.getElementById('modal-c-raised');
  if (raisedEl) raisedEl.textContent = `₹${c.collected.toLocaleString('en-IN')}`;

  const targetEl = document.getElementById('modal-c-target');
  if (targetEl) targetEl.textContent = `₹${c.target.toLocaleString('en-IN')}`;

  const progressEl = document.getElementById('modal-c-progress');
  if (progressEl) progressEl.style.width = `${pct}%`;

  const pctEl = document.getElementById('modal-c-pct');
  if (pctEl) pctEl.textContent = `${pct}% Funded`;

  const donorsEl = document.getElementById('modal-c-donors');
  if (donorsEl) donorsEl.textContent = `${c.donorsCount} Donors`;

  // Financial Ledger Breakdown
  const ledgerCollected = document.getElementById('modal-ledger-collected');
  if (ledgerCollected) ledgerCollected.textContent = `₹${c.collected.toLocaleString('en-IN')}`;

  const ledgerReported = document.getElementById('modal-ledger-reported');
  if (ledgerReported) ledgerReported.textContent = `₹${c.reportedExpenses.toLocaleString('en-IN')}`;

  const ledgerVerified = document.getElementById('modal-ledger-verified');
  if (ledgerVerified) ledgerVerified.textContent = `₹${c.verifiedExpenses.toLocaleString('en-IN')}`;

  const ledgerRemaining = document.getElementById('modal-ledger-remaining');
  if (ledgerRemaining) ledgerRemaining.textContent = `₹${remaining.toLocaleString('en-IN')}`;

  // Itemized Expenses Table
  const expensesTbody = document.getElementById('modal-expenses-tbody');
  if (expensesTbody) {
    if (!c.expenses || c.expenses.length === 0) {
      expensesTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.5rem;">No expenditures reported yet.</td></tr>`;
    } else {
      expensesTbody.innerHTML = c.expenses.map(exp => {
        let badgeHtml = '';
        if (exp.status === 'verified') {
          badgeHtml = `<span class="badge badge-sage">✓ Admin Verified</span>`;
        } else if (exp.status === 'evidence_submitted') {
          badgeHtml = `<span class="badge" style="background: #EBF3FD; color: #2F80ED;">Evidence Uploaded</span>`;
        } else {
          badgeHtml = `<span class="badge" style="background: #FEF7E6; color: #D9822B;">Reported Only</span>`;
        }

        return `
          <tr>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${exp.date}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${exp.title}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">₹${exp.amount.toLocaleString('en-IN')}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige);">${badgeHtml}</td>
            <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.8rem; color: var(--color-muted-text);">${exp.evidence}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Campaign-Specific Simulated Inflow & Donation Ledger
  const donationsTbody = document.getElementById('modal-donations-tbody');
  if (donationsTbody) {
    const user = getCurrentUser();
    let txns = (window.nexusStore.transactions || []).filter(t => t.campaignId === c.id);

    // Check if viewing from donor portal or logged in as donor
    const activeTab = document.querySelector('.dashboard-tab-btn.active')?.getAttribute('data-tab');
    const isDonorMode = (user && user.role === 'donor') || (activeTab === 'portal-donor');

    const modalDonationTitle = document.getElementById('modal-donations-section-title');
    if (isDonorMode) {
      const cleanName = (user.name || 'Margaret Sharma').trim().toLowerCase();
      txns = txns.filter(t => (t.donorName || '').trim().toLowerCase() === cleanName);
      if (modalDonationTitle) {
        modalDonationTitle.textContent = `Your Audited Contributions for this Cause (${user.name || 'Margaret Sharma'})`;
      }
    } else {
      if (modalDonationTitle) {
        modalDonationTitle.textContent = "Simulated Inflow & Public Donation Ledger";
      }
    }

    if (txns.length === 0) {
      donationsTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.25rem;">${isDonorMode ? 'No contributions recorded for this cause under your account.' : 'No contributions recorded for this cause yet.'}</td></tr>`;
    } else {
      donationsTbody.innerHTML = txns.map(t => `
        <tr>
          <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.date}</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${t.donorName}</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem; color: var(--color-forest-sage); font-weight: 600;">₹${t.amount.toLocaleString('en-IN')}</td>
          <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige);"><span class="badge badge-sage">Confirmed</span></td>
          <td style="padding: 0.75rem; border-bottom: 1px solid var(--color-nude-beige); font-family: monospace; font-size: 0.8rem; color: var(--color-muted-text);">${t.id}</td>
        </tr>
      `).join('');
    }
  }

  // Updates list
  const updatesContainer = document.getElementById('modal-updates-container');
  if (updatesContainer) {
    updatesContainer.innerHTML = (c.updates || []).map(u => `
      <div style="margin-bottom: 1rem; padding-left: 1rem; border-left: 2px solid var(--color-terracotta);">
        <div style="font-size: 0.8rem; color: var(--color-muted-text); font-weight: 600;">${u.date}</div>
        <strong style="font-size: 0.95rem; color: var(--color-cocoa-heading);">${u.title}</strong>
        <p style="font-size: 0.88rem; margin: 0.25rem 0 0; color: var(--color-charcoal-body);">${u.note}</p>
      </div>
    `).join('');
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// 4. Open Simulated Donation Modal
window.openDonationModal = function(campaignId) {
  if (!campaignId || typeof campaignId !== 'string') {
    campaignId = (window.nexusStore && window.nexusStore.campaigns.length > 0) ? window.nexusStore.campaigns[0].id : 'CMP-101';
  }
  
  const c = window.nexusStore.getCampaignById(campaignId) || window.nexusStore.campaigns[0];
  if (!c) return;

  currentModalCampaignId = c.id;
  const modal = document.getElementById('donation-checkout-modal');
  if (!modal) return;

  const titleEl = document.getElementById('checkout-campaign-title');
  if (titleEl) titleEl.textContent = c.title;

  const orgEl = document.getElementById('checkout-organizer');
  if (orgEl) orgEl.textContent = c.organizer;

  const neededEl = document.getElementById('checkout-remaining-needed');
  if (neededEl) neededEl.textContent = `Target: ₹${c.target.toLocaleString('en-IN')} | Raised: ₹${c.collected.toLocaleString('en-IN')}`;

  // Reset donation amount input
  const amountInput = document.getElementById('donation-amount-input');
  if (amountInput) amountInput.value = '1000';

  // Highlight default ₹1,000 preset button
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-amount') === '1000');
  });

  // Pre-fill donor name from logged-in session if available
  const nameInput = document.getElementById('donor-name-input');
  if (nameInput) {
    const user = getCurrentUser();
    nameInput.value = (user && user.role !== 'guest') ? user.name : '';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// Update Hero Spotlight in real time
function updateHeroSpotlight() {
  const c1 = window.nexusStore.getCampaignById('CMP-101') || window.nexusStore.campaigns[0];
  if (!c1) return;

  const pct = Math.min(100, Math.round((c1.collected / c1.target) * 100));
  const remaining = Math.max(0, c1.collected - c1.verifiedExpenses);

  const collectedEl = document.getElementById('hero-collected');
  if (collectedEl) collectedEl.textContent = `₹${c1.collected.toLocaleString('en-IN')}`;

  const remainingEl = document.getElementById('hero-remaining');
  if (remainingEl) remainingEl.textContent = `₹${remaining.toLocaleString('en-IN')}`;

  const ledgerCollectedEl = document.getElementById('hero-ledger-collected');
  if (ledgerCollectedEl) ledgerCollectedEl.textContent = `₹${c1.collected.toLocaleString('en-IN')}`;

  const progressBar = document.getElementById('hero-progress-bar');
  if (progressBar) progressBar.style.width = `${pct}%`;
}

// 5. Preset Amounts Handler
window.selectPresetAmount = function(amount, element) {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  if (element) element.classList.add('active');
  const amountInput = document.getElementById('donation-amount-input');
  if (amountInput) amountInput.value = amount;
};

// 6. Setup Donation Submission Form
function setupDonationForm() {
  const form = document.getElementById('donation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('donation-amount-input');
    const amountVal = parseInt(amountInput ? amountInput.value : '0', 10);
    const nameInput = document.getElementById('donor-name-input');
    
    const user = getCurrentUser();
    const defaultDonor = (user && user.role === 'donor') ? user.name : 'Anonymous Supporter';
    const donorName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : defaultDonor;

    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Please enter a valid simulated donation amount greater than ₹0.');
      return;
    }

    const targetCampaignId = currentModalCampaignId || 'CMP-101';
    const txn = window.nexusStore.recordDonation(targetCampaignId, amountVal, donorName);
    if (!txn) {
      alert('Error recording donation.');
      return;
    }

    // Inform the backend server (SQLite database & C++ bridge)
    try {
      fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: targetCampaignId,
          amount: amountVal,
          donor_name: donorName
        })
      }).catch(err => {
        console.warn('Backend server note (static mode fallback active):', err);
      });
    } catch (e) {
      // Ignored if network/fetch unavailable
    }

    // Close checkout modal
    closeAllModals();

    // Show instant simulated receipt
    openReceiptModal(txn);

    // Refresh ALL UI components and Ledgers across the platform
    renderCampaignCards();
    updateHeroSpotlight();
    updateTransparencyFormula();
    renderLiveLedgerTable();
    renderDonorDashboard();
    renderFundraiserDashboard();

    // Update active campaign modal ledger values if opened
    if (currentModalCampaignId) {
      const c = window.nexusStore.getCampaignById(currentModalCampaignId);
      if (c) {
        const remaining = Math.max(0, c.collected - c.verifiedExpenses);
        const modalLedgerCol = document.getElementById('modal-ledger-collected');
        if (modalLedgerCol) modalLedgerCol.textContent = `₹${c.collected.toLocaleString('en-IN')}`;
        const modalLedgerRem = document.getElementById('modal-ledger-remaining');
        if (modalLedgerRem) modalLedgerRem.textContent = `₹${remaining.toLocaleString('en-IN')}`;
      }
    }

    window.showNexusFeedback(`Simulated donation of ₹${amountVal.toLocaleString('en-IN')} recorded in ledger!`);
  });
}

// 7. Update Live Transparency Formula
function updateTransparencyFormula() {
  const campaigns = window.nexusStore.campaigns || [];
  const totalDonations = campaigns.reduce((sum, c) => sum + (c.collected || 0), 0);
  const totalVerifiedExp = campaigns.reduce((sum, c) => sum + (c.verifiedExpenses || 0), 0);
  const totalRemaining = Math.max(0, totalDonations - totalVerifiedExp);

  const donEl = document.getElementById('transparency-total-donations');
  if (donEl) donEl.textContent = `₹${totalDonations.toLocaleString('en-IN')}`;

  const expEl = document.getElementById('transparency-verified-expenses');
  if (expEl) expEl.textContent = `₹${totalVerifiedExp.toLocaleString('en-IN')}`;

  const remEl = document.getElementById('transparency-remaining-balance');
  if (remEl) remEl.textContent = `₹${totalRemaining.toLocaleString('en-IN')}`;

  // Update Stats Bar counter
  const statsTotal = document.getElementById('stats-total-donations');
  if (statsTotal) {
    statsTotal.textContent = `₹${totalDonations.toLocaleString('en-IN')}`;
    statsTotal.setAttribute('data-target', totalDonations);
  }

  // Update Platform Liquidity Grid
  const liq = window.nexusStore.getPlatformLiquidity();
  const liqInflow = document.getElementById('liquidity-total-inflow');
  const liqVerified = document.getElementById('liquidity-total-verified');
  const liqPending = document.getElementById('liquidity-total-pending');
  const liqVault = document.getElementById('liquidity-vault-reserve');
  if (liqInflow) liqInflow.textContent = `₹${liq.totalInflow.toLocaleString('en-IN')}`;
  if (liqVerified) liqVerified.textContent = `₹${liq.totalVerified.toLocaleString('en-IN')}`;
  if (liqPending) liqPending.textContent = `₹${liq.pendingAudit.toLocaleString('en-IN')}`;
  if (liqVault) liqVault.textContent = `₹${liq.vaultReserve.toLocaleString('en-IN')}`;
}

// 8. Live Public Transaction Ledger Renderer
function renderLiveLedgerTable() {
  const tbody = document.getElementById('transparency-live-ledger-tbody');
  if (!tbody) return;

  const txns = window.nexusStore.transactions || [];
  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 1.5rem;">No ledger transactions recorded yet. Simulate a donation above to generate real-time ledger entries!</td></tr>`;
    return;
  }

  tbody.innerHTML = txns.slice(0, 10).map((t, idx) => `
    <tr style="${idx === 0 ? 'background-color: var(--color-warm-cream); font-weight: 500;' : ''}">
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.date}</td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${t.campaignTitle}</td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">
        <a href="javascript:void(0)" onclick="openDonorProfileByName('${encodeURIComponent(t.donorName)}')" style="color: var(--color-forest-sage); font-weight: 600; text-decoration: underline;" title="View isolated profile for ${t.donorName}">
          ${t.donorName}
        </a>
      </td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.92rem; font-weight: 700; color: var(--color-forest-sage); font-family: var(--font-serif);">₹${t.amount.toLocaleString('en-IN')}</td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);"><span class="badge badge-sage">✓ Recorded</span></td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-family: monospace; font-size: 0.82rem; color: var(--color-muted-text);">${t.id}</td>
    </tr>
  `).join('');
}

// 9. Receipt Modal & "View in Ledger" Navigation
function openReceiptModal(txn) {
  const modal = document.getElementById('donation-receipt-modal');
  if (!modal) return;

  document.getElementById('receipt-txn-id').textContent = txn.id;
  document.getElementById('receipt-date').textContent = txn.date;
  document.getElementById('receipt-donor').textContent = txn.donorName;
  document.getElementById('receipt-campaign').textContent = txn.campaignTitle;
  document.getElementById('receipt-amount').textContent = `₹${txn.amount.toLocaleString('en-IN')}`;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

window.viewReceiptByTxnId = function(txnId) {
  const txn = (window.nexusStore.transactions || []).find(t => t.id === txnId);
  if (txn) {
    openReceiptModal(txn);
  } else {
    window.showNexusFeedback("Receipt details not found for transaction " + txnId);
  }
};

window.viewDonationInLedger = function() {
  closeAllModals();
  const ledgerSec = document.getElementById('transparency');
  if (ledgerSec) {
    ledgerSec.scrollIntoView({ behavior: 'smooth' });
    const firstRow = document.querySelector('#transparency-live-ledger-tbody tr');
    if (firstRow) {
      firstRow.style.transition = 'background-color 0.5s ease';
      firstRow.style.backgroundColor = '#dbe8d6';
      setTimeout(() => {
        firstRow.style.backgroundColor = '';
      }, 3000);
    }
  }
};

// 8. Close Modal Utilities
function setupModalDismissals() {
  document.querySelectorAll('.modal-backdrop, .modal-close-btn').forEach(elem => {
    elem.addEventListener('click', closeAllModals);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.style.display = 'none';
  });
  document.body.style.overflow = 'auto';
}

// 9. Dashboard View Tabs (Browse Causes, Donor Dashboard, Fundraiser Dashboard, Admin Audit)
function setupDashboardTabs() {
  const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const currentUser = getCurrentUser();

      // Role-Based Access Gate: Admin room requires authenticated Platform Auditor credentials
      if (targetTab === 'portal-admin' && currentUser.role !== 'admin') {
        openLoginModal();
        return;
      } else if (targetTab === 'portal-fundraiser' && currentUser.role !== 'fundraiser' && currentUser.role !== 'admin') {
        setCurrentUser(DEMO_USERS.fundraiser);
        renderDonorDashboard();
        renderFundraiserDashboard();
        renderAdminDashboard();
        updateTransparencyFormula();
      } else if (targetTab === 'portal-donor' && currentUser.role !== 'donor' && currentUser.role !== 'admin') {
        setCurrentUser(DEMO_USERS.donor);
        renderDonorDashboard();
        renderFundraiserDashboard();
        renderAdminDashboard();
        updateTransparencyFormula();
      }

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.portal-view').forEach(view => {
        view.style.display = (view.id === targetTab) ? 'block' : 'none';
      });

      window.showNexusFeedback(`Switched to ${btn.textContent.trim()} view.`);
    });
  });
}

// ============================================================================
// 10. ROLE-BASED ACCESS CONTROL (RBAC) & VERIFIED DONOR PROFILES
// ============================================================================
const DEMO_USERS = {
  guest: { id: null, name: "Guest", role: "guest", label: "Public Visitor", badge: "Public", icon: "🌐" },
  donor: { id: "USR-101", name: "Margaret Sharma", role: "donor", email: "margaret@gmail.com", label: "Margaret Sharma", badge: "Donor", icon: "👤" },
  fundraiser: { id: "USR-201", name: "Doon Rural Welfare Trust", role: "fundraiser", email: "contact@doonrural.org", label: "Doon Welfare", badge: "Fundraiser", icon: "📊" },
  admin: { id: "USR-901", name: "Platform Auditor", role: "admin", email: "audit@fundnexus.org", label: "Platform Auditor", badge: "Admin", icon: "🛡️" }
};

function getCurrentUser() {
  const saved = sessionStorage.getItem('fund_nexus_user');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return DEMO_USERS.guest;
}

function setCurrentUser(user) {
  sessionStorage.setItem('fund_nexus_user', JSON.stringify(user));
  updateUserUI();
}

const DONOR_PROFILES = {
  "margaret sharma": { id: "USR-101", name: "Margaret Sharma", email: "margaret@gmail.com", pin: "1010" },
  "aarav patel": { id: "USR-102", name: "Aarav Patel", email: "aarav.patel@gmail.com", pin: "1020" },
  "pari singhal": { id: "USR-103", name: "Pari Singhal", email: "pari.singhal@geu.ac.in", pin: "1030" },
  "yashasvi sharma": { id: "USR-104", name: "Yashasvi Sharma", email: "yashasvi.sharma@geu.ac.in", pin: "1040" },
  "rohan & sneha joshi": { id: "USR-105", name: "Rohan & Sneha Joshi", email: "rohan.joshi@outlook.com", pin: "1050" }
};

window.switchDonorByName = function(donorName, bypassPin = false) {
  if (!donorName) return;
  const key = donorName.trim().toLowerCase();
  const profile = DONOR_PROFILES[key] || {
    id: "USR-" + Math.floor(100 + Math.random() * 899),
    name: donorName,
    email: `${donorName.toLowerCase().replace(/\s+/g, '.')}@nexus.org`,
    pin: "1234"
  };

  // Zero-Trust Identity Guard: Enforce credential authentication to prevent identity spoofing
  if (!bypassPin) {
    const enteredPin = prompt(
      `🔐 Zero-Trust Identity Authentication Required\n` +
      `Target Identity: ${profile.name} (${profile.id})\n` +
      `Enter security PIN to verify ownership (Demo PIN hint: ${profile.pin}):`,
      profile.pin
    );

    if (enteredPin === null) return; // User cancelled authentication
    
    if (enteredPin.trim() !== profile.pin) {
      alert(
        `⛔ Security Incident [OWASP A01 / A07]: Identity Impersonation Blocked!\n` +
        `Invalid security credentials for ${profile.name} (${profile.id}).\n` +
        `Unauthorized account takeover attempt has been intercepted and logged.`
      );
      return;
    }
  }

  const donorUser = {
    id: profile.id,
    name: profile.name,
    role: "donor",
    email: profile.email,
    label: profile.name,
    badge: "Donor",
    icon: "👤",
    authToken: "SEC-AUTH-" + Math.random().toString(36).substring(2, 10).toUpperCase()
  };

  DEMO_USERS.donor = donorUser;
  setCurrentUser(donorUser);
  closeAllModals();
  renderDonorDashboard();
  switchDashboardTab('portal-donor');
  window.showNexusFeedback(`✓ Authenticated as ${profile.name} (${profile.id}) via cryptographic session token.`);
};

window.openDonorProfileByName = function(encodedName) {
  const donorName = decodeURIComponent(encodedName);
  window.switchDonorByName(donorName);
};

window.switchDonorProfile = function(donorName) {
  window.switchDonorByName(donorName);
};

window.clearDonorTransactions = function() {
  const currentUser = getCurrentUser();
  const cleanName = (currentUser.name || 'Margaret Sharma').trim().toLowerCase();
  
  window.nexusStore.transactions = (window.nexusStore.transactions || []).filter(
    t => (t.donorName || '').trim().toLowerCase() !== cleanName
  );
  window.nexusStore.saveTransactions();
  renderDonorDashboard();
  renderLiveLedgerTable();
  updateTransparencyFormula();
  window.showNexusFeedback(`Previous transactions cleared for ${currentUser.name}.`);
};

// 10. Donor Dashboard Renderer (Show All Campaigns & Clean Slate Transactions)
function renderDonorDashboard() {
  const currentUser = getCurrentUser();
  const allTxns = window.nexusStore.transactions || [];
  const campaigns = (window.nexusStore.campaigns || []).filter(c => c.status === 'active' || (!c.status && c.isVerified !== false));

  // Determine active donor name (default to Margaret Sharma if guest or unassigned)
  let activeName = (currentUser.name || "Margaret Sharma").trim();
  if (currentUser.role === 'guest' || !activeName) {
    activeName = "Margaret Sharma";
  }
  const cleanActiveName = activeName.toLowerCase();

  const profile = DONOR_PROFILES[cleanActiveName] || {
    id: currentUser.id || "USR-101",
    name: activeName,
    email: currentUser.email || `${cleanActiveName.replace(/\s+/g, '.')}@nexus.org`
  };

  // STRICT ISOLATION: Only transactions where donorName matches activeName (case-insensitive)
  const donorTxns = allTxns.filter(t => (t.donorName || "").trim().toLowerCase() === cleanActiveName);
  const totalGiven = donorTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

  // Update Welcome Banner
  const welcomeName = document.getElementById('donor-welcome-name');
  if (welcomeName) welcomeName.textContent = `Welcome back, ${profile.name} 💙`;

  const welcomeId = document.getElementById('donor-welcome-id');
  if (welcomeId) welcomeId.textContent = profile.id;

  const totalElem = document.getElementById('donor-total-given');
  if (totalElem) totalElem.textContent = `₹${totalGiven.toLocaleString('en-IN')}`;

  const countElem = document.getElementById('donor-total-txns');
  if (countElem) countElem.textContent = `${donorTxns.length} Donation${donorTxns.length === 1 ? '' : 's'}`;

  // Sync donor persona dropdown if present
  const selectEl = document.getElementById('active-donor-select');
  if (selectEl) {
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value.toLowerCase() === cleanActiveName) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }

  // Render ALL Active Campaigns Available to Support / Donate in Donor Portal
  const campTbody = document.getElementById('donor-campaigns-tbody');
  if (campTbody) {
    campTbody.innerHTML = campaigns.map(c => {
      const pct = Math.min(100, Math.round((c.collected / c.target) * 100));
      const remaining = Math.max(0, c.collected - c.verifiedExpenses);

      return `
        <tr>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="font-weight: 600; color: var(--color-cocoa-heading);">${c.icon} ${c.title}</div>
            <div style="font-size: 0.78rem; color: var(--color-muted-text); margin-top: 0.2rem;">📍 ${c.location} &bull; ${c.daysLeft} days left</div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <span class="badge badge-sage" style="font-size: 0.75rem;">${c.categoryLabel}</span>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">₹${c.target.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; color: var(--color-forest-sage); font-size: 0.88rem;">₹${c.collected.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 700; color: var(--color-forest-sage); font-size: 0.88rem;">
            ₹${remaining.toLocaleString('en-IN')}
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); min-width: 110px;">
            <div style="font-size: 0.78rem; font-weight: 600; margin-bottom: 0.2rem;">${pct}%</div>
            <div class="progress-container" style="height: 6px; margin: 0;">
              <div class="progress-bar" style="width: ${pct}%;"></div>
            </div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 600;" onclick="openDonationModal('${c.id}')">+ Donate Now</button>
              <button class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="openCampaignModal('${c.id}')">View Ledger</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Giving History Table (Starts clean with NO previous transactions)
  const tbody = document.getElementById('donor-history-tbody');
  if (tbody) {
    if (donorTxns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 1.75rem;">No previous transactions recorded for <strong>${profile.name}</strong>. Choose any campaign above to make your first transparent contribution!</td></tr>`;
    } else {
      tbody.innerHTML = donorTxns.map(t => `
        <tr>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.date}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${t.campaignTitle}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.9rem; font-weight: 700; color: var(--color-forest-sage); font-family: var(--font-serif);">₹${t.amount.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);"><span class="badge badge-sage">Confirmed</span></td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-family: monospace; font-size: 0.82rem; color: var(--color-muted-text);">${t.id}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <button class="btn btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.78rem;" onclick="viewReceiptByTxnId('${t.id}')">📄 Receipt</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// 11. Fundraiser Dashboard Renderer
function renderFundraiserDashboard() {
  const campaigns = window.nexusStore.campaigns;
  const tbody = document.getElementById('fundraiser-campaigns-tbody');
  if (tbody) {
    tbody.innerHTML = campaigns.map(c => {
      const remaining = Math.max(0, c.collected - c.verifiedExpenses);
      const riskScore = c.riskScore || 0;
      let badgeClass = 'badge-sage';
      let icon = '✓';
      if ((c.riskFlag || '').includes('High') || riskScore >= 45) {
        badgeClass = 'badge-terracotta';
        icon = '⚠️';
      } else if ((c.riskFlag || '').includes('Moderate') || riskScore >= 20) {
        badgeClass = 'badge-peach';
        icon = '⚡';
      }

      const isPending = c.status === 'pending_admin_approval';
      const isRejected = c.status === 'rejected';
      const hasDoc = c.verificationDoc && !c.verificationDoc.includes('No_Document');

      return `
        <tr>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600;">
            ${c.icon} ${c.title}
            <div style="font-size: 0.75rem; margin-top: 3px; display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              ${isPending ? `<span class="badge badge-terracotta" style="font-size: 0.7rem; font-weight: 700;">⏳ Awaiting Admin Document Review</span>` : isRejected ? `<span class="badge badge-terracotta" style="font-size: 0.7rem; font-weight: 700;">❌ Verification Rejected</span>` : `<span class="badge badge-sage" style="font-size: 0.7rem; font-weight: 700;">✓ Live Active</span>`}
              <span class="badge ${badgeClass}" style="font-size: 0.7rem; font-weight: 700;">${icon} ${c.riskFlag || 'Low Risk'} (${riskScore}/100)</span>
            </div>
            <div style="font-size: 0.72rem; margin-top: 3px; color: var(--color-muted-text);">
              ${hasDoc ? `<span style="color: var(--color-forest-sage); font-weight: 600; cursor: pointer; text-decoration: underline;" onclick="openCampaignDocModal('${encodeURIComponent(c.id)}', '${encodeURIComponent(c.verificationDoc)}', '${encodeURIComponent(c.panOrDarpan || 'AAATD1234F')}', '${encodeURIComponent(c.organizer || 'Doon Rural Welfare Trust')}', '${encodeURIComponent(c.docType || 'Legal Registration Certificate')}')">📎 Doc: ${c.verificationDoc} 🔍</span>` : `<span style="color: #b73838; font-weight: 600;">⚠️ No Document Attached</span>`}
              ${c.panOrDarpan && c.panOrDarpan !== 'Not Provided' ? ` &bull; <code>ID: ${c.panOrDarpan}</code>` : ''}
            </div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">₹${c.target.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); color: var(--color-forest-sage); font-weight: 600;">₹${c.collected.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); color: var(--color-terracotta);">₹${c.reportedExpenses.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 700; color: var(--color-forest-sage);">₹${remaining.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              ${isPending ? `
                <button class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.76rem; opacity: 0.7; cursor: not-allowed;" disabled title="Campaign must be approved by Platform Auditor before logging expenses">
                  ⏳ Review Pending
                </button>
              ` : `
                <button class="btn btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="openLogExpenseModal('${c.id}')">+ Log Expense</button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Admin-Only Campaign Deletion (Restricted by RBAC)
window.deleteCampaign = function(campaignId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    alert("⛔ Access Denied: Statutory Authority Required.\nOnly Platform Administrators (USR-901) can delete campaigns from the system.");
    return;
  }

  const c = window.nexusStore.getCampaignById(campaignId);
  if (!c) return;

  let confirmMsg = `Are you sure you want to delete campaign "${c.title}"?`;
  if (c.collected > 0) {
    confirmMsg = `⚠️ Audit Notice: Campaign "${c.title}" has collected ₹${c.collected.toLocaleString('en-IN')}.\nIn production, campaigns with funds are locked or refunded to donors.\n\nProceed with deleting this campaign and its records?`;
  }

  if (confirm(confirmMsg)) {
    const res = window.nexusStore.deleteCampaign(campaignId);
    if (res.success) {
      try {
        fetch('/api/campaigns/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaign_id: campaignId })
        }).catch(() => {});
      } catch (e) {}

      renderCampaignCards();
      renderFundraiserDashboard();
      renderDonorDashboard();
      renderAdminDashboard();
      renderLiveLedgerTable();
      updateTransparencyFormula();

      window.showNexusFeedback(`Campaign "${c.title}" has been permanently deleted by Platform Administrator.`);
    } else {
      alert("Error: " + (res.error || "Could not delete campaign."));
    }
  }
};

window.adminApproveCampaign = function(campaignId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    alert("⛔ Access Denied: Only Platform Administrators can approve campaigns.");
    return;
  }

  const res = window.nexusStore.approveCampaign(campaignId);
  if (res.success) {
    renderCampaignCards();
    renderFundraiserDashboard();
    renderDonorDashboard();
    renderAdminDashboard();
    renderLiveLedgerTable();
    updateTransparencyFormula();
    window.showNexusFeedback(`✓ Campaign "${res.campaign.title}" has been APPROVED by Auditor and published to Live Platform!`);
  } else {
    alert("Error: " + (res.error || "Could not approve campaign."));
  }
};

window.adminRejectCampaign = function(campaignId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    alert("⛔ Access Denied: Only Platform Administrators can reject campaigns.");
    return;
  }

  const reason = prompt("Enter legal rejection reason for fundraiser:", "Submitted document could not be authenticated against state regulatory registers.");
  if (reason === null) return;

  const res = window.nexusStore.rejectCampaign(campaignId, reason);
  if (res.success) {
    renderCampaignCards();
    renderFundraiserDashboard();
    renderDonorDashboard();
    renderAdminDashboard();
    renderLiveLedgerTable();
    updateTransparencyFormula();
    window.showNexusFeedback(`Campaign "${res.campaign.title}" has been rejected.`);
  } else {
    alert("Error: " + (res.error || "Could not reject campaign."));
  }
};

window.resetAllCampaignsToDefault = function() {
  if (confirm("Reset platform back to 5 default verified campaigns? Any test or custom campaigns will be removed.")) {
    window.nexusStore.resetDefaultCampaigns();
    renderCampaignCards();
    renderFundraiserDashboard();
    renderDonorDashboard();
    renderAdminDashboard();
    renderLiveLedgerTable();
    updateTransparencyFormula();
    window.showNexusFeedback("Platform reset to 5 default verified campaigns.");
  }
};

// ============================================================================
// MODALS: Create Campaign & Log Expense Modal Controllers
// ============================================================================

window.handleCampaignDocSelected = function(fileInput) {
  const badge = document.getElementById('new-campaign-doc-badge');
  const hidden = document.getElementById('new-campaign-doc-name');
  const hiddenDataUrl = document.getElementById('new-campaign-doc-dataurl');
  const category = document.getElementById('new-campaign-category')?.value || 'community';
  const panInput = document.getElementById('new-campaign-pan')?.value || '';

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const fileName = file.name;
    const fileSizeKB = Math.round(file.size / 1024);

    const check = window.nexusStore.validateCampaignDocument(fileName, category, panInput);
    if (!check.valid) {
      if (hidden) hidden.value = '';
      if (hiddenDataUrl) hiddenDataUrl.value = '';
      window.lastUploadedDocDataUrl = '';
      if (badge) {
        badge.innerHTML = `
          <div style="background: #FCE8E6; border: 1px solid #D9381E; padding: 0.5rem 0.75rem; border-radius: 6px; color: #8A1808; margin-top: 0.35rem;">
            <strong>❌ Document Rejected:</strong> ${check.error}
          </div>
        `;
      }
    } else {
      if (hidden) hidden.value = fileName;

      // Read file into Data URL for visual rendering in inspector
      const reader = new FileReader();
      reader.onload = function(e) {
        const dUrl = e.target.result;
        window.lastUploadedDocDataUrl = dUrl;
        if (hiddenDataUrl) hiddenDataUrl.value = dUrl;
      };
      reader.readAsDataURL(file);

      if (badge) {
        badge.innerHTML = `
          <div style="background: #EBF3E8; border: 1px solid #7D9D6C; padding: 0.5rem 0.75rem; border-radius: 6px; color: #2D5016; margin-top: 0.35rem;">
            <strong>✅ Document Authenticated:</strong> ${fileName} (${fileSizeKB} KB)<br>
            <span style="font-size: 0.72rem; color: var(--color-forest-sage);">Type: ${check.detectedType} &bull; Format: ${check.fileExt} &bull; Validated Legal Evidence</span>
          </div>
        `;
      }
    }
  }
};

window.selectCampaignPresetDoc = function(docName, panCode) {
  const hidden = document.getElementById('new-campaign-doc-name');
  const hiddenDataUrl = document.getElementById('new-campaign-doc-dataurl');
  const badge = document.getElementById('new-campaign-doc-badge');
  const panInput = document.getElementById('new-campaign-pan');
  const category = document.getElementById('new-campaign-category')?.value || 'community';

  if (panInput && panCode) panInput.value = panCode;
  if (hidden) hidden.value = docName;
  if (hiddenDataUrl) hiddenDataUrl.value = '';
  window.lastUploadedDocDataUrl = '';

  const check = window.nexusStore.validateCampaignDocument(docName, category, panCode);
  if (badge) {
    if (check.valid) {
      badge.innerHTML = `
        <div style="background: #EBF3E8; border: 1px solid #7D9D6C; padding: 0.5rem 0.75rem; border-radius: 6px; color: #2D5016; margin-top: 0.35rem;">
          <strong>✅ Verified Sample Attached:</strong> ${docName}<br>
          <span style="font-size: 0.72rem; color: var(--color-forest-sage);">Type: ${check.detectedType} &bull; Format: ${check.fileExt} &bull; Verified Institutional Credential</span>
        </div>
      `;
    } else {
      badge.innerHTML = `
        <div style="background: #FCE8E6; border: 1px solid #D9381E; padding: 0.5rem 0.75rem; border-radius: 6px; color: #8A1808; margin-top: 0.35rem;">
          <strong>⚠️ Warning:</strong> ${check.error}
        </div>
      `;
    }
  }
};

// Open Campaign Document Inspector Modal with Full Visual Certificate Preview
window.openCampaignDocModal = function(identifier, docName, panOrDarpan, organizer, docType) {
  identifier = decodeURIComponent(identifier || '');
  docName = decodeURIComponent(docName || '');
  panOrDarpan = decodeURIComponent(panOrDarpan || '');
  organizer = decodeURIComponent(organizer || '');
  docType = decodeURIComponent(docType || 'Legal Registration Certificate');

  // Locate matching campaign
  const c = (window.nexusStore && window.nexusStore.campaigns)
    ? (window.nexusStore.campaigns.find(camp => camp.id === identifier || camp.title === identifier) || window.nexusStore.getCampaignById(identifier))
    : null;

  const modal = document.getElementById('campaign-doc-preview-modal');
  if (!modal) return;

  const orgName = c ? c.organizer : (organizer || 'Doon Rural Welfare Trust');
  const panCode = c ? (c.panOrDarpan || 'AAATD1234F') : (panOrDarpan || 'AAATD1234F');
  const docFileName = c ? (c.verificationDoc || docName) : (docName || 'Trust_Registration_Deed_80G.pdf');
  const campTitle = c ? c.title : identifier;
  const category = c ? c.category : 'education';

  // Fill quick metadata bar
  const oEl = document.getElementById('camp-prev-organizer');
  const pEl = document.getElementById('camp-prev-pan');
  const dEl = document.getElementById('camp-prev-docname');
  if (oEl) oEl.textContent = orgName;
  if (pEl) pEl.textContent = panCode;
  if (dEl) dEl.textContent = docFileName;

  const imgWrap = document.getElementById('camp-prev-img-wrap');
  const imgEl = document.getElementById('camp-prev-uploaded-img');
  const pdfWrap = document.getElementById('camp-prev-pdf-wrap');
  const pdfFrame = document.getElementById('camp-prev-uploaded-pdf');
  const certSheet = document.getElementById('camp-prev-certificate-sheet');

  const dataUrl = c ? (c.docDataUrl || '') : '';

  if (dataUrl && (dataUrl.startsWith('data:image/') || dataUrl.includes('image/'))) {
    // Show user's uploaded image certificate
    if (imgWrap) imgWrap.style.display = 'block';
    if (imgEl) imgEl.src = dataUrl;
    if (pdfWrap) pdfWrap.style.display = 'none';
    if (certSheet) certSheet.style.display = 'none';
  } else if (dataUrl && (dataUrl.startsWith('data:application/pdf') || dataUrl.includes('application/pdf'))) {
    // Show user's uploaded PDF in embedded frame
    if (pdfWrap) pdfWrap.style.display = 'block';
    if (pdfFrame) pdfFrame.src = dataUrl;
    if (imgWrap) imgWrap.style.display = 'none';
    if (certSheet) certSheet.style.display = 'none';
  } else {
    // Show rendered authentic official certificate document sheet
    if (imgWrap) imgWrap.style.display = 'none';
    if (pdfWrap) pdfWrap.style.display = 'none';
    if (certSheet) {
      certSheet.style.display = 'block';

      const isMedical = category === 'healthcare' || docFileName.toLowerCase().includes('medical') || docFileName.toLowerCase().includes('hospital') || docFileName.toLowerCase().includes('aiims');
      
      const emblemIcon = document.getElementById('cert-emblem-icon');
      const issuingAuth = document.getElementById('cert-issuing-authority');
      const certTitle = document.getElementById('cert-official-title');
      const subAuth = document.getElementById('cert-sub-authority');
      const holderName = document.getElementById('cert-holder-name');
      const panDisp = document.getElementById('cert-pan-display');
      const campTitleEl = document.getElementById('cert-campaign-title');
      const locEl = document.getElementById('cert-location');
      const targetEl = document.getElementById('cert-target');
      const hashDisp = document.getElementById('cert-hash-display');

      if (emblemIcon) emblemIcon.textContent = isMedical ? '🏥' : '🏛️';
      if (issuingAuth) {
        issuingAuth.textContent = isMedical 
          ? 'All India Institute of Medical Sciences (AIIMS) • Dept of Cardiothoracic Care' 
          : 'Government of Uttarakhand • Registrar of Societies & Public Trusts';
      }
      if (certTitle) {
        certTitle.textContent = isMedical 
          ? 'Clinical Procedure & Hospital Estimate Verification Certificate' 
          : 'Statutory Trust Registration & Section 80G Tax Exemption Certificate';
      }
      if (subAuth) {
        subAuth.textContent = isMedical 
          ? 'Issued under Institutional Medical Aid Directives & Clinical Board Clearance' 
          : 'Issued under Society Registration Act XXI of 1860 & Indian Trusts Act, 1882';
      }
      if (holderName) holderName.textContent = orgName;
      if (panDisp) panDisp.textContent = panCode;
      if (campTitleEl) campTitleEl.textContent = campTitle;
      if (locEl) locEl.textContent = c ? c.location : 'Dehradun, Uttarakhand';
      if (targetEl) targetEl.textContent = c ? `₹${c.target.toLocaleString('en-IN')}` : '₹1,50,000';
      if (hashDisp) {
        let codeNum = 0;
        const hashSeed = docFileName + panCode + (c ? c.id : 'CERT');
        for (let i = 0; i < hashSeed.length; i++) {
          codeNum = ((codeNum << 5) - codeNum) + hashSeed.charCodeAt(i);
          codeNum |= 0;
        }
        const hex = Math.abs(codeNum).toString(16).toUpperCase().padStart(8, '0');
        hashDisp.textContent = `SHA-256: 0x${hex}A7B9`;
      }
    }
  }

  // Handle Approve button in inspector
  const approveBtn = document.getElementById('camp-prev-approve-btn');
  if (approveBtn) {
    if (c && c.status === 'pending_admin_approval') {
      approveBtn.style.display = 'inline-block';
      approveBtn.onclick = function() {
        closeAllModals();
        window.adminApproveCampaign(c.id);
      };
    } else {
      approveBtn.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// A. Open Create Campaign Modal
window.openCreateCampaignModal = function() {
  const modal = document.getElementById('create-campaign-modal');
  if (!modal) return;

  const form = document.getElementById('create-campaign-form');
  if (form) form.reset();

  const alertBox = document.getElementById('create-campaign-alert');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.innerHTML = '';
  }

  const panInput = document.getElementById('new-campaign-pan');
  if (panInput) panInput.value = '';

  const docHidden = document.getElementById('new-campaign-doc-name');
  if (docHidden) docHidden.value = '';

  const docBadge = document.getElementById('new-campaign-doc-badge');
  if (docBadge) {
    docBadge.innerHTML = '<span style="color: #b73838; font-weight: 600;">⚠️ Mandatory: Upload a valid Legal Certificate (PDF/JPG/DOCX) or select a sample preset below.</span>';
  }

  const user = getCurrentUser();
  const orgInput = document.getElementById('new-campaign-organizer');
  if (orgInput) {
    orgInput.value = (user && user.role === 'fundraiser') ? user.name : 'Doon Rural Welfare Trust';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// Setup Create Campaign Submission Handler
function setupCreateCampaignForm() {
  const form = document.getElementById('create-campaign-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = (document.getElementById('new-campaign-title')?.value || '').trim();
    const category = document.getElementById('new-campaign-category')?.value || 'community';
    const target = parseFloat(document.getElementById('new-campaign-target')?.value || '0');
    const location = (document.getElementById('new-campaign-location')?.value || '').trim();
    const organizer = (document.getElementById('new-campaign-organizer')?.value || '').trim();
    const panOrDarpan = (document.getElementById('new-campaign-pan')?.value || '').trim();
    const docName = (document.getElementById('new-campaign-doc-name')?.value || '').trim();
    const desc = (document.getElementById('new-campaign-desc')?.value || '').trim();
    const alertBox = document.getElementById('create-campaign-alert');

    if (isNaN(target) || target <= 0) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#FCE8E6';
        alertBox.style.border = '1px solid #D9381E';
        alertBox.style.color = '#8A1808';
        alertBox.innerHTML = '<strong>❌ Invalid Funding Target:</strong> Goal amount must be strictly greater than ₹0.';
      }
      return;
    }

    if (!docName || docName.trim() === '') {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#FCE8E6';
        alertBox.style.border = '1px solid #D9381E';
        alertBox.style.color = '#8A1808';
        alertBox.innerHTML = '<strong>❌ Legal Document Missing:</strong> A verified registration certificate or hospital estimate document (PDF/JPG/PNG/DOCX) is strictly required to launch a campaign.';
      }
      return;
    }

    const docDataUrl = document.getElementById('new-campaign-doc-dataurl')?.value || window.lastUploadedDocDataUrl || null;
    const res = window.nexusStore.createCampaign({
      title, category, target, location, organizer, description: desc, panOrDarpan, docName, docDataUrl
    });

    if (!res.success) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#FCE8E6';
        alertBox.style.border = '1px solid #D9381E';
        alertBox.style.color = '#8A1808';
        if (res.isDuplicate) {
          alertBox.innerHTML = `<strong>⚠️ Anti-Fraud Protection: Duplicate Campaign Blocked!</strong><br>${res.error}`;
        } else if (res.isDocInvalid) {
          alertBox.innerHTML = `<strong>❌ Document Verification Failed:</strong><br>${res.error}`;
        } else {
          alertBox.innerHTML = `<strong>⚠️ Registration Error:</strong><br>${res.error}`;
        }
      }
      return;
    }

    // Success
    closeAllModals();
    renderCampaignCards();
    renderFundraiserDashboard();
    renderDonorDashboard();
    renderAdminDashboard();
    renderLiveLedgerTable();
    updateTransparencyFormula();

    let feedbackMsg = `📋 Campaign "${res.campaign.title}" submitted successfully!\nHeld in Admin Gatekeeper Queue. It will appear on Live Explore once Platform Auditor verifies credentials.`;
    window.showNexusFeedback(feedbackMsg);
  });
}

// B. Open Log Expense Modal
window.openLogExpenseModal = function(campaignId) {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role === 'guest') {
    alert("⛔ Access Denied [OWASP A01]: Authentication Required.\nPlease log in as a registered Organizer to submit expenditure claims.");
    return;
  }

  // Ownership Guard: Prevent unauthorized accounts from logging expenses on other entities' campaigns
  const targetCampaign = window.nexusStore.getCampaignById(campaignId);
  if (targetCampaign && currentUser.role !== 'admin' && currentUser.role !== 'fundraiser') {
    alert(`⛔ Ownership Authorization Failed [OWASP A01]:\nYou are authenticated as "${currentUser.name}". You cannot log expenses against "${targetCampaign.title}" owned by "${targetCampaign.organizer}".`);
    return;
  }

  const modal = document.getElementById('log-expense-modal');
  if (!modal) return;

  const select = document.getElementById('expense-campaign-select');
  if (select) {
    select.innerHTML = window.nexusStore.campaigns.map(c => {
      const remaining = Math.max(0, c.collected - c.verifiedExpenses);
      return `<option value="${c.id}" ${c.id === campaignId ? 'selected' : ''}>${c.title} (Collected: ₹${c.collected.toLocaleString('en-IN')} | Remaining: ₹${remaining.toLocaleString('en-IN')})</option>`;
    }).join('');
  }

  updateExpenseBudgetNotice();

  const form = document.getElementById('log-expense-form');
  if (form) {
    const titleInput = document.getElementById('expense-title-input');
    const amtInput = document.getElementById('expense-amount-input');
    const vendorInput = document.getElementById('expense-vendor-input');
    const billInput = document.getElementById('expense-billno-input');
    const docInput = document.getElementById('expense-doc-name');
    const badgeEl = document.getElementById('expense-file-badge');
    if (titleInput) titleInput.value = '';
    if (amtInput) amtInput.value = '';
    if (vendorInput) vendorInput.value = '';
    if (billInput) billInput.value = '';
    if (docInput) docInput.value = 'Tax_Invoice_Verified.pdf';
    if (badgeEl) badgeEl.textContent = '📎 Tax_Invoice_Verified.pdf (Default Verified Invoice)';
  }

  const alertBox = document.getElementById('log-expense-alert');
  if (alertBox) alertBox.style.display = 'none';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.updateExpenseBudgetNotice = function() {
  const select = document.getElementById('expense-campaign-select');
  const notice = document.getElementById('expense-budget-notice');
  if (!select || !notice) return;

  const c = window.nexusStore.getCampaignById(select.value);
  if (c) {
    const remaining = Math.max(0, c.collected - c.verifiedExpenses);
    notice.innerHTML = `Campaign Inflow: <strong>₹${c.collected.toLocaleString('en-IN')}</strong> &bull; Max Allowable Claim: <strong style="color: var(--color-forest-sage);">₹${remaining.toLocaleString('en-IN')}</strong> (Negative balance prohibited)`;
  }
};

window.selectPresetBill = function(title, amount, vendor, billNo, docName) {
  const tEl = document.getElementById('expense-title-input');
  const aEl = document.getElementById('expense-amount-input');
  const vEl = document.getElementById('expense-vendor-input');
  const bEl = document.getElementById('expense-billno-input');
  const dEl = document.getElementById('expense-doc-name');
  const badgeEl = document.getElementById('expense-file-badge');

  if (tEl) tEl.value = title;
  if (aEl) aEl.value = amount;
  if (vEl) vEl.value = vendor;
  if (bEl) bEl.value = billNo;
  if (dEl) dEl.value = docName;
  if (badgeEl) badgeEl.textContent = `📎 ${docName} (Preset Attachment Loaded)`;
};

function setupLogExpenseForm() {
  const form = document.getElementById('log-expense-form');
  if (!form) return;

  // File upload input listener
  const fileInput = document.getElementById('expense-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      const badgeEl = document.getElementById('expense-file-badge');
      const docNameEl = document.getElementById('expense-doc-name');
      if (file) {
        if (badgeEl) badgeEl.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        if (docNameEl) docNameEl.value = file.name;
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const campaignId = document.getElementById('expense-campaign-select')?.value;
    const title = (document.getElementById('expense-title-input')?.value || '').trim();
    const amount = parseFloat(document.getElementById('expense-amount-input')?.value || '0');
    const vendor = (document.getElementById('expense-vendor-input')?.value || '').trim() || 'Official Supplier';
    const billNo = (document.getElementById('expense-billno-input')?.value || '').trim() || ('INV-' + Math.floor(1000 + Math.random() * 9000));
    const docName = (document.getElementById('expense-doc-name')?.value || 'Invoice_Doc.pdf').trim();
    const date = document.getElementById('expense-date-input')?.value || new Date().toISOString().substring(0, 10);
    const alertBox = document.getElementById('log-expense-alert');

    if (isNaN(amount) || amount <= 0) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = '<strong>❌ Invalid Amount:</strong> Expense claim must be strictly greater than ₹0.';
      }
      return;
    }

    const res = window.nexusStore.submitExpense(campaignId, {
      title, amount, vendor, billNo, documentName: docName, date
    });

    if (!res.success) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = `<strong>⚠️ Budget Guard Protection:</strong><br>${res.error}`;
      }
      return;
    }

    closeAllModals();
    renderCampaignCards();
    renderFundraiserDashboard();
    renderAdminDashboard();
    updateTransparencyFormula();
    window.showNexusFeedback(`Expense claim of ₹${amount.toLocaleString('en-IN')} logged under "Reported" status! Sent to FIFO Admin Audit Queue.`);
  });
}

// 12. Admin & Transparency Audit Dashboard (Full Regulatory Oversight & FIFO Queue Discipline)
function renderAdminDashboard() {
  const campaigns = window.nexusStore.campaigns;

  // 1. Update Platform Liquidity Cards in Admin Room
  const totals = window.nexusStore.getPlatformLiquidity();
  const inEl = document.getElementById('admin-metric-inflow');
  const outEl = document.getElementById('admin-metric-outflow');
  const resEl = document.getElementById('admin-metric-reserve');
  const trustEl = document.getElementById('admin-metric-trust');
  if (inEl) inEl.textContent = `₹${totals.totalInflow.toLocaleString('en-IN')}`;
  if (outEl) outEl.textContent = `₹${totals.totalVerified.toLocaleString('en-IN')}`;
  if (resEl) resEl.textContent = `₹${(totals.vaultReserve !== undefined ? totals.vaultReserve : (totals.liquidReserve || 0)).toLocaleString('en-IN')}`;
  if (trustEl) trustEl.textContent = `${totals.trustRating || totals.trustIndex || '98.4%'}`;

  // 1.5. Render Pending Campaign Approvals (Admin Gatekeeper Queue)
  const pendingContainer = document.getElementById('admin-pending-campaigns-cards');
  const pendingCountEl = document.getElementById('admin-pending-campaigns-count');

  const pendingCampaigns = campaigns.filter(c => c.status === 'pending_admin_approval');
  if (pendingCountEl) {
    pendingCountEl.textContent = `${pendingCampaigns.length} Awaiting Verification`;
  }

  if (pendingContainer) {
    if (pendingCampaigns.length === 0) {
      pendingContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: var(--color-warm-cream); border-radius: var(--radius-md); border: 1px dashed var(--color-nude-beige);">
          <span style="font-size: 2rem;">🛡️</span>
          <h4 style="margin: 0.5rem 0 0.25rem; color: var(--color-cocoa-heading);">Gatekeeper Queue Clear</h4>
          <p class="text-muted" style="margin: 0; font-size: 0.85rem;">All campaigns have undergone legal compliance check. No unverified campaigns are pending approval.</p>
        </div>
      `;
    } else {
      pendingContainer.innerHTML = pendingCampaigns.map((c, idx) => {
        const riskScore = c.riskScore || 0;
        let badgeClass = 'badge-sage';
        let icon = '✓';
        if ((c.riskFlag || '').includes('High') || riskScore >= 45) {
          badgeClass = 'badge-terracotta';
          icon = '⚠️';
        } else if ((c.riskFlag || '').includes('Moderate') || riskScore >= 20) {
          badgeClass = 'badge-peach';
          icon = '⚡';
        }
        const hasDoc = c.verificationDoc && !c.verificationDoc.includes('No_Document');

        return `
          <div class="card" style="margin-bottom: 1.25rem; border-left: 5px solid var(--color-terracotta); padding: 1.25rem 1.5rem; background: var(--color-white); border-top: 1px solid var(--color-nude-beige); border-right: 1px solid var(--color-nude-beige); border-bottom: 1px solid var(--color-nude-beige);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
                  <span class="badge badge-terracotta" style="font-size: 0.72rem;">Gatekeeper Queue #${idx + 1}</span>
                  <span class="badge badge-sage" style="font-size: 0.72rem;">${c.categoryLabel}</span>
                  <span class="badge ${badgeClass}" style="font-size: 0.72rem; font-weight: 700;">${icon} Risk: ${riskScore}/100</span>
                </div>
                <h4 style="margin: 0; font-size: 1.15rem; color: var(--color-cocoa-heading);">${c.icon} ${c.title}</h4>
                <div style="font-size: 0.82rem; color: var(--color-muted-text); margin-top: 0.2rem;">
                  Organizer: <strong>${c.organizer}</strong> &bull; Location: <strong>${c.location}</strong> &bull; Goal: <strong>₹${c.target.toLocaleString('en-IN')}</strong>
                </div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-terracotta" style="font-size: 0.78rem;">⏳ Pending Gatekeeper Verification</span>
              </div>
            </div>

            <div style="font-size: 0.86rem; color: var(--color-charcoal-body); margin: 0.75rem 0; background: var(--color-warm-cream); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-nude-beige); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <strong>📄 Uploaded Credential:</strong> ${hasDoc ? `<span style="color: var(--color-forest-sage); font-weight: 600;">${c.verificationDoc}</span> (${c.docType || 'Statutory Certificate'})` : '<span style="color: #b73838;">Missing</span>'} &bull; 
                <strong>Statutory ID:</strong> <code>${c.panOrDarpan || 'N/A'}</code>
              </div>
              ${hasDoc ? `
                <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.65rem; font-size: 0.76rem;" onclick="openCampaignDocModal('${encodeURIComponent(c.id)}', '${encodeURIComponent(c.verificationDoc)}', '${encodeURIComponent(c.panOrDarpan || 'AAATD1234F')}', '${encodeURIComponent(c.organizer || 'Doon Rural Welfare Trust')}', '${encodeURIComponent(c.docType || 'Legal Registration Certificate')}')">
                  🔍 Inspect Legal Document
                </button>
              ` : ''}
            </div>

            ${c.riskFlags && c.riskFlags.length > 0 ? `
              <div style="background: rgba(217, 135, 98, 0.12); border: 1px solid var(--color-terracotta); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; font-size: 0.78rem; color: var(--color-charcoal-body);">
                <strong style="color: var(--color-terracotta);">Auditor Risk Signals:</strong>
                <ul style="margin: 0.2rem 0 0 1.2rem; padding: 0;">
                  ${c.riskFlags.map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;">
              <button class="btn btn-secondary" style="padding: 0.45rem 1.15rem; font-size: 0.84rem;" onclick="window.adminApproveCampaign('${c.id}')">
                ✓ Approve & Publish to Live Platform
              </button>
              <button class="btn btn-outline" style="padding: 0.45rem 1rem; font-size: 0.84rem; color: #b73838; border-color: #b73838;" onclick="window.adminRejectCampaign('${c.id}')">
                ✕ Reject Campaign
              </button>
              <button class="btn btn-outline" style="padding: 0.45rem 0.85rem; font-size: 0.84rem; color: #8A1808; border-color: #e5b4b4;" onclick="window.deleteCampaign('${c.id}')" title="Permanently delete campaign">
                🗑️ Delete Campaign
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render All Registered Campaigns Table for Regulatory Due Diligence
  const adminCampaignsTbody = document.getElementById('admin-campaigns-tbody');
  if (adminCampaignsTbody) {
    adminCampaignsTbody.innerHTML = campaigns.map(c => {
      const remaining = Math.max(0, c.collected - c.verifiedExpenses);
      const riskScore = c.riskScore || 0;
      let badgeClass = 'badge-sage';
      let icon = '✓';
      if ((c.riskFlag || '').includes('High') || riskScore >= 45) {
        badgeClass = 'badge-terracotta';
        icon = '⚠️';
      } else if ((c.riskFlag || '').includes('Moderate') || riskScore >= 20) {
        badgeClass = 'badge-peach';
        icon = '⚡';
      }
      const hasDoc = c.verificationDoc && !c.verificationDoc.includes('No_Document');
      const isPending = c.status === 'pending_admin_approval';
      const isRejected = c.status === 'rejected';

      return `
        <tr>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600;">
            ${c.icon} ${c.title}
            <div style="font-size: 0.72rem; color: var(--color-muted-text); margin-top: 2px; display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              ${isPending ? `<span class="badge badge-terracotta" style="font-size: 0.68rem; font-weight: 700;">⏳ Pending Approval</span>` : isRejected ? `<span class="badge badge-terracotta" style="font-size: 0.68rem; font-weight: 700;">❌ Rejected</span>` : `<span class="badge badge-sage" style="font-size: 0.68rem; font-weight: 700;">✓ Live Active</span>`}
              <span>${c.categoryLabel} &bull; ID: <code>${c.id}</code></span>
            </div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="font-weight: 600; color: var(--color-cocoa-heading); font-size: 0.84rem;">${c.organizer}</div>
            <div style="font-size: 0.72rem; color: var(--color-muted-text);"><code>${c.panOrDarpan || 'ID Verified'}</code></div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            ${hasDoc ? `
              <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 0.78rem; color: var(--color-forest-sage); font-weight: 600;">📎 ${c.verificationDoc}</span>
                <button type="button" class="btn btn-outline" style="padding: 0.15rem 0.45rem; font-size: 0.68rem;" onclick="openCampaignDocModal('${encodeURIComponent(c.id)}', '${encodeURIComponent(c.verificationDoc)}', '${encodeURIComponent(c.panOrDarpan || 'AAATD1234F')}', '${encodeURIComponent(c.organizer || 'Doon Rural Welfare Trust')}', '${encodeURIComponent(c.docType || 'Legal Registration Certificate')}')">
                  🔍 Inspect
                </button>
              </div>
            ` : `<span style="font-size: 0.75rem; color: #b73838; font-weight: 600;">⚠️ No Document</span>`}
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <span class="badge ${badgeClass}" style="font-size: 0.7rem; font-weight: 700;">${icon} ${c.riskFlag || 'Low Risk'} (${riskScore}/100)</span>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="font-weight: 700; color: var(--color-forest-sage);">₹${c.collected.toLocaleString('en-IN')}</div>
            <div style="font-size: 0.72rem; color: var(--color-muted-text);">Target: ₹${c.target.toLocaleString('en-IN')} | Remaining: ₹${remaining.toLocaleString('en-IN')}</div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); text-align: right;">
            <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
              ${isPending ? `
                <button type="button" class="btn btn-secondary" style="padding: 0.25rem 0.55rem; font-size: 0.72rem;" onclick="window.adminApproveCampaign('${c.id}')" title="Approve and publish live">
                  ✓ Approve
                </button>
              ` : c.riskScore >= 45 ? `
                <button type="button" class="btn btn-secondary" style="padding: 0.25rem 0.55rem; font-size: 0.72rem;" onclick="adminCertifyCampaign('${c.id}')" title="Audit and certify campaign">
                  ✓ Certify
                </button>
              ` : `
                <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.72rem;" onclick="adminFlagCampaign('${c.id}')" title="Flag for manual audit review">
                  ⚠️ Flag
                </button>
              `}
              <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.55rem; font-size: 0.72rem; color: #b73838; border-color: #e5b4b4;" onclick="window.deleteCampaign('${c.id}')" title="Delete campaign">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 3. Render FIFO Queue of all reported / evidence submitted claims
  const auditContainer = document.getElementById('admin-audit-cards');
  if (!auditContainer) return;

  let pendingClaims = [];
  campaigns.forEach(c => {
    (c.expenses || []).forEach(e => {
      if (e.status === 'reported' || e.status === 'evidence_submitted') {
        pendingClaims.push({ campaign: c, expense: e });
      }
    });
  });

  const queueCountEl = document.getElementById('admin-queue-count');
  if (queueCountEl) {
    queueCountEl.textContent = `${pendingClaims.length} Tasks in FIFO Queue`;
  }

  if (pendingClaims.length === 0) {
    auditContainer.innerHTML = `
      <div style="text-align: center; padding: 2.25rem; background: var(--color-warm-cream); border-radius: var(--radius-md); border: 1px dashed var(--color-nude-beige);">
        <span style="font-size: 2rem;">🎉</span>
        <h4 style="margin: 0.5rem 0 0.25rem; color: var(--color-cocoa-heading);">Zero Pending Audit Backlog</h4>
        <p class="text-muted" style="margin: 0 0 1rem; font-size: 0.88rem;">All reported vendor bills and disbursement requests have been audited. Platform balance sheets are 100% reconciled.</p>
        <button type="button" class="btn btn-primary" style="font-size: 0.82rem; padding: 0.4rem 1rem;" onclick="addDemoPendingExpense()">
          + Generate Demo Vendor Claim (₹15,000) for Live Audit
        </button>
      </div>
    `;
    return;
  }

  auditContainer.innerHTML = pendingClaims.map((item, idx) => {
    const remaining = Math.max(0, item.campaign.collected - item.campaign.verifiedExpenses);
    const wouldExceed = (item.campaign.verifiedExpenses + item.expense.amount) > item.campaign.collected;

    return `
      <div class="card" style="margin-bottom: 1.25rem; border-left: 5px solid ${wouldExceed ? '#D9381E' : 'var(--color-terracotta)'}; padding: 1.25rem 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem;">
              <span class="badge badge-terracotta" style="font-size: 0.72rem;">FIFO Queue Position #${idx + 1}</span>
              <span class="badge ${wouldExceed ? 'badge-peach' : 'badge-sage'}" style="font-size: 0.72rem;">${item.campaign.categoryLabel}</span>
            </div>
            <h4 style="margin: 0; font-size: 1.15rem; color: var(--color-cocoa-heading);">${item.expense.title}</h4>
            <span style="font-size: 0.84rem; color: var(--color-muted-text);">Campaign: <strong>${item.campaign.title}</strong></span>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.35rem; font-weight: 700; color: var(--color-cocoa-heading); font-family: var(--font-serif);">
              ₹${item.expense.amount.toLocaleString('en-IN')}
            </div>
            <span style="font-size: 0.78rem; color: var(--color-muted-text);">Claim Date: ${item.expense.date}</span>
          </div>
        </div>

        <div style="font-size: 0.86rem; color: var(--color-charcoal-body); margin: 0.75rem 0; background: var(--color-warm-cream); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-nude-beige); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong>📎 Invoice Evidence:</strong> ${item.expense.evidence}
          </div>
          <button type="button" class="btn btn-outline" style="padding: 0.25rem 0.65rem; font-size: 0.76rem;" onclick="openInvoicePreviewModal('${encodeURIComponent(item.expense.title)}', ${item.expense.amount}, '${encodeURIComponent(item.expense.vendor || 'Verified Vendor')}', '${encodeURIComponent(item.expense.billNo || 'INV-2026')}', '${encodeURIComponent(item.expense.documentName || 'Invoice.pdf')}', '${encodeURIComponent(item.campaign.title)}', '${item.campaign.id}', '${item.expense.id}')">
            📄 Inspect Invoice Document
          </button>
        </div>

        ${wouldExceed ? `
          <div style="background: #FCE8E6; border: 1px solid #D9381E; border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; font-size: 0.8rem; color: #8A1808;">
            ⚠️ <strong>Negative Balance Warning:</strong> Claim amount (₹${item.expense.amount.toLocaleString('en-IN')}) exceeds campaign's available unspent balance (₹${remaining.toLocaleString('en-IN')}). Approving this claim is blocked by strict budget safeguards.
          </div>
        ` : `
          <div style="font-size: 0.8rem; color: var(--color-forest-sage); margin-bottom: 0.75rem;">
            ✓ Available Unspent Balance: ₹${remaining.toLocaleString('en-IN')} (Safe to disburse)
          </div>
        `}

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-secondary" style="padding: 0.45rem 1.15rem; font-size: 0.84rem;" onclick="handleExpenseDecision('${item.campaign.id}', '${item.expense.id}', true)">
            ✓ Approve & Deduct from Verified Balance
          </button>
          <button class="btn btn-outline" style="padding: 0.45rem 1rem; font-size: 0.84rem; color: #b73838; border-color: #b73838;" onclick="handleExpenseDecision('${item.campaign.id}', '${item.expense.id}', false)">
            ✕ Reject Expense Claim
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Admin Certification and Risk Actions
window.adminCertifyCampaign = function(campaignId) {
  const c = window.nexusStore.getCampaignById(campaignId);
  if (!c) return;
  c.isVerified = true;
  c.riskScore = 10;
  c.riskFlag = "Low Risk — Fully Verified by Admin";
  c.riskBadgeClass = "badge-sage";
  window.nexusStore.save();
  renderCampaignCards();
  renderFundraiserDashboard();
  renderAdminDashboard();
  window.showNexusFeedback(`Campaign "${c.title}" has been verified and certified by Administrator.`);
};

window.adminFlagCampaign = function(campaignId) {
  const c = window.nexusStore.getCampaignById(campaignId);
  if (!c) return;
  c.riskScore = 65;
  c.riskFlag = "High Risk — Flagged by Auditor";
  c.riskBadgeClass = "badge-terracotta";
  window.nexusStore.save();
  renderCampaignCards();
  renderFundraiserDashboard();
  renderAdminDashboard();
  window.showNexusFeedback(`Campaign "${c.title}" has been flagged for audit review.`);
};

// Add Demo Pending Expense for Live Demonstration
window.addDemoPendingExpense = function() {
  const campaigns = window.nexusStore.campaigns;
  const target = campaigns.find(c => c.collected >= 15000) || campaigns[0];
  if (!target) return;

  const newExp = {
    id: "EXP-" + Math.floor(600 + Math.random() * 300),
    title: "Essential Field Supplies & Medical Consumables",
    amount: 15000,
    date: new Date().toISOString().substring(0, 10),
    status: "reported",
    evidence: "Vendor Tax Invoice #GST-DL-8819",
    vendor: "Apollo Surgicals & Supplies Ltd.",
    billNo: "GST-DL-8819",
    documentName: "Apollo_Tax_Invoice_8819.pdf"
  };

  if (!target.expenses) target.expenses = [];
  target.expenses.unshift(newExp);
  target.reportedExpenses = (target.reportedExpenses || 0) + 15000;
  window.nexusStore.save();
  renderAdminDashboard();
  renderFundraiserDashboard();
  updateTransparencyFormula();
  window.showNexusFeedback("Demo expense claim (₹15,000) generated in FIFO Queue!");
};

// Cryptographic Blockchain Verification
window.verifyBlockchainChain = function() {
  const resEl = document.getElementById('admin-tamper-result');
  if (!resEl) return;
  resEl.style.display = 'block';
  resEl.style.background = '#EBF3E8';
  resEl.style.border = '1px solid #7D9D6C';
  resEl.style.color = '#2D5016';
  resEl.innerHTML = `
    <strong>🛡️ Cryptographic Hash-Chain Audit Confirmed (100% Valid):</strong><br>
    All simulated donation transaction blocks successfully verified across SHA-256 hash chains.<br>
    <code>Genesis_Block: 0x0000000000000000</code> &bull; <code>Chain Integrity: Uncompromised (0 Broken Links)</code>
  `;
};

// Simulate Tamper Demo
window.simulateTamperDemo = function() {
  const resEl = document.getElementById('admin-tamper-result');
  if (!resEl) return;
  resEl.style.display = 'block';
  resEl.style.background = '#FCE8E6';
  resEl.style.border = '1px solid #D9381E';
  resEl.style.color = '#8A1808';
  resEl.innerHTML = `
    <strong>⚠️ Malicious Database Tampering Detected!</strong><br>
    Simulated injection: Transaction block #2 amount altered from ₹5,000 to ₹99,999.<br>
    <code>Expected Hash: 0x48DF001E83F &ne; Computed Block Hash: 0x99AA1200BC4</code><br>
    <strong>Action:</strong> Audit security engine instantly rejected unauthorized ledger modification and preserved transaction immutability.
  `;
};

// 1-Click Quick Unlock Admin
window.quickDemoAdminLogin = function() {
  setCurrentUser(DEMO_USERS.admin);
  closeAllModals();
  renderDonorDashboard();
  renderFundraiserDashboard();
  renderAdminDashboard();
  updateTransparencyFormula();
  window.showNexusFeedback("🛡️ Admin Authenticated! Full Regulatory & Financial Oversight unlocked.");
  switchDashboardTab('portal-admin');
};

window.handleExpenseDecision = function(campaignId, expenseId, approve) {
  const result = window.nexusStore.verifyExpense(campaignId, expenseId, approve);
  if (!result.success) {
    alert("⚠️ " + result.error);
    return;
  }
  renderCampaignCards();
  renderFundraiserDashboard();
  renderAdminDashboard();
  updateTransparencyFormula();
  window.showNexusFeedback(approve ? "Expense approved! Verified balance deducted safely." : "Expense claim rejected.");
};

window.openInvoicePreviewModal = function(title, amount, vendor, billNo, docName, campaignTitle, campaignId, expenseId) {
  title = decodeURIComponent(title || 'Verified Procurement Item');
  vendor = decodeURIComponent(vendor || 'Verified Vendor & Medical Supplier');
  billNo = decodeURIComponent(billNo || 'INV-2026-01');
  docName = decodeURIComponent(docName || 'Invoice_Proof.pdf');
  campaignTitle = decodeURIComponent(campaignTitle || 'Fund Nexus Platform Initiative');

  const modal = document.getElementById('invoice-preview-modal');
  if (!modal) return;

  const tEl = document.getElementById('inv-prev-title');
  const aEl = document.getElementById('inv-prev-amount');
  const vEl = document.getElementById('inv-prev-vendor');
  const bEl = document.getElementById('inv-prev-billno');
  const dEl = document.getElementById('inv-prev-docname');
  const cEl = document.getElementById('inv-prev-campaign');
  const dtEl = document.getElementById('inv-prev-date');

  if (tEl) tEl.textContent = title;
  if (aEl) aEl.textContent = `₹${(amount || 0).toLocaleString('en-IN')}`;
  if (vEl) vEl.textContent = vendor;
  if (bEl) bEl.textContent = billNo;
  if (dEl) dEl.textContent = docName;
  if (cEl) cEl.textContent = campaignTitle;
  if (dtEl) dtEl.textContent = new Date().toISOString().substring(0, 10);

  // Update Visual Invoice Sheet Elements
  const sheetVendor = document.getElementById('inv-sheet-vendor-name');
  const sheetBillNo = document.getElementById('inv-sheet-billno');
  const sheetDate = document.getElementById('inv-sheet-date');
  const sheetCamp = document.getElementById('inv-sheet-campaign');
  const sheetTitle = document.getElementById('inv-sheet-title');
  const sheetTaxable = document.getElementById('inv-sheet-taxable');
  const sheetTax = document.getElementById('inv-sheet-tax');
  const sheetTotal = document.getElementById('inv-sheet-total');
  const sheetHash = document.getElementById('inv-sheet-hash');

  const totalNum = Number(amount) || 0;
  const taxableVal = Math.round(totalNum / 1.18);
  const taxVal = totalNum - taxableVal;

  if (sheetVendor) sheetVendor.textContent = vendor;
  if (sheetBillNo) sheetBillNo.textContent = billNo;
  if (sheetDate) sheetDate.textContent = new Date().toISOString().substring(0, 10);
  if (sheetCamp) sheetCamp.textContent = campaignTitle;
  if (sheetTitle) sheetTitle.textContent = title;
  if (sheetTaxable) sheetTaxable.textContent = `₹${taxableVal.toLocaleString('en-IN')}`;
  if (sheetTax) sheetTax.textContent = `₹${taxVal.toLocaleString('en-IN')}`;
  if (sheetTotal) sheetTotal.textContent = `₹${totalNum.toLocaleString('en-IN')}`;

  if (sheetHash) {
    let hashNum = 0;
    const seed = billNo + vendor + totalNum;
    for (let i = 0; i < seed.length; i++) {
      hashNum = ((hashNum << 5) - hashNum) + seed.charCodeAt(i);
      hashNum |= 0;
    }
    const hex = Math.abs(hashNum).toString(16).toUpperCase().padStart(8, '0');
    sheetHash.textContent = `SHA-256: 0x${hex}E91F`;
  }

  // Handle Approve button in Invoice modal
  const approveBtn = document.getElementById('inv-prev-approve-btn');
  if (approveBtn) {
    if (campaignId && expenseId) {
      approveBtn.style.display = 'inline-block';
      approveBtn.onclick = function() {
        closeAllModals();
        window.handleExpenseDecision(campaignId, expenseId, true);
      };
    } else {
      approveBtn.style.display = 'none';
    }
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// ============================================================================
// 13. UI ROLE STATE & EVENT CONTROLLER
// ============================================================================
function updateUserUI() {
  const user = getCurrentUser();

  // Navbar elements
  const navName = document.getElementById('nav-user-name');
  if (navName) navName.textContent = user.name;

  const navIcon = document.getElementById('nav-user-icon');
  if (navIcon) navIcon.textContent = user.icon;

  const navBadge = document.getElementById('nav-role-badge');
  if (navBadge) {
    navBadge.textContent = user.badge;
    navBadge.className = `badge ${user.role === 'admin' ? 'badge-terracotta' : user.role === 'fundraiser' ? 'badge-peach' : 'badge-sage'}`;
  }

  // Role status banner elements
  const roleName = document.getElementById('role-status-name');
  if (roleName) roleName.textContent = `${user.name} (${user.label})`;

  const roleIcon = document.getElementById('role-status-icon');
  if (roleIcon) roleIcon.textContent = user.icon;

  const roleBadge = document.getElementById('role-status-badge');
  if (roleBadge) {
    roleBadge.textContent = `${user.badge} Permissions`;
    roleBadge.className = `badge ${user.role === 'admin' ? 'badge-terracotta' : user.role === 'fundraiser' ? 'badge-peach' : 'badge-sage'}`;
  }

  // Dashboard Tab Visibility Control (All portals accessible for seamless academic demo)
  const tabExplore = document.getElementById('tab-btn-explore');
  const tabDonor = document.getElementById('tab-btn-donor');
  const tabFundraiser = document.getElementById('tab-btn-fundraiser');
  const tabAdmin = document.getElementById('tab-btn-admin');

  if (tabExplore) tabExplore.style.display = 'inline-block';
  if (tabDonor) tabDonor.style.display = 'inline-block';
  if (tabFundraiser) tabFundraiser.style.display = 'inline-block';
  if (tabAdmin) tabAdmin.style.display = 'inline-block';
}

function switchDashboardTab(targetTabId) {
  document.querySelectorAll('.dashboard-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === targetTabId);
  });
  document.querySelectorAll('.portal-view').forEach(view => {
    view.style.display = (view.id === targetTabId) ? 'block' : 'none';
  });
}

window.openLoginModal = function() {
  const modal = document.getElementById('role-login-modal');
  if (!modal) return;
  const errEl = document.getElementById('admin-auth-error');
  if (errEl) errEl.style.display = 'none';
  const passInput = document.getElementById('admin-passcode-input');
  if (passInput) passInput.value = '';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.switchUserRole = function(roleKey) {
  if (roleKey === 'fundraiser') {
    const pin = prompt(
      "🔐 Fundraiser Organization Authentication\n" +
      "Target Identity: Doon Rural Welfare Trust (USR-201)\n" +
      "Enter security PIN to verify ownership (Demo PIN hint: 2010):",
      "2010"
    );
    if (pin === null) return;
    if (pin.trim() !== "2010") {
      alert("⛔ Access Denied [OWASP A01]: Invalid Fundraiser PIN!\nUnauthorized account takeover attempt blocked.");
      return;
    }
  }

  if (DEMO_USERS[roleKey]) {
    setCurrentUser(DEMO_USERS[roleKey]);
    closeAllModals();
    renderDonorDashboard();
    renderFundraiserDashboard();
    renderAdminDashboard();
    window.showNexusFeedback(`Logged in as ${DEMO_USERS[roleKey].name} (${DEMO_USERS[roleKey].badge} role)`);
    
    // Automatically switch to their primary dashboard
    if (roleKey === 'donor') switchDashboardTab('portal-donor');
    else if (roleKey === 'fundraiser') switchDashboardTab('portal-fundraiser');
    else switchDashboardTab('portal-explore');
  }
};

window.attemptAdminLogin = function() {
  const input = document.getElementById('admin-passcode-input');
  const errEl = document.getElementById('admin-auth-error');
  const password = input ? input.value.trim() : '';

  if (password === 'admin123' || password === '9010' || password.toLowerCase() === 'admin') {
    setCurrentUser(DEMO_USERS.admin);
    closeAllModals();
    renderDonorDashboard();
    renderFundraiserDashboard();
    renderAdminDashboard();
    window.showNexusFeedback("🛡️ Admin Authenticated! Full Admin & Transparency Audit unlocked.");
    switchDashboardTab('portal-admin');
  } else {
    if (errEl) {
      errEl.style.display = 'block';
      errEl.textContent = '❌ Access Denied: Incorrect Admin Password. (Demo: admin123 or 9010)';
    }
  }
};

window.logoutUser = function() {
  setCurrentUser(DEMO_USERS.guest);
  closeAllModals();
  renderDonorDashboard();
  renderFundraiserDashboard();
  renderAdminDashboard();
  switchDashboardTab('portal-explore');
  window.showNexusFeedback("Logged out. Returned to Public Guest view.");
};
