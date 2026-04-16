// ===== FORM HANDLING SYSTEM =====

document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initFormValidation();
    initNewsletterForm();
    console.log('Form handlers initialized! 📧');
});

// ===== CONTACT FORM HANDLER =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleContactFormSubmission);

    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

async function handleContactFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');

    // Validate form before submission
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Show loading state
    setLoadingState(submitBtn, true);

    try {
        // Convert FormData to regular object
        const data = Object.fromEntries(formData.entries());

        // Add timestamp and additional info
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.pageUrl = window.location.href;

        // Attempt to send email
        const success = await sendEmail(data);

        if (success) {
            showSuccessMessage(form);
            form.reset();

            // Analytics tracking
            trackFormSubmission('contact', 'success');
        } else {
            throw new Error('Failed to send email');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Sorry, there was an error sending your message. Please try again or contact me directly.');
        trackFormSubmission('contact', 'error');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// ===== EMAIL SENDING =====
async function sendEmail(formData) {
    // Using FormSubmit for zero-configuration email sending
    try {
        const response = await fetch('https://formsubmit.co/ajax/r.udhayakumar0726@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                _subject: "New Portfolio Contact from " + formData.name,
                _replyto: formData.email,
                _template: "table"
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('FormSubmit success:', result);
            return result.success === "true" || result.success === true;
        } else {
            console.warn('FormSubmit needs activation or failed via AJAX, falling back to standard submission...');
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://formsubmit.co/r.udhayakumar0726@gmail.com';
            
            // Need these system fields for FormSubmit
            const params = {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                _subject: "New Portfolio Contact from " + formData.name,
                _replyto: formData.email
            };

            for (const key in params) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
            
            document.body.appendChild(form);
            form.submit();
            
            // We pretend it succeeds in the background so the UI doesn't crash, the browser will navigate anyway
            return true;
        }
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    // Custom validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters only, min 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            message: 'Subject must be between 5 and 100 characters'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10 and 1000 characters'
        }
    };

    window.validationRules = validationRules;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = window.validationRules[fieldName];

    if (!rules) return true;

    // Clear previous errors
    clearFieldError(field);

    // Required validation
    if (rules.required && !value) {
        showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
        return false;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rules.required) return true;

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, rules.message);
        return false;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
        showFieldError(field, rules.message);
        return false;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, rules.message);
        return false;
    }

    // Custom validations
    if (fieldName === 'email') {
        return validateEmail(field);
    }

    // Show success if validation passes
    showFieldSuccess(field);
    return true;
}

function validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }

    // Additional email validation (optional)
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];

    if (domain && !commonDomains.includes(domain.toLowerCase())) {
        // This is just a warning, not an error
        showFieldWarning(field, 'Please double-check your email address');
    } else {
        showFieldSuccess(field);
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success', 'warning');

    const errorElement = getOrCreateFieldMessage(field, 'error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showFieldWarning(field, message) {
    field.classList.add('warning');
    field.classList.remove('error', 'success');

    const warningElement = getOrCreateFieldMessage(field, 'warning');
    warningElement.textContent = message;
    warningElement.style.display = 'block';
}

function showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error', 'warning');
    clearFieldMessages(field);
}

function clearFieldError(field) {
    field.classList.remove('error', 'warning', 'success');
    clearFieldMessages(field);
}

function getOrCreateFieldMessage(field, type) {
    const formGroup = field.closest('.form-group');
    let messageElement = formGroup.querySelector(`.field-${type}`);

    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = `field-message field-${type}`;
        formGroup.appendChild(messageElement);
    }

    return messageElement;
}

function clearFieldMessages(field) {
    const formGroup = field.closest('.form-group');
    const messages = formGroup.querySelectorAll('.field-message');
    messages.forEach(msg => msg.style.display = 'none');
}

// ===== UI FEEDBACK =====
function setLoadingState(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');

    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

function showSuccessMessage(form) {
    const successHTML = `
        <div class="form-success-message">
            <div class="success-icon">✅</div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you soon!</p>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = successHTML;
    const successElement = tempDiv.firstElementChild;

    form.parentNode.insertBefore(successElement, form);
    form.style.display = 'none';

    // Remove success message after 5 seconds and show form again
    setTimeout(() => {
        successElement.remove();
        form.style.display = 'grid';
    }, 5000);

    showNotification('Message sent successfully! 🎉', 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => removeNotification(notification), 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');

        if (!validateEmail({ value: email })) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        setLoadingState(submitBtn, true);

        try {
            // Replace with your newsletter service API
            const success = await subscribeToNewsletter(email);

            if (success) {
                showNotification('Successfully subscribed to newsletter! 📧', 'success');
                newsletterForm.reset();
                trackFormSubmission('newsletter', 'success');
            } else {
                throw new Error('Subscription failed');
            }
        } catch (error) {
            showNotification('Failed to subscribe. Please try again later.', 'error');
            trackFormSubmission('newsletter', 'error');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });
}

async function subscribeToNewsletter(email) {
    // TODO: Integrate with a newsletter service (Mailchimp, ConvertKit, etc.)
    // Replace the fetch call below with your newsletter service API.
    console.warn('Newsletter: no service configured.');
    return false;
}

// ===== ANALYTICS TRACKING =====
function trackFormSubmission(formType, status) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            form_type: formType,
            status: status
        });
    }

    // Custom analytics
    if (typeof analytics !== 'undefined') {
        analytics.track('Form Submitted', {
            form_type: formType,
            status: status,
            timestamp: new Date().toISOString()
        });
    }
}

// ===== AUTO-SAVE FUNCTIONALITY =====
function initAutoSave() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Load saved data on page load
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue) {
            input.value = savedValue;
        }
    });

    // Save data as user types
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            localStorage.setItem(`form_${input.name}`, input.value);
        }, 1000));
    });

    // Clear saved data on successful submission
    contactForm.addEventListener('submit', () => {
        formInputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

// ===== SPAM PROTECTION =====
function initSpamProtection() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Add honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    contactForm.appendChild(honeypot);

    // Add timestamp field
    const timestamp = document.createElement('input');
    timestamp.type = 'hidden';
    timestamp.name = 'timestamp';
    timestamp.value = Date.now();
    contactForm.appendChild(timestamp);

    // Check for spam on submission
    contactForm.addEventListener('submit', (e) => {
        const formData = new FormData(contactForm);

        // Check honeypot
        if (formData.get('website')) {
            e.preventDefault();
            showNotification('Spam detected. Submission blocked.', 'error');
            return false;
        }

        // Check submission time (too fast = bot)
        const submitTime = Date.now();
        const formTime = parseInt(formData.get('timestamp'));
        if (submitTime - formTime < 3000) { // Less than 3 seconds
            e.preventDefault();
            showNotification('Please take a moment to fill out the form properly.', 'error');
            return false;
        }
    });
}

// ===== UTILITY FUNCTIONS =====
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

// Initialize auto-save and spam protection
document.addEventListener('DOMContentLoaded', () => {
    initAutoSave();
    initSpamProtection();
});

// Export form handler functions
window.FormHandler = {
    validateForm,
    validateField,
    showNotification,
    trackFormSubmission
};