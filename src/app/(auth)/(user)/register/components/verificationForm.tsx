import React, { useRef, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import upload_icon from "@/../public/icons/upload.svg";
import check_icon from "@/../public/icons/check_green.svg";
import download_icon from "@/../public/icons/download.svg";
import right_arrow from "@/../public/icons/arrow_right.svg";
interface SignUpData {
  image: File | null;
  undertaking: File | null;
  policeVerification: File | null;
  educationQualification: File | null;
  bankPassbook:File|null;
  pwdCertificate:File|null;
  bplCertificate:File|null;

}

function VerificationForm({ switchTab, updateFormData, formData }: any) {
  const { handleSubmit } = useForm<SignUpData>();

  const [uploadedFiles, setUploadedFiles] = useState<SignUpData>(
    formData.files || {
      image: null,
      undertaking: null,
      policeVerification: null,
      educationQualification: null,
      bankPassbook:null,
      pwdCertificate:null,
      bplCertificate:null,
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const fileRefs: any = {
    image: useRef(null),
    undertaking: useRef(null),
    policeVerification: useRef(null),
    educationQualification: useRef(null),
    bankPassbook:useRef(null),
    pwdCertificate:useRef(null),
    bplCertificate:useRef(null),
  };

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (field: keyof SignUpData, file: File | null) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev, [field]: file };

      updateFormData({ files: newFiles });
      localStorage.setItem("uploadedFiles", JSON.stringify(newFiles));
      console.log("this is file updloaddk>>", newFiles);
      return newFiles;
    });

    setErrors((prev) => ({ ...prev, [field]: !file }));
  };

  const handleDownload = () => {
    const pdfUrl = "/pdf/9_Police_Verification.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Police_Verification_Form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffect(() => {
  //   const savedFiles = localStorage.getItem("uploadedFiles");
  //   if (savedFiles) {
  //     setUploadedFiles(JSON.parse(savedFiles));
  //   }
  // }, []);

  const onSubmit: SubmitHandler<SignUpData> = async () => {
    alert("dksjf")
    const missingFields = Object.keys(uploadedFiles).reduce((acc, key) => {
   

const fileExists=uploadedFiles[key as keyof SignUpData]

const isPwdRequired=key==="pwdCertificate"&&formData.pwdCategory==="Yes";
const isBplRequired=key==="bplCertificate"&&formData.entrepreneurshipInterest==="Yes"


if((!fileExists && isPwdRequired)||(!fileExists&&isBplRequired)|| (!fileExists && key !== "pwdCertificate" && key !== "bplCertificate")){
  acc[key] = true;

}
      return acc;
    }, {} as { [key: string]: boolean });

    if (Object.keys(missingFields).length > 0) {
      setErrors(missingFields);
      return;
    }
    console.log("uploaded files>>>", uploadedFiles);
    switchTab && switchTab({ index: 2, value: "account" });
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-[40px] w-full max-w-md">
        {Object.keys(uploadedFiles)
        .filter((key)=>
          !(formData.pwdCategory === "No" && key == "pwdCertificate")&&
        !(formData.entrepreneurshipInterest === "No" && key=="bplCertificate"))
        .map((key) => (
          <div key={key} className="flex flex-col">
            <div
              className={`flex justify-between items-center bg-gray-100 rounded-lg py-3 px-4 cursor-pointer ${
                errors[key] ? "border border-red-500" : ""
              }`}
            >
              <span>{key.replace(/_/g, " ").toUpperCase()}</span>

              <div className="flex gap-3">
                {key === "policeVerification" && (
                  <button type="button" onClick={handleDownload}>
                    <Image
                      alt="Download"
                      src={download_icon}
                      width={20}
                      height={20}
                    />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleFileClick(fileRefs[key as keyof SignUpData])
                  }
                >
                  {uploadedFiles[key as keyof SignUpData] ? (
                    <Image
                      alt="Uploaded"
                      src={check_icon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      alt="Upload"
                      src={upload_icon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
            </div>

            <input
              ref={fileRefs[key as keyof SignUpData]}
              type="file"
              className="hidden"
              onChange={(e) =>
                handleFileChange(
                  key as keyof SignUpData,
                  e.target.files?.[0] || null
                )
              }
            />
            {errors[key] && (
              <p className="text-red-500 text-xs">
                Please upload {key.replace(/_/g, " ")}.
              </p>
            )}
          </div>
        ))}
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#688086] text-white rounded-lg py-2 px-5"

        >
          <span>Next</span>
          <Image alt="login banner" src={right_arrow} />
        </button>
      </div>
    </form>
  );
}

export default VerificationForm;
