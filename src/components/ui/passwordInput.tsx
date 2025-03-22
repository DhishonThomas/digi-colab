"use client";
import Image from "next/image";
import React, { useState } from "react";

type PasswordInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value} // Controlled input
        onChange={onChange} // Parent updates state
        autoComplete="off"
        className="text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-3 md:py-4 px-5 bg-[#413C340D] "
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-[20px] top-[12px] md:top-[17px]"
      >
        {showPassword ? (
          <Image
            alt="show"
            src={"/icons/lock_open.svg"}
            width={16}
            height={16}
          />
        ) : (
          <Image
            alt="hide"
            src={"/icons/lock_closed.svg"}
            width={16}
            height={16}
          />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
