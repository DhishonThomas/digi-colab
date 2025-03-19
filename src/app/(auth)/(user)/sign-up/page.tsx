"use client"
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import Select, { SingleValue } from 'react-select';
import login_banner from '@/../public/images/login_banner.png'
import LoginForm from '@/components/login/loginForm';
import SignUpForm from './components/signupForm';

const options = [
  { value: 'english', label: 'EN' },
  { value: 'arabic', label: 'AR' },
];

function page() {
  const [selectedOption, setSelectedOption] = useState<string | null>("english");

  const handleChange = (newValue: SingleValue<{ value: string; label: string }>) => {
    setSelectedOption(newValue ? newValue.value : null);
  };

  return (
    <main className=" bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
    <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[90px]">
      <div className="w-full max-w-[310px]">
        <Suspense>
        <SignUpForm />
        </Suspense>
      </div>
      <div className="  relative hidden md:block">
        <Image alt="login banner" src={login_banner} />
      </div>
    </div>
    </main>
  );
}

export default page;