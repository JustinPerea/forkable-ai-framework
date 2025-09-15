/**
 * Configuration Testing Utilities
 * Helper functions to test configuration-driven UI updates
 */

import configManager from '../config/ConfigManager.js';

/**
 * Test configuration updates with sample themes
 */
export const testConfigurationUpdates = () => {
    console.log('🧪 Testing configuration updates...');

    // Sample theme configurations
    const themes = {
        default: {
            branding: {
                name: "AI Image Analyzer",
                tagline: "Get detailed AI analysis of your images",
                colors: {
                    primary: "#667eea",
                    secondary: "#764ba2",
                    accent: "#f093fb"
                }
            }
        },
        purple: {
            branding: {
                name: "Purple AI Vision",
                tagline: "Unleash the power of AI image analysis",
                colors: {
                    primary: "#8b5cf6",
                    secondary: "#a855f7",
                    accent: "#c084fc"
                }
            }
        },
        green: {
            branding: {
                name: "EcoVision AI",
                tagline: "Sustainable AI-powered image insights",
                colors: {
                    primary: "#10b981",
                    secondary: "#059669",
                    accent: "#34d399"
                }
            }
        },
        dark: {
            branding: {
                name: "DarkMode AI",
                tagline: "Professional AI image analysis",
                colors: {
                    primary: "#4f46e5",
                    secondary: "#7c3aed",
                    accent: "#ec4899"
                }
            },
            features: {
                darkMode: true
            }
        }
    };

    // Create theme selector for testing
    createThemeSelector(themes);

    return themes;
};

/**
 * Create a theme selector for testing
 */
const createThemeSelector = (themes) => {
    // Check if selector already exists
    if (document.getElementById('theme-selector')) {
        return;
    }

    const selector = document.createElement('div');
    selector.id = 'theme-selector';
    selector.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        font-family: system-ui, sans-serif;
        min-width: 200px;
    `;

    const title = document.createElement('h4');
    title.textContent = '🎨 Theme Tester';
    title.style.cssText = 'margin: 0 0 10px 0; font-size: 14px; color: #333;';
    selector.appendChild(title);

    const select = document.createElement('select');
    select.style.cssText = `
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        margin-bottom: 10px;
    `;

    // Add theme options
    Object.keys(themes).forEach(themeKey => {
        const option = document.createElement('option');
        option.value = themeKey;
        option.textContent = themes[themeKey].branding.name;
        select.appendChild(option);
    });

    // Add change handler
    select.addEventListener('change', (e) => {
        const selectedTheme = themes[e.target.value];
        console.log(`Switching to theme: ${e.target.value}`, selectedTheme);
        configManager.updateConfig(selectedTheme);
    });

    selector.appendChild(select);

    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset';
    resetBtn.style.cssText = `
        width: 100%;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f8f9fa;
        cursor: pointer;
        font-size: 12px;
    `;
    resetBtn.addEventListener('click', () => {
        console.log('Resetting to default configuration');
        configManager.resetConfig();
        select.value = 'default';
    });
    selector.appendChild(resetBtn);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 8px;
        border: none;
        background: none;
        font-size: 16px;
        cursor: pointer;
        color: #666;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.addEventListener('click', () => {
        selector.remove();
    });
    selector.appendChild(closeBtn);

    document.body.appendChild(selector);
};

/**
 * Test API endpoint configuration
 */
export const testAPIConfiguration = () => {
    console.log('🌐 Testing API configuration...');

    const config = configManager.getConfig();
    const apiUrl = config.api.baseUrl + config.api.endpoints.processImage;

    console.log('API Endpoint:', apiUrl);

    // Test if endpoint is reachable (without sending data)
    fetch(apiUrl.replace('/process-image', '/health'))
        .then(response => {
            if (response.ok) {
                console.log('✅ API endpoint is reachable');
            } else {
                console.log('⚠️ API endpoint responded with error:', response.status);
            }
        })
        .catch(error => {
            console.log('❌ API endpoint is not reachable:', error.message);
            console.log('💡 Make sure the backend server is running on the configured port');
        });
};

/**
 * Log current configuration state
 */
export const logConfigurationState = () => {
    console.group('🔧 Current Configuration State');

    const config = configManager.getConfig();

    console.log('Branding:', config.branding);
    console.log('Features:', config.features);
    console.log('API Configuration:', config.api);
    console.log('UI Settings:', config.ui);

    // Check CSS variables
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    console.log('Applied CSS Variables:');
    console.log('  --color-primary:', computedStyle.getPropertyValue('--color-primary'));
    console.log('  --color-secondary:', computedStyle.getPropertyValue('--color-secondary'));
    console.log('  --color-accent:', computedStyle.getPropertyValue('--color-accent'));

    console.groupEnd();
};

/**
 * Auto-test configuration system
 */
export const runConfigurationTests = () => {
    console.log('🚀 Running configuration system tests...');

    // Wait for DOM to be ready
    setTimeout(() => {
        logConfigurationState();
        testAPIConfiguration();

        // Only create theme selector in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            testConfigurationUpdates();
        }
    }, 1000);
};