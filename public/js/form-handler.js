/**
 * Enhanced Form Handler
 * Provides advanced form functionality, validation, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all forms
  initForms();
  
  // Initialize form validation
  initFormValidation();
  
  // Initialize form animations
  initFormAnimations();
  
  // Initialize special form elements
  initSpecialFormElements();
});

/**
 * Initialize all forms
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Prevent default form submission to handle with AJAX
    form.addEventListener('submit', function(e) {
      // Only prevent default if the form has data-ajax="true"
      if (this.getAttribute('data-ajax') === 'true') {
        e.preventDefault();
        handleFormSubmit(this);
      } else {
        // Add loading state for regular form submission
        addFormLoadingState(this);
      }
    });
    
    // Add form animation classes
    form.classList.add('form-animate-in');
    
    // Add animation classes to form fields
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      group.classList.add('form-field-animate', `form-field-animate-delay-${(index % 4) + 1}`);
    });
  });
}

/**
 * Handle form submission with AJAX
 * @param {HTMLFormElement} form - The form element
 */
function handleFormSubmit(form) {
  // Add loading state
  addFormLoadingState(form);
  
  // Get form data
  const formData = new FormData(form);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  // Get form action URL
  const url = form.getAttribute('action') || window.location.href;
  
  // Send AJAX request
  fetch(url, {
    method: form.getAttribute('method') || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // Remove loading state
    removeFormLoadingState(form);
    
    if (data.success) {
      // Show success message
      showFormFeedback(form, 'success', data.message || 'Form submitted successfully!');
      
      // Reset form if needed
      if (form.getAttribute('data-reset-on-success') === 'true') {
        form.reset();
      }
      
      // Redirect if needed
      if (data.redirect) {
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1000);
      }
    } else {
      // Show error message
      showFormFeedback(form, 'error', data.message || 'An error occurred. Please try again.');
      
      // Show field errors if any
      if (data.errors) {
        showFieldErrors(form, data.errors);
      }
    }
  })
  .catch(error => {
    console.error('Form submission error:', error);
    removeFormLoadingState(form);
    showFormFeedback(form, 'error', 'An unexpected error occurred. Please try again.');
  });
}

/**
 * Add loading state to form
 * @param {HTMLFormElement} form - The form element
 */
function addFormLoadingState(form) {
  // Add loading class to form
  form.classList.add('form-loading');
  
  // Disable submit button and show spinner
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    // Store original button text
    submitBtn.dataset.originalText = submitBtn.innerHTML;
    
    // Replace with loading spinner
    submitBtn.innerHTML = `
      <div class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </div>
    `;
    
    // Disable button
    submitBtn.disabled = true;
  }
}

/**
 * Remove loading state from form
 * @param {HTMLFormElement} form - The form element
 */
function removeFormLoadingState(form) {
  // Remove loading class from form
  form.classList.remove('form-loading');
  
  // Restore submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn && submitBtn.dataset.originalText) {
    submitBtn.innerHTML = submitBtn.dataset.originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Show form feedback message
 * @param {HTMLFormElement} form - The form element
 * @param {string} type - The feedback type (success, error, warning, info)
 * @param {string} message - The feedback message
 */
function showFormFeedback(form, type, message) {
  // Remove existing feedback
  const existingFeedback = form.querySelector('.form-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create feedback element
  const feedback = document.createElement('div');
  feedback.className = `form-feedback ${type}`;
  feedback.innerHTML = message;
  
  // Add icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      break;
    case 'error':
      icon = '<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      break;
    case 'warning':
      icon = '<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      break;
    case 'info':
      icon = '<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      break;
  }
  
  feedback.innerHTML = icon + message;
  
  // Add to form
  form.appendChild(feedback);
  
  // Animate in
  setTimeout(() => {
    feedback.style.opacity = '1';
  }, 10);
  
  // Auto-remove success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        feedback.remove();
      }, 300);
    }, 5000);
  }
}

/**
 * Show field errors
 * @param {HTMLFormElement} form - The form element
 * @param {Object} errors - The field errors object
 */
function showFieldErrors(form, errors) {
  // Clear existing errors
  const existingErrors = form.querySelectorAll('.form-error-message');
  existingErrors.forEach(error => error.remove());
  
  // Remove error class from inputs
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => input.classList.remove('error'));
  
  // Add new errors
  for (const field in errors) {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      // Add error class to input
      input.classList.add('error');
      
      // Add error message
      const errorMsg = document.createElement('p');
      errorMsg.className = 'form-error-message';
      errorMsg.textContent = errors[field];
      
      // Insert after input
      input.parentNode.insertBefore(errorMsg, input.nextSibling);
    }
  }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', function() {
        validateInput(this);
      });
      
      // Clear validation on input
      input.addEventListener('input', function() {
        clearInputValidation(this);
      });
    });
    
    // Password strength meter
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      input.addEventListener('input', function() {
        updatePasswordStrength(this);
      });
    });
  });
}

/**
 * Validate a single input
 * @param {HTMLInputElement} input - The input element
 */
function validateInput(input) {
  // Skip if input is not required
  if (!input.required) return;
  
  // Check if empty
  if (input.value.trim() === '') {
    showInputError(input, 'This field is required');
    return;
  }
  
  // Email validation
  if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      showInputError(input, 'Please enter a valid email address');
      return;
    }
  }
  
  // Password validation
  if (input.type === 'password' && input.value.length < 6) {
    showInputError(input, 'Password must be at least 6 characters');
    return;
  }
  
  // Number validation
  if (input.type === 'number') {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const value = parseFloat(input.value);
    
    if (!isNaN(min) && value < min) {
      showInputError(input, `Value must be at least ${min}`);
      return;
    }
    
    if (!isNaN(max) && value > max) {
      showInputError(input, `Value must be at most ${max}`);
      return;
    }
  }
  
  // Date validation
  if (input.type === 'date') {
    const minDate = input.min ? new Date(input.min) : null;
    const maxDate = input.max ? new Date(input.max) : null;
    const value = new Date(input.value);
    
    if (minDate && value < minDate) {
      showInputError(input, `Date must be on or after ${input.min}`);
      return;
    }
    
    if (maxDate && value > maxDate) {
      showInputError(input, `Date must be on or before ${input.max}`);
      return;
    }
  }
  
  // Custom validation using data-validate attribute
  const validateAttr = input.getAttribute('data-validate');
  if (validateAttr) {
    const regex = new RegExp(validateAttr);
    if (!regex.test(input.value)) {
      showInputError(input, input.getAttribute('data-validate-message') || 'Invalid format');
      return;
    }
  }
  
  // If we get here, input is valid
  showInputSuccess(input);
}

/**
 * Show input error
 * @param {HTMLInputElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
  // Add error class to input
  input.classList.add('error');
  
  // Remove existing error message
  const existingError = input.nextElementSibling;
  if (existingError && existingError.classList.contains('form-error-message')) {
    existingError.remove();
  }
  
  // Add error message
  const errorMsg = document.createElement('p');
  errorMsg.className = 'form-error-message';
  errorMsg.textContent = message;
  
  // Insert after input
  input.parentNode.insertBefore(errorMsg, input.nextSibling);
}

/**
 * Show input success
 * @param {HTMLInputElement} input - The input element
 */
function showInputSuccess(input) {
  // Remove error class from input
  input.classList.remove('error');
  
  // Remove existing error message
  const existingError = input.nextElementSibling;
  if (existingError && existingError.classList.contains('form-error-message')) {
    existingError.remove();
  }
  
  // Add success class if needed
  if (input.getAttribute('data-show-success') === 'true') {
    input.classList.add('success');
    
    // Add success message if needed
    if (input.getAttribute('data-success-message')) {
      const successMsg = document.createElement('p');
      successMsg.className = 'form-success-message';
      successMsg.textContent = input.getAttribute('data-success-message');
      
      // Insert after input
      input.parentNode.insertBefore(successMsg, input.nextSibling);
    }
  }
}

/**
 * Clear input validation
 * @param {HTMLInputElement} input - The input element
 */
function clearInputValidation(input) {
  // Remove error class from input
  input.classList.remove('error');
  
  // Remove existing error message
  const existingError = input.nextElementSibling;
  if (existingError && existingError.classList.contains('form-error-message')) {
    existingError.remove();
  }
}

/**
 * Update password strength meter
 * @param {HTMLInputElement} input - The password input element
 */
function updatePasswordStrength(input) {
  // Get password strength container
  const container = input.parentNode.querySelector('.form-password-strength');
  if (!container) return;
  
  const password = input.value;
  let strength = 0;
  let strengthText = '';
  
  // Calculate strength
  if (password.length >= 8) strength += 1;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
  if (password.match(/\d/)) strength += 1;
  if (password.match(/[^a-zA-Z\d]/)) strength += 1;
  
  // Set strength text and class
  switch (strength) {
    case 0:
    case 1:
      strengthText = 'Weak';
      strengthClass = 'weak';
      break;
    case 2:
      strengthText = 'Medium';
      strengthClass = 'medium';
      break;
    case 3:
      strengthText = 'Strong';
      strengthClass = 'strong';
      break;
    case 4:
      strengthText = 'Very Strong';
      strengthClass = 'very-strong';
      break;
  }
  
  // Update strength bar
  const progressBar = container.querySelector('.form-password-strength-progress');
  if (progressBar) {
    progressBar.className = `form-password-strength-progress ${strengthClass}`;
  }
  
  // Update strength text
  const strengthTextElement = container.querySelector('.form-password-strength-text');
  if (strengthTextElement) {
    strengthTextElement.textContent = strengthText;
    strengthTextElement.className = `form-password-strength-text ${strengthClass}`;
  }
}

/**
 * Initialize form animations
 */
function initFormAnimations() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.form-submit-btn, .form-cancel-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'absolute w-full h-full bg-white rounded-full opacity-30 transform scale-0';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transformOrigin = '50% 50%';
      
      this.appendChild(ripple);
      
      // Animate the ripple
      ripple.animate([
        { transform: 'scale(0)', opacity: '0.3' },
        { transform: 'scale(4)', opacity: '0' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
      
      // Remove the ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add focus animations to inputs
  const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentNode.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentNode.classList.remove('focused');
    });
  });
}

/**
 * Initialize special form elements
 */
function initSpecialFormElements() {
  // Initialize OTP inputs
  initOTPInputs();
  
  // Initialize file uploads
  initFileUploads();
  
  // Initialize tags input
  initTagsInput();
  
  // Initialize autocomplete
  initAutocomplete();
  
  // Initialize toggle switches
  initToggleSwitches();
}

/**
 * Initialize OTP inputs
 */
function initOTPInputs() {
  const otpContainers = document.querySelectorAll('.form-otp-container');
  
  otpContainers.forEach(container => {
    const inputs = container.querySelectorAll('.form-otp-input');
    
    inputs.forEach((input, index) => {
      // Focus next input on input
      input.addEventListener('input', function() {
        if (this.value.length === this.maxLength) {
          // Focus next input
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      });
      
      // Handle backspace
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
          // Focus previous input
          inputs[index - 1].focus();
        }
      });
      
      // Handle paste
      input.addEventListener('paste', function(e) {
        e.preventDefault();
        
        // Get pasted text
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        
        // Fill inputs with pasted text
        for (let i = 0; i < pastedText.length && i < inputs.length; i++) {
          inputs[i].value = pastedText[i];
        }
        
        // Focus last filled input
        const lastIndex = Math.min(pastedText.length, inputs.length) - 1;
        if (lastIndex >= 0) {
          inputs[lastIndex].focus();
        }
      });
    });
  });
}

/**
 * Initialize file uploads
 */
function initFileUploads() {
  const fileUploads = document.querySelectorAll('.form-file-upload');
  
  fileUploads.forEach(upload => {
    const input = upload.querySelector('.form-file-input');
    const button = upload.querySelector('.form-file-button');
    const text = button.querySelector('.form-file-text');
    
    input.addEventListener('change', function() {
      if (this.files.length > 0) {
        // Update text with file name
        text.textContent = this.files.length > 1 
          ? `${this.files.length} files selected` 
          : this.files[0].name;
        
        // Add selected class to button
        button.classList.add('border-primary-500', 'bg-primary-50');
      } else {
        // Reset text
        text.textContent = 'Choose a file or drag it here';
        
        // Remove selected class from button
        button.classList.remove('border-primary-500', 'bg-primary-50');
      }
    });
  });
}

/**
 * Initialize tags input
 */
function initTagsInput() {
  const tagsContainers = document.querySelectorAll('.form-tags-container');
  
  tagsContainers.forEach(container => {
    const input = container.querySelector('.form-tags-input');
    const hiddenInput = container.querySelector('input[type="hidden"]');
    
    // Add tag on enter
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        
        const tag = this.value.trim();
        if (tag) {
          addTag(container, tag);
          this.value = '';
          updateHiddenInput(container, hiddenInput);
        }
      }
    });
    
    // Add tag on blur
    input.addEventListener('blur', function() {
      const tag = this.value.trim();
      if (tag) {
        addTag(container, tag);
        this.value = '';
        updateHiddenInput(container, hiddenInput);
      }
    });
    
    // Handle tag removal
    container.addEventListener('click', function(e) {
      if (e.target.classList.contains('form-tag-remove')) {
        e.target.parentNode.remove();
        updateHiddenInput(container, hiddenInput);
      }
    });
  });
}

/**
 * Add a tag to the container
 * @param {HTMLElement} container - The tags container
 * @param {string} tag - The tag text
 */
function addTag(container, tag) {
  // Create tag element
  const tagElement = document.createElement('div');
  tagElement.className = 'form-tag';
  tagElement.innerHTML = `
    ${tag}
    <span class="form-tag-remove">&times;</span>
  `;
  
  // Add tag before input
  const input = container.querySelector('.form-tags-input');
  container.insertBefore(tagElement, input);
}

/**
 * Update hidden input with tags
 * @param {HTMLElement} container - The tags container
 * @param {HTMLInputElement} hiddenInput - The hidden input
 */
function updateHiddenInput(container, hiddenInput) {
  if (!hiddenInput) return;
  
  // Get all tags
  const tags = Array.from(container.querySelectorAll('.form-tag'))
    .map(tag => tag.textContent.trim());
  
  // Update hidden input
  hiddenInput.value = tags.join(',');
}

/**
 * Initialize autocomplete
 */
function initAutocomplete() {
  const autocompletes = document.querySelectorAll('.form-autocomplete');
  
  autocompletes.forEach(autocomplete => {
    const input = autocomplete.querySelector('.form-input');
    const resultsContainer = autocomplete.querySelector('.form-autocomplete-results');
    
    // Skip if no results container
    if (!resultsContainer) return;
    
    // Get options from data attribute
    const options = JSON.parse(input.getAttribute('data-options') || '[]');
    
    // Filter options on input
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      
      // Clear results
      resultsContainer.innerHTML = '';
      
      // Hide results if empty
      if (!value) {
        resultsContainer.style.display = 'none';
        return;
      }
      
      // Filter options
      const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(value)
      );
      
      // Add filtered options to results
      filteredOptions.forEach(option => {
        const item = document.createElement('div');
        item.className = 'form-autocomplete-item';
        item.textContent = option;
        
        // Select option on click
        item.addEventListener('click', function() {
          input.value = option;
          resultsContainer.style.display = 'none';
        });
        
        resultsContainer.appendChild(item);
      });
      
      // Show results if not empty
      resultsContainer.style.display = filteredOptions.length > 0 ? 'block' : 'none';
    });
    
    // Hide results on blur
    input.addEventListener('blur', function() {
      setTimeout(() => {
        resultsContainer.style.display = 'none';
      }, 200);
    });
    
    // Show results on focus
    input.addEventListener('focus', function() {
      if (this.value) {
        resultsContainer.style.display = 'block';
      }
    });
  });
}

/**
 * Initialize toggle switches
 */
function initToggleSwitches() {
  const toggles = document.querySelectorAll('.form-switch');
  
  toggles.forEach(toggle => {
    const input = toggle.querySelector('.form-switch-input');
    const label = toggle.querySelector('.form-switch-label');
    
    // Toggle on label click
    label.addEventListener('click', function() {
      input.checked = !input.checked;
      
      // Trigger change event
      const event = new Event('change');
      input.dispatchEvent(event);
    });
  });
}
