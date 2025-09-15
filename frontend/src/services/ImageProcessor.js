/**
 * Image Processing Service
 * Handles image upload, processing, and result display
 */

import configManager from '../config/ConfigManager.js';

class ImageProcessor {
    constructor() {
        this.selectedFile = null;
        this.apiUrl = null;
        this.initializeEventListeners();
        this.setupConfiguration();
    }

    /**
     * Setup configuration and wait for config to load
     */
    async setupConfiguration() {
        // Wait for configuration to be loaded
        if (!configManager.getConfig()) {
            await configManager.loadConfig();
        }

        const config = configManager.getConfig();
        this.apiUrl = config.api.baseUrl + config.api.endpoints.processImage;

        // Listen for configuration changes
        window.addEventListener('configLoaded', () => {
            const updatedConfig = configManager.getConfig();
            this.apiUrl = updatedConfig.api.baseUrl + updatedConfig.api.endpoints.processImage;
        });
    }

    /**
     * Initialize event listeners for UI interactions
     */
    initializeEventListeners() {
        const imageInput = document.getElementById('image-input');
        const processButton = document.getElementById('process-button');
        const fileInputButton = document.querySelector('.file-input-button');

        if (!imageInput || !processButton || !fileInputButton) {
            console.warn('Some UI elements not found. Make sure DOM is fully loaded.');
            return;
        }

        // File input change handler
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Process button click handler
        processButton.addEventListener('click', () => this.processImage());

        // File input button click handler (for better UX)
        fileInputButton.addEventListener('click', () => {
            imageInput.click();
        });

        // Drag and drop support
        this.setupDragAndDrop();
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const container = document.querySelector('.container');
        if (!container) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            container.addEventListener(eventName, () => container.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            container.addEventListener(eventName, () => container.classList.remove('drag-over'), false);
        });

        container.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    /**
     * Prevent default drag behaviors
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Handle file drop
     */
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    /**
     * Handle file selection from input
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    /**
     * Process and validate selected file
     */
    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showMessage('Image file is too large. Please select an image smaller than 10MB.', 'error');
            return;
        }

        this.selectedFile = file;
        this.updateUI();
        this.showPreview(file);
    }

    /**
     * Update UI elements based on current state
     */
    updateUI() {
        const fileName = document.getElementById('file-name');
        const processButton = document.getElementById('process-button');
        const resultSection = document.getElementById('result-section');

        if (fileName) {
            fileName.textContent = this.selectedFile ? `Selected: ${this.selectedFile.name}` : '';
        }

        if (processButton) {
            processButton.disabled = !this.selectedFile;
        }

        if (resultSection) {
            resultSection.style.display = 'none';
        }

        this.clearMessages();
    }

    /**
     * Show image preview
     */
    showPreview(file) {
        const previewContainer = document.getElementById('preview-container');
        if (!previewContainer) return;

        // Clear previous preview
        previewContainer.innerHTML = '';

        // Create preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.createElement('img');
            previewImg.src = e.target.result;
            previewImg.className = 'preview-image';
            previewImg.alt = 'Preview';
            previewContainer.appendChild(previewImg);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Process image with AI analysis
     */
    async processImage() {
        if (!this.selectedFile) {
            this.showMessage('Please select an image first.', 'error');
            return;
        }

        if (!this.apiUrl) {
            this.showMessage('Configuration not loaded. Please try again.', 'error');
            return;
        }

        try {
            // Show loading state
            this.showLoading(true);
            this.clearMessages();

            // Convert file to Base64
            const base64Data = await this.fileToBase64(this.selectedFile);

            // Make API request
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: base64Data
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Display the result
            this.displayResult(result.description, result.originalImageData, result.mimeType);
            this.showMessage('Image analyzed successfully!', 'success');

        } catch (error) {
            console.error('Error processing image:', error);
            const errorMessage = error.message || 'An unexpected error occurred';

            if (error.message.includes('fetch')) {
                this.showMessage('Unable to connect to the server. Please ensure the backend is running.', 'error');
            } else {
                this.showMessage(`Error: ${errorMessage}`, 'error');
            }
        } finally {
            // Hide loading state
            this.showLoading(false);
        }
    }

    /**
     * Convert file to Base64 string
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Display processing results
     */
    displayResult(description, imageData, mimeType = 'image/jpeg') {
        const resultSection = document.getElementById('result-section');
        const resultImage = document.getElementById('result-image');

        if (!resultSection || !resultImage) {
            console.error('Result section elements not found');
            return;
        }

        // Construct data URL for original image
        const dataUrl = `data:${mimeType};base64,${imageData}`;
        resultImage.src = dataUrl;
        resultImage.alt = 'Original Image';

        // Add or update description
        let descriptionDiv = document.getElementById('ai-description');
        if (!descriptionDiv) {
            descriptionDiv = document.createElement('div');
            descriptionDiv.id = 'ai-description';
            descriptionDiv.className = 'ai-description';
            resultSection.appendChild(descriptionDiv);
        }

        descriptionDiv.innerHTML = `
            <h4>🤖 AI Analysis:</h4>
            <p>${this.escapeHtml(description)}</p>
        `;

        // Show result section
        resultSection.style.display = 'block';

        // Scroll to result with smooth behavior
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Show loading state
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        const processButton = document.getElementById('process-button');

        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }

        if (processButton) {
            processButton.disabled = show || !this.selectedFile;
        }

        // Update loading text with random message
        if (show) {
            this.updateLoadingText();
        }
    }

    /**
     * Update loading text with a random message from config
     */
    updateLoadingText() {
        const config = configManager.getConfig();
        const loadingText = document.querySelector('.loading-text');

        if (loadingText && config?.ui?.loadingMessages?.length > 0) {
            const messages = config.ui.loadingMessages;
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            loadingText.textContent = randomMessage;
        }
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        container.innerHTML = '';
        container.appendChild(messageDiv);

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        }

        // Auto-hide info messages after 3 seconds
        if (type === 'info') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 3000);
        }
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        const container = document.getElementById('message-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

export default ImageProcessor;