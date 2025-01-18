import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccidentDateSectionProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const AccidentDateSection = ({ value, onChange, required = false }: AccidentDateSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        When did the accident occur, approximately?
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select onValueChange={onChange} value={value || ""} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Please select an approximate date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Within the last 10 days">Within the last 10 days</SelectItem>
          <SelectItem value="Within the last 30 days">Within the last 30 days</SelectItem>
          <SelectItem value="Within the last 6 months">Within the last 6 months</SelectItem>
          <SelectItem value="Within the last 1 year">Within the last 1 year</SelectItem>
          <SelectItem value="Within the last 2 years">Within the last 2 years</SelectItem>
          <SelectItem value="Longer than 2 years ago">Longer than 2 years ago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};