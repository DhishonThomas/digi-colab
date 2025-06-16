import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import upload_icon from "@/../public/icons/upload.svg";
import check_icon from "@/../public/icons/check_green.svg";
import download_icon from "@/../public/icons/download.svg";
import right_arrow from "@/../public/icons/arrow_right.svg";
import CameraCaptureModal from "@/components/common/CameraCaptureModal";

interface SignUpData {
  image: File | null;
  policeVerification?: File | null;
  educationDocument: File | null;
  bankPassbook: File | null;
  pwdCertificate: File | null;
  bplCertificate: File | null;
}


const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

function VerificationForm({ switchTab, updateFormData, formData }: any) {
  const { handleSubmit } = useForm<SignUpData>();

  const [uploadedFiles, setUploadedFiles] = useState<SignUpData>(
    formData.files || {
      image: null,
      policeVerification: null,
      educationDocument: null,
      bankPassbook: null,
      pwdCertificate: null,
      bplCertificate: null,
    }
  );
  let filesPlaceHolder:any={image:"IMAGE",policeVerification:"POLICE VERIFICATION",educationDocument:"EDUCATIONAL DOCUMENT",bankPassbook:"BANK PASSBOOK",pwdCertificate:"PWD CERTIFICATE",bplCertificate:"BPL CERTIFICATE"}

  const [showCameraModal, setShowCameraModal] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [blockSubmit, setBlockSubmit] = useState<{ [key: string]: boolean }>(
    {}
  ); // Track form validation per field

  const fileRefs: any = {
    image: useRef(null),
    policeVerification: useRef(null),
    educationDocument: useRef(null),
    bankPassbook: useRef(null),
    pwdCertificate: useRef(null),
    bplCertificate: useRef(null),
  };

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleCapturedImage = (file: File) => {
    handleFileChange("image", file);
  };

  const validateFile = (field: keyof SignUpData, file: File | null) => {
    let errorMsg = "";

    if (!file) {
      errorMsg = "File is required.";
    } else if (field === "image" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errorMsg = "Only JPG, JPEG, or PNG files are allowed.";
    } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errorMsg = `File size must be under ${MAX_FILE_SIZE_MB}MB.`;
    }

    setBlockSubmit((prev) => ({ ...prev, [field]: !errorMsg }));
    return errorMsg;
  };

  const handleFileChange = (field: keyof SignUpData, file: File | null) => {
    const errorMsg = validateFile(field, file);

    setUploadedFiles((prev) => {
      const newFiles = { ...prev, [field]: file };
      updateFormData({ ...formData, files: newFiles }); // Ensure full formData is updated
      localStorage.setItem("uploadedFiles", JSON.stringify(newFiles));
      return newFiles;
    });

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    setTouchedFields((prev) => ({ ...prev, [field]: true })); // Mark field as touched
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
  const checkForErrors = () => {
    const newErrors: { [key: string]: string } = {};
    const newBlockSubmit: { [key: string]: boolean } = {};

    Object.keys(uploadedFiles).forEach((key) => {
      const file = uploadedFiles[key as keyof SignUpData];

      const isPwdRequired =
        key === "pwdCertificate" && formData.pwdCategory === "Yes";
      const isBplRequired =
        key === "bplCertificate" && formData.entrepreneurshipInterest === "Yes";

      // 🆕 Skip policeVerification
      if (key === "policeVerification") {
        newBlockSubmit[key] = true; // Valid by default
        return; // Skip validation
      }

      let errorMsg = "";

      if (
        (!file && isPwdRequired) ||
        (!file && isBplRequired) ||
        (!file && key !== "pwdCertificate" && key !== "bplCertificate")
      ) {
        errorMsg = "This file is required.";
      } else if (
        file &&
        key === "image" &&
        !ALLOWED_IMAGE_TYPES.includes(file.type)
      ) {
        errorMsg = "Only JPG, JPEG, or PNG files are allowed.";
      } else if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errorMsg = `File size must be under ${MAX_FILE_SIZE_MB}MB.`;
      }

      if (errorMsg) {
        newErrors[key] = errorMsg;
        newBlockSubmit[key] = false;
      } else {
        newBlockSubmit[key] = true;
      }
    });

    setErrors(newErrors);
    setBlockSubmit(newBlockSubmit);
  };

  const onSubmit: SubmitHandler<SignUpData> = async () => {
    // Mark all fields as touched
    setTouchedFields(
      Object.keys(uploadedFiles).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );

    checkForErrors(); // Revalidate all fields before submission

    // Prevent submission if any field is invalid
    if (
      Object.values(blockSubmit).some((status) => status === false) ||
      Object.keys(blockSubmit).length < 1
    ) {
      return;
    }

    switchTab && switchTab({ index: 2, value: "account" });
  };

  return (
    <form
      className="flex flex-col items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-[40px] w-full max-w-md">
        {Object.keys(uploadedFiles)
          .filter(
            (key) =>
              !(formData.pwdCategory === "No" && key === "pwdCertificate") &&
              !(
                formData.entrepreneurshipInterest === "No" &&
                key === "bplCertificate"
              )
          )
          .map((key) => (
            <div key={key} className="flex flex-col">
              <div
                className={`flex justify-between items-center bg-gray-100 rounded-lg py-3 px-4 cursor-pointer ${
                  errors[key] && touchedFields[key]
                    ? "border border-red-500"
                    : ""
                }`}
              >
                <span>{filesPlaceHolder[key]}</span>
                <p className="text-gray-400">
                  {key === "policeVerification" ? "*not mandatory" : ""}
                </p>

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
                      key === "image"
                        ? setShowCameraModal(true)
                        : handleFileClick(fileRefs[key])
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
                ref={fileRefs[key]}
                type="file"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(
                    key as keyof SignUpData,
                    e.target.files?.[0] || null
                  )
                }
              />
              {errors[key] && touchedFields[key] && (
                <p className="text-red-500 text-xs">{errors[key]}</p>
              )}
            </div>
          ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#688086] text-white rounded-lg py-2 px-6 w-full"
        >
          <span>Next</span>
          <Image alt="Next arrow" src={right_arrow} width={20} height={20} />
        </button>
      </div>
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCapturedImage}
      />
    </form>
  );
}

export default VerificationForm;
