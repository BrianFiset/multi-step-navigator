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
    setValue(field, value);
    await trigger(field);
  };

  const onSubmitWithValidation = async (data: Partial<FormData>) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWithValidation)} className="space-y-6">
      <InjurySection
        value={watch("injuryType")}
        onChange={(value) => onSelectChange("injuryType", value)}
      />

      <AccidentDateSection
        value={watch("accidentDate")}
        onChange={(value) => onSelectChange("accidentDate", value)}
      />

      <YesNoRadioGroup
        label="Were you at fault in the accident?"
        value={watch("atFault")}
        onChange={(value) => onSelectChange("atFault", value)}
        id="fault"
      />

      <YesNoRadioGroup
        label="Are you currently working with or have you previously retained another attorney for this matter?"
        value={watch("hasAttorney")}
        onChange={(value) => onSelectChange("hasAttorney", value)}
        id="attorney"
      />

      <YesNoRadioGroup
        label="Are you aware if the other party is insured?"
        value={watch("otherPartyInsured")}
        onChange={(value) => onSelectChange("otherPartyInsured", value)}
        id="insured"
      />

      <YesNoRadioGroup
        label="Have you sought medical attention?"
        value={watch("soughtMedicalAttention")}
        onChange={(value) => onSelectChange("soughtMedicalAttention", value)}
        id="medical"
      />

      <AccidentDescriptionSection
        value={watch("accidentDescription") || ""}
        onChange={(e) => setValue("accidentDescription", e.target.value)}
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
          Submit
        </Button>
      </div>
    </form>
  );
};