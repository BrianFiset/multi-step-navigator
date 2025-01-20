import { useForm } from "react-hook-form";
import { FormData } from "./MultiStepForm";
import { Button } from "@/components/ui/button";
import { InjurySection } from "./form-sections/InjurySection";
import { AccidentDateSection } from "./form-sections/AccidentDateSection";
import { YesNoRadioGroup } from "./form-sections/YesNoRadioGroup";
import { AccidentDescriptionSection } from "./form-sections/AccidentDescriptionSection";
import { toast } from "sonner";

interface StepTwoProps {
  onSubmit: (data: Partial<FormData>) => void;
  onPrevious: () => void;
  initialData: FormData;
}

export const StepTwo = ({ onSubmit, onPrevious, initialData }: StepTwoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<Partial<FormData>>({
    defaultValues: initialData,
  });

  const onSelectChange = async (field: keyof FormData, value: string) => {
    if (field === 'injuryType' && value === '') {
      toast.error('Please select a valid injury type');
      return;
    }
    if (field === 'accidentDate' && value === '') {
      toast.error('Please select when the accident occurred');
      return;
    }
    setValue(field, value);
    await trigger(field);
  };

  const onSubmitWithValidation = async (data: Partial<FormData>) => {
    // Check if injury type and accident date are selected
    if (!data.injuryType || data.injuryType === '') {
      toast.error('Please select a valid injury type');
      return;
    }
    if (!data.accidentDate || data.accidentDate === '') {
      toast.error('Please select when the accident occurred');
      return;
    }
    
    // Check if all required radio buttons are selected
    if (!data.atFault) {
      toast.error('Please indicate if you were at fault');
      return;
    }
    if (!data.hasAttorney) {
      toast.error('Please indicate if you have an attorney');
      return;
    }
    if (!data.otherPartyInsured) {
      toast.error('Please indicate if the other party is insured');
      return;
    }
    if (!data.soughtMedicalAttention) {
      toast.error('Please indicate if you sought medical attention');
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWithValidation)} className="space-y-6">
      <InjurySection
        value={watch("injuryType")}
        onChange={(value) => onSelectChange("injuryType", value)}
        required={true}
      />

      <AccidentDateSection
        value={watch("accidentDate")}
        onChange={(value) => onSelectChange("accidentDate", value)}
        required={true}
      />

      <YesNoRadioGroup
        label="Were you at fault in the accident?"
        value={watch("atFault")}
        onChange={(value) => onSelectChange("atFault", value)}
        id="fault"
        required={true}
      />

      <YesNoRadioGroup
        label="Are you currently working with or have you previously retained another attorney for this matter?"
        value={watch("hasAttorney")}
        onChange={(value) => onSelectChange("hasAttorney", value)}
        id="attorney"
        required={true}
      />

      <YesNoRadioGroup
        label="Are you aware if the other party is insured?"
        value={watch("otherPartyInsured")}
        onChange={(value) => onSelectChange("otherPartyInsured", value)}
        id="insured"
        required={true}
      />

      <YesNoRadioGroup
        label="Have you sought medical attention?"
        value={watch("soughtMedicalAttention")}
        onChange={(value) => onSelectChange("soughtMedicalAttention", value)}
        id="medical"
        required={true}
      />

      <AccidentDescriptionSection
        value={watch("accidentDescription") || ""}
        onChange={(e) => setValue("accidentDescription", e.target.value)}
        required={false}
      />

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Previous
        </Button>
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
};