import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import Image from "next/image";
import right_arrow from "@/../public/icons/arrow_right.svg";
import FormInput from "@/components/ui/formInput";
import { STATE_OPTIONS, DISTRICT_OPTIONS } from "@/utils/constants";
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
  validateVolunteerRegNum,
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
  volunteerRegNum: string;
  educationQualification: string;
  bankAccNumber: string;
  bankName: string;
  ifsc: string;
  pwdCategory: string;
  entrepreneurshipInterest: string;
  educationYearOfCompletion: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
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

        {/* Gender Field */}
        <div className="flex flex-col">
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-2 px-4 bg-[#413C340D] ${
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
            <p className="text-red-500 text-sm mt-2">{errors.gender.message}</p>
          )}
        </div>

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
          placeholder="AGE"
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

        {/* Current Address Field */}
        <FormInput
          name="currentAddress"
          type="text"
          placeholder="PRESENT ADDRESS"
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

        {/* Address Field */}
        <FormInput
          name="address"
          type="text"
          placeholder="PERMANENT ADDRESS"
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

        {/* State Field */}
        <div className="flex flex-col">
          <Controller
            name="state"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-2 px-4 bg-[#413C340D] ${
                  errors.state ? "border-red-500" : ""
                }`}
              >
                <option value="">SELECT STATE</option>
                {STATE_OPTIONS.map((state: string) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-2">{errors.state.message}</p>
          )}
        </div>

        {/* District Field */}
        <div className="flex flex-col">
          <Controller
            name="district"
            control={control}
            rules={{ required: "District is required" }}
            render={({ field }) => {
              const selectedState = useWatch({
                control,
                name: "state",
              });
              return (
                <select
                  {...field}
                  className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-2 px-4 bg-[#413C340D] ${
                    errors.state ? "border-red-500" : ""
                  }`}
                >
                  <option value="">SELECT DISTRICT</option>
                  {(DISTRICT_OPTIONS[selectedState] || []).map(
                    (district: string) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )
                  )}
                </select>
              );
            }}
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-2">
              {errors.district.message}
            </p>
          )}
        </div>

        {/* City Field */}
        <FormInput
          name="city"
          type="text"
          placeholder="CITY"
          control={control}
          rules={{
            required: "City is required",
          }}
          error={errors.city}
        />

        {/* Pincode Field */}
        <FormInput
          name="pincode"
          type="text"
          placeholder="PINCODE"
          control={control}
          rules={{
            required: "Pincode is required",
            validate: (value: any) => {
              const pincodeRegex = /^[1-9][0-9]{5}$/;
              if (!pincodeRegex.test(value)) {
                setBlock(true);
                return "Please enter a valid 6-digit pincode";
              }
              setBlock(false);
              return true;
            },
          }}
          error={errors.pincode}
        />

        {/* Education Qualification Field */}
        <div className="flex flex-col">
          <Controller
            name="educationQualification"
            control={control}
            rules={{ required: "Education Qualification is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] placeholder:text-gray-500 leading-[14px] rounded-[10px] border w-full py-2 px-4 bg-[#413C340D] ${
                  errors.educationQualification
                    ? "border-red-500"
                    : "border-[#423B3125]"
                }`}
              >
                <option value="">SELECT EDUCATIONAL QUALIFICATION</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="ITI">ITI</option>
              </select>
            )}
          />
          {errors.educationQualification && (
            <p className="text-red-500 text-sm mt-2">
              {errors.educationQualification.message}
            </p>
          )}
        </div>

        {/* Education Year of Completion Field */}
        <FormInput
          name="educationYearOfCompletion"
          type="number"
          placeholder="YEAR OF COMPLETION"
          control={control}
          rules={{
            required: "Education year of completion is required",
          }}
          error={errors.educationYearOfCompletion}
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

        {/* Volunteer Registration Number */}
        <FormInput
          name="volunteerRegNum"
          type="text"
          placeholder="VOLUNTEER REGISTRATION NUMBER"
          control={control}
          rules={{
            required: "Volunteer Registration Number is required",
            validate: (value: any) => {
              let volunteerRegNumValidate = validateVolunteerRegNum(value);
              if (volunteerRegNumValidate) {
                setBlock(true);
                return volunteerRegNumValidate;
              } else {
                setBlock(false);
                return true;
              }
            },
          }}
          error={errors.volunteerRegNum}
        />

        {/* PWD Category */}
        <div className="flex flex-col">
          <Controller
            name="pwdCategory"
            control={control}
            rules={{ required: "PWD Category is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-2 px-4 bg-[#413C340D] ${
                  errors.pwdCategory ? "border-red-500" : ""
                }`}
              >
                <option value="">SELECT PWD CATEGORY</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          />
          {errors.pwdCategory && (
            <p className="text-red-500 text-sm mt-2">
              {errors.pwdCategory.message}
            </p>
          )}
        </div>

        {/* Entrepreneurship Interest */}
        <div className="flex flex-col">
          <Controller
            name="entrepreneurshipInterest"
            control={control}
            rules={{ required: "Entrepreneurship Interest is required" }}
            render={({ field }) => (
              <select
                {...field}
                className={`text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-2 px-4 bg-[#413C340D] ${
                  errors.entrepreneurshipInterest ? "border-red-500" : ""
                }`}
              >
                <option value="">SELECT ENTREPRENEURSHIP INTEREST</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            )}
          />
          {errors.entrepreneurshipInterest && (
            <p className="text-red-500 text-sm mt-2">
              {errors.entrepreneurshipInterest.message}
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
