import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import FormInput from "@/components/ui/formInput";
import PasswordInput from "@/components/ui/passwordInput";
import {
  CAPTCHA_API,
  USER_SEND_OTP,
  USER_VERIFY_OTP,
} from "@/utils/constants";

interface SignUpData {
  email: string;
  password: string;
  confirm_password: string;
  otp: string;
}

const AccountForm = ({ switchTab, handleFinalSubmit, updateFormData }: any) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: { email: "", password: "", confirm_password: "", otp: "" },
  });

  // 🔹 State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpMessage, setOtpMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState({ sendOtp: false, verifyOtp: false, register: false });
  const [resendOtp, setResendOtp] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null); // ✅ CAPTCHA State

  // 🔹 Watch Form Values
  const email = watch("email", "");
  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const otp = watch("otp", "");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔹 API Call: Send OTP
  const sendOtp = async () => {
    if (!email || !isValidEmail(email)) {
      setError("email", { type: "manual", message: "Enter a valid email address." });
      return;
    }
    clearErrors("email");
    setLoading((prev) => ({ ...prev, sendOtp: true }));

    try {
      const response = await axios.post(USER_SEND_OTP, { email });
      if (response.data.success) {
        setOtpSent(true);
        setOtpMessage("✅ OTP sent successfully!");
        setTimer(60);
        setResendOtp(true);
      } else {
        setOtpMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      setOtpMessage(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  // 🔹 API Call: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("otp", { type: "manual", message: "Enter the OTP sent to your email." });
      return;
    }
    setLoading((prev) => ({ ...prev, verifyOtp: true }));

    try {
      const response = await axios.post(USER_VERIFY_OTP, { email, otp });
      if (response.data.success) {
        setOtpVerified(true);
        setOtpMessage("✅ OTP verified successfully!");
        clearErrors("otp");
        setResendOtp(false);
        setTimer(0);
        setOtpSent(false);
      } else {
        setError("otp", { type: "manual", message: response.data.message || "Invalid OTP." });
      }
    } catch (error) {
      setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  // 🔹 Final Form Submission
  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    if (!otpVerified) {
      setError("otp", { type: "manual", message: "Please verify the OTP first." });
      return;
    }
    if (password !== confirmPassword) {
      setError("confirm_password", { type: "manual", message: "Passwords do not match." });
      return;
    }
    if (!captchaValue) {
      alert("Please complete the CAPTCHA verification.");
      return;
    }

    if (updateFormData) updateFormData({ email, password });
    setLoading((prev) => ({ ...prev, register: true }));
    await handleFinalSubmit(email, password, setLoading, setSubmitError);
  };
  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 md:gap-6 mb-6 w-full max-w-md">
        <FormInput label="Email" name="email" type="email" placeholder="Enter Email" control={control} rules={{ required: "Email is required." }} error={errors.email} />

        {!otpSent && !otpVerified && (
          <button type="button" onClick={sendOtp} className="bg-[#688086] text-white font-semibold py-2 px-4 rounded-lg" disabled={loading.sendOtp}>
            {loading.sendOtp ? "Sending..." : "Send OTP"}
          </button>
        )}

        {otpMessage && <p className="text-sm text-green-600">{otpMessage}</p>}

        {otpSent && (
          <>
            <FormInput label="OTP" name="otp" type="text" placeholder="Enter OTP" control={control} rules={{ required: "Please enter the OTP." }} error={errors.otp} />
            <button type="button" onClick={verifyOtp} className="bg-[#688086] text-white font-semibold py-2 px-4 rounded-lg" disabled={loading.verifyOtp || otpVerified}>
              {loading.verifyOtp ? "Verifying..." : "Verify OTP"}
            </button>
            {timer > 0 && <p className="text-gray-500 text-xs">Resend OTP in {timer}s</p>}
          </>
        )}

        {otpVerified && (
          <div className="flex flex-col gap-4 md:gap-6 mb-6 w-full max-w-md">
            <Controller name="password" control={control} render={({ field }) => <PasswordInput placeholder="Enter Password" value={field.value || ""} onChange={field.onChange} />} />
            <Controller name="confirm_password" control={control} render={({ field }) => <PasswordInput placeholder="Confirm Password" value={field.value || ""} onChange={field.onChange} />} />

            {/* ✅ Google reCAPTCHA */}
            <ReCAPTCHA className="bg-[#f4f4f4] rounded-3xl" sitekey={CAPTCHA_API??""} onChange={(value) => setCaptchaValue(value)} />

            <button type="submit" className="bg-[#688086] text-white font-semibold rounded-lg py-2 px-6" disabled={!otpVerified || !captchaValue || loading.register}>
              {loading.register ? "Registering..." : "Register"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AccountForm;
