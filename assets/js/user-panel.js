/**
 * MODERN USER PANEL SYSTEM
 * JavaScript enhancements for user pages
 */

class UserPanel {
    constructor() {
        this.hamburger = document.querySelector('.hamburger-toggle');
        this.navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupActiveNavigation();
    }
    
    setupEventListeners() {
        // Hamburger toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Navigation links active state
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.handleNavigation(link));
        });
    }
    
    toggleMobileMenu() {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar) {
            navbar.classList.toggle('show');
        }
    }

    setupActiveNavigation() {
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (currentPath.includes(linkPath)) {
                link.classList.add('active');
            }
        });
    }

    handleNavigation(link) {
        // Remove active from all links
        this.navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked link
        link.classList.add('active');
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UserPanel();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserPanel;
}
