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
  bidId: ''
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
  alert(message);
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

// Navigate to next step
function nextStep(currentStep) {
  if (currentStep === 1) {
    // Validate Step 1
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const state = document.getElementById('state').value;
    const zipcode = document.getElementById('zipcode').value;

    if (!firstName || !lastName || !email || !phone || !state || !zipcode) {
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
    Object.assign(formData, { firstName, lastName, email, phone, state, zipcode });
    
    // Move to step 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    updateProgressDots(2);
    
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
    
    // Send ping request
    pingLeadPortal(formData).then(pingResult => {
      if (!pingResult.success) {
        showError('Failed to process your request. Please try again.');
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        return;
      }
      
      // Store the IDs for later use in submission
      formData.leadId = pingResult.leadId;
      formData.bidId = pingResult.bidId;
      
      // Continue to step 3
      setTimeout(() => {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        updateProgressDots(3);
      }, 3000);
    });
    
    return; // Exit here as we're handling the transition with setTimeout
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
  const tcpaConsent = document.getElementById('tcpaConsent').checked;
  
  if (!tcpaConsent) {
    showError('Please accept the consent agreement');
    return;
  }

  formData.tcpaConsent = tcpaConsent;
  
  // Show loading state
  document.getElementById('step3').style.display = 'none';
  document.getElementById('loadingState').style.display = 'flex';
  
  // Send post request with stored lead_id and bid_id
  const result = await postLeadData(formData, formData.leadId, formData.bidId);
  
  if (!result.success) {
    showError('Failed to submit your information. Please try again.');
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    return;
  }
  
  // Hide loading state and show success message
  document.getElementById('loadingState').style.display = 'none';
  alert('Form submitted successfully!');
}

// Initialize progress dots when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateProgressDots(1);
});
