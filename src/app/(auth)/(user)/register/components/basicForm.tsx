import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import right_arrow from "@/../public/icons/arrow_right.svg";
import FormInput from "@/components/ui/formInput";
import { validateAddress, validateDOB, validateGender, validateGuardian, validateName, validatePhone } from "@/utils/validators";

// Define the form data type
interface SignUpData {
  name: string;
  guardian: string;
  address: string;
  dob: string;
  gender: string;
  phone: string;
}

function BasicForm({ switchTab , formData,updateFormData }: any) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: formData,
  });

useEffect(()=>{
  reset(formData)
},[formData,reset])

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    updateFormData(data)
    console.log("Form Data:", data);

    switchTab && switchTab({ index: 1, value: "verification" });
  };
const [block,setBlock]=useState(false)
  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-[40px]">
        {/* Name Field */}
        <FormInput
          name="name"
          type="text"
          placeholder="NAME"
          control={control}
          rules={{ required: "Name is required",
            validate: (value:any) =>{
              let nameValidate=validateName(value)
           if(nameValidate){
            setBlock(true)
            return nameValidate
           }else{
            setBlock(false)
            return true
           }
          }
           }}
          error={errors.name}
        />

        {/* Guardian Field */}
        <FormInput
          name="guardian"
          type="text"
          placeholder="NAME OF FATHER/MOTHER"
          control={control}
          rules={{ required: "Guardian name is required" ,
            validate: (value:any) =>{
              let guardianValidate=validateGuardian(value)
           if(guardianValidate){
            setBlock(true)
            return guardianValidate
           }else{
            setBlock(false)
            return true
           }
          }
          }}
          error={errors.guardian}
        />

        {/* Address Field */}
        <FormInput
          name="address"
          type="text"
          placeholder="CURRENT ADDRESS"
          control={control}
          rules={{ required: "Address is required" ,
            validate: (value:any) =>{
              let addressValidate=validateAddress(value)
           if(addressValidate){
            setBlock(true)
            return addressValidate
           }else{
            setBlock(false)
            return true
           }
          }
          }}
          error={errors.address}
        />

        {/* Date of Birth Field */}
        <FormInput
          name="dob"
          type="date"
          placeholder="DOB"
          control={control}
          rules={{ required: "Date of Birth is required",
            validate: (value:any) =>{
              let dobValidate=validateDOB(value)
           if(dobValidate){
            setBlock(true)
            return dobValidate
           }else{
            setBlock(false)
            return true
           }
          }
           }}
          error={errors.dob}
        />

        {/* Gender Field */}
        <FormInput
          name="gender"
          type="text"
          placeholder="GENDER"
          control={control}
          rules={{
            required: "Gender is required",
            validate: (value:any) =>{
              let genderValidate=validateGender(value)
           if(genderValidate){
            setBlock(true)
            return genderValidate
           }else{
            setBlock(false)
            return true
           }
          }
          }}
          error={errors.gender}
        />

        {/* Phone Number Field */}
        <FormInput
          name="phone"
          type="text"
          placeholder="PHONE NUMBER"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value:any) =>{
              let phoneValidate=validatePhone(value)
           if(phoneValidate){
            setBlock(true)
            return phoneValidate
           }else{
            setBlock(false)
            return true
           }
          }
          }}
          error={errors.phone}
        />
      </div>

      <button
        disabled={block}
        type="submit"
        className="flex items-center justify-center gap-[34px] text-white bg-[#688086] rounded-[8px] py-[10px] px-[54px] w-[fit-content] m-auto mb-[10px]"
      >
        <span>Next</span>
        <Image alt="login banner" src={right_arrow} />
      </button>
    </form>
  );
}

export default BasicForm;
