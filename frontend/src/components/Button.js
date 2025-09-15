/**
 * Button Component
 * Reusable button with multiple variants and states
 */

export default class Button {
    constructor(options = {}) {
        this.options = {
            text: 'Button',
            variant: 'primary', // primary, secondary, accent, outline
            size: 'medium', // small, medium, large
            disabled: false,
            loading: false,
            icon: null,
            onClick: null,
            className: '',
            ...options
        };

        this.element = this.create();
    }

    /**
     * Create the button element
     */
    create() {
        const button = document.createElement('button');

        // Set base classes
        button.className = this.getClasses();

        // Set content
        button.innerHTML = this.getContent();

        // Set attributes
        button.disabled = this.options.disabled || this.options.loading;

        // Add event listener
        if (this.options.onClick && typeof this.options.onClick === 'function') {
            button.addEventListener('click', this.options.onClick);
        }

        return button;
    }

    /**
     * Get CSS classes for the button
     */
    getClasses() {
        const classes = ['btn'];

        // Variant class
        classes.push(`btn-${this.options.variant}`);

        // Size class
        classes.push(`btn-${this.options.size}`);

        // State classes
        if (this.options.loading) {
            classes.push('btn-loading');
        }

        if (this.options.disabled) {
            classes.push('btn-disabled');
        }

        // Custom classes
        if (this.options.className) {
            classes.push(this.options.className);
        }

        return classes.join(' ');
    }

    /**
     * Get button content (text + icon)
     */
    getContent() {
        let content = '';

        // Add loading spinner if loading
        if (this.options.loading) {
            content += '<span class="btn-spinner"></span>';
        }

        // Add icon if provided
        if (this.options.icon && !this.options.loading) {
            content += `<span class="btn-icon">${this.options.icon}</span>`;
        }

        // Add text
        content += `<span class="btn-text">${this.options.text}</span>`;

        return content;
    }

    /**
     * Update button text
     */
    setText(text) {
        this.options.text = text;
        const textElement = this.element.querySelector('.btn-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.options.loading = loading;
        this.element.disabled = loading || this.options.disabled;
        this.element.className = this.getClasses();
        this.element.innerHTML = this.getContent();
    }

    /**
     * Set disabled state
     */
    setDisabled(disabled) {
        this.options.disabled = disabled;
        this.element.disabled = disabled || this.options.loading;
        this.element.className = this.getClasses();
    }

    /**
     * Get the DOM element
     */
    getElement() {
        return this.element;
    }

    /**
     * Destroy the button
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Add CSS for button component if not already present
if (!document.querySelector('#button-component-styles')) {
    const style = document.createElement('style');
    style.id = 'button-component-styles';
    style.textContent = `
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
            border: none;
            border-radius: var(--border-radius-xl);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            transition: all var(--transition-normal);
            text-decoration: none;
            white-space: nowrap;
            user-select: none;
            position: relative;
            overflow: hidden;
        }

        /* Button variants */
        .btn-primary {
            background: var(--gradient-primary);
            color: white;
            box-shadow: 0 0.25rem 0.9375rem rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-0.125rem);
            box-shadow: 0 0.375rem 1.25rem rgba(102, 126, 234, 0.6);
        }

        .btn-accent {
            background: var(--gradient-accent);
            color: white;
            box-shadow: 0 0.25rem 0.9375rem rgba(240, 147, 251, 0.4);
        }

        .btn-accent:hover:not(:disabled) {
            transform: translateY(-0.125rem);
            box-shadow: 0 0.375rem 1.25rem rgba(240, 147, 251, 0.6);
        }

        .btn-secondary {
            background: #f8f9fa;
            color: var(--color-text);
            border: 0.0625rem solid #dee2e6;
        }

        .btn-secondary:hover:not(:disabled) {
            background: #e9ecef;
            transform: translateY(-0.0625rem);
        }

        .btn-outline {
            background: transparent;
            color: var(--color-primary);
            border: 0.125rem solid var(--color-primary);
        }

        .btn-outline:hover:not(:disabled) {
            background: var(--color-primary);
            color: white;
        }

        /* Button sizes */
        .btn-small {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: 0.875rem;
        }

        .btn-medium {
            padding: var(--spacing-md) var(--spacing-xl);
            font-size: 1rem;
        }

        .btn-large {
            padding: var(--spacing-lg) var(--spacing-xxl);
            font-size: 1.125rem;
        }

        /* Button states */
        .btn:disabled,
        .btn-disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }

        .btn-loading {
            pointer-events: none;
        }

        .btn-spinner {
            width: 1rem;
            height: 1rem;
            border: 0.125rem solid transparent;
            border-top: 0.125rem solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .btn-icon {
            display: flex;
            align-items: center;
        }

        .btn-text {
            display: flex;
            align-items: center;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}