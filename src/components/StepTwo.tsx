import { useForm } from "react-hook-form";
import { FormData } from "./MultiStepForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StepTwoProps {
  onSubmit: (data: Partial<FormData>) => void;
  initialData: FormData;
}

export const StepTwo = ({ onSubmit, initialData }: StepTwoProps) => {
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
      <div className="space-y-2">
        <Label className="flex items-center">
          What injuries did you sustain?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          onValueChange={(value) => onSelectChange("injuryType", value)}
          defaultValue={watch("injuryType")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your injury type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="head">Head Injury</SelectItem>
            <SelectItem value="neck">Neck Injury</SelectItem>
            <SelectItem value="back">Back Injury</SelectItem>
            <SelectItem value="limbs">Limb Injury</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          When did the accident occur, approximately?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select
          onValueChange={(value) => onSelectChange("accidentDate", value)}
          defaultValue={watch("accidentDate")}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Please select an approximate date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_week">Within the last week</SelectItem>
            <SelectItem value="last_month">Within the last month</SelectItem>
            <SelectItem value="last_3_months">Within the last 3 months</SelectItem>
            <SelectItem value="last_6_months">Within the last 6 months</SelectItem>
            <SelectItem value="last_year">Within the last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center">
          Were you at fault in the accident?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <RadioGroup
          onValueChange={(value) => onSelectChange("atFault", value)}
          defaultValue={watch("atFault")}
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="fault-yes" />
            <Label htmlFor="fault-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="fault-no" />
            <Label htmlFor="fault-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center">
          Are you currently working with or have you previously retained another
          attorney for this matter?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <RadioGroup
          onValueChange={(value) => onSelectChange("hasAttorney", value)}
          defaultValue={watch("hasAttorney")}
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="attorney-yes" />
            <Label htmlFor="attorney-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="attorney-no" />
            <Label htmlFor="attorney-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center">
          Are you aware if the other party is insured?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <RadioGroup
          onValueChange={(value) => onSelectChange("otherPartyInsured", value)}
          defaultValue={watch("otherPartyInsured")}
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="insured-yes" />
            <Label htmlFor="insured-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="insured-no" />
            <Label htmlFor="insured-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center">
          Have you sought medical attention?
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <RadioGroup
          onValueChange={(value) =>
            onSelectChange("soughtMedicalAttention", value)
          }
          defaultValue={watch("soughtMedicalAttention")}
          required
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="medical-yes" />
            <Label htmlFor="medical-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="medical-no" />
            <Label htmlFor="medical-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Could you please describe what happened during the accident?</Label>
        <Textarea
          {...register("accidentDescription")}
          placeholder="Please provide details about the accident (optional)"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
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