import React, { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { useSelector } from "react-redux";
import { signature } from "@/app/(dashboard)/admin/letter-heads/page";
import { RootState } from "@/store/store";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SuccessModal from "@/components/ui/SuccessModal";
import { set } from "lodash";
import NoData from "@/components/ui/NoData";

const Signature = () => {
  const admin: any = useSelector((state: RootState) => state.admin);

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isAddSignatureModal, setIsAddSignatureModal] = useState(false);
  const [isUpdateSignature, setIsUpdateSignature] = useState(false);
  const [signatures, setSignatures] = useState<signature[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // for edit signature
  const [selectedSignature, setSelectedSignature] = useState<signature | null>(
    null
  );

  // for add signature
  const [signatureName, setSignatureName] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const [deleteConformation, setDeleteConformation] = useState(false);
  const [idForDelete, setIdForDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
const  [isDelete, setIsDelete] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const defaultSignatureImage = "/images/signature-dummy.png";

  const fetchSignatures = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.get("/uploads/list");

      if (data) {
        setSignatures(data.images);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // ========= for signature form submit =========

  const handleSubmitSignature = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!signatureName || !signatureFile) {
      setLoading(false);

      alert("Please provide both name and signature image.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", admin?.admin?._id);
    formData.append("userName", signatureName);
    formData.append("image", signatureFile);

    try {
      const response = await adminApi.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Optional: Refresh signature list or close modal
      setIsAddSignatureModal(false);
      setSignatureName("");
      setSignatureFile(null);
      fetchSignatures(); // re-fetch the updated list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload signature.");
    } finally {
      setLoading(false);
      
    }
  };

  // ========= For delete signature ==========
  const deleteSignature = async () => {
    try {
      setIsDelete(true);
      const { data } = await adminApi.delete(`uploads/delete/${idForDelete}`);

      if (data) {
        setIdForDelete(null);
        setSuccessMessage(data.message);
        setShowSuccessModal(true);
        fetchSignatures();
      }
    } catch (error) {
      console.error(error);
    }
     finally {
      setIsDelete(false);
    }
  };

  // ========== For edit signature ===========
  const handleUpdateSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", signatureName);

    if (signatureFile) {
      formData.append("image", signatureFile);
    }
    // setIsLoading(true);
    try {
      const { data } = await adminApi.put(
        `/uploads/edit/${selectedSignature?.public_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data) {
        setIsUpdateSignature(false);
        setSignatureName("");
        setSignatureFile(null);
        fetchSignatures();
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  const [currentPage, setCurrentPage] = useState(1);

  // const handleSearch = (term: string) => {
  //   const lowerTerm = term.toLowerCase();

  //   const result = letterheadList.filter((item) => {
  //     const subjectMatch = item.subject?.toLowerCase().includes(lowerTerm);

  //     // Optional: Add other fields if needed later
  //     return subjectMatch;
  //   });

  //   setFilteredData(result);
  //   setCurrentPage(1); // Reset to the first page when searching
  // };

  const rolesPerPage = 10;

  const paginateData = signatures.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );
  const totalPages = Math.ceil(signatures.length / rolesPerPage);

  useEffect(() => {
    fetchSignatures();
  }, []);
  return (
    <div>
      <button
        className="px-5 py-2 mx-3 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
        onClick={() => setIsSignatureModalOpen(true)}
      >
        Signatures
      </button>

      {/* Modal for list all signatures */}
      <Modal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        title="signature"
        size="large" // or "small", "large", "fullscreen"
        overFlow={true}
      >
        <button
          className="px-5 py-2 m-3 rounded-xl bg-[#B56365] text-white hover:bg-[#b56364f8]"
          onClick={() => setIsAddSignatureModal(true)}
        >
          add signature
        </button>
        {paginateData.length === 0 ? (
          <NoData
            message="No Signatures Found"
            description="It seems there are no signatures available at the moment. Add a new signature to use it in your documents."
            actionText="Add a Signature"
          />
        ) : (
          <div>
            <div className="flex justify-end mx-20"></div>
            <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th></th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">action</th>
                </tr>
              </thead>
              <tbody>
                {paginateData.length > 0 &&
                  paginateData.map((role, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-5 py-2 w-32 h-[20px]">
                        <Image
                          src={role.url}
                          alt="Profile Picture"
                          width={60}
                          height={10}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">{role.name}</td>
                      <td>
                        <button
                          className="px-3 mx-2 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                          onClick={() => {
                            setIsUpdateSignature(true);
                            setSelectedSignature(role);
                            setSignatureFile(null);
                            setSignatureName(role.name);
                          }}
                        >
                          edit
                        </button>
                        <button
                          className="px-3 mx-2 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                          onClick={() => {
                            setIdForDelete(role.public_id);
                            setDeleteConformation(true);
                          }}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#B56365] text-white hover:bg-[#b56364f8]"
                }`}
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#B56365] text-white hover:bg-[#b56364f8]"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for add signature form */}
      <Modal
        isOpen={isAddSignatureModal}
        onClose={() => setIsAddSignatureModal(false)}
        title="Add Signature"
        size="small"
      >
        <form
          className=" space-y-4c border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]"
          onSubmit={(e) => handleSubmitSignature(e)}
        >
          {/* Name Input */}
          <div className="w-full p-4 rounded-md bg-transparent shadow-lg transition-all border-0 border-b-4 border-b-gray-300 focus:border-b-[#B56365] focus:ring-0 outline-none">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
            />
          </div>

          {/* File Input */}

          <div className="flex-1 space-y-4 mt-3">
            <h3 className="text-base font-bold text-gray-700">
              Upload Signature Image
            </h3>
            <div
              className="w-full border-4 border-[#B56365] max-w-[150px] h-[150px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => signatureInputRef.current?.click()}
            >
              <img
                src={
                  signatureFile
                    ? URL.createObjectURL(signatureFile)
                    : defaultSignatureImage
                }
                alt="Signature Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSignatureFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
              disabled={loading} // Disable button while loading
            >
              {loading ? " Creating Signature...." : "Create Signature"}
            </button>
          </div>
        </form>
      </Modal>

      {/* modal for update signature */}
      <Modal
        isOpen={isUpdateSignature}
        onClose={() => setIsUpdateSignature(false)}
        title="Update Signature"
        size="small"
      >
        <form
          className=" space-y-4c border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]"
          onSubmit={handleUpdateSignature}
        >
          {/* Name Input */}
          <div className="w-full p-4 rounded-md bg-transparent shadow-lg transition-all border-0 border-t-4 border-t-gray-300 focus:border-t-[#B56365] focus:ring-0 outline-none">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
            />
          </div>

          {/* File Input */}
          <div className="flex-1 space-y-4 mt-2">
            <h3 className="text-base font-bold text-gray-700">
              Upload Signature Image
            </h3>
            <div
              className="w-full border-4 border-[#B56365] max-w-[150px] h-[150px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => signatureInputRef.current?.click()}
            >
              <img
                src={
                  selectedSignature && selectedSignature.url
                    ? selectedSignature.url
                    : defaultSignatureImage
                }
                alt="Signature Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSignatureFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            >
              update Signature
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!idForDelete}
        onClose={() => setIdForDelete(null)}
        onConfirm={deleteSignature}
        title="Delete Job Role"
        message="Are you sure you want to delete this job role?"
        confirmButtonText={isDelete ? "Deleting..." : "Yes, Delete"}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default Signature;
