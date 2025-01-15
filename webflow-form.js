// Add this JavaScript to your Webflow page settings

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

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone number format
function isValidPhone(phone) {
  return /^[0-9-+()]*$/.test(phone);
}

// Validate zipcode format
function isValidZipcode(zipcode) {
  return /^\d{5}(-\d{4})?$/.test(zipcode);
}

// Show error message
function showError(message) {
  alert(message); // You can replace this with a more sophisticated error display
}

// Update progress dots
function updateProgressDots(step) {
  document.getElementById('currentStep').textContent = step;
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.classList.toggle('active', i <= step);
  }
}

// Navigate to next step
function nextStep(currentStep) {
  if (currentStep === 1) {
    // Validate Step 1
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const zipcode = document.getElementById('zipcode').value;

    if (!firstName || !lastName || !email || !phone || !zipcode) {
      showError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!isValidPhone(phone)) {
      showError('Please enter a valid phone number');
      return;
    }

    if (!isValidZipcode(zipcode)) {
      showError('Please enter a valid zipcode');
      return;
    }

    // Store data
    Object.assign(formData, { firstName, lastName, email, phone, zipcode });

  } else if (currentStep === 2) {
    // Validate Step 2
    const injuryType = document.getElementById('injuryType').value;
    const accidentDate = document.getElementById('accidentDate').value;
    const atFault = document.querySelector('input[name="atFault"]:checked')?.value;
    const hasAttorney = document.querySelector('input[name="hasAttorney"]:checked')?.value;
    const otherPartyInsured = document.querySelector('input[name="otherPartyInsured"]:checked')?.value;
    const soughtMedicalAttention = document.querySelector('input[name="soughtMedicalAttention"]:checked')?.value;
    const accidentDescription = document.getElementById('accidentDescription').value;

    if (!injuryType || !accidentDate || !atFault || !hasAttorney || !otherPartyInsured || !soughtMedicalAttention) {
      showError('Please fill in all required fields');
      return;
    }

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
    
    return; // Exit here as we're handling the transition with setTimeout
  }

  // Hide current step and show next step
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep + 1}`).style.display = 'block';
  updateProgressDots(currentStep + 1);
}

// Navigate to previous step
function previousStep(currentStep) {
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep - 1}`).style.display = 'block';
  updateProgressDots(currentStep - 1);
}

// Submit form
function submitForm() {
  const tcpaConsent = document.getElementById('tcpaConsent').checked;
  
  if (!tcpaConsent) {
    showError('Please accept the consent agreement');
    return;
  }

  formData.tcpaConsent = tcpaConsent;
  
  // Here you can send the formData to your server or handle it as needed
  console.log('Form submitted:', formData);
  alert('Form submitted successfully!');
}

// Initialize progress dots when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateProgressDots(1);
});