/**
 * FUND NEXUS — Main Frontend Script
 * Interactive logic for Landing Page, Counter animations, FAQ accordion,
 * and Simulated Giving Previews.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Fund Nexus v1.0 initialized successfully.');

  // 1. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other open FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle clicked FAQ
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 2. Smooth Scrolling for Navigation Anchor Links
  const navAnchors = document.querySelectorAll('a[href^="#"]');
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          
          // Update active link state in navbar
          document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  // 3. Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-item h3');
  let animated = false;

  function runCounters() {
    if (animated) return;
    const statsSection = document.querySelector('.stats-bar');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.9) {
      animated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target') || '0', 10);
        const prefix = stat.getAttribute('data-prefix') || '';
        const suffix = stat.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1200; // ms
        const stepTime = 20;
        const stepIncrement = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
          current += stepIncrement;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', runCounters);
  runCounters(); // Initial check if visible on load

  // 4. Toast Notification Feedback System
  window.showNexusFeedback = function(message) {
    let toast = document.getElementById('nexus-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nexus-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #49352B;
        color: #FFFFFF;
        padding: 14px 22px;
        border-radius: 9999px;
        font-size: 0.92rem;
        font-family: 'Plus Jakarta Sans', sans-serif;
        box-shadow: 0 10px 25px rgba(73, 53, 43, 0.25);
        z-index: 9999;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(14px);
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid rgba(255, 255, 255, 0.15);
      `;
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<span>✦</span> <span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(14px)';
    }, 3200);
  };

  // 5. Simulated Donation Quick-Action
  window.simulateQuickDonation = function(campaignTitle, sampleAmount) {
    const randomTxnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const msg = `Simulated Donation of ₹${sampleAmount.toLocaleString('en-IN')} recorded for "${campaignTitle}". Ref: ${randomTxnId}`;
    window.showNexusFeedback(msg);
  };

  // 6. Dark & Light Theme Controller (Nude Cream & Dark Mocha)
  window.setAppTheme = function(theme) {
    const isDark = (theme === 'dark');
    
    // Apply both attribute and class for 100% selector compatibility
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
    }

    // Update Navbar Toggle Button if present
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
    if (themeText) themeText.textContent = isDark ? 'Light' : 'Dark';

    localStorage.setItem('fund_nexus_theme', theme);
  };

  // Restore saved theme on page load
  const savedTheme = localStorage.getItem('fund_nexus_theme') || 'light';
  window.setAppTheme(savedTheme);

  // Navbar button listener
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      window.setAppTheme(next);
      window.showNexusFeedback(`Switched to ${next === 'dark' ? 'Dark Mocha 🌙' : 'Nude Cream ☀️'}`);
    });
  }
});
