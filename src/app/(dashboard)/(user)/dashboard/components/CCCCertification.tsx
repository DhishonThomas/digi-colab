import React, { useEffect, useState } from "react";
import JobRolesList from "./JobRoles";
import Link from "next/link";
import userApi from "@/utils/axios_Interceptors/userApiService";
import { set } from "react-hook-form";

const CCCSection: React.FC = () => {
  const [hasCertificate, setHasCertificate] = useState<null | boolean>(null);
  const [isCCCUploaded, setIsCCCUploaded] = useState<boolean|null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showJobRoles, setShowJobRoles] = useState(false);
const checkCssStatus=async()=>{
    const response=await userApi.get("/ccc-status");
    if(response.data.success&&response.data.cccCertified){
      setIsCCCUploaded(true)
      setHasCertificate(true)
    }else{
      setIsCCCUploaded(false)
    }
console.log("this is ccc-status>data.",response)

  }


useEffect(()=>{

  checkCssStatus()
},[])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
console.log(selectedFile);
    setFile(selectedFile);

  };

  const handleUpload =async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("cccCertificate", file);
    formData.append("cccCertified", hasCertificate ? "Yes" : "No");
    const response=await userApi.post("/update-ccc-status",formData,{
      headers: { "Content-Type": "multipart/form-data" },
    })
    
    console.log("this is the response data of the upload.",response.data)
    

    // Simulate file upload delay
    setTimeout(() => {
      setIsUploading(false);
      setIsCCCUploaded(true);
    }, 1500);
  };

  if(isCCCUploaded===null){
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
     {hasCertificate===false||hasCertificate===null&& <h1 className="text-3xl font-bold text-center text-gray-800">
        CCC Certificate Verification
      </h1>}

      {/* Step 1 - Ask if they have the certificate */}
      {hasCertificate === null && (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-lg font-medium">
            Do you have a valid CCC certificate?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setHasCertificate(true)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Yes, I have it
            </button>
            <button
              onClick={() => setHasCertificate(false)}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              No, I don’t have it
            </button>
          </div>
        </div>
      )}

      {/* Step 2A - Upload UI */}
      {hasCertificate === true && !isCCCUploaded && (
        <div className="border p-6 rounded bg-gray-50 shadow space-y-4">
          <p className="font-medium text-gray-700">
            Please upload your CCC certificate (PDF only)
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="border px-3 py-2 rounded w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`px-6 py-2 rounded text-white ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>

            <button
              onClick={() => {
                setHasCertificate(null);
                setFile(null);
                setError("");
              }}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              ← Back to choice
            </button>
          </div>
        </div>
      )}

      {/* Step 2B - No CCC: Get Certified */}
      {hasCertificate === false && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-6 rounded space-y-4">
          <p className="text-gray-800">
            To proceed, please complete the CCC certification through the
            official NIELIT portal.
          </p>
          <Link
            href="https://nielit.gov.in/content/course-computer-concepts-ccc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Get Certified Here
          </Link>
          <button
            onClick={() => setHasCertificate(null)}
            className="text-sm text-blue-600 underline hover:text-blue-800 block"
          >
            ← Back to choice
          </button>
        </div>
      )}

      {/* Step 3 - Show job roles only after upload + user clicks View */}
      {isCCCUploaded && !showJobRoles && (
        <div className="text-center space-y-4">
          <p className="text-green-700 font-medium">
            ✅ Certificate uploaded successfully!
          </p>
          <button
            onClick={() => setShowJobRoles(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            View Job Roles
          </button>
        </div>
      )}

      {/* Step 4 - Job Roles list */}
      {showJobRoles && <JobRolesList />}
    </div>
  );
};

export default CCCSection;
