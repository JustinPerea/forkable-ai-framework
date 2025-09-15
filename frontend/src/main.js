/**
 * Main Entry Point - Forkable AI Landing Page
 * Simple landing page showcasing live applications
 */

import './styles/main.css';

/**
 * Landing Page Application
 */
class LandingApp {
    constructor() {
        this.init();
    }

    /**
     * Initialize the landing page
     */
    init() {
        console.log('🚀 Forkable AI Landing Page - Initializing...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup analytics tracking
        this.setupAnalytics();
        
        console.log('✅ Landing page initialized');
    }

    /**
     * Setup event listeners for landing page functionality
     */
    setupEventListeners() {
        // Email signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleEmailSignup.bind(this));
        }
        
        // Smooth scrolling for CTA button
        window.scrollToDemo = () => {
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
                this.trackEvent('cta_clicked', 'hero_section');
            }
        };
        
        // Track demo app clicks
        window.trackClick = (appType) => {
            this.trackEvent('demo_app_clicked', appType);
        };
    }

    /**
     * Handle email signup form submission
     */
    async handleEmailSignup(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const messageDiv = document.getElementById('signup-message');
        
        // Basic email validation
        if (!this.isValidEmail(email)) {
            this.showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            // Store email locally for now (you can integrate with your backend later)
            this.storeEmail(email);
            
            // Track signup
            this.trackEvent('email_signup', email);
            
            // Show success message
            this.showMessage(messageDiv, 'Thanks! We\'ll notify you when Forkable AI launches.', 'success');
            
            // Clear form
            document.getElementById('email').value = '';
            
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage(messageDiv, 'Something went wrong. Please try again.', 'error');
        }
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Store email locally (replace with your backend integration)
     */
    storeEmail(email) {
        const emails = JSON.parse(localStorage.getItem('forkable_emails') || '[]');
        if (!emails.includes(email)) {
            emails.push(email);
            localStorage.setItem('forkable_emails', JSON.stringify(emails));
        }
        console.log('Email stored:', email);
    }

    /**
     * Show message to user
     */
    showMessage(container, message, type = 'info') {
        if (!container) return;
        
        container.textContent = message;
        container.className = `signup-message ${type}`;
        container.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            container.style.display = 'none';
        }, 5000);
    }

    /**
     * Setup analytics tracking
     */
    setupAnalytics() {
        // Track page load
        this.trackEvent('page_load', 'landing_page');
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll >= 25 && maxScroll < 50) {
                    this.trackEvent('scroll_depth', '25_percent');
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    this.trackEvent('scroll_depth', '50_percent');
                } else if (maxScroll >= 75) {
                    this.trackEvent('scroll_depth', '75_percent');
                }
            }
        });
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', `${timeSpent}_seconds`);
        });
    }

    /**
     * Track events (replace with your analytics service)
     */
    trackEvent(event, data) {
        console.log('Track event:', event, data);
        
        // Store locally for now (integrate with Google Analytics, Mixpanel, etc. later)
        const events = JSON.parse(localStorage.getItem('forkable_events') || '[]');
        events.push({
            event,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        localStorage.setItem('forkable_events', JSON.stringify(events));
        
        // If you have Google Analytics, you can add it here:
        // gtag('event', event, { custom_parameter: data });
    }

    /**
     * Get analytics data for debugging
     */
    getAnalyticsData() {
        return {
            emails: JSON.parse(localStorage.getItem('forkable_emails') || '[]'),
            events: JSON.parse(localStorage.getItem('forkable_events') || '[]')
        };
    }

    /**
     * Get app instance for debugging
     */
    static getInstance() {
        return window.forkableLanding;
    }
}

// Initialize landing page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanding);
} else {
    initializeLanding();
}

function initializeLanding() {
    // Create global app instance for debugging
    window.forkableLanding = new LandingApp();
}

// Export for module compatibility
export default LandingApp;