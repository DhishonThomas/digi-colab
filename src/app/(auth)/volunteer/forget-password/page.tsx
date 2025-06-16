"use client";

import ForgetPassword from "@/components/password/forgetPassword";
import Image from "next/image";
import React, { Suspense, useState } from "react";
import login_banner from "@/../public/images/login_banner.png";
import axios from "axios";
import { VOLUNTEER_FORGET_PASSWORD } from "@/utils/constants";

const Page = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmail = async (data: { email: string }) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(VOLUNTEER_FORGET_PASSWORD, { email: data.email });

      if (response.data.success) {
        setSuccessMessage(`Email sent successfully to ${data.email}. Check your inbox.`);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[310px]">
          <Suspense>
            <ForgetPassword
              onSubmit={handleEmail}
              errorMessage={errorMessage}
              successMessage={successMessage}
              loading={loading}
            />
          </Suspense>
        </div>
        <div className="relative hidden md:block">
          <Image alt="login banner" src={login_banner} />
        </div>
      </div>
    </main>
  );
};

export default Page;
