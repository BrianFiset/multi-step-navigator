import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface YesNoRadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id: string;
  required?: boolean;
}

export const YesNoRadioGroup = ({
  label,
  value,
  onChange,
  id,
  required = true,
}: YesNoRadioGroupProps) => {
  return (
    <div className="space-y-4">
      <Label className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup onValueChange={onChange} defaultValue={value} required={required}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id={`${id}-yes`} />
          <Label htmlFor={`${id}-yes`}>Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id={`${id}-no`} />
          <Label htmlFor={`${id}-no`}>No</Label>
        </div>
      </RadioGroup>
    </div>
  );
};