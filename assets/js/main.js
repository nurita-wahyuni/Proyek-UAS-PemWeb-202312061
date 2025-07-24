// ===============================================
// OPTIMIZED RENTAL SYSTEM - LIGHTWEIGHT FRAMEWORK
// ===============================================

// Lightweight Animation System
class AnimationEngine {
  constructor() {
    this.observers = new Map();
    this.isInitialized = false;
    // Lazy initialization
    this.initPromise = null;
  }
  
  async init() {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = this.initializeObservers();
    await this.initPromise;
    this.isInitialized = true;
  }

  initializeObservers() {
    // Intersection Observer for reveal animations
    this.observers.set('reveal', new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerAnimation(entry.target, 'reveal');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    ));

    // Mutation Observer for dynamic content
    this.observers.set('mutation', new MutationObserver(
      (mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.initializeElement(node);
            }
          });
        });
      }
    ));
  }

  triggerAnimation(element, type) {
    switch(type) {
      case 'reveal':
        element.classList.add('revealed');
        break;
      case 'bounce':
        element.classList.add('animate-bounce');
        setTimeout(() => element.classList.remove('animate-bounce'), 1000);
        break;
      case 'pulse':
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 2000);
        break;
    }
  }

  observeElement(element, type = 'reveal') {
    const observer = this.observers.get(type);
    if (observer) {
      observer.observe(element);
    }
  }

  initializeElement(element) {
    // Auto-initialize reveal animations
    if (element.classList.contains('animate-reveal')) {
      this.observeElement(element, 'reveal');
    }

    // Initialize interactive elements
    if (element.classList.contains('interactive-card')) {
      this.initializeInteractiveCard(element);
    }
  }

  initializeInteractiveCard(card) {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
      card.style.boxShadow = '0 20px 40px rgba(106, 27, 154, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 8px 25px rgba(106, 27, 154, 0.1)';
    });
  }
}

// Modern UI Manager
class UIManager {
  constructor() {
    this.modals = new Map();
    this.notifications = [];
    this.loadingStates = new Set();
    this.themes = {
      light: 'light-theme',
      dark: 'dark-theme',
      auto: 'auto-theme'
    };
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.initializeUI();
  }

  initializeUI() {
    this.createNotificationContainer();
    this.initializeTheme();
    this.setupGlobalListeners();
  }

  createNotificationContainer() {
    if (!document.querySelector('.notification-container')) {
      const container = document.createElement('div');
      container.className = 'notification-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
  }

  showNotification(message, type = 'info', duration = 5000) {
    const notification = this.createNotification(message, type);
    const container = document.querySelector('.notification-container');
    
    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      this.hideNotification(notification);
    }, duration);

    return notification;
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };

    notification.innerHTML = `
      <div class="notification-content">
        <i class="bi ${icons[type] || icons.info}"></i>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="window.uiManager.hideNotification(this.closest('.notification'))">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `;

    return notification;
  }

  hideNotification(notification) {
    notification.classList.add('hiding');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  showLoading(element, text = 'Loading...') {
    const loadingId = Date.now().toString();
    this.loadingStates.add(loadingId);
    
    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    element.setAttribute('data-loading-id', loadingId);
    
    element.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span>${text}</span>
      </div>
    `;
    
    element.classList.add('loading-state');
    return loadingId;
  }

  hideLoading(element) {
    const loadingId = element.getAttribute('data-loading-id');
    if (loadingId && this.loadingStates.has(loadingId)) {
      this.loadingStates.delete(loadingId);
      const originalContent = element.getAttribute('data-original-content');
      element.innerHTML = originalContent;
      element.classList.remove('loading-state');
      element.removeAttribute('data-original-content');
      element.removeAttribute('data-loading-id');
    }
  }

  setTheme(theme) {
    document.body.classList.remove(...Object.values(this.themes));
    document.body.classList.add(this.themes[theme]);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  initializeTheme() {
    this.setTheme(this.currentTheme);
  }

  setupGlobalListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            this.openQuickSearch();
            break;
          case '/':
            e.preventDefault();
            this.focusSearchInput();
            break;
        }
      }
    });

    // Global click handler for interactive elements
    document.addEventListener('click', (e) => {
      // Handle notification actions
      if (e.target.matches('.notification-action')) {
        this.handleNotificationAction(e.target);
      }
      
      // Handle modal triggers
      if (e.target.matches('[data-modal-target]')) {
        const modalId = e.target.getAttribute('data-modal-target');
        this.openModal(modalId);
      }
    });
  }

  openQuickSearch() {
    // Implementation for quick search modal
    console.log('Quick search opened');
  }

  focusSearchInput() {
    const searchInput = document.querySelector('.search-input, input[type="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: 0,
      interactions: [],
      errors: []
    };
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Page load time
    window.addEventListener('load', () => {
      this.metrics.pageLoad = performance.now();
      console.log(`Page loaded in ${this.metrics.pageLoad.toFixed(2)}ms`);
    });

    // Error tracking
    window.addEventListener('error', (e) => {
      this.metrics.errors.push({
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        timestamp: Date.now()
      });
    });

    // Interaction tracking
    ['click', 'touchstart'].forEach(event => {
      document.addEventListener(event, (e) => {
        this.trackInteraction(e);
      });
    });
  }

  trackInteraction(event) {
    this.metrics.interactions.push({
      type: event.type,
      target: event.target.tagName,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize global instances
const animationEngine = new AnimationEngine();
const uiManager = new UIManager();
const performanceMonitor = new PerformanceMonitor();

// Make instances globally available
window.animationEngine = animationEngine;
window.uiManager = uiManager;
window.performanceMonitor = performanceMonitor;

// Admin Panel Toggle Script for Homepage
if (document.getElementById("adminToggle")) {
  const adminToggle = document.getElementById("adminToggle");
  const adminSidebar = document.getElementById("adminSidebar");
  const homepageOverlay = document.getElementById("homepageOverlay");

  const toggleAdminPanel = () => {
    const isActive = adminToggle.classList.toggle("active");
    adminSidebar.classList.toggle("show", isActive);
    homepageOverlay.classList.toggle("show", isActive);

    document.body.style.overflow = isActive ? "hidden" : "";
    
    // Add modern animation
    if (isActive) {
      animationEngine.triggerAnimation(adminSidebar, 'reveal');
    }
  };

  adminToggle.addEventListener("click", toggleAdminPanel);
  homepageOverlay.addEventListener("click", toggleAdminPanel);
}

// ===== MAIN JAVASCRIPT FOR RENTAL SYSTEM =====

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(function (alert) {
    if (
      alert.classList.contains("alert-success") ||
      alert.classList.contains("alert-info")
    ) {
      setTimeout(function () {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }, 5000);
    }
  });

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      
      // Skip if href is just '#' or empty
      if (!targetId || targetId === '#' || targetId.length <= 1) {
        return;
      }
      
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } catch (error) {
        // Invalid selector, skip smooth scrolling
        console.warn('Invalid selector:', targetId);
      }
    });
  });

  // Form validation enhancement - improved to not interfere with valid submissions
  const forms = document.querySelectorAll("form");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      // Only prevent submission if form is actually invalid
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add("was-validated");
      } else {
        // Form is valid, allow submission
        form.classList.add("was-validated");
        // Don't prevent default - let the form submit normally
      }
    });
  });

  // Password confirmation validation
  const passwordFields = document.querySelectorAll(
    'input[name="new_password"]'
  );
  const confirmFields = document.querySelectorAll(
    'input[name="confirm_password"]'
  );

  if (passwordFields.length > 0 && confirmFields.length > 0) {
    confirmFields[0].addEventListener("input", function () {
      const password = passwordFields[0].value;
      const confirm = this.value;

      if (password !== confirm) {
        this.setCustomValidity("Password tidak cocok");
      } else {
        this.setCustomValidity("");
      }
    });
  }

  // Loading button states - improved to not interfere with form submission
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach(function (button) {
    // Store original button text
    button.setAttribute("data-original-text", button.innerHTML);

    button.addEventListener("click", function (e) {
      const form = this.closest("form");

      // Only add loading state if form is valid and will actually submit
      if (form && form.checkValidity()) {
        const self = this;

        // Set loading state after a very small delay to ensure form submission happens first
        setTimeout(() => {
          if (!self.disabled) {
            // Only if not already disabled
            self.innerHTML =
              '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';
            self.disabled = true;
          }
        }, 50);

        // Re-enable after 10 seconds as fallback
        setTimeout(() => {
          self.disabled = false;
          self.innerHTML = self.getAttribute("data-original-text") || "Submit";
        }, 10000);
      }
    });
  });

  // Image lazy loading
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(function (img) {
    imageObserver.observe(img);
  });

  // Search functionality
  const searchInputs = document.querySelectorAll(
    'input[type="search"], .search-input'
  );
  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const searchTargets = document.querySelectorAll(".searchable");

      searchTargets.forEach(function (target) {
        const text = target.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          target.style.display = "";
        } else {
          target.style.display = "none";
        }
      });
    });
  });

  // Counter animation
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);

        counterObserver.unobserve(counter);
      }
    });
  });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  // Dark mode toggle (if implemented)
  const darkModeToggle = document.querySelector("#darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
      );
    });

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode");
    }
  }

  // Back to top button
  const backToTopButton = document.querySelector("#backToTop");
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.style.display = "block";
      } else {
        backToTopButton.style.display = "none";
      }
    });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Auto-refresh for dashboard (every 5 minutes)
  if (window.location.pathname.includes("dashboard")) {
    setInterval(function () {
      // Only refresh if user is active (not idle)
      if (document.hasFocus()) {
        const statsElements = document.querySelectorAll(
          ".stat-card [data-stat]"
        );
        // You can implement AJAX refresh here
      }
    }, 300000); // 5 minutes
  }

  // Confirmation dialogs
  const deleteButtons = document.querySelectorAll(
    '.btn-delete, [data-action="delete"]'
  );
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      const confirmMessage =
        this.getAttribute("data-confirm") ||
        "Apakah Anda yakin ingin menghapus item ini?";
      if (!confirm(confirmMessage)) {
        e.preventDefault();
      }
    });
  });

  // Format currency inputs
  const currencyInputs = document.querySelectorAll(".currency-input");
  currencyInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      let value = this.value.replace(/[^0-9]/g, "");
      if (value) {
        value = parseInt(value).toLocaleString("id-ID");
        this.value = "Rp " + value;
      }
    });
  });

  // Phone number formatting
  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], .phone-input'
  );
  phoneInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      let value = this.value;

      // Only format if value has sufficient length to avoid auto-prefix on single digits
      if (value.length >= 2) {
        // Remove all non-digit characters except + at the beginning
        value = value.replace(/[^0-9+]/g, "");

        // If starts with 0, replace with +62
        if (value.startsWith("0")) {
          value = "+62" + value.substring(1);
        }
        // If starts with 62 but not +62, add +
        else if (value.startsWith("62") && !value.startsWith("+62")) {
          value = "+" + value;
        }
        // If it's just numbers and doesn't start with +62, and length > 3, add +62
        else if (
          /^[0-9]+$/.test(value) &&
          !value.startsWith("62") &&
          value.length > 3
        ) {
          value = "+62" + value;
        }
      }

      this.value = value;
    });
  });
});

// Utility functions
function showToast(message, type = "info") {
  const toastContainer =
    document.querySelector(".toast-container") || createToastContainer();
  const toast = createToast(message, type);
  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Remove toast after it's hidden
  toast.addEventListener("hidden.bs.toast", function () {
    toast.remove();
  });
}

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "9999";
  document.body.appendChild(container);
  return container;
}

function createToast(message, type) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");

  const typeColors = {
    success: "text-bg-success",
    error: "text-bg-danger",
    warning: "text-bg-warning",
    info: "text-bg-info",
  };

  toast.innerHTML = `
        <div class="toast-header ${typeColors[type] || "text-bg-info"}">
            <strong class="me-auto">Notifikasi</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

  return toast;
}

// Format number to Indonesian currency
function formatCurrency(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

// Format date to Indonesian format
function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for global use
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.debounce = debounce;
