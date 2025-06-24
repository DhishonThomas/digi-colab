import React, { useState } from "react";
import Modal from "@/components/ui/Modal"; // Import your reusable Modal component
import NoData from "@/components/ui/NoData"; // Import your reusable NoData component

interface Candidate {
  _id: string;
  name: string;
  regNumber: string;
  email: string;
  phone: string;
  address: string;
  currentAddress: string;
  city: string;
  district: string;
  pincode: string;
  gender: string;
  dob: string; // Assuming date as string (ISO format)
  state: string;
  image: string;
  volunteerRegNum: string;
  accountVerified: boolean;
  educationQualification: string;
  educationYearOfCompletion: number;
  cccCertified: string; // Options: "Yes", "No", "Pending"
  bankName: string;
  bankAccNumber: string;
  ifsc: string;
}

interface CandidatesTableProps {
  candidates: Candidate[];
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ candidates }) => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);

  const itemsPerPage = 10;

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.regNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const paginatedData = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (candidate: Candidate) => {
    setSelectedUser(candidate);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Candidates</h1>
      <input
        type="text"
        placeholder="Search by name or reg number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
      />
      {paginatedData.length === 0 ? (
        <NoData
          message="No Candidates Found"
          description="It looks like there are no candidates to display at the moment."
          actionText="Add Your First Candidate"
        />
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Reg Number</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{candidate.name}</td>
                    <td className="px-4 py-2 border-b">{candidate.regNumber}</td>
                    <td className="px-4 py-2 border-b">{candidate.email}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="px-3 py-1 rounded-md text-sm bg-teal-500 text-white hover:bg-teal-600"
                        onClick={() => handleView(candidate)}
                      >
                        View
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
                  : "bg-teal-500 text-white hover:bg-teal-600"
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
                  : "bg-teal-500 text-white hover:bg-teal-600"
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
  overFlow={true}
>
  {selectedUser && (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Candidate Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Candidate Basic Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedUser.phone}
          </p>
          <p>
            <strong>Gender:</strong> {selectedUser.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(selectedUser.dob).toLocaleDateString()}
          </p>
        </div>

        {/* Address Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Address Details</h3>
          <p>
            <strong>Permanent Address:</strong> {selectedUser.address}
          </p>
          <p>
            <strong>Current Address:</strong> {selectedUser.currentAddress}
          </p>
          <p>
            <strong>City:</strong> {selectedUser.city}
          </p>
          <p>
            <strong>District:</strong> {selectedUser.district}
          </p>
          <p>
            <strong>State:</strong> {selectedUser.state}
          </p>
          <p>
            <strong>Pin Code:</strong> {selectedUser.pincode}
          </p>
        </div>

        {/* Bank Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
          <p>
            <strong>Bank Name:</strong> {selectedUser.bankName}
          </p>
          <p>
            <strong>Account Number:</strong> {selectedUser.bankAccNumber}
          </p>
          <p>
            <strong>IFSC Code:</strong> {selectedUser.ifsc}
          </p>
        </div>

        {/* Volunteer and Registration Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Registration Details</h3>
          <p>
            <strong>Registration Number:</strong> {selectedUser.regNumber}
          </p>
          <p>
            <strong>Volunteer Registration Number:</strong>{" "}
            {selectedUser.volunteerRegNum}
          </p>
          <p>
            <strong>Account Verified:</strong>{" "}
            {selectedUser.accountVerified ? "Yes" : "No"}
          </p>
        </div>

        {/* Qualification Details */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Qualification Details</h3>
          <p>
            <strong>Qualification:</strong>{" "}
            {selectedUser.educationQualification}
          </p>
          <p>
            <strong>Year of Completion:</strong>{" "}
            {selectedUser.educationYearOfCompletion}
          </p>
          <p>
            <strong>CCC Certification:</strong> {selectedUser.cccCertified}
          </p>
        </div>

        {/* Candidate Image */}
        <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg shadow-md">
          <img
            src={selectedUser.image}
            alt="Candidate"
            className="w-32 h-32 rounded-full"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  )}
</Modal>

    </div>
  );
};

export default CandidatesTable;
