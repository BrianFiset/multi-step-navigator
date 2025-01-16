// Form data storage
let formData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zipcode: '',
  injuryType: '',
  accidentDate: '',
  atFault: '',
  hasAttorney: '',
  otherPartyInsured: '',
  soughtMedicalAttention: '',
  accidentDescription: '',
  tcpaConsent: false
};

// Validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9-+()]*$/.test(phone);
}

function isValidZipcode(zipcode) {
  return /^\d{5}(-\d{4})?$/.test(zipcode);
}

// Error handling
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const existingError = input.parentElement.querySelector('.error-message');
  
  input.classList.add('error');
  
  if (!existingError) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  }
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorMessage = input.parentElement.querySelector('.error-message');
  
  input.classList.remove('error');
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Progress indicator
function updateProgressDots(step) {
  document.getElementById('currentStep').textContent = step;
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.classList.toggle('active', i <= step);
  }
}

// Navigation functions
function nextStep(currentStep) {
  if (currentStep === 1) {
    // Validate Step 1
    let isValid = true;
    const fields = ['firstName', 'lastName', 'email', 'phone', 'zipcode'];
    
    fields.forEach(field => clearError(field));
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const zipcode = document.getElementById('zipcode').value;

    if (!firstName) {
      showError('firstName', 'First name is required');
      isValid = false;
    }
    
    if (!lastName) {
      showError('lastName', 'Last name is required');
      isValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    if (!phone || !isValidPhone(phone)) {
      showError('phone', 'Please enter a valid phone number');
      isValid = false;
    }
    
    if (!zipcode || !isValidZipcode(zipcode)) {
      showError('zipcode', 'Please enter a valid zipcode');
      isValid = false;
    }

    if (!isValid) return;

    // Store data
    Object.assign(formData, { firstName, lastName, email, phone, zipcode });

  } else if (currentStep === 2) {
    // Validate Step 2
    let isValid = true;
    
    const injuryType = document.getElementById('injuryType').value;
    const accidentDate = document.getElementById('accidentDate').value;
    const atFault = document.querySelector('input[name="atFault"]:checked')?.value;
    const hasAttorney = document.querySelector('input[name="hasAttorney"]:checked')?.value;
    const otherPartyInsured = document.querySelector('input[name="otherPartyInsured"]:checked')?.value;
    const soughtMedicalAttention = document.querySelector('input[name="soughtMedicalAttention"]:checked')?.value;
    const accidentDescription = document.getElementById('accidentDescription').value;

    if (!injuryType) {
      showError('injuryType', 'Please select an injury type');
      isValid = false;
    }
    
    if (!accidentDate) {
      showError('accidentDate', 'Please select when the accident occurred');
      isValid = false;
    }
    
    if (!atFault || !hasAttorney || !otherPartyInsured || !soughtMedicalAttention) {
      alert('Please answer all required questions');
      isValid = false;
    }

    if (!isValid) return;

    // Store data
    Object.assign(formData, {
      injuryType,
      accidentDate,
      atFault,
      hasAttorney,
      otherPartyInsured,
      soughtMedicalAttention,
      accidentDescription
    });

    // Show loading state
    document.getElementById('step2').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    
    // Simulate loading (3 seconds)
    setTimeout(() => {
      document.getElementById('loadingState').style.display = 'none';
      document.getElementById('step3').style.display = 'block';
      updateProgressDots(3);
    }, 3000);
    
    return;
  }

  // Hide current step and show next step
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep + 1}`).style.display = 'block';
  updateProgressDots(currentStep + 1);
}

function previousStep(currentStep) {
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep - 1}`).style.display = 'block';
  updateProgressDots(currentStep - 1);
}

// Form submission
function submitForm() {
  const tcpaConsent = document.getElementById('tcpaConsent').checked;
  
  if (!tcpaConsent) {
    alert('Please accept the consent agreement');
    return;
  }

  formData.tcpaConsent = tcpaConsent;
  
  // Here you would typically send the formData to your server
  console.log('Form submitted:', formData);
  
  // Show success message
  alert('Form submitted successfully! We will contact you soon.');
}

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateProgressDots(1);
  
  // Add input event listeners for real-time validation
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearError(input.id);
    });
  });
});