"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FieldError } from "react-hook-form";
import Select, { StylesConfig, components } from "react-select";

function FormSelect({
  title,
  list,
  label,
}: {
  title: string;
  list: string[];
  label: string;
}) {
  const elemRef = useRef<HTMLDivElement | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<string>("");

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (elemRef.current && !elemRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elemRef]);

  return (
    <div className="flex flex-col gap-2 md:gap-[13px]">
      <label className="text-text-primary text-[14px]">{label}</label>
      <div
        ref={elemRef}
        className="relative w-full md:w-auto "
        onClick={handleShowOptions}
      >
        <div className="w-full h-[50px] flex items-center justify-between p-[17px] border border-[#E1DDD2] rounded-[8px] cursor-pointer">
          <h4 className="text-[12px] text-[#C0C0C0]">
            {selectedShift ? selectedShift : title}
          </h4>
          <Image
            src={"/icons/arrow_down.svg"}
            alt="arrow"
            width={24}
            height={24}
          />
        </div>
        {showOptions && (
          <div className="bg-[#ffffff] rounded-[8px] py-2 w-[70%] md:w-[110px] md:py-[14px] flex flex-col gap-[2px] items-center absolute z-50 top-[35px] shadow">
            {list.map((option, i) => (
              <button
                onClick={() => setSelectedShift(option)}
                key={i}
                className="py-2 w-full px-3 border-none bg-none outline-none text-[#94684E] hover:text-text-primary text-left"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

const customStyles: StylesConfig<SelectOption, false> = {
  control: (provided: any) => ({
    ...provided,
    minHeight: "36px",
    height: "50px",
    fontSize: "14px",
    textAlign: "left",
    border: "1px solid #E1DDD2",
    width: "100%",
    outLine: "none",
    borderColor: "none",
    borderRadius: "8px",
    boxShadow: "unset",
    "@media (max-width: 768px)": {
      fontSize: "13px",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "#fff", //state.isSelected
    // ? '#f0efcb'
    // : state.isFocused
    // ? '#f0efcb'
    // : '#fff',
    color: state.isSelected ? "#44322d " : `#94684E`,
    ":active": {
      ...provided[":active"],
      color: state.isSelected ? "#44322d " : "#94684E",
    },
    ":hover": {
      color: "#44322d ",
    },
    maxHeight: "100px",
  }),
  menuPortal: (base: any) => ({
    ...base,
    position: "relative",
    zIndex: 999,
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#C0C0C0",
    fontSize: "12px",
  }),
};
const customDropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image src={"/icons/arrow_down.svg"} alt="arrow" width={24} height={24} />
    </components.DropdownIndicator>
  );
};

interface SelectProps {
  label?: string | undefined;
  placeholder?: string | undefined;
  options?: SelectOption[];
  control?: any;
  name: string;
  error?: any;
  labels?: any;
  customError?: any;
  defaultValue?: any;
  rules?: Record<string, any>;
  setSelectedValue?: any;
  handleOnChange?: any;
  isDisabled?: boolean;
}
export function CustomFormSelect({
  label,
  placeholder,
  options,
  error,
  control,
  name,
  rules,
  labels,
  customError,
  defaultValue,
  setSelectedValue,
  handleOnChange,
  isDisabled
}: SelectProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<string>("");

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const defaultOption = options?.find(
    (item) => item.value === defaultValue?.uid
  );

  return (
    <div className="flex flex-col gap-2 md:gap-[13px]">
      <label className="text-text-primary text-[14px]">{label}</label>
      <div className="relative w-full md:w-auto ">
        {control && name ?
        <Controller
          control={control}
          name={name}
          defaultValue={defaultOption || null} // Ensure defaultValue is properly assigned
          rules={rules}
          render={({ field }) => (
            <Select
              {...field}
              instanceId={label}
              placeholder={placeholder}
              components={{ DropdownIndicator: customDropdownIndicator }}
              styles={customStyles}
              isDisabled={isDisabled}
              options={options}
              value={field.value || defaultOption || null} // Ensure value is set to selected option
              onChange={(e) => {
                field.onChange(e);
                setSelectedValue && setSelectedValue(e.value);
                handleOnChange && handleOnChange(e);
              }}
            />
          )}
        />:      <Select
        instanceId={label}
        placeholder={placeholder}
        defaultValue={defaultOption||defaultValue}
        isDisabled={isDisabled}
        components={{ DropdownIndicator: customDropdownIndicator }}
        styles={customStyles}
        options={options}
      />}
      </div>
      {error && error.message && (
        <span className="text-red-500 text-[13px] xl:text-[14px] font-medium">
          *{error.message}
        </span>
      )}
    </div>
  );
}

export default FormSelect;
