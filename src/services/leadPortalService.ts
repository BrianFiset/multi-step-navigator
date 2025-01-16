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
const API_URL = "https://percallpro.leadportal.com/apiJSON.php";

async function pingLeadPortal(formData: LeadData) {
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

  console.log('Sending ping request with data:', pingPayload);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pingPayload)
  });

  if (!response.ok) {
    throw new Error(`Ping request failed: ${response.statusText}`);
  }

  const data: PingResponse = await response.json();
  console.log('Ping response:', data);

  return {
    leadId: data.response.lead_id,
    bidId: data.response.bids.bid[0].bid_id
  };
}

async function postLeadData(formData: LeadData, leadId: string, bidId: string) {
  const postPayload = {
    Request: {
      Mode: "post",
      Key: API_KEY,
      API_Action: "pingPostConsent",
      TYPE: "37",
      IP_Address: "75.2.92.149",
      SRC: "AutoLegalUplift_",
      Landing_Page: "https://auto.legaluplift.com/",
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

  console.log('Sending post request with data:', postPayload);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postPayload)
  });

  if (!response.ok) {
    throw new Error(`Post request failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Post response:', data);
  return data;
}

export async function submitLeadData(formData: LeadData): Promise<boolean> {
  try {
    // Step 1: Send ping request
    const { leadId, bidId } = await pingLeadPortal(formData);

    // Step 2: Send post request with lead_id and bid_id
    await postLeadData(formData, leadId, bidId);

    return true;
  } catch (error) {
    console.error('Error submitting lead:', error);
    return false;
  }
}