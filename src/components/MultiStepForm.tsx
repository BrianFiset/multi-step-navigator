import { useState } from "react";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { toast } from "sonner";

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
};

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleStepOneSubmit = (stepOneData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepOneData }));
    setStep(2);
  };

  const handleStepTwoSubmit = async (stepTwoData: Partial<FormData>) => {
    const finalFormData = { ...formData, ...stepTwoData };
    console.log("Form submitted:", finalFormData);
    toast.success("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              Step {step}/2
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
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1
              ? "Share Your Information to Get Started"
              : "Tell Us About Your Case"}
          </h1>
          <p className="text-gray-600 mt-1">
            {step === 1
              ? "Fill out this quick form to receive immediate legal assistance."
              : "Help us understand your situation better."}
          </p>
        </div>

        {step === 1 ? (
          <StepOne onSubmit={handleStepOneSubmit} initialData={formData} />
        ) : (
          <StepTwo onSubmit={handleStepTwoSubmit} initialData={formData} />
        )}
      </div>
    </div>
  );
};