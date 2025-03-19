"use client"
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import login_banner from '@/../public/images/login_banner.png'
import LoginForm from '@/components/login/loginForm';
import axios from 'axios';
import { USER_URL } from '@/utils/constants';


function Login() {

  const handleLogin=async(data:{email:string,password:string})=>{

console.log("form data",data)
  
  const login=await axios.post(`${USER_URL}/login`,{
    email:data.email,
    password:data.password
  })
const token=login.data.token

console.log(token, login.data)
  }

  return (
    <main className=" bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
    <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
      <div className="w-full max-w-[310px]">
        <Suspense>
        <LoginForm onSubmit={handleLogin}/>
        </Suspense>
      </div>
      <div className="  relative hidden md:block">
        <Image alt="login banner" src={login_banner} />
      </div>
    </div>
    </main>
  );
}

export default Login;