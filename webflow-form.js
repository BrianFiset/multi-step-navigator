// Form data storage
let formData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  state: '',
  zipcode: '',
  injuryType: '',
  accidentDate: '',
  atFault: '',
  hasAttorney: '',
  otherPartyInsured: '',
  soughtMedicalAttention: '',
  accidentDescription: '',
  tcpaConsent: false,
  leadId: '',
  bidId: '',
  companyName: 'LegalUpLift' // Default company name
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

// Add error styling to invalid field
function showFieldError(field, message) {
  // Add red border
  field.style.border = '1px solid #ff4444';
  
  // Create or update error message
  let errorDiv = field.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
  errorDiv.textContent = message;
  errorDiv.style.color = '#ff4444';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.marginTop = '4px';
}

// Remove error styling
function removeFieldError(field) {
  field.style.border = '1px solid #d1d5db';
  
  // Remove error message if it exists
  const errorDiv = field.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.remove();
  }
}

// Add input event listeners to remove error on input
document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => removeFieldError(field));
});

// Navigate to next step
function nextStep(currentStep) {
  if (currentStep === 1) {
    // Validate Step 1
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const state = document.getElementById('state');
    const zipcode = document.getElementById('zipcode');
    
    let isValid = true;

    if (!firstName.value) {
      showFieldError(firstName, 'First name is required');
      isValid = false;
    }
    
    if (!lastName.value) {
      showFieldError(lastName, 'Last name is required');
      isValid = false;
    }
    
    if (!email.value) {
      showFieldError(email, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email');
      isValid = false;
    }
    
    if (!phone.value) {
      showFieldError(phone, 'Phone number is required');
      isValid = false;
    } else if (!isValidPhone(phone.value)) {
      showFieldError(phone, 'Please enter a valid phone number');
      isValid = false;
    }
    
    if (!state.value) {
      showFieldError(state, 'State is required');
      isValid = false;
    }
    
    if (!zipcode.value) {
      showFieldError(zipcode, 'Zipcode is required');
      isValid = false;
    } else if (!isValidZipcode(zipcode.value)) {
      showFieldError(zipcode, 'Please enter a valid zipcode');
      isValid = false;
    }

    if (!isValid) return;

    // Store data
    Object.assign(formData, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      state: state.value,
      zipcode: zipcode.value
    });
    
    // Move to step 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    updateProgressDots(2);
    
  } else if (currentStep === 2) {
    // Validate Step 2
    const injuryType = document.getElementById('injuryType');
    const accidentDate = document.getElementById('accidentDate');
    const atFaultInputs = document.querySelectorAll('input[name="atFault"]');
    const hasAttorneyInputs = document.querySelectorAll('input[name="hasAttorney"]');
    const otherPartyInsuredInputs = document.querySelectorAll('input[name="otherPartyInsured"]');
    const soughtMedicalAttentionInputs = document.querySelectorAll('input[name="soughtMedicalAttention"]');
    
    let isValid = true;

    // Validate dropdown selections
    if (!injuryType.value || injuryType.value === "") {
      showFieldError(injuryType, 'Injury type is required');
      isValid = false;
    }
    
    if (!accidentDate.value || accidentDate.value === "") {
      showFieldError(accidentDate, 'Accident date is required');
      isValid = false;
    }

    // Validate radio button groups
    const validateRadioGroup = (inputs, groupName) => {
      const isChecked = Array.from(inputs).some(input => input.checked);
      if (!isChecked) {
        inputs.forEach(input => {
          input.closest('.radio-group').style.border = '1px solid #ef4444';
          input.closest('.radio-group').style.borderRadius = '0.375rem';
          input.closest('.radio-group').style.padding = '0.5rem';
        });
        isValid = false;
      }
    };

    validateRadioGroup(atFaultInputs, 'atFault');
    validateRadioGroup(hasAttorneyInputs, 'hasAttorney');
    validateRadioGroup(otherPartyInsuredInputs, 'otherPartyInsured');
    validateRadioGroup(soughtMedicalAttentionInputs, 'soughtMedicalAttention');

    if (!isValid) return;

    // Store data
    Object.assign(formData, {
      injuryType: injuryType.value,
      accidentDate: accidentDate.value,
      atFault: document.querySelector('input[name="atFault"]:checked')?.value,
      hasAttorney: document.querySelector('input[name="hasAttorney"]:checked')?.value,
      otherPartyInsured: document.querySelector('input[name="otherPartyInsured"]:checked')?.value,
      soughtMedicalAttention: document.querySelector('input[name="soughtMedicalAttention"]:checked')?.value,
      accidentDescription: document.getElementById('accidentDescription').value
    });

    // Show loading state
    document.getElementById('step2').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    
    // Send ping request
    pingLeadPortal(formData).then(pingResult => {
      if (pingResult.success) {
        formData.leadId = pingResult.leadId;
        formData.bidId = pingResult.bidId;
      }
      
      // Update TCPA text with company name
      const tcpaText = document.getElementById('tcpaText');
      if (tcpaText) {
        tcpaText.textContent = `I consent to be contacted by ${formData.companyName} regarding my legal matter. I understand that this may include calls, text messages, or emails, and that I can withdraw my consent at any time.`;
      }
      
      setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        updateProgressDots(3);
      }, 3000);
    });
    
    return;
  }
}

// Navigate to previous step
function previousStep(currentStep) {
  document.getElementById(`step${currentStep}`).style.display = 'none';
  document.getElementById(`step${currentStep - 1}`).style.display = 'block';
  updateProgressDots(currentStep - 1);
}

// Submit form
async function submitForm() {
  const tcpaConsent = document.getElementById('tcpaConsent');
  
  if (!tcpaConsent.checked) {
    showFieldError(tcpaConsent, 'You must consent to be contacted');
    tcpaConsent.closest('.checkbox-label').style.color = '#ef4444';
    return;
  }

  formData.tcpaConsent = tcpaConsent.checked;
  
  // Show loading state
  document.getElementById('step3').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';
  
  // Send post request with stored lead_id and bid_id
  const result = await postLeadData(formData, formData.leadId, formData.bidId);
  
  // Hide loading state and show success message regardless of API result
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('successState').style.display = 'block';
}

// API configuration
const API_KEY = "4363f919c362693f3bfb2b978471ba01acd6dbf09853655f805022feb8ba199a";
const API_URL = "https://api.fisetbrian.workers.dev/";

// Ping request to get lead_id and bid_id
async function pingLeadPortal(formData) {
  try {
    const pingPayload = {
      Request: {
        Mode: "ping",
        Key: API_KEY,
        API_Action: "pingPostConsent",
        TYPE: "37",
        IP_Address: "75.2.92.149",
        SRC: "AutoLegalUplift_",
        State: formData.state,
        Zip: formData.zipcode,
        Has_Attorney: formData.hasAttorney,
        At_Fault: formData.atFault,
        Injured: "Yes",
        Has_Insurance: formData.otherPartyInsured,
        Primary_Injury: formData.injuryType,
        Incident_Date: formData.accidentDate,
        Skip_Dupe_Check: "1",
        Format: "JSON"
      }
    };

    console.log('Ping Request:', pingPayload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(pingPayload)
    });

    const data = await response.json();
    console.log('Ping Response:', data);
    
    // Extract company name from the first bid's seller_company_name
    if (data.response?.bids?.bid?.[0]?.seller_company_name) {
      formData.companyName = data.response.bids.bid[0].seller_company_name;
    }
    
    return {
      leadId: data.response.lead_id,
      bidId: data.response.bids.bid[0].bid_id,
      success: true
    };
  } catch (error) {
    console.error('Error in ping request:', error);
    return {
      leadId: '',
      bidId: '',
      success: false
    };
  }
}

// Post request with lead data
async function postLeadData(formData, leadId, bidId) {
  try {
    const tcpaLanguage = `I consent to be contacted by ${formData.companyName} regarding my legal matter. I understand that this may include calls, text messages, or emails, and that I can withdraw my consent at any time.`;
    
    const postPayload = {
      Request: {
        Mode: "post",
        Key: API_KEY,
        API_Action: "pingPostConsent",
        TYPE: "37",
        IP_Address: "75.2.92.149",
        SRC: "AutoLegalUplift_",
        Landing_Page: window.location.href,
        Trusted_Form_URL: "Trusted_Form_URL",
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        State: formData.state,
        Zip: formData.zipcode,
        Primary_Phone: formData.phone,
        Email: formData.email,
        Has_Attorney: formData.hasAttorney,
        At_Fault: formData.atFault,
        Injured: "Yes",
        Has_Insurance: formData.otherPartyInsured,
        Primary_Injury: formData.injuryType,
        Incident_Date: formData.accidentDate,
        Skip_Dupe_Check: "1",
        Lead_ID: leadId,
        Match_With_Bid_ID: bidId,
        TCPA_Consent: "Yes",
        TCPA_Language: tcpaLanguage,
        Format: "JSON"
      }
    };

    console.log('Post Request:', postPayload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(postPayload)
    });

    const data = await response.json();
    console.log('Post Response:', data);

    return { success: true };
  } catch (error) {
    console.error('Error in post request:', error);
    return { success: false };
  }
}

function updateProgressDots(step) {
  document.getElementById('currentStep').textContent = step;
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`dot${i}`);
    dot.classList.toggle('active', i <= step);
  }
}

// Initialize progress dots when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateProgressDots(1);
  
  // Add input listeners to radio groups to remove error styling
  document.querySelectorAll('.radio-group').forEach(group => {
    group.addEventListener('change', () => {
      group.style.border = 'none';
      group.style.padding = '0';
    });
  });
  
  // Add change listener to TCPA checkbox to remove error styling
  document.getElementById('tcpaConsent').addEventListener('change', function() {
    if (this.checked) {
      removeFieldError(this);
      this.closest('.checkbox-label').style.color = '#4b5563';
    }
  });
});
