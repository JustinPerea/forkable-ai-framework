/**
 * Configuration Manager - Handles dynamic branding and theming
 * Core component for configuration-driven UI updates
 */

class ConfigManager {
    constructor() {
        this.config = null;
        this.defaultConfig = {
            branding: {
                name: "AI Image Analyzer",
                tagline: "Get detailed AI analysis of your images",
                description: "Transform your images with AI-powered analysis",
                colors: {
                    primary: "#667eea",
                    secondary: "#764ba2",
                    accent: "#f093fb",
                    success: "#4caf50",
                    error: "#f44336",
                    warning: "#ff9800",
                    text: "#333",
                    textLight: "#666"
                }
            },
            features: {
                authentication: false,
                payments: false,
                admin: false,
                social: false
            },
            api: {
                baseUrl: window.location.origin + "/api",
                endpoints: {
                    processImage: "/process-image",
                    config: "/config",
                    auth: "/auth",
                    user: "/user",
                    payment: "/payment"
                }
            },
            ui: {
                theme: "default",
                animations: true,
                loadingMessages: [
                    "Processing your image with AI...",
                    "Analyzing visual elements...",
                    "Generating insights..."
                ]
            }
        };

        this.loadConfig();
    }

    /**
     * Load configuration from backend or use defaults
     */
    async loadConfig() {
        try {
            // Try to fetch configuration from backend
            const response = await fetch('/api/config');
            if (response.ok) {
                const serverConfig = await response.json();
                this.config = this.mergeConfigs(this.defaultConfig, serverConfig);
            } else {
                console.warn('Failed to fetch server config, using defaults');
                this.config = this.defaultConfig;
            }
        } catch (error) {
            console.warn('Config API not available, using defaults:', error.message);
            this.config = this.defaultConfig;
        }

        this.applyConfig();
        return this.config;
    }

    /**
     * Deep merge two configuration objects
     */
    mergeConfigs(defaultConfig, serverConfig) {
        const merged = { ...defaultConfig };

        for (const key in serverConfig) {
            if (typeof serverConfig[key] === 'object' && serverConfig[key] !== null && !Array.isArray(serverConfig[key])) {
                merged[key] = { ...merged[key], ...serverConfig[key] };
            } else {
                merged[key] = serverConfig[key];
            }
        }

        return merged;
    }

    /**
     * Apply configuration to the UI
     */
    applyConfig() {
        if (!this.config) return;

        // Update document metadata
        this.updateDocumentMeta();

        // Update branding elements
        this.updateBranding();

        // Update CSS variables for theming
        this.updateTheme();

        // Dispatch configuration loaded event
        window.dispatchEvent(new CustomEvent('configLoaded', {
            detail: this.config
        }));
    }

    /**
     * Update document meta information
     */
    updateDocumentMeta() {
        const { branding } = this.config;

        document.title = branding.name;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = branding.description;
        }
    }

    /**
     * Update branding elements in the UI
     */
    updateBranding() {
        const { branding } = this.config;

        // Update app title
        const titleElement = document.querySelector('.app-title');
        if (titleElement) {
            titleElement.textContent = branding.name;
        }

        // Update app tagline
        const taglineElement = document.querySelector('.app-tagline');
        if (taglineElement) {
            taglineElement.textContent = branding.tagline;
        }
    }

    /**
     * Update CSS variables for theming
     */
    updateTheme() {
        const { colors } = this.config.branding;
        const root = document.documentElement;

        // Set CSS custom properties
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-accent', colors.accent);
        root.style.setProperty('--color-success', colors.success);
        root.style.setProperty('--color-error', colors.error);
        root.style.setProperty('--color-warning', colors.warning);
        root.style.setProperty('--color-text', colors.text);
        root.style.setProperty('--color-text-light', colors.textLight);

        // Create gradient variables
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`);
        root.style.setProperty('--gradient-accent', `linear-gradient(135deg, ${colors.accent} 0%, #f5576c 100%)`);
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return this.config;
    }

    /**
     * Get specific config value by path (e.g., 'branding.colors.primary')
     */
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    /**
     * Update configuration dynamically (useful for admin interface)
     */
    updateConfig(updates) {
        this.config = this.mergeConfigs(this.config, updates);
        this.applyConfig();

        // Save to localStorage for persistence
        localStorage.setItem('app-config-override', JSON.stringify(updates));
    }

    /**
     * Reset to default configuration
     */
    resetConfig() {
        localStorage.removeItem('app-config-override');
        this.config = this.defaultConfig;
        this.applyConfig();
    }

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(feature) {
        return this.config?.features?.[feature] || false;
    }
}

// Create singleton instance
const configManager = new ConfigManager();

export default configManager;