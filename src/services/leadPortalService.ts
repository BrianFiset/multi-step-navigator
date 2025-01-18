interface PingResponse {
  response: {
    lead_id: string;
    bids: {
      bid: Array<{
        bid_id: string;
      }>;
    };
  };
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  zipcode: string;
  injuryType: string;
  accidentDate: string;
  atFault: string;
  hasAttorney: string;
  otherPartyInsured: string;
  soughtMedicalAttention: string;
}

const API_KEY = "4363f919c362693f3bfb2b978471ba01acd6dbf09853655f805022feb8ba199a";
const API_URL = "https://api.fisetbrian.workers.dev/";

async function pingLeadPortal(formData: LeadData) {
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

async function postLeadData(formData: LeadData, leadId: string, bidId: string) {
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
        TCPA_Consent: "Yes",
        TCPA_Language: `I consent to be contacted regarding my legal matter. I understand that this may include calls, text messages, or emails, and that I can withdraw my consent at any time.`,
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

export async function submitLeadData(formData: LeadData): Promise<boolean> {
  try {
    const { leadId, bidId } = await pingLeadPortal(formData);
    await postLeadData(formData, leadId, bidId);
    return true;
  } catch (error) {
    console.error('Error submitting lead:', error);
    return false;
  }
}