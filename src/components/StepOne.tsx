import { useForm } from "react-hook-form";
import { FormData } from "./MultiStepForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface StepOneProps {
  onSubmit: (data: Partial<FormData>) => void;
  initialData: FormData;
}

export const StepOne = ({ onSubmit, initialData }: StepOneProps) => {
  const [state, setState] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Partial<FormData>>({
    defaultValues: initialData,
  });

  const zipcode = watch("zipcode");

  // Function to get state from zipcode
  const getStateFromZipcode = async (zipcode: string) => {
    if (/^\d{5}(-\d{4})?$/.test(zipcode)) {
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
        const data = await response.json();
        const stateAbbr = data.places[0]["state abbreviation"];
        setState(stateAbbr);
      } catch (error) {
        console.error("Error fetching state from zipcode:", error);
        setState("");
      }
    }
  };

  // Watch for zipcode changes
  const handleZipcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZipcode = e.target.value;
    if (newZipcode.length === 5) {
      getStateFromZipcode(newZipcode);
    }
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
          <Input
            id="state"
            value={state}
            readOnly
            className="bg-gray-100"
          />
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
            onChange={(e) => {
              register("zipcode").onChange(e);
              handleZipcodeChange(e);
            }}
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