"use client";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import React, { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import CandidateDetailsContent from "./components/CandidateDetailsContent";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import NoData from "@/components/ui/NoData";

export default function Page() {
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerPage = 10;

  async function fetchData() {
    try {
      setLoading(true);
      const candidates = await adminApi.get("/users");
      setData(candidates.data.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(
    (elem: any) =>
      elem?.userDetails?.name.toLowerCase().includes(search.toLowerCase()) ||
      elem?.userDetails?.regNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  async function handleView(regNumber: string) {
    try {
      const encodedRegisterNumber = encodeURIComponent(regNumber);
      const response = await adminApi.get(`/user/${encodedRegisterNumber}`);
      if (response.data.success) {
        setSelectedUser(response.data.user); // updated for `user` key
        setIsModalOpen(true);
      } else {
        console.error("Error fetching user details:", response.data.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<{
    regNumber: string;
    isBlocked: boolean;
  } | null>(null);

  async function handleBlockToggle() {
    if (!blockTarget) return;

    const encodedReg = encodeURIComponent(blockTarget.regNumber);

    try {
      const response = await adminApi.put(`/user/block/${encodedReg}`, {
        block: blockTarget.isBlocked ? "false" : "true",
      });


      if (response.data.success) {
        // Update the state directly
        setData((prevData: any[]) =>
          prevData.map((item) =>
            item.userDetails.regNumber === blockTarget.regNumber
              ? {
                  ...item,
                  userDetails: {
                    ...item.userDetails,
                    isBlocked: !blockTarget.isBlocked,
                  },
                }
              : item
          )
        );
      } else {
        console.error("Failed to block/unblock:", response.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsConfirmModalOpen(false);
      setBlockTarget(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Candidates</h1>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      )}
      {!loading && (
        <div>
          <input
            type="text"
            placeholder="Search by name or reg number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-6 border border-gray-300 rounded-md"
          />
          {paginatedData.length === 0 ?(
             <NoData
          message="No Candidates Found"
          description="It looks like there are no candidates to display at the moment. You can add new candidates or refresh the page to see updates."
          actionText="Add Your First Candidate"
        />
          ):(
            <div>
               <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Reg Number</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((elem: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      {elem?.userDetails?.name}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {elem?.userDetails?.regNumber}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {elem?.userDetails?.email}
                    </td>

                    <td className="px-4 py-2 border-b space-x-2">
                      <button
                        className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                        onClick={() => {
                          handleView(elem?.userDetails?.regNumber);
                        }}
                      >
                        View
                      </button>
                      {}
                      <button
                        onClick={() => {
                          // Set the block target first
                          setBlockTarget({
                            regNumber: elem?.userDetails?.regNumber,
                            isBlocked: elem?.userDetails?.isBlocked,
                          });

                          // Then open the confirmation modal
                          setIsConfirmModalOpen(true);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          elem?.userDetails?.isBlocked
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {elem?.userDetails?.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
              {totalPages > 0
                ? `Page ${currentPage} of ${totalPages}`
                : "Page 0 of 0"}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#B56365] text-white hover:bg-[#b56364f8]"
              }`}
            >
              Next
            </button>
          </div>

            </div>
          )}
         
          <Modal
            fullscreen
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            {selectedUser && <CandidateDetailsContent user={selectedUser} />}
          </Modal>
          <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => {
              setIsConfirmModalOpen(false);
              setBlockTarget(null);
            }}
            onConfirm={handleBlockToggle}
            title={blockTarget?.isBlocked ? "Unblock User" : "Block User"}
            message={`Are you sure you want to ${
              blockTarget?.isBlocked ? "unblock" : "block"
            } the user with Registration Number: ${
              blockTarget?.regNumber || ""
            }?`}
            confirmButtonText={
              blockTarget?.isBlocked ? "Yes, Unblock" : "Yes, Block"
            }
            confirmButtonClass={
              blockTarget?.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          />
        </div>
      )}
    </div>
  );
}
