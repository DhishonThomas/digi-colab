import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import InputText from "@/components/ui/inputText";
import right_arrow from '@/../public/icons/arrow_right.svg'
import PasswordInput from "@/components/ui/passwordInput";
import Image from "next/image";
import FormInput from "@/components/ui/formInput";


// Define the form data type
interface SignUpData {
  name: string;
  email: string;
  aadhaar: string;
  phone: string;
}

function SignUpForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpData>({
    defaultValues: {
      email: "",
    },
  });

  const searchParams = useSearchParams();

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    router.push("/register")
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 mb-[67px]">
        <h1 className="text-text-primary text-[36px] leading-[40px] md:leading-[56px] font-semibold">
          Sign Up
        </h1>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 mb-[40px]">
        {/* Username / Email Field */}
        <FormInput
          name="name"
          type="text"
          placeholder="NAME" />
        <FormInput
          name="email"
          type="text"
          placeholder="EMAIL ID" />
          <div className="flex flex-col gap-[10px]">
        <FormInput
          name="aadhaar"
          type="text"
          placeholder="AADHAAR" />
        <div className="flex gap-6 justify-center px-7">
          <div className="flex">
          <FormInput
            name=""
            type="text"
            placeholder="-" /></div>
          <div className="flex">
          <FormInput
            name=""
            type="text"
            placeholder="-" /></div>
          <div className="flex">
          <FormInput
            name=""
            type="text"
            placeholder="-" /></div>
          <div className="flex">
          <FormInput
            name=""
            type="text"
            placeholder="-" /></div>

        </div></div>
        <div className="flex flex-col gap-[10px]">
        <FormInput
          name="phone"
          type="text"
          placeholder="PHONE NUMBER" />
          <div className="flex gap-6 justify-center px-7">
            <div className="flex">
            <FormInput
              name=""
              type="text"
              placeholder="-" /></div>
            <div className="flex">
            <FormInput
              name=""
              type="text"
              placeholder="-" /></div>
            <div className="flex">
            <FormInput
              name=""
              type="text"
              placeholder="-" /></div>
            <div className="flex">
            <FormInput
              name=""
              type="text"
              placeholder="-" /></div>
  
          </div></div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-[34px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[48px] w-[fit-content] m-auto mb-[10px]"
      >
        <span>Next</span>
        <Image alt="login banner" src={right_arrow} />
      </button>

      <div className="flex items-center text-[12px] gap-3">
        <div className=" text-[#544F4F]">Already have an account?</div>
        <a
          className="text-right  text-[16px] font-[700]"
          href="/"
        >
         Log In
        </a>
      </div>
    </form>
  );
}

export default SignUpForm;
