"use client";

import { useEffect, useState } from "react";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

interface Approval {
  _id: string;
  admin: Admin;
  approvedAt: string;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
}

interface PaymentRequest {
  _id: string;
  volunteer: Volunteer;
  volunteerRegNumber: string;
  userCount: number;
  amount: number;
  status: string;
  approvals: Approval[];
  requestDate: string;
  paymentDate?: string;
}

const AdminPaymentRequests = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: "approve" | "mark-paid" | "reject";
  } | null>(null);

  const itemsPerPage = 10;

  const fetchPaymentRequests = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/payment-requests/all");
      if (response.data.success) {
        setPaymentRequests(response.data.paymentRequests);
      }
    } catch (error) {
      console.error("Failed to fetch payment requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "mark-paid" | "reject") => {
    try {
      await adminApi.patch(`/payment-requests/${action}/${id}`);
      fetchPaymentRequests();
    } catch (error) {
      console.error(`Failed to ${action} payment request`, error);
    }
  };

  const totalPages = Math.ceil(paymentRequests.length / itemsPerPage);
  const paginateData = paymentRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading Payment Requests...
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Payment Requests</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Volunteer Name</th>
              <th className="px-4 py-2 border-b">Reg. Number</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">User Count</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginateData.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{request.volunteer.name}</td>
                <td className="px-4 py-2 border-b">{request.volunteerRegNumber}</td>
                <td className="px-4 py-2 border-b">{request.volunteer.email}</td>
                <td className="px-4 py-2 border-b">{request.userCount}</td>
                <td className="px-4 py-2 border-b">₹{request.amount}</td>
                <td className="px-4 py-2 border-b capitalize">{request.status}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => setConfirmAction({ id: request._id, action: "approve" })}
                    className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: request._id, action: "mark-paid" })}
                    className="px-3 py-1 rounded-md text-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: request._id, action: "reject" })}
                    className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={async () => {
          if (confirmAction) {
            await handleAction(confirmAction.id, confirmAction.action);
            setConfirmAction(null);
          }
        }}
        title={`Confirm ${confirmAction?.action.replace("-", " ")}`}
        message={`Are you sure you want to ${confirmAction?.action.replace("-", " ")} this payment request?`}
        confirmButtonText={`Yes, ${confirmAction?.action.replace("-", " ")}`}
      />
    </div>
  );
};

export default AdminPaymentRequests;
