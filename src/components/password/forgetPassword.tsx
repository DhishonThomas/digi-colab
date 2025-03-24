"use client"
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputText from '../ui/inputText';
import Image from 'next/image';


interface ForgetPasswordProps{
    email:string;
}
  
  interface ForgetPasswordFormProps {
    onSubmit: (email: ForgetPasswordProps) => void; 
    errorMessage?:string|null
  }

const ForgetPassword = ({onSubmit,errorMessage}:ForgetPasswordFormProps) => {

    const {
        control,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        setValue,
        formState: { errors },
      } = useForm<ForgetPasswordProps>({
        defaultValues: {
          email: "",
        },
      });

  return (

    <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}> 
       
       <div className="flex flex-col gap-2 mb-[67px]">
        <h1 className="text-text-primary text-[36px] leading-[40px] md:leading-[56px] font-semibold">
          Forget Password
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

        <button
        type="submit"
        className="flex items-center justify-center gap-[14px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[88px] w-[fit-content] m-auto mb-[20px]"
      >
        <span>Verify</span>
      </button>
        </div>
    </form>
)
}

export default ForgetPassword