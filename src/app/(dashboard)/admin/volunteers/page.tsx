"use client";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import VolunteerDetailsContent from "./components/VolunteerDetailsContent";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function Page() {
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

 async function fetchData(){

  const volunteer=await adminApi.get('/volunteers')
  setData(volunteer.data.data)
}

  useEffect(() => {
fetchData()
    
  }, []);
  const filteredData = data.filter(
    (elem: any) =>
      elem.volunteerDetails.name.toLowerCase().includes(search.toLowerCase()) ||
      elem.volunteerDetails.tempRegNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
console.log(data)

async function handleView(regNumber: string) {
  const encodedRegNumber = encodeURIComponent(regNumber);
  const response = await adminApi.get(`/volunteer/${encodedRegNumber}`);
  if (response.data.success) {
    setSelectedVolunteer(response.data);
    setModalOpen(true);
  } else {
    alert("Failed to fetch details.");
  }
}
const [selectedVolunteer, setSelectedVolunteer] = useState(null);
const [modalOpen, setModalOpen] = useState(false);

const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
const [blockTarget, setBlockTarget] = useState<{ regNumber: string; isBlocked: boolean } | null>(null);

  async function handleBlockToggle() {
    if (!blockTarget) return;
  
    const encodedReg = encodeURIComponent(blockTarget.regNumber);
    console.log("blockTarget", blockTarget)
    console.log("encodedReg", encodedReg);
    
    try {
      const response = await adminApi.put(`/volunteer/block/${encodedReg}`,{block:blockTarget.isBlocked?"false":"true"});
     console.log(response.data)
      if (response.data.success) {
        // Update the state directly
        setData((prevData: any[]) =>
          prevData.map((item) =>
            item.volunteerDetails.tempRegNumber === blockTarget.regNumber
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
      <h1 className="text-2xl font-bold mb-4 text-center">Volunteers</h1>
      <input
        type="text"
        placeholder="Search by name or reg number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Reg Number</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Candidate Count</th>
              <th className="px-4 py-2 border-b">Paid</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((elem: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{elem?.volunteerDetails?.name}</td>
                <td className="px-4 py-2 border-b">{elem?.volunteerDetails?.tempRegNumber}</td>
                <td className="px-4 py-2 border-b">{elem?.volunteerDetails?.email}</td>
                <td className="px-4 py-2 border-b">{elem?.userCount}</td>
                <td className="px-4 py-2 border-b">
                  {elem?.volunteerDetails?.isPaid ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
  <button
    disabled={elem?.volunteerDetails?.isPaid}
    className={`px-3 py-1 rounded-md text-sm ${
      elem?.volunteerDetails?.isPaid
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    {elem?.volunteerDetails?.isPaid ? "Paid" : "Pay"}
  </button>

  <button className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
  onClick={()=>{handleView(elem?.volunteerDetails?.tempRegNumber)}}
  >
    View
  </button>

  <button
  onClick={() => {
    // Set the block target first
    setBlockTarget({
      regNumber: elem?.volunteerDetails?.tempRegNumber,
      isBlocked: elem?.volunteerDetails?.isBlocked,
    });
    
    // Then open the confirmation modal
    setIsConfirmModalOpen(true);
  }}
  className={`px-3 py-1 rounded-md text-sm ${
    elem?.volunteerDetails?.isBlocked
      ? "bg-yellow-500 text-white hover:bg-yellow-600"
      : "bg-red-500 text-white hover:bg-red-600"
  }`}
>
  {elem?.volunteerDetails?.isBlocked ? "Unblock" : "Block"}
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
      <Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Volunteer Details"
  fullscreen
>
  {selectedVolunteer && <VolunteerDetailsContent data={selectedVolunteer} />}
</Modal>
<ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setBlockTarget(null);
        }}
        onConfirm={handleBlockToggle}
        actionType={blockTarget?.isBlocked ? 'unblock' : 'block'} // Dynamically pass action type
        regNumber={blockTarget?.regNumber || ''}
      />
    </div>
    
  );
}
