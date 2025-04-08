import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import right_arrow from "@/../public/icons/arrow_right.svg";
import FormInput from "@/components/ui/formInput";
import {
  validateAddress,
  validateAge,
  validateBankAccNumber,
  validateBankName,
  validateCurrentAddress,
  validateDOB,
  validateGuardian,
  validateIFSC,
  validateName,
  validatePhone,
} from "@/utils/validators";

// Define the form data type
interface SignUpData {
  name: string;
  guardian: string;
  address: string;
  currentAddress: string;
  dob: string;
  age: string;
  gender: string;
  phone: string;
  volunteerRegisterNumber: string;
  bankAccNumber: string;
  bankName: string;
  ifsc: string;
  pwdCategory: string;
  entrepreneurshipInterest: string;
}

function BasicForm({ switchTab, formData, updateFormData }: any) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: formData,
  });

  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    updateFormData(data);
    console.log("Form Data:", data);

    switchTab && switchTab({ index: 1, value: "verification" });
  };

  return (
    <form
      className="w-full max-w-3xl mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="flex flex-col gap-4">
          {/* Name Field */}
          <FormInput
            name="name"
            type="text"
            placeholder="NAME"
            control={control}
            rules={{
              required: "Name is required",
              validate: (value: any) => {
                let nameValidate = validateName(value);
                if (nameValidate) {
                  setBlock(true);
                  return nameValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.name}
          />

          {/* Guardian Field */}
          <FormInput
            name="guardian"
            type="text"
            placeholder="NAME OF FATHER/MOTHER"
            control={control}
            rules={{
              required: "Guardian name is required",
              validate: (value: any) => {
                let guardianValidate = validateGuardian(value);
                if (guardianValidate) {
                  setBlock(true);
                  return guardianValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.guardian}
          />

          {/* Address Field */}
          <FormInput
            name="address"
            type="text"
            placeholder="ADDRESS"
            control={control}
            rules={{
              required: "Address is required",
              validate: (value: any) => {
                let addressValidate = validateAddress(value);
                if (addressValidate) {
                  setBlock(true);
                  return addressValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.address}
          />

          {/* Date of Birth Field */}
          <FormInput
            name="dob"
            type="date"
            placeholder="DOB"
            control={control}
            rules={{
              required: "Date of Birth is required",
              validate: (value: any) => {
                let dobValidate = validateDOB(value);
                if (dobValidate) {
                  setBlock(true);
                  return dobValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.dob}
          />

          {/* Age Number Field */}
          <FormInput
            name="age"
            type="number"
            placeholder="Age"
            control={control}
            rules={{
              required: "Age is required",
              validate: (value: any) => {
                let ageValidate = validateAge(value);
                if (ageValidate) {
                  setBlock(true);
                  return ageValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.age}
          />

          {/* Gender Field */}
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-3 px-5 bg-[#413C340D] ${
                  errors.gender ? "border-red-500" : ""
                }`}
              >
                <option value="">SELECT GENDER</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
          )}

          {/* Entrepreneurship Interest */}
          <Controller
            name="entrepreneurshipInterest"
            control={control}
            rules={{ required: "Entrepreneurship Interest is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded-lg px-4 py-3 bg-white ${
                  errors.entrepreneurshipInterest ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Entrepreneurship Interest</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          />
          {errors.entrepreneurshipInterest && (
            <p className="text-red-500 text-xs mt-1">
              {errors.entrepreneurshipInterest.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {/* Phone Number Field */}
          <FormInput
            name="phone"
            type="text"
            placeholder="PHONE NUMBER"
            control={control}
            rules={{
              required: "Phone number is required",
              validate: (value: any) => {
                let phoneValidate = validatePhone(value);
                if (phoneValidate) {
                  setBlock(true);
                  return phoneValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.phone}
          />

          {/* Current Address Field */}
          <FormInput
            name="currentAddress"
            type="text"
            placeholder="CURRENT ADDRESS"
            control={control}
            rules={{
              required: "Current Address is required",
              validate: (value: any) => {
                let currentAddressValidate = validateCurrentAddress(value);
                if (currentAddressValidate) {
                  setBlock(true);
                  return currentAddressValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.currentAddress}
          />

          {/* Bank Account Number */}
          <FormInput
            name="bankAccNumber"
            type="text"
            placeholder="BANK ACCOUNT NUMBER"
            control={control}
            rules={{
              required: "Bank Account Number is required",
              validate: (value: any) => {
                let bankAccValidate = validateBankAccNumber(value);
                if (bankAccValidate) {
                  setBlock(true);
                  return bankAccValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.bankAccNumber}
          />

          {/* Bank Name */}
          <FormInput
            name="bankName"
            type="text"
            placeholder="BANK NAME"
            control={control}
            rules={{
              required: "Bank Name is required",
              validate: (value: any) => {
                let bankNameValidate = validateBankName(value);
                if (bankNameValidate) {
                  setBlock(true);
                  return bankNameValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.bankName}
          />

          {/* IFSC Code */}
          <FormInput
            name="ifsc"
            type="text"
            placeholder="IFSC CODE"
            control={control}
            rules={{
              required: "IFSC Code is required",
              validate: (value: any) => {
                let ifscValidate = validateIFSC(value);
                if (ifscValidate) {
                  setBlock(true);
                  return ifscValidate;
                } else {
                  setBlock(false);
                  return true;
                }
              },
            }}
            error={errors.ifsc}
          />

          {/* Volunteer Selection Dropdown (Styled Like Other Inputs) */}
          <Controller
  name="volunteerRegisterNumber"
  control={control}
  rules={{ required: "Volunteer Register Number is required" }}
  render={({ field }) => (
    <input
      {...field}
      type="text"
      placeholder="Volunteer Register Number"
      className={`text-[14px] placeholder:text-gray-500 bg-white leading-[14px] rounded-[10px] border w-full py-3 px-4 bg-[#413C340D] ${
        errors.volunteerRegisterNumber ? "border-red-500" : "border-[#423B3125]"
      }`}
    />
  )}
/>

          {errors.volunteerRegisterNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.volunteerRegisterNumber.message}
            </p>
          )}

          {/* PWD Category */}
          <Controller
            name="pwdCategory"
            control={control}
            rules={{ required: "PWD Category is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded-lg px-4 py-3 bg-white ${
                  errors.pwdCategory ? "border-red-500" : ""
                }`}
              >
                <option value="">Select PWD Category</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          />
          {errors.pwdCategory && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pwdCategory.message}
            </p>
          )}
        </div>
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
