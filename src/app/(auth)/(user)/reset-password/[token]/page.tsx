"use client";
import ResetPassword from "@/components/password/resetPassword";
import Image from "next/image";
import React, { useState } from "react";
import { useParams } from "next/navigation"; // ✅ Use useParams instead of useSearchParams
import axios from "axios";
import login_banner from "@/../public/images/login_banner.png";
import { USER_RESET_PASSWORD } from "@/utils/constants";
import AuthLayout from "@/components/layout/AuthLayout";

const Page = () => {
    
  const { token } = useParams(); // ✅ Get token from URL path
  console.log("Token from URL:", token);

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
      const response = await axios.put(`${USER_RESET_PASSWORD}/${token}`, {
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

    <AuthLayout
    backgroundImage="/images/background.png"
    maxWidth="310px"
    showSideImage
    sideImageSrc={login_banner}
    >
<ResetPassword
            onSubmit={handleResetPassword}
            errorMessage={errorMessage}
            successMessage={successMessage}
            loading={loading}
          />
    </AuthLayout>
  );
};

export default Page;
