/**
 * Hotspot Portal JavaScript
 * Handles form validation, API communication, and user interaction
 */

const HotspotPortal = {
    // Configuration
    config: {
        apiUrl: '/api',
        endpoints: {
            register: '/register',
            verify: '/verify',
            health: '/health'
        },
        validation: {
            nameMinLength: 2,
            nameMaxLength: 100,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        ui: {
            loadingDelay: 300,
            messageTimeout: 5000,
            retryDelay: 2000
        }
    },

    // DOM elements
    elements: {},

    // State
    state: {
        isSubmitting: false,
        retryCount: 0,
        maxRetries: 3
    },

    /**
     * Initialize the portal
     */
    async init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeValidation();
        await this.fetchCsrfToken();
        this.checkApiHealth();
        console.log('Hotspot Portal initialized');
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Form elements
            form: document.getElementById('registration-form'),
            firstNameInput: document.getElementById('first-name'),
            lastNameInput: document.getElementById('last-name'),
            emailInput: document.getElementById('email'),
            termsCheckbox: document.getElementById('terms-agreement'),
            submitBtn: document.getElementById('submit-btn'),
            csrfToken: document.getElementById('csrf-token'),

            // Button elements
            btnText: document.querySelector('.btn-text'),
            btnSpinner: document.querySelector('.btn-spinner'),

            // Error elements
            firstNameError: document.getElementById('first-name-error'),
            lastNameError: document.getElementById('last-name-error'),
            emailError: document.getElementById('email-error'),
            termsError: document.getElementById('terms-error'),

            // Message elements
            successMessage: document.getElementById('success-message'),
            errorMessageGlobal: document.getElementById('error-message-global'),
            errorMessageText: document.getElementById('error-message-text'),

            // Loading overlay
            loadingOverlay: document.getElementById('loading-overlay'),

            // Links
            termsLink: document.getElementById('terms-link'),
            privacyLink: document.getElementById('privacy-link'),
            footerLinks: {
                terms: document.getElementById('footer-terms'),
                privacy: document.getElementById('footer-privacy'),
                support: document.getElementById('footer-support')
            }
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        this.elements.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Real-time validation
        this.elements.firstNameInput?.addEventListener('input', () => {
            this.validateField('firstName');
        });

        this.elements.lastNameInput?.addEventListener('input', () => {
            this.validateField('lastName');
        });

        this.elements.emailInput?.addEventListener('input', () => {
            this.validateField('email');
        });

        this.elements.termsCheckbox?.addEventListener('change', () => {
            this.validateField('terms');
        });

        // Field blur validation
        this.elements.firstNameInput?.addEventListener('blur', () => {
            this.validateField('firstName', true);
        });

        this.elements.lastNameInput?.addEventListener('blur', () => {
            this.validateField('lastName', true);
        });

        this.elements.emailInput?.addEventListener('blur', () => {
            this.validateField('email', true);
        });

        // Link handlers
        this.bindLinkHandlers();

        // Window events
        window.addEventListener('beforeunload', (e) => {
            if (this.state.isSubmitting) {
                e.preventDefault();
                e.returnValue = 'Your registration is in progress. Are you sure you want to leave?';
            }
        });
    },

    /**
     * Bind link handlers
     */
    bindLinkHandlers() {
        const linkHandler = (e) => {
            e.preventDefault();
            this.showModal('Terms and Privacy', 'Terms of Service and Privacy Policy content would be displayed here.');
        };

        this.elements.termsLink?.addEventListener('click', linkHandler);
        this.elements.privacyLink?.addEventListener('click', linkHandler);
        this.elements.footerLinks.terms?.addEventListener('click', linkHandler);
        this.elements.footerLinks.privacy?.addEventListener('click', linkHandler);

        this.elements.footerLinks.support?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'mailto:support@your-domain.com?subject=WiFi Portal Support';
        });
    },

    /**
     * Initialize form validation
     */
    initializeValidation() {
        // Set up initial validation state
        this.clearAllErrors();
        
        // Enable HTML5 validation features
        this.elements.form?.setAttribute('novalidate', '');
    },

    /**
     * Check API health
     */
    async checkApiHealth() {
        try {
            const response = await this.apiRequest('GET', this.config.endpoints.health);
            if (response.success) {
                console.log('API is healthy');
            }
        } catch (error) {
            console.warn('API health check failed:', error.message);
        }
    },

    /**
     * Fetch CSRF token from API
     */
    async fetchCsrfToken() {
        try {
            const response = await fetch(this.config.apiUrl + '/csrf-token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data.csrf_token) {
                    this.csrfToken = data.data.csrf_token;
                    
                    // Update hidden input if it exists
                    if (this.elements.csrfToken) {
                        this.elements.csrfToken.value = this.csrfToken;
                    }
                    
                    console.log('CSRF token fetched successfully');
                } else {
                    console.warn('Failed to fetch CSRF token');
                }
            } else {
                console.warn('CSRF token request failed:', response.status);
            }
        } catch (error) {
            console.error('Error fetching CSRF token:', error.message);
        }
    },

    /**
     * Refresh CSRF token
     */
    async refreshCsrfToken() {
        await this.fetchCsrfToken();
    },

    /**
     * Handle form submission
     */
    async handleFormSubmit() {
        if (this.state.isSubmitting) {
            return;
        }

        // Validate all fields
        const isValid = this.validateAllFields();
        if (!isValid) {
            this.focusFirstError();
            return;
        }

        // Start submission
        this.state.isSubmitting = true;
        this.setSubmissionState(true);
        this.clearMessages();

        try {
            // Prepare form data
            const formData = this.getFormData();
            
            // Add device information
            formData.user_agent = navigator.userAgent;
            formData.screen_resolution = screen.width + 'x' + screen.height;
            formData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Submit to API
            const response = await this.apiRequest('POST', this.config.endpoints.register, formData);

            if (response.success) {
                this.handleRegistrationSuccess(response);
            } else {
                this.handleRegistrationError(response);
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.handleRegistrationError({ message: error.message });
        } finally {
            this.state.isSubmitting = false;
            this.setSubmissionState(false);
        }
    },

    /**
     * Get form data
     */
    getFormData() {
        return {
            first_name: this.elements.firstNameInput?.value.trim() || '',
            last_name: this.elements.lastNameInput?.value.trim() || '',
            email: this.elements.emailInput?.value.trim() || '',
            terms_agreement: this.elements.termsCheckbox?.checked || false,
            csrf_token: this.csrfToken || ''
        };
    },

    /**
     * Validate all fields
     */
    validateAllFields() {
        const validations = [
            this.validateField('firstName', true),
            this.validateField('lastName', true),
            this.validateField('email', true),
            this.validateField('terms', true)
        ];

        return validations.every(result => result);
    },

    /**
     * Validate individual field
     */
    validateField(fieldName, showError = false) {
        const validators = {
            firstName: () => this.validateName(this.elements.firstNameInput, this.elements.firstNameError, 'First name'),
            lastName: () => this.validateName(this.elements.lastNameInput, this.elements.lastNameError, 'Last name'),
            email: () => this.validateEmail(this.elements.emailInput, this.elements.emailError),
            terms: () => this.validateTerms(this.elements.termsCheckbox, this.elements.termsError)
        };

        const validator = validators[fieldName];
        if (!validator) {
            return true;
        }

        const result = validator();
        
        if (!showError && result) {
            // Clear error if validation passes and we're not showing errors yet
            const errorElement = {
                firstName: this.elements.firstNameError,
                lastName: this.elements.lastNameError,
                email: this.elements.emailError,
                terms: this.elements.termsError
            }[fieldName];
            
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        return result;
    },

    /**
     * Validate name fields
     */
    validateName(inputElement, errorElement, fieldName) {
        if (!inputElement || !errorElement) return false;

        const value = inputElement.value.trim();
        
        if (!value) {
            errorElement.textContent = fieldName + ' is required';
            return false;
        }

        if (value.length < this.config.validation.nameMinLength) {
            errorElement.textContent = fieldName + ' must be at least ' + this.config.validation.nameMinLength + ' characters';
            return false;
        }

        if (value.length > this.config.validation.nameMaxLength) {
            errorElement.textContent = fieldName + ' must be less than ' + this.config.validation.nameMaxLength + ' characters';
            return false;
        }

        if (!/^[a-zA-Z\s\-'\.]+$/.test(value)) {
            errorElement.textContent = fieldName + ' contains invalid characters';
            return false;
        }

        errorElement.textContent = '';
        return true;
    },

    /**
     * Validate email field
     */
    validateEmail(inputElement, errorElement) {
        if (!inputElement || !errorElement) return false;

        const value = inputElement.value.trim();
        
        if (!value) {
            errorElement.textContent = 'Email address is required';
            return false;
        }

        if (!this.config.validation.emailRegex.test(value)) {
            errorElement.textContent = 'Please enter a valid email address';
            return false;
        }

        if (value.length > 255) {
            errorElement.textContent = 'Email address is too long';
            return false;
        }

        errorElement.textContent = '';
        return true;
    },

    /**
     * Validate terms checkbox
     */
    validateTerms(checkboxElement, errorElement) {
        if (!checkboxElement || !errorElement) return false;

        if (!checkboxElement.checked) {
            errorElement.textContent = 'You must agree to the Terms of Service and Privacy Policy';
            return false;
        }

        errorElement.textContent = '';
        return true;
    },

    /**
     * Set submission state
     */
    setSubmissionState(isSubmitting) {
        if (!this.elements.submitBtn) return;

        this.elements.submitBtn.disabled = isSubmitting;
        
        if (isSubmitting) {
            this.elements.btnText?.classList.add('hidden');
            this.elements.btnSpinner?.classList.remove('hidden');
            this.showLoadingOverlay();
        } else {
            this.elements.btnText?.classList.remove('hidden');
            this.elements.btnSpinner?.classList.add('hidden');
            this.hideLoadingOverlay();
        }
    },

    /**
     * Show loading overlay
     */
    showLoadingOverlay() {
        setTimeout(() => {
            if (this.state.isSubmitting) {
                this.elements.loadingOverlay?.classList.remove('hidden');
            }
        }, this.config.ui.loadingDelay);
    },

    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        this.elements.loadingOverlay?.classList.add('hidden');
    },

    /**
     * Handle registration success
     */
    handleRegistrationSuccess(response) {
        this.showSuccess('Registration successful! Please check your email for a verification link.');
        this.elements.form?.reset();
        this.clearAllErrors();
        
        // Analytics or tracking
        this.trackEvent('registration_success');

        // Auto-hide success message after delay
        setTimeout(() => {
            this.hideMessages();
        }, this.config.ui.messageTimeout);
    },

    /**
     * Handle registration error
     */
    handleRegistrationError(response) {
        let errorMessage = 'Registration failed. Please try again.';
        
        if (response.message) {
            errorMessage = response.message;
        }

        if (response.errors) {
            this.handleValidationErrors(response.errors);
            errorMessage = 'Please correct the errors below and try again.';
        }

        this.showError(errorMessage);
        
        // Analytics or tracking
        this.trackEvent('registration_error', {
            error: errorMessage,
            retry_count: this.state.retryCount
        });

        this.state.retryCount++;
    },

    /**
     * Handle validation errors from server
     */
    handleValidationErrors(errors) {
        const errorMap = {
            first_name: this.elements.firstNameError,
            last_name: this.elements.lastNameError,
            email: this.elements.emailError,
            terms_agreement: this.elements.termsError
        };

        Object.keys(errors).forEach(field => {
            const errorElement = errorMap[field];
            if (errorElement && errors[field]) {
                errorElement.textContent = Array.isArray(errors[field]) ? errors[field][0] : errors[field];
            }
        });
    },

    /**
     * Show success message
     */
    showSuccess(message) {
        if (!this.elements.successMessage) return;

        this.hideMessages();
        this.elements.successMessage.querySelector('p').textContent = message;
        this.elements.successMessage.classList.remove('hidden');
        this.scrollToMessage();
    },

    /**
     * Show error message
     */
    showError(message) {
        if (!this.elements.errorMessageGlobal || !this.elements.errorMessageText) return;

        this.hideMessages();
        this.elements.errorMessageText.textContent = message;
        this.elements.errorMessageGlobal.classList.remove('hidden');
        this.scrollToMessage();
    },

    /**
     * Hide all messages
     */
    hideMessages() {
        this.elements.successMessage?.classList.add('hidden');
        this.elements.errorMessageGlobal?.classList.add('hidden');
    },

    /**
     * Clear all error messages
     */
    clearAllErrors() {
        const errorElements = [
            this.elements.firstNameError,
            this.elements.lastNameError,
            this.elements.emailError,
            this.elements.termsError
        ];

        errorElements.forEach(element => {
            if (element) {
                element.textContent = '';
            }
        });
    },

    /**
     * Clear all messages
     */
    clearMessages() {
        this.hideMessages();
        this.clearAllErrors();
    },

    /**
     * Focus first error field
     */
    focusFirstError() {
        const errorFields = [
            { element: this.elements.firstNameInput, error: this.elements.firstNameError },
            { element: this.elements.lastNameInput, error: this.elements.lastNameError },
            { element: this.elements.emailInput, error: this.elements.emailError },
            { element: this.elements.termsCheckbox, error: this.elements.termsError }
        ];

        for (const field of errorFields) {
            if (field.error && field.error.textContent.trim()) {
                field.element?.focus();
                break;
            }
        }
    },

    /**
     * Scroll to message area
     */
    scrollToMessage() {
        const messageArea = this.elements.successMessage?.parentElement || this.elements.errorMessageGlobal?.parentElement;
        if (messageArea) {
            messageArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    /**
     * Make API request with CSRF protection
     */
    async apiRequest(method, endpoint, data = null) {
        const url = this.config.apiUrl + endpoint;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        // Add CSRF token to headers for state-changing requests
        if (this.csrfToken && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE')) {
            options.headers['X-CSRF-Token'] = this.csrfToken;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            // Add CSRF token to data as well for dual validation
            if (this.csrfToken) {
                data.csrf_token = this.csrfToken;
            }
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                // Handle CSRF token expiration
                if (response.status === 403 && result.message && result.message.toLowerCase().includes('csrf')) {
                    console.log('CSRF token expired, refreshing...');
                    await this.refreshCsrfToken();
                    
                    // Retry the request with new token
                    if (this.csrfToken) {
                        options.headers['X-CSRF-Token'] = this.csrfToken;
                        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                            data.csrf_token = this.csrfToken;
                            options.body = JSON.stringify(data);
                        }
                        
                        const retryResponse = await fetch(url, options);
                        const retryResult = await retryResponse.json();
                        
                        if (!retryResponse.ok) {
                            throw new Error(retryResult.message || 'HTTP ' + retryResponse.status + ': ' + retryResponse.statusText);
                        }
                        
                        return retryResult;
                    }
                }
                
                throw new Error(result.message || 'HTTP ' + response.status + ': ' + response.statusText);
            }

            return result;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    },

    /**
     * Track events (placeholder for analytics)
     */
    trackEvent(eventName, data = {}) {
        console.log('Event tracked:', eventName, data);
        
        // Integration with analytics services would go here
        // Example: gtag('event', eventName, data);
        // Example: analytics.track(eventName, data);
    },

    /**
     * Show modal (placeholder)
     */
    showModal(title, content) {
        alert(title + '\n\n' + content);
        // A proper modal implementation would go here
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HotspotPortal.init());
} else {
    HotspotPortal.init();
}

// Export for global access
window.HotspotPortal = HotspotPortal;
