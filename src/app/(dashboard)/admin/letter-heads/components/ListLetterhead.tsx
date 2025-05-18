import {
  LetterHeadData,
  SentMessage,
  signature,
} from "@/app/(dashboard)/admin/letter-heads/page";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import React, { ChangeEvent, useEffect, useState } from "react";
import LetterheadPdf from "./LetterheadPdf";
import EditLetterHeadButton from "./EditLetterhead";
import Modal from "@/components/ui/Modal";
import SuccessModal from "@/components/ui/SuccessModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
interface PropsType {
  letterheadList: LetterHeadData[]; // ✅ renamed
  signatures: signature[];
  fetchLetterhead: () => void;
}

const ListLetterhead = ({
  letterheadList,
  signatures,
  fetchLetterhead,
}: PropsType) => {
  const [viewPdfModalOpen, setViewPdfModalOpen] = useState(false);
  const [letterheadTemplate, setLetterheadTemplate] = useState<any>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteConformation, setDeleteConformation] = useState(false);
  const [idForDelete, setIdForDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSignature, setSelectedSignature] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<LetterHeadData[]>([]); // `Message[]` contains email and sentAt

  // =========for delete letterhead template=========
  const deleteLetterhead = async () => {
    const id = idForDelete;
    try {
      const { data } = await adminApi.delete(`/uploads/delete-file/${id}`);

      if (data) {
        // console.log(data);
        setIdForDelete(null);
        setSuccessMessage(data.message);
        setShowSuccessModal(true);
        fetchLetterhead();
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };
  const viewLetterHead = (role: any) => {
    setLetterheadTemplate(role);
    setSelectedSignature(signatures.find((item) => item._id === role.image_id));
    setViewPdfModalOpen(true);
  };
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (term: string) => {
    const lowerTerm = term.toLowerCase();

    const result = letterheadList.filter((item) => {
      const subjectMatch = item.subject?.toLowerCase().includes(lowerTerm);

      // Optional: Add other fields if needed later
      return subjectMatch;
    });

    setFilteredData(result);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const rolesPerPage = 10;

  const paginateData = filteredData.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rolesPerPage);




  useEffect(() => {
    setFilteredData(letterheadList);
  }, [letterheadList]);

  return (
    <div>
      <button
        className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
        onClick={() => setIsModalOpen(true)}
      >
        Letter Head
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Letter Head"
        size="fullscreen" // or "small", "large", "fullscreen"
        fullscreen={true}
        overFlow={true}
      >
        <div className="overflow-x-auto">
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="search"
              className="p-3 my-3 rounded-full w-72 mx-36 border"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
            />
          </div>
          <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 ">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="px-4 py-2 border-b text-start">Subject</th>
                <th className="px-4 py-2 border-b text-start">Content</th>
                <th className="px-4 py-2 border-b w-72 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginateData &&
                paginateData.map((role: LetterHeadData, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{role.subject}</td>
                    <td className="px-4 py-2 border-b">
                      {role.body_text.length > 20
                        ? role.body_text.slice(0, 20) + "..."
                        : role.body_text}
                    </td>{" "}
                    {/* <td className="px-4 py-2 border-b">{truncateText(role.description)}</td> */}
                    <td className="px-4 py-2 border-b w-72 space-x-2 flex gap-3">
                      <button
                        onClick={() => viewLetterHead(role)}
                        className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                      >
                        View
                      </button>
                      <EditLetterHeadButton
                        signatures={signatures}
                        letterhead={role}
                      />
                      <button
                        onClick={() => {
                          setIdForDelete(role._id);
                          setDeleteConformation(true);
                        }}
                        className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

      </Modal>

      {/* Modal for signature list */}

      <Modal
        isOpen={viewPdfModalOpen}
        onClose={() => setViewPdfModalOpen(false)}
        title="Letter Head"
        size="large" // or "small", "large", "fullscreen"
        fullscreen={true}
        overFlow={true}
      >
        <LetterheadPdf
          data={letterheadTemplate}
          signature={selectedSignature}
        />
      </Modal>
      <ConfirmationModal
        isOpen={!!idForDelete}
        onClose={() => setIdForDelete(null)}
        onConfirm={deleteLetterhead}
        title="Delete Job Role"
        message="Are you sure you want to delete this job role?"
        confirmButtonText="Yes, Delete"
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default ListLetterhead;
