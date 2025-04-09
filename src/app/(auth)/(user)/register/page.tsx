"use client";
import React, { Suspense, useEffect, useState } from "react";
import BasicForm from "./components/basicForm";
import AccountForm from "./components/accountForm";
import VerificationForm from "./components/verificationForm";
import axios from "axios";
import { USER_REGISTER } from "@/utils/constants";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";

type Tab = "basic" | "verification" | "account";

const tabs = [
  { label: "BASIC DETAILS", value: "basic" },
  { label: "VERIFICATION", value: "verification" },
  { label: "ACCOUNT CREATION", value: "account" },
];

export type FormData = {
  name: string;
  email:string;
  password:string;
  guardian: string;
  address: string;
  currentAddress:string;
  dob: string;
  age: number|string;
  gender: string;
  phone: string;
  volunteerRegNum:string;
  bankAccNumber:string;
  bankName: string;
  ifsc: string;
  pwdCategory: string;
  entrepreneurshipInterest: string;
  files: {
    image?: File | null;
    policeVerification?: File | null;
    educationQualification?: File | null;
    bankPassbook?: File|null,
    pwdCertificate?: File|null,
    bplCertificate?: File|null,
  };
};

function Page() {
  const [activeTab, setActiveTab] = useState<{ index: number; value: Tab }>({
    index: 0,
    value: "basic",
  });

  const router=useRouter()

  const [data, setData] = useState<FormData>({
    name: "",
    email:"",
    password:"",
    guardian: "",
    address: "",
    currentAddress:"",
    dob: "",
    age: "",
    gender: "",
    phone: "",
    volunteerRegNum:"",
    bankAccNumber:"",
    bankName: "",
    ifsc: "",
    pwdCategory: "",
    entrepreneurshipInterest: "",
    files: {
      image: null,
      policeVerification: null,
      educationQualification: null,
      bankPassbook:null,
      pwdCertificate:null,
      bplCertificate:null,
    },
  });

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
  
  // Save data on form change (excluding `files`)
  useEffect(() => {
    const { files, ...textData } = data; // Exclude the `files` field
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
    setCompletedForms((prev:any) => ({ ...prev, [formName]: true }));
  };

  // Control tab switching ....sd
  const handleTabSwitch = (index: number, value: Tab) => {
    if (completedForms[value] || index <= activeTab.index) {
      setActiveTab({ index, value });
    }
  };


  const handleFinalSubmit = async (
    email: string,
    password: string,
    undertaking: boolean,
    handleLoading: (loading: boolean) => void,
    handleError: (message: string) => void
  ) => {
    handleLoading(true);
  
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("guardian", data.guardian);
    formData.append("address", data.address);
    formData.append("currentAddress", data.currentAddress);
    formData.append("dob", data.dob);
    formData.append("age", data.age ? String(Number(data.age)) : "0");
    formData.append("gender", data.gender);
    formData.append("phone", data.phone);
    formData.append("volunteerRegNum", data.volunteerRegNum);
    formData.append("bankAccNumber", data.bankAccNumber);
    formData.append("bankName", data.bankName);
    formData.append("ifsc", data.ifsc);
    formData.append("pwdCategory", data.pwdCategory);
    formData.append("entrepreneurshipInterest", data.entrepreneurshipInterest);
    formData.append("undertaking",undertaking+"")
    // Append only files
    Object.entries(data.files || {}).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });
    try {
      const response = await axios.post(USER_REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });  
      if (response.data.success) {
        router.replace("/login");
      } else {
        handleError(response.data.message || "Something went wrong.");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Server error occurred.";
      }
      handleError(errorMessage);
      console.error("Error:", error);
    } finally {
      handleLoading(false);
    }
  };
  return (

<AuthLayout backgroundImage="/images/watermark_logo.png" maxWidth="510px">
  <h1 className="text-text-primary text-[36px] font-semibold text-center mb-6">
    Register
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
</AuthLayout>

         
     
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
  handleFinalSubmit: (email:string,password:string,undertaking:boolean,handleLoading:()=>void,handleError:()=>void) => Promise<any>;
  markFormCompleted: (formName: Tab) => void;
}) => {
  switch (activeTab) {
    case "basic":
      return <BasicForm switchTab={() => { markFormCompleted("basic"); switchTab({ index: 1, value: "verification" }); }} formData={formData} updateFormData={updateFormData} />;
    case "verification":
      return <VerificationForm switchTab={() => { markFormCompleted("verification"); switchTab({ index: 2, value: "account" }); }} formData={formData} updateFormData={updateFormData} />;
    case "account":
      return <AccountForm switchTab={switchTab} handleFinalSubmit={handleFinalSubmit} updateFormData={updateFormData} />;
    default:
      return <></>;
  }
};
