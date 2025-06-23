"use client";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

type DonationDetailsViewProps = {
  donation: {
    _id: string;
    date: string;
    donationAmount: number;
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    donorAddress: string;
    paymentImageURL: string;
    transactionId: string;
    status:any
  };
  handleParentChange: (newStatus: string) => void;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getFullYear()}`;
};

const DonationDetailsView: React.FC<DonationDetailsViewProps> = ({
  donation,
  handleParentChange,
}) => {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await adminApi.post(
        `/donations/status/${donation._id}`,
        {
          newStatus,
        }
      );
      console.log("Status updated successfully:", response.data);
      handleParentChange(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        "There was an error updating the donation status. Please try again."
      );
    } finally {
      setConfirmationStatus("");
    }
  };

  const [confirmationStatus, setConfirmationStatus] = useState<string>("");
  return (
    <div className="p-6">
      <ConfirmationModal
        isOpen={confirmationStatus !== ""}
        onClose={() => {
          setConfirmationStatus("");
        }}
        onConfirm={() => handleStatusChange(confirmationStatus)}
        title={"Change Donation Status"}
        message={`Are you sure you want to ${
          confirmationStatus === "Verified" ? "verify" : "reject"
        } the payment?`}
        confirmButtonText={
          confirmationStatus === "Verified" ? "Yes, Verify" : "Yes, Reject"
        }
        confirmButtonClass={
          confirmationStatus === "Verified"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col gap-4 border-4 border-gray-600 rounded-lg p-4 h-96 overflow-auto">
          <h1 className="text-xl text-blue-600 font-bold mb-4">
            PAYMENT PROOF
          </h1>
          <Link
            href={donation.paymentImageURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={donation.paymentImageURL}
              alt="Payment Proof"
              width={400}
              height={300}
              className="object-cover border-2 border-black rounded-md"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-4 border-4 border-gray-600 h-96 overflow-auto rounded-lg p-4">
          <h2 className="text-xl text-blue-600 font-bold mb-4">
            SUBMITTED DETAILS
          </h2>
          <p className="text-xl font-bold">
            Amount: ₹ {donation.donationAmount}
          </p>
          <p className="text-lg font-medium">
            Date: {formatDate(donation.date)}
          </p>
          <p className="text-lg font-medium">Name: {donation.donorName}</p>
          <p className="text-lg font-medium">Email: {donation.donorEmail}</p>
          <p className="text-lg font-medium">
            Phone: +91 {donation.donorPhone}
          </p>
          <p className="text-lg font-medium">
            Address: {donation.donorAddress}
          </p>
          <p className="text-lg font-medium">
            ASF Transaction ID: {donation.transactionId}{" "}
          </p>
          <p className="text-lg font-medium">PAN: XXXXXXXXXX</p>
        </div>
        {donation.status !== "Pending" && (
          <p className="text-lg col-span-2 font-semibold">
            PAYMENT STATUS:{" "}
            {donation.status === "Verified" ? "VERIFIED ✅" : "REJECTED ❌"}
          </p>
        )}
        {donation.status !== "Verified" && (
          <>
            <button
              onClick={() => setConfirmationStatus("Verified")}
              disabled={donation.status === "Verified"}
              className={`${
                donation.status === "Verified"
                  ? "bg-gray-300"
                  : "bg-teal-600 hover:bg-teal-700"
              } text-white px-4 py-4 font-semibold rounded transition`}
            >
              VERIFY PAYMENT
            </button>
            <button
              onClick={() => setConfirmationStatus("Rejected")}
              disabled={donation.status === "Rejected"}
              className={`${
                donation.status === "Rejected"
                  ? "bg-gray-300"
                  : "bg-red-600 hover:bg-red-700"
              } text-white px-4 py-4 font-semibold rounded transition`}
            >
              REJECT PAYMENT
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationDetailsView;
