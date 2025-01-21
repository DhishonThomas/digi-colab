"use client";

import Image from "next/image";
import React from "react";
import { Controller, FieldError } from "react-hook-form";

interface Props {
  icon?: string;
  type: string;
  placeholder: string;
  dir?: string;
  control?: any; // Optional for flexibility
  name?: string; // Optional for non-react-hook-form use cases
  rules?: Record<string, any>;
  defaultValue?: string;
  error?: FieldError | undefined;
  disabled?: boolean
}

function FormInput({
  icon,
  type,
  placeholder,
  dir,
  control,
  name,
  rules,
  defaultValue = "",
  error,
  disabled
}: Props) {
  return (
    <div className="flex flex-col gap-2 md:gap-[13px]">
        {control && name ? (
          <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field }) => (
              <input
                id={name}
                {...field}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                autoFocus={!!error}
                className="text-[14px] leading-[14px] rounded-[10px] placeholder:text-[#363636] border border-[#423B3125] w-full py-3 md:py-4 px-5 bg-[#413C340D]"
                dir={dir || "ltr"}
              />
            )}
          />
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete="off"
            className="text-[14px] leading-[14px] rounded-[10px] border placeholder:text-[#363636]  border-[#423B3125] w-full py-3 md:py-4 px-5 bg-[#413C340D]"
            dir={dir || "ltr"}
            defaultValue={defaultValue} // For non-react-hook-form usage
          />
        )}
      {error && error.message && (
        <span className="text-red-500 text-[13px] xl:text-[14px] font-medium">
          *{error.message}
        </span>
      )}
    </div>
  );
}

export default FormInput;
