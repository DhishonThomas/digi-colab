"use client"
import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import login_banner from '@/../public/images/login_banner.png';
import LoginForm from '@/components/login/loginForm';
import axios from 'axios';
import { USER_LOGIN } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/store/slices/userSlice';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

function Login() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    } else {
      setLoading(false); 
    }
  }, [token, router]);

  const handleLogin = async (data: { email: string; password: string }) => {


    try {
      const login = await axios.post(USER_LOGIN, {
        email: data.email,
        password: data.password,
      });

      dispatch(loginSuccess({
        user: login.data.user,
        token: login.data.token,
      }));

      setErrorMessage(null);
      router.replace("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.response ? "Invalid email or password" : "Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Checking authentication...</div>;
  }

  return (
    <main className="bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[310px]">
          <Suspense>
            <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
          </Suspense>
        </div>
        <div className="relative hidden md:block">
          <Image alt="login banner" src={login_banner} />
        </div>
      </div>
    </main>
  );
}

export default Login;
