import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InjurySectionProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const InjurySection = ({ value, onChange, required = false }: InjurySectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        What injuries did you sustain?
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select onValueChange={onChange} value={value || ""} required={required}>
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
  );
};