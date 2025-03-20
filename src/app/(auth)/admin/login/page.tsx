"use client"
import React, { Suspense, useState } from 'react';
import Image from 'next/image';
import login_banner from '@/../public/images/login_banner.png'
import LoginForm from '@/components/login/loginForm';
import axios from 'axios';
import { ADMIN_LOGIN } from '@/utils/constants';
import { useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/store/slices/adminSlice';


function Login() {

  const dispatch=useDispatch()
  const [errorMessage,setErrorMessage]=useState<string|null>(null)
  const router=useRouter()
  const handleLogin = async (data: { email: string; password: string }) => {
    console.log("form data", data);
  
    try {
      const login = await axios.post(ADMIN_LOGIN, {
        email: data.email,
        password: data.password,
      });
  
      const token = login.data.token;
      console.log("Token:", token);
      console.log("Response Data:", login.data);

      dispatch(loginAdmin({
        admin:login.data.admin,
        token:login.data.token
      }))
      router.push("/admin/dashboard")
      setErrorMessage(null); 
    } catch (error: any) {
      if (error.response) {
        console.error("Error Response:", error.response.data.message);
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    
    }
  };
  

  return (
    <main className=" bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
    <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
      <div className="w-full max-w-[310px]">
        <Suspense>
        <LoginForm onSubmit={handleLogin} errorMessage={errorMessage}/>
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