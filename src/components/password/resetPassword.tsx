"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import PasswordInput from "../ui/passwordInput";

interface ResetPasswordProps {
  password: string;
  confirm_password: string;
}

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordProps) => void;
  errorMessage?: string | null;
  successMessage?: string | null;
  loading: boolean;
}

const ResetPassword = ({ onSubmit, errorMessage, successMessage, loading }: ResetPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordProps>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const password = watch("password");

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-text-primary text-3xl font-semibold text-center">
          Reset Password
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters long" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            }}
            render={({ field }) => (
              <PasswordInput
                placeholder="Enter Password"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-2">
          <Controller
            name="confirm_password"
            control={control}
            rules={{
              required: "Confirm Password is required",
              validate: (value) => value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <PasswordInput
                placeholder="Confirm Password"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-3 text-white bg-[#688086] rounded-md py-2 px-16 w-fit mx-auto ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#546a70]"
          }`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>

        {/* Error & Success Messages */}
        {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center mt-2">{successMessage}</p>}
      </div>
    </form>
  );
};

export default ResetPassword;
