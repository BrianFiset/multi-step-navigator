import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AccidentDescriptionSectionProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AccidentDescriptionSection = ({
  value,
  onChange,
}: AccidentDescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Could you please describe what happened during the accident?</Label>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder="Please provide details about the accident (optional)"
        className="min-h-[100px]"
      />
    </div>
  );
};