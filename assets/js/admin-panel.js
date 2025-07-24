/**
 * NEXT-LEVEL ADMIN PANEL SYSTEM
 * Ultra-modern hamburger menu with slide animations
 * Integrated with main website homepage
 */

class AdminPanel {
  constructor() {
    this.sidebar = document.querySelector(".admin-sidebar");
    this.content = document.querySelector(".admin-content");
    this.hamburger = document.querySelector(".hamburger-toggle");
    this.mobileMenu = document.querySelector(".mobile-menu-btn");
    this.overlay = document.querySelector(".mobile-overlay");
    this.navLinks = document.querySelectorAll(".admin-nav .nav-link");

    // Only initialize if we're on an admin page
    if (this.sidebar || document.body.classList.contains('admin-page')) {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.setupActiveNavigation();
    this.setupScrollAnimations();
    this.setupStatsCountUp();
    this.loadSavedState();
  }

  setupEventListeners() {
    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener("click", () => this.toggleSidebar());
    }

    // Mobile menu toggle
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", () =>
        this.toggleMobileSidebar()
      );
    }

    // Mobile overlay click
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeMobileSidebar());
    }

    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavigation(e, link));
    });

    // Window resize
    window.addEventListener("resize", () => this.handleResize());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  toggleSidebar() {
    if (!this.sidebar) return;

    const isCollapsed = this.sidebar.classList.contains("collapsed");

    if (isCollapsed) {
      this.expandSidebar();
    } else {
      this.collapseSidebar();
    }

    // Save state
    localStorage.setItem("admin-sidebar-collapsed", !isCollapsed);

    // Update hamburger icon
    this.updateHamburgerIcon(!isCollapsed);
  }

  collapseSidebar() {
    if (!this.sidebar) return;
    
    this.sidebar.classList.add("collapsed");
    this.animateElements(".nav-group-title", "fadeOut", 200);
    this.animateElements(".nav-link span", "fadeOut", 100);

    // Add tooltip functionality for collapsed state
    this.addTooltips();
  }

  expandSidebar() {
    if (!this.sidebar) return;
    
    this.sidebar.classList.remove("collapsed");

    setTimeout(() => {
      this.animateElements(".nav-group-title", "fadeIn", 300);
      this.animateElements(".nav-link span", "fadeIn", 200);
    }, 100);

    // Remove tooltips
    this.removeTooltips();
  }

  toggleMobileSidebar() {
    if (!this.sidebar) return;

    const isVisible = this.sidebar.classList.contains("show");

    if (isVisible) {
      this.closeMobileSidebar();
    } else {
      this.openMobileSidebar();
    }
  }

  openMobileSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add("show");
    }
    if (this.overlay) {
      this.overlay.classList.add("show");
    }
    document.body.style.overflow = "hidden";
  }

  closeMobileSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove("show");
    }
    if (this.overlay) {
      this.overlay.classList.remove("show");
    }
    document.body.style.overflow = "";
  }

  updateHamburgerIcon(collapsed) {
    if (!this.hamburger) return;

    const icon = this.hamburger.querySelector("i") || this.hamburger;
    icon.className = collapsed ? "bi bi-chevron-right" : "bi bi-chevron-left";
  }

  setupActiveNavigation() {
    if (!this.sidebar) return;

    const currentPath = window.location.pathname;

    this.navLinks.forEach((link) => {
      const linkPath = new URL(link.href).pathname;

      if (
        currentPath.includes(linkPath) ||
        (linkPath.includes("dashboard") && currentPath.includes("admin"))
      ) {
        link.classList.add("active");

        // Scroll to active item if collapsed
        if (this.sidebar.classList.contains("collapsed")) {
          link.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  handleNavigation(e, link) {
    // Add loading animation
    this.showLoadingState(link);

    // Remove active from all links
    this.navLinks.forEach((l) => l.classList.remove("active"));

    // Add active to clicked link
    link.classList.add("active");

    // Add ripple effect
    this.createRippleEffect(e, link);

    // Close mobile sidebar if open
    if (window.innerWidth <= 1024) {
      setTimeout(() => this.closeMobileSidebar(), 300);
    }
  }

  showLoadingState(link) {
    const icon = link.querySelector("i");
    const originalClass = icon.className;

    icon.className = "bi bi-arrow-clockwise loading-spin";

    setTimeout(() => {
      icon.className = originalClass;
    }, 1000);
  }

  createRippleEffect(e, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

    element.style.position = "relative";
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  setupScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all stat cards and content cards
    document
      .querySelectorAll(".stat-card, .content-card, .action-card")
      .forEach((card) => {
        observer.observe(card);
      });
  }

  setupStatsCountUp() {
    const statNumbers = document.querySelectorAll(".stat-number");

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.textContent.replace(/\D/g, ""));
      if (target > 0) {
        this.animateCountUp(stat, target);
      }
    });
  }

  animateCountUp(element, target) {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(
        startValue + (target - startValue) * easeOutQuart
      );

      if (target > 1000) {
        element.textContent = (current / 1000).toFixed(1) + "k+";
      } else {
        element.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  addTooltips() {
    this.navLinks.forEach((link) => {
      const span = link.querySelector("span");
      if (span) {
        link.setAttribute("title", span.textContent);
        link.setAttribute("data-bs-toggle", "tooltip");
        link.setAttribute("data-bs-placement", "right");
      }
    });

    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
      const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltips.forEach((tooltip) => new bootstrap.Tooltip(tooltip));
    }
  }

  removeTooltips() {
    this.navLinks.forEach((link) => {
      link.removeAttribute("title");
      link.removeAttribute("data-bs-toggle");
      link.removeAttribute("data-bs-placement");
    });
  }

  handleResize() {
    if (window.innerWidth > 1024) {
      this.closeMobileSidebar();
    }
  }

  handleKeyboard(e) {
    // Alt + M = Toggle sidebar
    if (e.altKey && e.key === "m") {
      e.preventDefault();
      this.toggleSidebar();
    }

    // Escape = Close mobile sidebar
    if (e.key === "Escape" && this.sidebar && this.sidebar.classList.contains("show")) {
      this.closeMobileSidebar();
    }
  }

  animateElements(selector, animation, delay) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animation = `${animation} 0.3s ease forwards`;
      }, index * delay);
    });
  }

  loadSavedState() {
    const isCollapsed =
      localStorage.getItem("admin-sidebar-collapsed") === "true";

    if (isCollapsed) {
      this.collapseSidebar();
      this.updateHamburgerIcon(true);
    }
  }

  // Public methods for external use
  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} notification fade-in`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            border-radius: 15px;
            box-shadow: var(--shadow-card);
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  updateStats(stats) {
    Object.keys(stats).forEach((key) => {
      const element = document.querySelector(
        `[data-stat="${key}"] .stat-number`
      );
      if (element) {
        this.animateCountUp(element, stats[key]);
      }
    });
  }
}

// CSS Animations
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .notification {
        animation: slideInRight 0.3s ease forwards;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.AdminPanel = new AdminPanel();
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdminPanel;
}
