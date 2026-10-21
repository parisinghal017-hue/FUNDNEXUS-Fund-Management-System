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

  let list = [...window.nexusStore.campaigns];

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
    const remaining = c.collected - c.verifiedExpenses;

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
  const remaining = c.collected - c.verifiedExpenses;

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
    const txns = (window.nexusStore.transactions || []).filter(t => t.campaignId === c.id);
    if (txns.length === 0) {
      donationsTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding: 1.25rem;">No simulated contributions recorded for this cause yet. Be the first to donate!</td></tr>`;
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
  const remaining = c1.collected - c1.verifiedExpenses;

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
    const donorName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Anonymous Supporter';

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
        const remaining = c.collected - c.verifiedExpenses;
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
  const totalRemaining = totalDonations - totalVerifiedExp;

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
}

// 8. Live Public Transaction Ledger Renderer
function renderLiveLedgerTable() {
  const tbody = document.getElementById('transparency-live-ledger-tbody');
  if (!tbody) return;

  const txns = window.nexusStore.transactions || [];
  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 1.5rem;">No ledger transactions recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = txns.slice(0, 10).map((t, idx) => `
    <tr style="${idx === 0 ? 'background-color: var(--color-warm-cream); font-weight: 500;' : ''}">
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.date}</td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${t.campaignTitle}</td>
      <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.donorName}</td>
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

      // Enforce Role-Based Access Control on sensitive dashboards
      if (targetTab === 'portal-admin' && currentUser.role !== 'admin') {
        openLoginModal();
        const errEl = document.getElementById('admin-auth-error');
        if (errEl) {
          errEl.style.display = 'block';
          errEl.textContent = '🔒 Admin authentication required. Enter password to unlock Audit Room.';
        }
        window.showNexusFeedback('Access Restricted: Administrator privileges required.');
        return;
      }

      if (targetTab === 'portal-fundraiser' && currentUser.role !== 'fundraiser' && currentUser.role !== 'admin') {
        openLoginModal();
        window.showNexusFeedback('Please log in with Fundraiser credentials to manage campaigns.');
        return;
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

// 10. Donor Dashboard Renderer (Matching reference slide 22 & 23)
function renderDonorDashboard() {
  const currentUser = getCurrentUser();
  const txns = window.nexusStore.transactions || [];
  const campaigns = window.nexusStore.campaigns || [];
  const totalGiven = txns.reduce((sum, t) => sum + t.amount, 0);

  // Update Welcome Banner
  const welcomeName = document.getElementById('donor-welcome-name');
  if (welcomeName) welcomeName.textContent = `Welcome back, ${currentUser.name} 💙`;

  const welcomeId = document.getElementById('donor-welcome-id');
  if (welcomeId) welcomeId.textContent = currentUser.id || 'DNR-4091';

  const totalElem = document.getElementById('donor-total-given');
  if (totalElem) totalElem.textContent = `₹${totalGiven.toLocaleString('en-IN')}`;

  const countElem = document.getElementById('donor-total-txns');
  if (countElem) countElem.textContent = `${txns.length} Donations`;

  // Render All Active Campaigns Table in Donor Portal
  const campTbody = document.getElementById('donor-campaigns-tbody');
  if (campTbody) {
    campTbody.innerHTML = campaigns.map(c => {
      const pct = Math.min(100, Math.round((c.collected / c.target) * 100));
      const remaining = c.collected - c.verifiedExpenses;
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
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 700; color: var(--color-forest-sage); font-size: 0.88rem;">₹${remaining.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); min-width: 110px;">
            <div style="font-size: 0.78rem; font-weight: 600; margin-bottom: 0.2rem;">${pct}%</div>
            <div class="progress-container" style="height: 6px; margin: 0;">
              <div class="progress-bar" style="width: ${pct}%;"></div>
            </div>
          </td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;" onclick="openCampaignModal('${c.id}')">Ledger</button>
              <button class="btn btn-primary" style="padding: 0.3rem 0.7rem; font-size: 0.78rem;" onclick="openDonationModal('${c.id}')">Donate</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Giving History Table
  const tbody = document.getElementById('donor-history-tbody');
  if (tbody) {
    tbody.innerHTML = txns.map(t => `
      <tr>
        <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">${t.date}</td>
        <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600; font-size: 0.88rem;">${t.campaignTitle}</td>
        <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-size: 0.88rem;">₹${t.amount.toLocaleString('en-IN')}</td>
        <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);"><span class="badge badge-sage">Confirmed</span></td>
        <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-family: monospace; font-size: 0.82rem; color: var(--color-muted-text);">${t.id}</td>
      </tr>
    `).join('');
  }
}

// 11. Fundraiser Dashboard Renderer
function renderFundraiserDashboard() {
  const campaigns = window.nexusStore.campaigns;
  const tbody = document.getElementById('fundraiser-campaigns-tbody');
  if (tbody) {
    tbody.innerHTML = campaigns.map(c => {
      const remaining = c.collected - c.verifiedExpenses;
      return `
        <tr>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 600;">${c.title}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">₹${c.target.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); color: var(--color-forest-sage); font-weight: 600;">₹${c.collected.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); color: var(--color-terracotta);">₹${c.reportedExpenses.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige); font-weight: 700;">₹${remaining.toLocaleString('en-IN')}</td>
          <td style="padding: 0.85rem; border-bottom: 1px solid var(--color-nude-beige);">
            <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;" onclick="openExpenseClaimPrompt('${c.id}')">+ Log Expense</button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Expense submission helper
window.openExpenseClaimPrompt = function(campaignId) {
  const title = prompt("Enter expense item description (e.g. Solar cables, Rice sacks, Medical kit):");
  if (!title) return;
  const amountStr = prompt("Enter expenditure amount (₹):");
  const amount = parseInt(amountStr, 10);
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount.");
    return;
  }
  const evidence = prompt("Enter evidence document reference (e.g. Invoice #2049, Mandi Samiti Bill):") || "Self-declaration claim";

  window.nexusStore.submitExpense(campaignId, { title, amount, evidence });
  renderCampaignCards();
  renderFundraiserDashboard();
  renderAdminDashboard();
  window.showNexusFeedback(`Expense claim of ₹${amount.toLocaleString('en-IN')} logged under "Reported" status!`);
};

// 12. Admin & Transparency Audit Dashboard
function renderAdminDashboard() {
  const campaigns = window.nexusStore.campaigns;
  const auditContainer = document.getElementById('admin-audit-cards');
  if (!auditContainer) return;

  let pendingClaims = [];
  campaigns.forEach(c => {
    c.expenses.forEach(e => {
      if (e.status === 'reported' || e.status === 'evidence_submitted') {
        pendingClaims.push({ campaign: c, expense: e });
      }
    });
  });

  if (pendingClaims.length === 0) {
    auditContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: var(--color-warm-cream); border-radius: var(--radius-md); border: 1px dashed var(--color-nude-beige);">
        <p class="text-muted" style="margin: 0;">✓ All reported expenses have been reviewed. Zero pending audit backlog.</p>
      </div>
    `;
    return;
  }

  auditContainer.innerHTML = pendingClaims.map(item => `
    <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--color-terracotta);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <div>
          <span class="badge badge-peach" style="margin-bottom: 0.35rem;">Audit Required</span>
          <h4 style="margin: 0; font-size: 1.1rem;">${item.expense.title}</h4>
          <span style="font-size: 0.82rem; color: var(--color-muted-text);">Campaign: <strong>${item.campaign.title}</strong></span>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-cocoa-heading); font-family: var(--font-serif);">
            ₹${item.expense.amount.toLocaleString('en-IN')}
          </div>
          <span style="font-size: 0.78rem; color: var(--color-muted-text);">Date: ${item.expense.date}</span>
        </div>
      </div>
      <p style="font-size: 0.86rem; color: var(--color-charcoal-body); margin: 0.5rem 0 0.85rem; background: var(--color-warm-cream); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
        📎 <strong>Submitted Evidence:</strong> ${item.expense.evidence}
      </p>
      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.82rem;" onclick="handleExpenseDecision('${item.campaign.id}', '${item.expense.id}', true)">
          ✓ Approve & Deduct from Verified Balance
        </button>
        <button class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.82rem; color: #b73838; border-color: #b73838;" onclick="handleExpenseDecision('${item.campaign.id}', '${item.expense.id}', false)">
          ✕ Reject Expense Claim
        </button>
      </div>
    </div>
  `).join('');
}

window.handleExpenseDecision = function(campaignId, expenseId, approve) {
  window.nexusStore.verifyExpense(campaignId, expenseId, approve);
  renderCampaignCards();
  renderFundraiserDashboard();
  renderAdminDashboard();
  window.showNexusFeedback(approve ? "Expense approved! Verified balance updated." : "Expense rejected.");
};

// ============================================================================
// 13. ROLE-BASED ACCESS CONTROL (RBAC) & AUTHENTICATION CONTROLLER
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

  // Dashboard Tab Visibility Control (RBAC Gating)
  const tabExplore = document.getElementById('tab-btn-explore');
  const tabDonor = document.getElementById('tab-btn-donor');
  const tabFundraiser = document.getElementById('tab-btn-fundraiser');
  const tabAdmin = document.getElementById('tab-btn-admin');

  if (tabExplore) tabExplore.style.display = 'inline-block';
  if (tabDonor) tabDonor.style.display = (user.role === 'donor' || user.role === 'admin') ? 'inline-block' : 'none';
  if (tabFundraiser) tabFundraiser.style.display = (user.role === 'fundraiser' || user.role === 'admin') ? 'inline-block' : 'none';
  if (tabAdmin) tabAdmin.style.display = (user.role === 'admin') ? 'inline-block' : 'none';

  // If currently viewing a restricted portal that is no longer accessible, reset to explore
  const activeTabBtn = document.querySelector('.dashboard-tab-btn.active');
  const activeTabTarget = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : null;

  if (activeTabTarget === 'portal-admin' && user.role !== 'admin') {
    switchDashboardTab('portal-explore');
  } else if (activeTabTarget === 'portal-fundraiser' && user.role !== 'fundraiser' && user.role !== 'admin') {
    switchDashboardTab('portal-explore');
  } else if (activeTabTarget === 'portal-donor' && user.role !== 'donor' && user.role !== 'admin') {
    switchDashboardTab('portal-explore');
  }
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
  if (DEMO_USERS[roleKey]) {
    setCurrentUser(DEMO_USERS[roleKey]);
    closeAllModals();
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
  switchDashboardTab('portal-explore');
  window.showNexusFeedback("Logged out. Returned to Public Guest view.");
};
