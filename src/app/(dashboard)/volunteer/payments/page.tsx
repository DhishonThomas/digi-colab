"use client";

import React, { useEffect, useState } from "react";
import SuccessModal from "@/components/ui/SuccessModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Modal from "@/components/ui/Modal";
import volunteerApi from "@/utils/axios_Interceptors/volunteerApiService";

const PaymentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userCount, setUserCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [confirmRequest, setConfirmRequest] = useState(false);
  const requestsPerPage = 5;

  const fetchPaymentRequests = async () => {
    setIsLoading(true);
    try {
      const { data } = await volunteerApi.get("/payment-requests/my-requests");
      if (data.success) setRequests(data.paymentRequests);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const handlePaymentRequest = async () => {
    try {
      await volunteerApi.post("/payment-requests/request", { userCount });
      setSuccessMessage("Payment request submitted successfully!");
      setShowSuccessModal(true);
      fetchPaymentRequests();
    } catch (err:any) {
      setSuccessMessage(err?.response?.data?.message || "Failed to submit payment request.");
      setShowSuccessModal(true);
    }
  };

  const paginatedData = requests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Request History</h1>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Request Payment
        </button>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Reg Number</th>
                <th className="px-4 py-2 border-b">User Count</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Requested On</th>
                <th className="px-4 py-2 border-b">Paid On</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((req: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{req.volunteerRegNumber}</td>
                  <td className="px-4 py-2 border-b">{req.userCount}</td>
                  <td className="px-4 py-2 border-b">{req.amount}</td>
                  <td className="px-4 py-2 border-b capitalize">{req.status}</td>
                  <td className="px-4 py-2 border-b">{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">
                    {req.paymentDate ? new Date(req.paymentDate).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {requests.length > 0 && (
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
      )}

      {/* Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Payment"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">User Count</label>
          <input
            type="number"
            min={1}
            value={userCount}
            onChange={(e) => setUserCount(Number(e.target.value))}
            className="w-full border p-2 rounded"
            placeholder="Enter number of users"
          />
          <button
            onClick={() => {
              setShowRequestModal(false);
              setConfirmRequest(true);
            }}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </Modal>

      {/* Confirm Request Modal */}
      <ConfirmationModal
        isOpen={confirmRequest}
        onClose={() => setConfirmRequest(false)}
        onConfirm={async () => {
          setConfirmRequest(false);
          await handlePaymentRequest();
        }}
        title={`Confirm Payment Request`}
        message={`Are you sure you want to request payment for ${userCount} users?`}
        confirmButtonText={`Yes, Request`}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default PaymentRequestsPage;
