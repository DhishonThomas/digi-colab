import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  user: any;
}

const CandidateDetailsContent: React.FC<Props> = ({ user }) => {
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

  const renderDoc = (label: string, url?: string | null) => {
    if (!url) {
      return <p className="text-red-500 text-sm">Not uploaded</p>;
    }

    // Use a base URL (adjust as needed for your environment)
    let isPdf = false;
    try {
      const fullUrl = new URL(url, window.location.origin); // works with relative and absolute URLs
      isPdf = fullUrl.pathname.toLowerCase().endsWith(".pdf");
    } catch (error) {
      console.error("Invalid URL passed to renderDoc:", url);
      return <p className="text-red-500 text-sm">Invalid file URL</p>;
    }

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

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-10">
      {/* Candidate Info */}
      <div className="flex items-center gap-4">
        <Link href={user?.image} target="_blank" rel="noopener noreferrer">
          <Image
            src={user?.image}
            alt="Candidate"
            width={100}
            height={100}
            className="rounded-full object-cover border"
          />
        </Link>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-600">{user?.regNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {renderField("Guardian", user?.guardian)}
        {renderField("Age", user?.age)}
        {renderField("Gender", user?.gender)}
        {renderField("DOB", new Date(user?.dob).toLocaleDateString())}
        {renderField("Email", user?.email)}
        {renderField("Phone", user?.phone)}
        {renderField("Education Qualification", user?.educationQualification)}
        {renderField("Completion Year", user?.educationYearOfCompletion)}
        {renderField("Address", user?.address)}
        {renderField("Current Address", user?.currentAddress)}
        {renderField("State", user?.state)}
        {renderField("District", user?.district)}
        {renderField("City", user?.city)}
        {renderField("Pin Code", user?.pincode)}
        {renderField("Volunteer Reg No", user?.volunteerRegNum)}
        {renderField("CCC Certified", user?.cccCertified)}
        {renderField("PWD Category", user?.pwdCategory)}
        {renderField(
          "Entrepreneurship Interest",
          user?.entrepreneurshipInterest
        )}
        {renderField("Bank Name", user?.bankName)}
        {renderField("IFSC", user?.ifsc)}
        {renderField("Bank Account No.", user?.bankAccNumber)}
        {renderField("Account Verified", user?.accountVerified ? "Yes" : "No")}
      </div>

      {/* Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-medium mb-1">Bank Passbook</p>
          {renderDoc("Bank Passbook", user?.bankPassbook)}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Education Certificate</p>
          {renderDoc("Education Certificate", user?.educationDocument)}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Police Verification</p>
          {renderDoc("Police Verification", user?.policeVerification)}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">PWD Certificate</p>
          {renderDoc("PWD Certificate", user?.pwdCertificate)}
        </div>
        <div>
          <p className="text-sm font-medium mb-1">BPL Certificate</p>
          {renderDoc("BPL Certificate", user?.bplCertificate)}
        </div>
        {user?.cccCertificate && (
          <div>
            <p className="text-sm font-medium mb-1">CCC Certificate</p>
            {renderDoc("CCC Certificate", user?.cccCertificate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailsContent;
