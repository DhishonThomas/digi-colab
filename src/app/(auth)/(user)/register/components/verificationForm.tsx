import React, { useRef, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import upload_icon from "@/../public/icons/upload.svg";
import check_icon from "@/../public/icons/check_green.svg";
import download_icon from "@/../public/icons/download.svg";

interface SignUpData {
  capture: File | null;
  undertaking: File | null;
  police_verification: File | null;
  bank: File | null;
  education: File | null;
}

function VerificationForm({ switchTab, updateFormData, formData }: any) {
  const { handleSubmit } = useForm<SignUpData>();

  const [uploadedFiles, setUploadedFiles] = useState<SignUpData>(
    formData.files || {
      capture: null,
      undertaking: null,
      police_verification: null,
      bank: null,
      education: null,
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const fileRefs: any = {
    capture: useRef<HTMLInputElement>(null),
    undertaking: useRef<HTMLInputElement>(null),
    police_verification: useRef<HTMLInputElement>(null),
    bank: useRef<HTMLInputElement>(null),
    education: useRef<HTMLInputElement>(null),
  };

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleFileChange = (field: keyof SignUpData, file: File | null) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev, [field]: file };
      updateFormData({ files: newFiles });
      localStorage.setItem("uploadedFiles", JSON.stringify(newFiles));
      return newFiles;
    });

    // Remove error if file is uploaded
    setErrors((prev) => ({ ...prev, [field]: !file }));
  };

  const handleDownload = () => {
    const pdfUrl = "/pdf/9_Police_Verification.pdf"; // Correct Next.js path
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Police_Verification_Form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles");
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  const onSubmit: SubmitHandler<SignUpData> = async () => {
    // Checking for missing files
    const missingFields = Object.entries(uploadedFiles).reduce((acc, [key, value]) => {
      if (!value) acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    // If any file is missing, prevent submission
    if (Object.keys(missingFields).length > 0) {
      setErrors(missingFields);
      return;
    }

    // Proceed only if "police_verification" file is uploaded
    if (!uploadedFiles.police_verification) {
      setErrors((prev) => ({ ...prev, police_verification: true }));
      return;
    }

    
    switchTab && switchTab({ index: 2, value: "account" });
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 md:gap-6 mb-[40px] w-full max-w-md">
        {Object.keys(uploadedFiles)
          .filter((key) => key !== "police_verification") // Remove "police_verification" from loop
          .map((key) => (
            <div key={key} className="flex flex-col">
              <div
                className={`flex justify-between items-center bg-gray-100 rounded-lg py-3 px-4 cursor-pointer ${
                  errors[key] ? "border border-red-500" : ""
                }`}
              >
                <span>{key.toUpperCase().replace("_", " ")}</span>
                <button type="button" onClick={() => handleFileClick(fileRefs[key])}>
                  {uploadedFiles[key as keyof SignUpData] ? (
                    <Image alt="Uploaded" src={check_icon} width={20} height={20} />
                  ) : (
                    <Image alt="Upload" src={upload_icon} width={20} height={20} />
                  )}
                </button>
              </div>
              <input
                ref={fileRefs[key]}
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(key as keyof SignUpData, e.target.files?.[0] || null)}
              />
              {errors[key] && <p className="text-red-500 text-xs">Please upload {key.replace("_", " ")}.</p>}
            </div>
          ))}

        {/* Police Verification - Special Case with Download Button */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center bg-gray-100 rounded-lg py-3 px-4">
            <span>POLICE VERIFICATION</span>
            <div className="flex gap-3">
              <button type="button" onClick={handleDownload}>
                <Image alt="Download" src={download_icon} width={20} height={20} />
              </button>
              <button type="button" onClick={() => handleFileClick(fileRefs.police_verification)}>
                {uploadedFiles.police_verification ? (
                  <Image alt="Uploaded" src={check_icon} width={20} height={20} />
                ) : (
                  <Image alt="Upload" src={upload_icon} width={20} height={20} />
                )}
              </button>
            </div>
          </div>

          <input
            ref={fileRefs.police_verification}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange("police_verification", e.target.files?.[0] || null)}
          />
          {errors.police_verification && <p className="text-red-500 text-xs">Police verification is required.</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-[#688086] text-white rounded-lg py-2 px-5">Next</button>
      </div>
    </form>
  );
}

export default VerificationForm;
