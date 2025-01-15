import { FormData } from "@/components/MultiStepForm";

interface LeadPortalRequest {
  Request: {
    Mode: string;
    Key: string;
    API_Action: string;
    TYPE: string;
    IP_Address: string;
    SRC: string;
    Landing_Page: string;
    Trusted_Form_URL: string;
    First_Name: string;
    Last_Name: string;
    State: string;
    Zip: string;
    Primary_Phone: string;
    Email: string;
    Has_Attorney: string;
    At_Fault: string;
    Injured: string;
    Has_Insurance: string;
    Primary_Injury: string;
    Incident_Date: string;
  };
}

// Function to get state from zipcode using an API
async function getStateFromZipcode(zipcode: string): Promise<string> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
    const data = await response.json();
    return data.places[0].state;
  } catch (error) {
    console.error('Error fetching state from zipcode:', error);
    return '';
  }
}

export async function submitLeadData(formData: FormData): Promise<boolean> {
  try {
    const state = await getStateFromZipcode(formData.zipcode);
    
    const requestData: LeadPortalRequest = {
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

    const response = await fetch('https://percallpro.leadportal.com/apiJSON.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Lead submission result:', result);
    return true;
  } catch (error) {
    console.error('Error submitting lead:', error);
    return false;
  }
}