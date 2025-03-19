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

function VerificationForm({switchTab}:any) {
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
    switchTab&&switchTab({index:2,value:"account"})
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >

      <div className="flex flex-col gap-4 md:gap-6 mb-[40px]">
        {/* Username / Email Field */}
        <FormInput
          name="name"
          type="text"
          placeholder="CAPTURE IMAGE" />
        <FormInput
          name="email"
          type="text"
          placeholder="UNDERTAKING DOCUMENT" />
        <FormInput
          name="email"
          type="text"
          placeholder="POLICE VERIFICATION" />
        <FormInput
          name="email"
          type="text"
          placeholder="BANK DOCUMENT" />
        <FormInput
          name="email"
          type="text"
          placeholder="EDUCATION QUALIFICATION" />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-[34px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[54px] w-[fit-content] m-auto mb-[10px]"
      >
        <span>Next</span>
        <Image alt="login banner" src={right_arrow} />
      </button>
    </form>
  );
}

export default VerificationForm;
