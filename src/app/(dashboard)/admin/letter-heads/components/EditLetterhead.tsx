"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import TextareaAutosize from 'react-textarea-autosize';
import {
  FileLinkItem,
  LetterHeadData,
} from "@/app/(dashboard)/admin/letter-heads/page";
import { handleCreatePdf } from "./CreatePdf";
import SuccessModal from "@/components/ui/SuccessModal";

export interface signature {
  _id: string;
  userId: string;
  public_id: string;
  name: string;
  url: string;
}

interface LetterHeadButtonProps {
  signatures: signature[];
  letterhead: LetterHeadData;
  fetchLetterhead: () => void;
}

type FileWithCustomName = {
  file: File;
  customName: string;
};

const EditLetterHeadButton = ({
  signatures,
  letterhead,
  fetchLetterhead
}: LetterHeadButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const [letterContent, setLetterContent] = useState<string>(
    letterhead.body_text
  );
  const [letterSubject, setLetterSubject] = useState<string>(
    letterhead.subject
  );
  const [file, setFile] = useState<FileLinkItem[]>(letterhead.file_link);
  const [deletedFiles, setDeletedFile] = useState<string[]>([]);
  const [selectedSignature, setSelectedSignature] =
    useState<signature | null>();

  const [selectedFiles, setSelectedFiles] = useState<FileWithCustomName[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithCustomName[]>([]);
const [loading,setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSelectSignature = (item: signature) => {
    setSelectedSignature(item);
    setIsSignatureModalOpen(false);
  };

  // ==========for change the selected file=========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        customName: file.name,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, customName: newName } : item
      )
    );
  };

  const handleUpload = () => {
    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    setSelectedFiles([]); // Clear selected files
  };

  // ======================Edit letterhead====================

  const handleEditLetterhead = async () => {
    const formData = new FormData();
    if (!selectedSignature) return;

    // Add files and custom names to formData
    uploadedFiles.forEach((item, index) => {
      setLoading(true);
      formData.append(`files[${index}][file]`, item.file);
      formData.append(`files[${index}][name]`, item.customName);
    });

    // Add additional data to the formDat
    formData.append("file_ids", JSON.stringify(deletedFiles));
    formData.append("subject", letterSubject);
    formData.append("body_text", letterContent);
    formData.append("image_id", selectedSignature?._id);

    try {
      // Make the API call using await
      const response = await adminApi.put(
        `/uploads/edit-file/${letterhead._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchLetterhead(); // Fetch updated letterhead list
      setIsModalOpen(false);
      setSuccessMessage(response.data.message);
      setShowSuccessModal(true);
      handleCreatePdf(response.data.data, signatures,"edit");
      // Handle the response
    } catch (error) {
      // Handle error
      console.error("Error uploading files:", error);
    }finally{
      setLoading(false);
    }
  };
  // ================================================================

  // =================for remove selected file========================

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const removeFile = (publicIdToRemove: string) => {
    setFile((prevFiles) =>
      prevFiles.filter((f) => f.public_id !== publicIdToRemove)
    );
    setDeletedFile((prev) => [...prev, publicIdToRemove]); // Fixes the error
  };

  useEffect(() => {
    if (signatures.length && letterhead.image_id) {
      const match = signatures.find((sig) => sig._id === letterhead.image_id);
      setSelectedSignature(match || null);
    }
  }, [signatures, letterhead.image_id]);

  return (
    <div>
      <button
        className="px-4 py-2 bg-green-600 text-white hover:bg-green-800 rounded-md"
        onClick={() => {
          setIsModalOpen(true);
        }}
        title="Remove"
      >
        edit
      </button>

      {/* Modal foe Letter head */}
     {/* Modal for Edit Letterhead */}
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit Letter Head"
  size="large" // or "small", "large", "fullscreen"
  overFlow={true}
>
  <div className="flex justify-center p-4 bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain">
    {/* A4 Container */}
    <div
      className="bg-white shadow-lg relative"
 style={{
          width: "210mm", // A4 width
          minHeight: "297mm", // Minimum height for A4
          boxSizing: "border-box",
        }}    >
      {/* Letterhead Header */}
       <div
          className="flex items-center justify-between h-[180px] px-6"
          style={{
            background: "linear-gradient(to right, #c4c4c4 35%, #ffffff 60%)",
          }}
        >
        {/* Text Section */}
          <div className="pl-16 flex flex-col justify-center text-center flex-1">
            <h1 className="text-4xl font-light text-gray-800 underline mb-2">
              ANARA SKILLS FOUNDATION
            </h1>
            <p className="text-gray-600 text-lg mb-4">www.anaraskills.org</p>
            <p className="text-gray-600 text-base">
              (CIN:U88900KA2024NPL193940)
            </p>
          </div>

        {/* Logo Image */}
        <div className="flex-shrink-0 pl-10">
          <Image
            src="/images/login_banner.png"
            alt="Anara Skills Foundation Logo"
            width={160}
            height={50}
          />
        </div>
      </div>

      {/* Letter Content */}
      <div className="p-6">
         <div className="grid grid-cols-10 gap-4">
        {/* Left Column */}
            <div className="col-span-3 gap-56 border-r-4 border-zinc-500 p-3">
            {[
              {
                name: "Subodh Saxena",
                title: "Founder & Chief Executive Officer (CEO)",
              },
              {
                name: "Sumita Saxena",
                title: "Founder & Chief People Officer (CPO)",
              },
              {
                name: "Dipa Padmakumar",
                title: "Founder & Chief Operating Officer (COO)",
              },
              {
                name: "Baiju K J",
                title: "Founder & Chief Technology Officer (CTO)",
              },
              {
                name: "Shruti Lokre",
                title: "Founder & Chief Legal Officer (CLO)",
              },
            ].map((person, index) => (
              <div className="mb-44" key={index}>
                <h3 className="text-md font-semibold">{person.name}</h3>
                <h5 className="text-[10px] font-light tracking-tight">
                  {person.title}
                </h5>
              </div>
            ))}
          <button
            className="mt-4 px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8] self-center"
            onClick={() => setIsSignatureModalOpen(true)}
          >
            Add Signature
          </button>
        </div>

        {/* Right Column */}
        <div className="col-span-7">

         <input
                      type="text"
                      value={letterSubject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLetterSubject(e.target.value)
                      }
                      className="mb-4 p-2 border w-full border-gray-300 rounded text-sm outline-none"
                    />
                    <TextareaAutosize
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      minRows={8}
                      className="p-4 border border-gray-300 rounded text-sm outline-none w-full"
                    />
          {/* Uploaded Files Display */}
          {file.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Attached Files:</h3>
              <ul>
                {file.map((item, index) => (
                  <li
                    key={item.public_id}
                    className="text-blue-700 flex items-center justify-between"
                  >
                    {item.file_name}
                    <button
                      onClick={() => removeFile(item.public_id)}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {uploadedFiles.map((item, index) => (
                <li key={index} className="text-center relative group">
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={item.customName}
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                  <p className="mt-1 text-sm text-blue-600">
                    {item.customName}
                  </p>
                  <button
                    onClick={() => handleRemoveUploadedFile(index)}
                    className="absolute top-1 right-1 bg-white rounded-full text-red-500 p-1 hover:bg-red-100"
                    title="Remove"
                  >
                    <FiX size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* File Upload */}
          <div className="mt-4 space-y-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Attach files:
            </label>
            <div
              className="w-full border-2 border-dashed border-[#B56365] rounded-lg p-6 text-center 
               hover:bg-[#fdf0f0] transition duration-300 ease-in-out cursor-pointer"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-[#B56365] file:text-white
               hover:file:bg-[#b56364f8]"
              />
              <p className="mt-2 text-xs text-gray-400">
                You can select multiple files
              </p>
            </div>
            
          </div>
          
          {/* Signature Section */}
          {selectedSignature && (
            <div className="mt-6 flex flex-col items-center">
              <Image
                src={selectedSignature.url}
                alt="Signature"
                width={100}
                height={50}
                className="object-contain"
              />
              <h1 className="text-sm font-medium">{selectedSignature.name}</h1>
            </div>
          )}
        </div>
        
      </div>
      </div>
     

      {/* Action Buttons */}
      <div className="flex justify-end gap-6 mt-4 p-4">
        <button
          className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
          onClick={handleEditLetterhead}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
</div>



</Modal>


      {/* Modal for signature list */}
      <Modal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        title="signature"
        size="small" // or "small", "large", "fullscreen"
      >
        <div className="overflow-y-auto">
          <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th></th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">action</th>
              </tr>
            </thead>
            <tbody>
              {signatures.length > 0 &&
                signatures.map((role, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className=" w-32 h-[20px]">
                      <Image
                        src={role.url}
                        alt="Signature"
                        width={60}
                        height={10}
                      />
                    </td>
                    <td className="px-4 py-2 border-b">{role.name}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleSelectSignature(role)}
                        className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
                      >
                        add
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
      {/* modal for success message*/}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default EditLetterHeadButton;