"use client";
import React, { Suspense, useEffect, useState } from "react";
import BasicForm from "./components/basicForm";
import AccountForm from "./components/accountForm";
import VerificationForm from "./components/verificationForm";

type Tab = "basic" | "verification" | "account";

const tabs = [
  { label: "BASIC DETAILS", value: "basic" },
  { label: "VERIFICATION", value: "verification" },
  { label: "ACCOUNT CREATION", value: "account" },
];

type FormData = {
  name: string;
  guardian: string;
  address: string;
  dob: string;
  gender: string;
  phone: string;
  files: {
    capture?: File | null;
    undertaking?: File | null;
    police_verification?: File | null;
    bank?: File | null;
    education?: File | null;
  };
};

function Page() {
  const [activeTab, setActiveTab] = useState<{ index: number; value: Tab }>({
    index: 0,
    value: "basic",
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    guardian: "",
    address: "",
    dob: "",
    gender: "",
    phone: "",
    files: {
      capture: null,
      undertaking: null,
      police_verification: null,
      bank: null,
      education: null,
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
      setFormData(JSON.parse(savedData));
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

  // Save data on form change
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("activeTab", JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("completedForms", JSON.stringify(completedForms));
  }, [completedForms]);

  // Upadationg the parent form..
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({
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

  const handleFinalSubmit = () => {
    console.log("Final Submitted Data:", formData);
    alert("Form submitted successfully!");
    localStorage.removeItem("formData");
    localStorage.removeItem("activeTab");
    localStorage.removeItem("completedForms");
  };

  return (
    <main className="bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat">
      <div className="flex w-full min-h-[100vh] justify-center gap-[173px] container py-[140px]">
        <div className="w-full max-w-[310px]">
          <h1 className="text-text-primary text-[36px] font-semibold text-center mb-6">
            Register
          </h1>
          <div className="flex items-center justify-center mb-[44px] gap-[65px]">
            {tabs.map((tab:any, i) => (
              <div
                key={i}
                onClick={() => handleTabSwitch(i, tab.value)}
                className={`flex flex-col items-center cursor-pointer ${
                  !completedForms[tab.value] && i > activeTab.index ? "opacity-50 cursor-not-allowed" : ""
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
              formData={formData}
              updateFormData={updateFormData}
              handleFinalSubmit={handleFinalSubmit}
              markFormCompleted={markFormCompleted}
            />
          </Suspense>
        </div>
      </div>
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
  handleFinalSubmit: () => void;
  markFormCompleted: (formName: Tab) => void;
}) => {
  switch (activeTab) {
    case "basic":
      return <BasicForm switchTab={() => { markFormCompleted("basic"); switchTab({ index: 1, value: "verification" }); }} formData={formData} updateFormData={updateFormData} />;
    case "verification":
      return <VerificationForm switchTab={() => { markFormCompleted("verification"); switchTab({ index: 2, value: "account" }); }} formData={formData} updateFormData={updateFormData} />;
    case "account":
      return <AccountForm switchTab={switchTab} handleFinalSubmit={handleFinalSubmit} />;
    default:
      return <></>;
  }
};
