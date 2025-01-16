import { useForm } from "react-hook-form";
import { FormData } from "./MultiStepForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepOneProps {
  onSubmit: (data: Partial<FormData>) => void;
  initialData: FormData;
}

export const StepOne = ({ onSubmit, initialData }: StepOneProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Partial<FormData>>({
    defaultValues: initialData,
  });

  const handleStateChange = (value: string) => {
    setValue('state', value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9-+()]*$/,
                message: "Invalid phone number",
              },
            })}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">
            State <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={handleStateChange} defaultValue={initialData.state}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">AL</SelectItem>
              <SelectItem value="AK">AK</SelectItem>
              <SelectItem value="AZ">AZ</SelectItem>
              <SelectItem value="AR">AR</SelectItem>
              <SelectItem value="CA">CA</SelectItem>
              <SelectItem value="CO">CO</SelectItem>
              <SelectItem value="CT">CT</SelectItem>
              <SelectItem value="DE">DE</SelectItem>
              <SelectItem value="FL">FL</SelectItem>
              <SelectItem value="GA">GA</SelectItem>
              <SelectItem value="HI">HI</SelectItem>
              <SelectItem value="ID">ID</SelectItem>
              <SelectItem value="IL">IL</SelectItem>
              <SelectItem value="IN">IN</SelectItem>
              <SelectItem value="IA">IA</SelectItem>
              <SelectItem value="KS">KS</SelectItem>
              <SelectItem value="KY">KY</SelectItem>
              <SelectItem value="LA">LA</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="MD">MD</SelectItem>
              <SelectItem value="MA">MA</SelectItem>
              <SelectItem value="MI">MI</SelectItem>
              <SelectItem value="MN">MN</SelectItem>
              <SelectItem value="MS">MS</SelectItem>
              <SelectItem value="MO">MO</SelectItem>
              <SelectItem value="MT">MT</SelectItem>
              <SelectItem value="NE">NE</SelectItem>
              <SelectItem value="NV">NV</SelectItem>
              <SelectItem value="NH">NH</SelectItem>
              <SelectItem value="NJ">NJ</SelectItem>
              <SelectItem value="NM">NM</SelectItem>
              <SelectItem value="NY">NY</SelectItem>
              <SelectItem value="NC">NC</SelectItem>
              <SelectItem value="ND">ND</SelectItem>
              <SelectItem value="OH">OH</SelectItem>
              <SelectItem value="OK">OK</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
              <SelectItem value="PA">PA</SelectItem>
              <SelectItem value="RI">RI</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="TN">TN</SelectItem>
              <SelectItem value="TX">TX</SelectItem>
              <SelectItem value="UT">UT</SelectItem>
              <SelectItem value="VT">VT</SelectItem>
              <SelectItem value="VA">VA</SelectItem>
              <SelectItem value="WA">WA</SelectItem>
              <SelectItem value="WV">WV</SelectItem>
              <SelectItem value="WI">WI</SelectItem>
              <SelectItem value="WY">WY</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipcode">
            Zipcode Of Accident <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipcode"
            {...register("zipcode", {
              required: "Zipcode is required",
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: "Invalid zipcode",
              },
            })}
            className={errors.zipcode ? "border-red-500" : ""}
          />
          {errors.zipcode && (
            <p className="text-red-500 text-sm">{errors.zipcode.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next Step
      </Button>
    </form>
  );
};