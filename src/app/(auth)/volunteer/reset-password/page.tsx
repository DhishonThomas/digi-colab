"use client";
import ResetPassword from "@/components/password/resetPassword";
import Image from "next/image";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import login_banner from "@/../public/images/login_banner.png";
import { VOLUNTEER_RESET_PASSWORD } from "@/utils/constants";

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // ✅ Get token from URL

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPassword = async (data: { password: string; confirm_password: string }) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!token) {
      setErrorMessage("Invalid or expired reset link.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${VOLUNTEER_RESET_PASSWORD}/${token}`, {
        password: data.password,
        confirmPassword: data.confirm_password,
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successful! You can now log in.");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[url('/images/background.png')] bg-center bg-no-repeat bg-cover w-full">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[310px]">
          <Suspense>
            <ResetPassword
              onSubmit={handleResetPassword}
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
