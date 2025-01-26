import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import InputText from "../ui/inputText";
import login_icon from '@/../public/icons/arrow_top_right.svg'
import PasswordInput from "../ui/passwordInput";
import Image from "next/image";


// Define the form data type
interface LoginFormData {
  email: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const searchParams=useSearchParams();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    router.push("/admin/dashboard")
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 mb-[67px]">
        <h1 className="text-text-primary text-[36px] leading-[40px] md:leading-[56px] font-semibold">
          Login
        </h1>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 mb-[45px]">
        {/* Username / Email Field */}
        <div className="flex flex-col gap-2 sm:gap-[13px]">
          <Controller
            name="email"
            control={control}
            // rules={{ required: "Email is required" }}
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
            // rules={{ required: "Password is required" }}
            render={({ field }) => (
              <PasswordInput placeholder="PASSWORD" {...field} />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
          <div className="flex justify-between text-[12px]">
            <div className="font-[500]">
                <input className="" type="checkbox" />
                <span className="ms-1">Remember Me</span>
            </div>
          <a
            className="text-right"
            href="#"
          >
            Forgot password?
          </a>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-[14px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[88px] w-[fit-content] m-auto mb-[20px]"
      >
        <span>Login</span>
        <Image alt="login banner" src={login_icon} />
      </button>
      
      <div className="flex items-center text-[12px] gap-3">
            <div className="">Don't Have An Account?</div>
          <a
            className="text-right text-[#688086] text-[16px] font-[700]"
            href="/sign-up"
          >
            sign up
          </a>
          </div>
    </form>
  );
}

export default LoginForm;
