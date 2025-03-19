import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import InputText from "@/components/ui/inputText";
import check_icon from '@/../public/icons/check.svg'
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

function AccountForm({switchTab}:any) {
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
    router.push("/")
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-[40px]">
        <div className="flex flex-col gap-[10px]">
        <FormInput
          name="EMAIL"
          type="text"
          placeholder="EMAIL" />
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
          <PasswordInput placeholder="ENTER PASSWORD" />
          <PasswordInput placeholder="CONFIRM PASSWORD"  />
      </div>

      
      <button
        type="submit"
        className="flex items-center justify-center gap-[34px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[54px] w-[fit-content] m-auto mb-[10px]"
      >
        <span>Register</span>
        <Image alt="login banner" src={check_icon} />
      </button>
    </form>
  );
}

export default AccountForm;
