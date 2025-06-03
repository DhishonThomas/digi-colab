import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import FormInput from "@/components/ui/formInput";
import PasswordInput from "@/components/ui/passwordInput";
import {
  CAPTCHA_API,
  VOLUNTEER_SEND_OTP,
  VOLUNTEER_VERIFY_OTP,
} from "@/utils/constants";
import Link from "next/link";
import { debounce } from "lodash";

interface SignUpData {
  email: string;
  password: string;
  confirm_password: string;
  otp: string;
}
const AccountForm = ({
  switchTab,
  handleFinalSubmit,
  formData,
  updateFormData,
}: any) => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: {
      email: formData.email || "",
      password: "",
      confirm_password: "",
      otp: "",
    },
  });
  //|| !formData.files.policeVerification
  if (
    !formData.files.image ||
    !formData.files.educationCertificate ||
    !formData.files.bankDocument
  ) {
    switchTab && switchTab({ index: 1, value: "verification" });
  }

  // 🔹 State
  const [timer, setTimer] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    register: false,
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null); // ✅ CAPTCHA State

  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // 🔹 Watch Form Values
  const email = watch("email", formData.email || "");
  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const otp = watch("otp", "");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      if (formData.otpLockActive) {
        updateFormData({ otpLockActive: false });
      }
    }
  }, [timer]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔹 API Call: Send OTP
  const sendOtp = async () => {
    if (!email || !isValidEmail(email)) {
      setError("email", {
        type: "manual",
        message: "Enter a valid email address.",
      });
      return;
    }
    clearErrors("email");
    setLoading((prev) => ({ ...prev, sendOtp: true }));

    try {
      const response = await axios.post(VOLUNTEER_SEND_OTP, { email });
      if (response.data.success) {
        if (response.data.otpStatus === "sent") {
          updateFormData({
            otpSend: true,
            otpLockActive: true,
            otpMessage: "✅ OTP sent successfully!",
            otpResend: true,
            otpVerified: false,
          });
          setTimer(300);
        } else if (response.data.otpStatus === "verified") {
          updateFormData({
            otpVerified: true,
            otpSend: false,
            otpMessage: "✅ Email already verified!",
            otpResend: false,
            otpLockActive: false,
          });
        }
        clearErrors("otp");
        setTimer(0);
      }
    } catch (error: any) {
      updateFormData({
        otpMessage: error.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  // 🔹 API Call: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("otp", {
        type: "manual",
        message: "Enter the OTP sent to your email.",
      });
      return;
    }
    setLoading((prev) => ({ ...prev, verifyOtp: true }));

    try {
      const response = await axios.post(VOLUNTEER_VERIFY_OTP, { email, otp });
      if (response.data.success) {
        updateFormData({
          otpVerified: true,
          otpResend: false,
          otpSend: false,
          otpMessage: "✅ OTP verified successfully!",
        });

        clearErrors("otp");
        setTimer(0);
      } else {
        setError("otp", {
          type: "manual",
          message: response.data.message || "Invalid OTP.",
        });
      }
    } catch (error: any) {
      setError("otp", {
        type: "manual",
        message:
          error.response?.data?.message || "Invalid OTP. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  // 🔹 Final Form Submission
  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    setLoading((prev) => ({ ...prev, register: true }));

    setSubmitError(""); // Clear previous error messages
    setCaptchaError(""); // Clear previous CAPTCHA error
    try {
      if (!formData.otpVerified) {
        setError("otp", {
          type: "manual",
          message: "Please verify the OTP first.",
        });
        setSubmitError("Please verify the OTP first.");
        return;
      }
      if (password !== confirmPassword) {
        setError("confirm_password", {
          type: "manual",
          message: "Passwords do not match.",
        });
        setSubmitError("Passwords do not match.");
        return;
      }
      if (!declarationAccepted) {
        setSubmitError("Confirmation is required.");
        return;
      }
      if (!captchaValue) {
        setCaptchaError("Please complete the CAPTCHA verification.");
        setSubmitError("Please complete the CAPTCHA verification.");
        return;
      }

      await handleFinalSubmit(
        email,
        password,
        declarationAccepted,
        setSubmitError
      );
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, register: false }));
    }
  };

  // inside your component
  const handleEmailChange = useMemo(
    () =>
      debounce((val: string) => {
        updateFormData({ email: val });
      }, 300),
    []
  );

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-6 w-full max-w-md">
        <FormInput
          label="Email"
          onChange={handleEmailChange}
          name="email"
          type="email"
          placeholder="Enter Email"
          control={control}
          rules={{ required: "Email is required." }}
          error={errors.email}
        />

        {!formData.otpSend && !formData.otpVerified && (
          <button
            type="button"
            onClick={sendOtp}
            className="bg-[#688086] text-white font-semibold py-2 px-4 rounded-lg"
            disabled={loading.sendOtp}
          >
            {loading.sendOtp ? "Verifying..." : "Verify EMAIL"}
          </button>
        )}

        {formData.otpMessage && (
          <p className="text-sm text-green-600">{formData.otpMessage}</p>
        )}

        {formData.otpSend && (
          <>
            <FormInput
              label="OTP"
              name="otp"
              type="text"
              placeholder="Enter OTP"
              control={control}
              rules={{ required: "Please enter the OTP." }}
              error={errors.otp}
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="bg-[#688086] text-white font-semibold py-2 px-4 rounded-lg"
              disabled={loading.verifyOtp || formData.otpVerified}
            >
              {loading.verifyOtp ? "Verifying..." : "Verify OTP"}
            </button>
            {timer > 0 && (
              <p className="text-gray-500 text-xs">Resend OTP in {timer}s</p>
            )}
          </>
        )}
        {timer == 0 && formData.otpResend && (
          <button
            type="button"
            onClick={sendOtp}
            className=" text-blue-600 font-semibold py-2 px-4 rounded-lg"
            disabled={loading.sendOtp || formData.otpVerified}
          >
            {loading.sendOtp ? "Resending..." : "Resend OTP"}
          </button>
        )}
        {formData.otpVerified && (
          <div className="flex flex-col gap-4 md:gap-6 mb-6 w-full max-w-md">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  placeholder="Enter Password"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="confirm_password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  placeholder="Confirm Password"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            {/* ✅ Google reCAPTCHA */}
            <ReCAPTCHA
              className="bg-[#f4f4f4] rounded-3xl"
              sitekey={CAPTCHA_API ?? ""}
              onChange={(value) => setCaptchaValue(value)}
            />
            {captchaError && (
              <p className="text-sm text-red-600">{captchaError}</p>
            )}{" "}
            {/* ✅ CAPTCHA Error Message */}
            {/* ✅ Declaration Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="declaration"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="declaration" className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <Link
                  href={"/volunteer/register/terms-and-conditions"}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
            <button
              type="submit"
              className="bg-[#688086] text-white font-semibold rounded-lg py-2 px-6"
              disabled={
                !formData.otpVerified ||
                !captchaValue ||
                !declarationAccepted ||
                loading.register
              }
            >
              {loading.register ? "Registering..." : "Register"}
            </button>
            {/* ✅ Display submit errors */}
            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default AccountForm;
