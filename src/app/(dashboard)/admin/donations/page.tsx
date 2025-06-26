"use client";

import { useState, useEffect } from "react";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Modal from "@/components/ui/Modal";
import DonationDetailsView from "./components/DonationDetailsView";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("Pending");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await adminApi.get("/donations");
        setData(response.data.donations);
      } catch (error) {
        console.error("Error fetching donations", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleParentChange = (updatedDetails: {
    status: string;
    statusUpdatedBy?: {
      name: string;
      email: string;
    };
    statusUpdatedAt?: Date;
  }) => {
    setData((prevData) =>
      prevData.map((donation) => {
        if (selectedDonation._id === donation._id) {
          const updated = {
            ...donation,
            status: updatedDetails.status,
            statusUpdatedBy: updatedDetails.statusUpdatedBy,
            statusUpdatedAt: updatedDetails.statusUpdatedAt,
          };
          setSelectedDonation(updated);
          return updated;
        }
        return donation;
      })
    );
  };

  const filteredData = data.filter(
    (donation) => donation.status === status
  );

  const itemsPerPage = 5;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Donations</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500">No donations found.</div>
      ) : (
        <div className="flex flex-col">
          {/* Status Filter Buttons */}
          <div className="flex gap-8 items-center mb-4">
            {["Pending", "Verified", "Rejected"].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setStatus(statusOption)}
                className={`px-4 py-2 rounded-lg ${
                  status === statusOption
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-300"
                } transition-colors duration-300`}
              >
                {statusOption}
              </button>
            ))}
          </div>

          {/* Donation Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Sl.No:</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Donor Name</th>
                  <th className="px-4 py-2 border-b">Amount</th>
                  <th className="px-4 py-2 border-b">Verification</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((donation, index) => (
                  <tr key={donation._id} className="text-center">
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">{donation.donorName}</td>
                    <td className="px-4 py-2 border-b">
                      ₹ {donation.donationAmount}
                    </td>
                    <td className="px-4 py-2 border-b">{donation.status}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => {
                          setSelectedDonation(donation);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {filteredData.length > 0 ? (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
            ) : (
              <div className="text-center font-semibold text-gray-500 mt-4">
                {status === "Pending"
                  ? "You have no donations awaiting verification"
                  : status === "Verified"
                  ? "No verified donations found."
                  : "No rejected donation requests found."}
              </div>
            )}
          </div>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Donation Details"
            overFlow={true}
            fullscreen
          >
            {selectedDonation && (
              <DonationDetailsView
                donation={selectedDonation}
                handleParentChange={handleParentChange}
              />
            )}
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Page;
