import Image from 'next/image';
import React from 'react'

type InputProps = {
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputText: React.FC<InputProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className='border border-text-primary rounded-[10px] flex items-center'>
      <input type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className=' text-[14px] leading-[14px] rounded-[10px] border border-[#423B3125] w-full py-3 md:py-4 px-5 bg-[#413C340D]' />
    </div>
  )
}

export default InputText;