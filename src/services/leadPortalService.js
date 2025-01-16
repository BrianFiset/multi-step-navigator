// Function to get state from zipcode using an API
async function getStateFromZipcode(zipcode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
    const data = await response.json();
    return data.places[0].state;
  } catch (error) {
    console.error('Error fetching state from zipcode:', error);
    return '';
  }
}

export async function submitLeadData(formData) {
  try {
    const state = await getStateFromZipcode(formData.zipcode);
    
    const requestData = {
      Request: {
        Mode: "ping",
        Key: "4363f919c362693f3bfb2b978471ba01acd6dbf09853655f805022feb8ba199a",
        API_Action: "pingPostConsent",
        TYPE: "37",
        IP_Address: "75.2.92.149",
        SRC: "AutoLegalUplift_",
        Landing_Page: "https://auto.legaluplift.com/",
        Trusted_Form_URL: "Trusted_Form_URL",
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        State: state,
        Zip: formData.zipcode,
        Primary_Phone: formData.phone,
        Email: formData.email,
        Has_Attorney: formData.hasAttorney,
        At_Fault: formData.atFault,
        Injured: "Yes",
        Has_Insurance: formData.otherPartyInsured,
        Primary_Injury: formData.injuryType,
        Incident_Date: formData.accidentDate
      }
    };

    console.log('Sending request with data:', requestData);

    const response = await fetch('https://percallpro.leadportal.com/apiJSON.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      console.error('API Response not OK:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Full API Response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: result
    });
    
    return true;
  } catch (error) {
    console.error('Detailed error submitting lead:', {
      error,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}