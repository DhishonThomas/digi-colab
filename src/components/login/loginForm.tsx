"use client";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import InputText from "../ui/inputText";
import login_icon from "@/../public/icons/arrow_top_right.svg";
import PasswordInput from "../ui/passwordInput";
import Image from "next/image";
import Link from "next/link";

// Define the form data type
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void; // Parent function to handle data
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)} // Calls the parent function on submit
    >
      <div className="flex flex-col gap-2 mb-[67px]">
        <h1 className="text-text-primary text-[36px] leading-[40px] md:leading-[56px] font-semibold">
          Login
        </h1>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 mb-[45px]">
        {/* Email Field */}
        <div className="flex flex-col gap-2 sm:gap-[13px]">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputText placeholder="EMAIL" {...field} />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2 sm:gap-[13px]">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                placeholder="Enter Password"
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-[14px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[88px] w-[fit-content] m-auto mb-[20px]"
      >
        <span>Login</span>
        <Image alt="login banner" src={login_icon} />
      </button>
    </form>
  );
}

export default LoginForm;
