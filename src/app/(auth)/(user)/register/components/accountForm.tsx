import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import Axios for API requests
import FormInput from "@/components/ui/formInput";
import PasswordInput from "@/components/ui/passwordInput";
import { USER_SEND_OTP, USER_VERIFY_OTP, USER_REGISTER } from "@/utils/constants"; // Ensure correct imports

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
    setValue,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      otp: "",
    },
  });

  // 🔹 State for OTP Handling
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // 🔹 Watch Form Values
  const email = watch("email", "");
  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const otp = watch("otp", "");

  // ⏳ Handle OTP Countdown Timer
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  // ✅ Validate Email Format
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 🔹 API Call: Send OTP
  const sendOtp = async () => {
    if (!email) {
      setError("email", { type: "manual", message: "Please enter your email address." });
      return;
    }
    if (!isValidEmail(email)) {
      setError("email", { type: "manual", message: "Invalid email format." });
      return;
    }

    clearErrors("email"); // ✅ Clears email error if valid
    setLoading(true);

    try {
      const response = await axios.post(USER_SEND_OTP, { email });

      if (response.data.success) {
        setOtpSent(true);
        setOtpMessage("✅ OTP sent successfully!");
        setTimer(60);
      } else {
        setOtpMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error: any) {
      setOtpMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 API Call: Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("otp", { type: "manual", message: "Please enter the OTP sent to your email." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(USER_VERIFY_OTP, { email, otp });

      if (response.data.success) {
        setOtpVerified(true);
        setOtpMessage("✅ OTP verified successfully!");
        clearErrors("otp"); // ✅ Clears OTP error on success

        // Remove timer and resend OTP button after successful verification
        setTimer(0);
        setOtpSent(false);
      } else {
        setError("otp", { type: "manual", message: response.data.message || "Invalid OTP. Try again." });
      }
    } catch (error) {
      setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Final Form Submission
  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    if (!otpVerified) {
      setError("otp", { type: "manual", message: "Please verify the OTP before proceeding." });
      return;
    }
    if (password !== confirmPassword) {
      setError("confirm_password", { type: "manual", message: "Passwords do not match." });
      return;
    }
  
    if (updateFormData) {
      updateFormData({ email, password });
    } else {
      console.error("updateFormData function is missing");
    }
  
    setLoading(true);
  
   handleFinalSubmit()
  };
  

  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 md:gap-6 mb-6 w-full max-w-md">
        
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter Email"
          control={control}
          rules={{ required: "Email is required." }}
          error={errors.email}
        />

        {!otpSent && (
          <button
            type="button"
            onClick={sendOtp}
            className="bg-[#688086] text-white font-semibold py-2 px-4 rounded-lg"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {otpMessage && <p className="text-sm text-green-600">{otpMessage}</p>}

        {otpSent && (
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
              disabled={loading || otpVerified}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {timer > 0 && <p className="text-gray-500 text-xs">Resend OTP in {timer}s</p>}
          </>
        )}

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
        <button
          type="submit"
          className="bg-[#688086] text-white font-semibold rounded-lg py-2 px-6"
          disabled={!otpVerified || loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
