import { useForm } from "react-hook-form";
import { FormData } from "./MultiStepForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StepThreeProps {
  onSubmit: (data: Partial<FormData>) => void;
  onPrevious: () => void;
  initialData: FormData;
}

export const StepThree = ({ onSubmit, onPrevious, initialData }: StepThreeProps) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Partial<FormData>>({
    defaultValues: initialData,
  });

  const onSubmitForm = (data: Partial<FormData>) => {
    if (!watch("tcpaConsent")) {
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tcpaConsent"
            onCheckedChange={(checked) => {
              setValue("tcpaConsent", checked ? "true" : "false");
            }}
          />
          <Label htmlFor="tcpaConsent" className="text-sm text-gray-600">
            I consent to be contacted by Law Partners regarding my legal matter. I
            understand that this may include calls, text messages, or emails, and
            that I can withdraw my consent at any time.
          </Label>
        </div>
      </div>

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