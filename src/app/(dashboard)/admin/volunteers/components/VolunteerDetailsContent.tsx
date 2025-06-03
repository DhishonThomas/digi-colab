import React, { useMemo, useState } from "react";
import Image from "next/image";
import InputText from "@/components/ui/inputText";
import Link from "next/link";
import CandidateDetailsContent from "../../candidates/components/CandidateDetailsContent";
import Modal from "@/components/ui/Modal";
import { set } from "lodash";

interface Props {
  data: any;
}

const VolunteerDetailsContent: React.FC<Props> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gender, setGender] = useState("");
  const itemsPerPage = 3;
  const [modalCandidate, setModalCandidate] = useState<boolean>(false);

  const filteredCandidates = useMemo(() => {
    setCurrentPage(1);
    return (
      data?.registeredUsers?.filter(
        (user: any) =>
          (user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.regNumber?.toLowerCase().includes(search.toLowerCase())) &&
          (gender === "" || user.gender === gender)
      ) || []
    );
  }, [search, data, gender]);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const volunteer = data?.volunteerDetails;

  const renderDoc = (label: string, url?: string) => {
    if (!url) {
      return <p className="text-red-500 text-sm">Not uploaded</p>;
    }

    const isPdf = url.toLowerCase().endsWith(".pdf");

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-blue-600 hover:underline"
      >
        {isPdf ? (
          <div className="flex items-center gap-2">
            <span className="underline">{label} (PDF)</span>
          </div>
        ) : (
          <Image
            src={url}
            alt={label}
            width={100}
            height={100}
            className="rounded-md object-cover border hover:brightness-110 transition"
          />
        )}
      </a>
    );
  };

  const renderField = (label: string, value?: string | number) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="text"
        disabled
        value={value || "—"}
        className="w-full bg-gray-100 border rounded px-3 py-2 text-sm text-gray-700"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Volunteer Info */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href={volunteer?.image}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={volunteer?.image}
                alt="Volunteer"
                width={100}
                height={100}
                className="rounded-full object-cover border"
              />
            </Link>

            <h2 className="text-xl font-semibold">{volunteer?.name}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderField("Guardian", volunteer?.guardian)}
            {renderField("Age", volunteer?.age)}
            {renderField("Gender", volunteer?.gender)}
            {renderField("DOB", new Date(volunteer?.dob).toLocaleDateString())}
            {renderField("Email", volunteer?.email)}
            {renderField("Phone", volunteer?.phone)}
            {renderField("Address", volunteer?.address)}
            {renderField("Current Address", volunteer?.currentAddress)}
            {renderField("Reg Number", volunteer?.tempRegNumber)}
            {renderField("Employment", volunteer?.employmentStatus)}
            {renderField("Monthly Income", volunteer?.monthlyIncomeRange)}
            {renderField("Bank Name", volunteer?.bankName)}
            {renderField("IFSC", volunteer?.ifsc)}
            {renderField("Account No.", volunteer?.bankAccNumber)}
            {renderField("Degree", volunteer?.educationQualification?.degree)}
            {renderField(
              "Completion Year",
              volunteer?.educationQualification?.yearOfCompletion
            )}
          </div>

          {/* Documents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">Bank Document</p>
              {renderDoc("Bank Document", volunteer?.bankDocument)}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Education Certificate</p>
              {renderDoc(
                "Education Certificate",
                volunteer?.educationQualification?.certificate
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Police Verification</p>
              {renderDoc(
                "Education Certificate",
                volunteer?.policeVerification
              )}
            </div>
            {/* Add more docs if needed */}
          </div>
        </div>

        {/* Registered Candidates */}
        <div className="w-full lg:w-1/3 bg-gray-50 border rounded-xl p-4 h-full">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">
              Registered Candidates ({data?.userCount})
            </h3>

            <select
              className="w-30 p-2 border rounded-md self-end bg-white text-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <InputText
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="mt-4 max-h-[500px] overflow-y-auto pr-2 space-y-3">
            {paginatedCandidates.length === 0 && (
              <p className="text-gray-500 font-semibold text-sm">
                {data?.registeredUsers?.length === 0
                  ? "No registered candidates under the volunteer."
                  : "No candidates matching your search/gender criteria"}
              </p>
            )}
            {paginatedCandidates.map((user: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white border rounded-md flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm">
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p className="text-sm">
                      <strong>Reg No.:</strong> {user.regNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      Job Role: N/A | Course: N/A
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      setModalCandidate(true);
                    }}
                  >
                    View
                  </button>
                  {modalCandidate && (
                    <Modal
                      isOpen={modalCandidate}
                      onClose={() => setModalCandidate(false)}
                      title="Candidate Details"
                      fullscreen
                    >
                      <CandidateDetailsContent user={user} />
                    </Modal>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetailsContent;
