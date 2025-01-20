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
}

export const AccidentDateSection = ({ value, onChange }: AccidentDateSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        When did the accident occur, approximately?
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Select onValueChange={onChange} defaultValue={value} required>
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
  );
};