"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { FiX } from "react-icons/fi";
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
      handleCreatePdf(response.data.data, signatures);
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Letter Head"
        size="large" // or "small", "large", "fullscreen"
        overFlow={true}
      >
        <div className="flex justify-center p-4">
          {/* A5 Container */}
          <div
            className="bg-white shadow-lg"
            style={{
              width: "210mm", // A4 width
              height: "297mm", // A4 height
              padding: "", // Standard letterhead padding
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Letterhead Header */}
        <div className="flex items-center justify-between h-[180px] px-6"   style={{
            background: 'linear-gradient(to right, #c4c4c4 35%, #ffffff 60%)'
          }}
        >
          {/* Text Section - vertically stacked, centered */}
          <div className="pl-16 flex flex-col justify-center text-center flex-1">
            <h1 className="text-4xl font-light text-gray-800 underline mb-2">
              ANARA SKILLS FOUNDATION
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              www.anaraskills.org
            </p>
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
            <div className="mb-8 ">
              <div className="grid grid-cols-10">
                <div className="col-span-3  h-full border-r-4 border-zinc-500  p-3">
                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Subodh Saxena</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Executive Officer (CEO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Sumita Saxena</h3>
                    <h5 className="text-[10px] font-light tracking-tight">
                      Founder & Chief People Officer (CPO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Dipa Padmakumar</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Operating Officer (COO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Baiju K J</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Technology Officer (CTO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Shruti Lokre</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Legal Officer (CLO)
                    </h5>
                  </div>
                  <button
                    className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    add signature
                  </button>
                </div>
                <div className="col-span-7">
                  <div className="col-span-7 p-4">
                    {/* Subject Field */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) =>
                        setLetterSubject(e.currentTarget.innerText)
                      }
                      className="mb-4 p-2 border border-gray-300 rounded text-sm outline-none"
                    >
                      {letterSubject}
                    </div>

                    {/* Content Field */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) =>
                        setLetterContent(e.currentTarget.innerText)
                      }
                      className="p-4 border border-gray-300 rounded text-sm outline-none min-h-[200px]"
                    >
                      {letterContent}
                    </div>

                    {/* Uploaded Files Display */}

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold mb-2">
                        Attached Files:
                      </h3>
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

                      {uploadedFiles.length > 0 && (
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedFiles.map((item, index) => (
                            <li
                              key={index}
                              className="text-center relative group"
                            >
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
                    </div>

                    {/* File Upload */}

                    <div className="mt-4 space-y-4">
                      {/* File Input */}
                      <div>
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

                      {/* List of Selected Files */}
                      {selectedFiles.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2">
                            Selected Files:
                          </h3>
                          <ul className="space-y-3">
                            {selectedFiles.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <span className="flex items-center gap-2 text-sm text-gray-600">
                                  {item.file.name}
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-red-500 hover:underline text-xs"
                                  >
                                    Remove
                                  </button>
                                </span>

                                <span>
                                  <label
                                    htmlFor="filename"
                                    className="font-semibold"
                                  >
                                    Filename
                                  </label>
                                  <input
                                    type="text"
                                    value={item.customName}
                                    onChange={(e) =>
                                      handleNameChange(index, e.target.value)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 text-sm my-1"
                                    placeholder="Enter custom name"
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={handleUpload}
                            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Upload
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {selectedSignature && (
                  <div className=" absolute bottom-32 left-64 right-0mb-4 ml-4 flex flex-col items-center gap-2">
                    <Image
                      src={selectedSignature.url}
                      alt="Profile Picture"
                      width={60}
                      height={10}
                    />
                    <h1>{selectedSignature.name}</h1>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Footer */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-500">
              <p>
                Company Registration Number: 12345678 • VAT Number: GB123456789
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 mt-4 mr-32">
          <button
            className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            onClick={handleEditLetterhead}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Updating..." : "Update"}

          </button>
          <button
            className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            onClick={() => setIsModalOpen(false)}
          >
            cancel
          </button>
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
