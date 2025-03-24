"use client"
import ForgetPassword from '@/components/password/forgetPassword';
import FormInput from '@/components/ui/formInput'
import InputText from '@/components/ui/inputText';
import Image from 'next/image';
import React, { Suspense, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import login_banner from '@/../public/images/login_banner.png';
import ResetPassword from '@/components/password/resetPassword';


const page = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const handleResetPassword=()=>{

  }


  return (


    <main className="bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[310px]">
          <Suspense>
            <ResetPassword onSubmit={handleResetPassword} errorMessage={errorMessage} />
          </Suspense>
        </div>
        <div className="relative hidden md:block">
          <Image alt="login banner" src={login_banner} />
        </div>
      </div>
    </main>

  )
}

export default page