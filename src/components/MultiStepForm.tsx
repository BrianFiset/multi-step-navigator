import { useState, useEffect } from "react";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { toast } from "sonner";
import { submitLeadData } from "@/services/leadPortalService";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipcode: string;
  injuryType: string;
  accidentDate: string;
  atFault: string;
  hasAttorney: string;
  otherPartyInsured: string;
  soughtMedicalAttention: string;
  accidentDescription: string;
  tcpaConsent: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  zipcode: "",
  injuryType: "",
  accidentDate: "",
  atFault: "",
  hasAttorney: "",
  otherPartyInsured: "",
  soughtMedicalAttention: "",
  accidentDescription: "",
  tcpaConsent: "",
};

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSearching) {
      const submitData = async () => {
        try {
          const success = await submitLeadData(formData);
          if (!success) {
            toast.error("Failed to submit lead data");
            setStep(2);
            setIsSearching(false);
            return;
          }
          
          // If successful, continue to step 3 after the loading animation
          const timer = setTimeout(() => {
            setIsSearching(false);
            setStep(3);
          }, 3000);
          
          return () => clearTimeout(timer);
        } catch (error) {
          console.error('Error submitting lead:', error);
          toast.error("Failed to submit lead data");
          setStep(2);
          setIsSearching(false);
        }
      };

      submitData();
    }
  }, [isSearching, formData]);

  const handleStepOneSubmit = (stepOneData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepOneData }));
    setStep(2);
  };

  const handleStepTwoSubmit = (stepTwoData: Partial<FormData>) => {
    const requiredFields = [
      "injuryType",
      "accidentDate",
      "atFault",
      "hasAttorney",
      "otherPartyInsured",
      "soughtMedicalAttention",
    ];

    const missingFields = requiredFields.filter(
      (field) => !stepTwoData[field as keyof typeof stepTwoData]
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setFormData((prev) => ({ ...prev, ...stepTwoData }));
    setIsSearching(true);
  };

  const handleStepThreeSubmit = async (stepThreeData: Partial<FormData>) => {
    const finalFormData = { ...formData, ...stepThreeData };
    console.log("Form submitted:", finalFormData);
    toast.success("Form submitted successfully!");
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(1, prevStep - 1));
  };

  if (isSearching) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-700">
              Searching for Available Partners...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              Step {step}/3
            </span>
            <div className="flex gap-2">
              <div
                className={`h-2 w-16 rounded ${
                  step >= 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-2 w-16 rounded ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-2 w-16 rounded ${
                  step >= 3 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1
              ? "Share Your Information to Get Started"
              : step === 2
              ? "Tell Us About Your Case"
              : "Final Step"}
          </h1>
          <p className="text-gray-600 mt-1">
            {step === 1
              ? "Fill out this quick form to receive immediate legal assistance."
              : step === 2
              ? "Help us understand your situation better."
              : "Please review and confirm your consent."}
          </p>
        </div>

        {step === 1 ? (
          <StepOne onSubmit={handleStepOneSubmit} initialData={formData} />
        ) : step === 2 ? (
          <StepTwo
            onSubmit={handleStepTwoSubmit}
            onPrevious={handlePrevious}
            initialData={formData}
          />
        ) : (
          <StepThree
            onSubmit={handleStepThreeSubmit}
            onPrevious={handlePrevious}
            initialData={formData}
          />
        )}
      </div>
    </div>
  );
};