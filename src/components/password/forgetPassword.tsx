"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import InputText from "../ui/inputText";

interface ForgetPasswordProps {
  email: string;
}

interface ForgetPasswordFormProps {
  onSubmit: (data: ForgetPasswordProps) => Promise<void>; 
  errorMessage?: string | null;
  successMessage?: string | null;
  loading: boolean;
}

const ForgetPassword = ({ onSubmit, errorMessage, successMessage, loading }: ForgetPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordProps>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-text-primary text-3xl font-semibold text-center">
          Forget Password
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => <InputText placeholder="EMAIL" {...field} />}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-3 text-white bg-[#688086] rounded-md py-2 px-16 w-fit mx-auto ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#546a70]"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Error & Success Messages */}
        {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center mt-2">{successMessage}</p>}
      </div>
    </form>
  );
};

export default ForgetPassword;
