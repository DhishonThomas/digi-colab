"use client";
import React, { Suspense, useEffect, useState } from "react";
import BasicForm from "./components/basicForm";
import AccountForm from "./components/accountForm";
import VerificationForm from "./components/verificationForm";
import axios from "axios";
import { VOLUNTEER_REGISTER } from "@/utils/constants";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/ui/SuccessModal";

type Tab = "basic" | "verification" | "account";

const tabs = [
  { label: "BASIC DETAILS", value: "basic" },
  { label: "VERIFICATION", value: "verification" },
  { label: "ACCOUNT CREATION", value: "account" },
];

export type FormData = {
  name: string;
  email: string;
  password: string;
  guardian: string;
  address: string;
  currentAddress: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  age: number | string;
  dob: string;
  gender: string;
  phone: string;
  bankAccNumber: string;
  bankName: string;
  ifsc: string;
  educationDegree: string;
  educationYearOfCompletion: string;
  employmentStatus: string;
  monthlyIncomeRange: string;
  otpVerified: boolean;
  otpSend: boolean;
  otpResend: boolean;
  otpLockActive: boolean;
  otpMessage: string;
  files: {
    image?: File | null;
    policeVerification?: File | null;
    bankDocument?: File | null;
    educationCertificate?: File | null;
  };
};

function Page() {
  const [activeTab, setActiveTab] = useState<{ index: number; value: Tab }>({
    index: 0,
    value: "basic",
  });

  const router = useRouter();

  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    guardian: "",
    address: "",
    currentAddress: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    bankAccNumber: "",
    bankName: "",
    ifsc: "",
    educationDegree: "",
    educationYearOfCompletion: "",
    employmentStatus: "",
    monthlyIncomeRange: "",
    otpVerified: false,
    otpSend: false,
    otpResend: false,
    otpLockActive: false,
    otpMessage: "",
    files: {
      image: null,
      policeVerification: null,
      bankDocument: null,
      educationCertificate: null,
    },
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [completedForms, setCompletedForms] = useState<any>({
    basic: false,
    verification: false,
    account: false,
  });

  // Load stored data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData((prevData) => ({
        ...parsedData, // Load text fields from localStorage
        files: prevData.files || {}, // Retain existing `files`
        otpVerified: false,
        otpSend: false,
        otpResend: false,
        otpLockActive: false,
        otpMessage: "",
      }));
    }

    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(JSON.parse(savedTab));
    }

    const savedCompletion = localStorage.getItem("completedForms");
    if (savedCompletion) {
      setCompletedForms(JSON.parse(savedCompletion));
    }
  }, []);

  // Save data on form change (excluding `files` and 'otp' fields)
  useEffect(() => {
    const {
      files,
      otpMessage,
      otpResend,
      otpSend,
      otpVerified,
      otpLockActive,
      ...textData
    } = data; // Exclude the `files` and 'otp' related fields
    localStorage.setItem("formData", JSON.stringify(textData));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("completedForms", JSON.stringify(completedForms));
  }, [completedForms]);
  // Upadationg the parent form..
  const updateFormData = (newData: Partial<FormData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
      files: { ...prev.files, ...newData.files },
    }));
  };

  const markFormCompleted = (formName: Tab) => {
    setCompletedForms((prev: any) => ({ ...prev, [formName]: true }));
  };

  // Control tab switching ....sd
  const handleTabSwitch = (index: number, value: Tab) => {
    if (data.otpLockActive) {
      alert("You can't switch tabs while OTP verification is in progress.");
      return;
    }
    if (completedForms[value] || index <= activeTab.index) {
      setActiveTab({ index, value });
    }
  };

  const handleFinalSubmit = async (
    email: string,
    password: string,
    undertaking: boolean,
    handleError: (message: string) => void
  ) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("guardian", data.guardian);
    formData.append("address", data.address);
    formData.append("currentAddress", data.currentAddress);
    formData.append("state", data.state);
    formData.append("district", data.district);
    formData.append("city", data.city);
    formData.append("pincode", data.pincode);
    formData.append("dob", data.dob);
    formData.append("age", data.age ? String(Number(data.age)) : "0");
    formData.append("gender", data.gender);
    formData.append("phone", data.phone);
    formData.append("bankAccNumber", data.bankAccNumber);
    formData.append("bankName", data.bankName);
    formData.append("ifsc", data.ifsc);
    formData.append("educationDegree", data.educationDegree);
    formData.append(
      "educationYearOfCompletion",
      data.educationYearOfCompletion
    );
    formData.append("employmentStatus", data.employmentStatus);
    formData.append("monthlyIncomeRange", data.monthlyIncomeRange);
    formData.append("undertaking", undertaking + "");
    // Append only files
    Object.entries(data.files || {}).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });
    try {
      const response = await axios.post(VOLUNTEER_REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setSuccessMessage("Volunteer registered successfully!");
        setShowSuccessModal(true);
        router.replace("/volunteer/login");
      } else {
        handleError(response.data.message || "Something went wrong.");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || "Server error occurred.";
      }
      handleError(errorMessage);
      console.error("Error:", error);
    }
  };
  return (
    <main className="bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[510px]">
          <h1 className="text-text-primary text-[36px] font-semibold text-center mb-6">
            Volunteer Register
          </h1>
          <div className="flex items-center justify-center mb-[24px] gap-[65px]">
            {tabs.map((tab: any, i) => (
              <div
                key={i}
                onClick={() => handleTabSwitch(i, tab.value)}
                className={`flex flex-col items-center cursor-pointer ${
                  !completedForms[tab.value] && i > activeTab.index
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div
                  className={`text-[10px] font-[600] border border-[#DADADA] w-[32px] flex items-center justify-center rounded-full aspect-square ${
                    activeTab.index >= i ? "bg-[#688086] text-white" : ""
                  }`}
                >
                  {i + 1}
                </div>
                <div className="text-[8px]">{tab.label}</div>
              </div>
            ))}
          </div>
          <Suspense>
            <TabDispatcher
              switchTab={setActiveTab}
              activeTab={activeTab.value}
              formData={data}
              updateFormData={updateFormData}
              handleFinalSubmit={handleFinalSubmit}
              markFormCompleted={markFormCompleted}
            />
          </Suspense>
        </div>
      </div>
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </main>
  );
}

export default Page;

const TabDispatcher = ({
  activeTab,
  switchTab,
  formData,
  updateFormData,
  handleFinalSubmit,
  markFormCompleted,
}: {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  activeTab: string;
  switchTab: any;
  handleFinalSubmit: (
    email: string,
    password: string,
    undertaking: boolean,
    handleError: () => void
  ) => Promise<any>;
  markFormCompleted: (formName: Tab) => void;
}) => {
  switch (activeTab) {
    case "basic":
      return (
        <BasicForm
          switchTab={() => {
            markFormCompleted("basic");
            switchTab({ index: 1, value: "verification" });
          }}
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    case "verification":
      return (
        <VerificationForm
          switchTab={() => {
            markFormCompleted("verification");
            switchTab({ index: 2, value: "account" });
          }}
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    case "account":
      return (
        <AccountForm
          switchTab={switchTab}
          handleFinalSubmit={handleFinalSubmit}
          formData={formData}
          updateFormData={updateFormData}
        />
      );
    default:
      return <></>;
  }
};
