"use client";
import { useState, useEffect } from "react";
import { STATE_OPTIONS, DISTRICT_OPTIONS } from "@/utils/constants";
import adminApi from "@/utils/axios_Interceptors/adminApiService";

export default function Page() {
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  async function fetchData() {
    try {
      setLoading(true);
      const consolidated = await adminApi.get("/consolidated");
      const pincodeMapping: any = {};

      // Scan all users and update pincodeMapping with necessary fields
      const dataPerPincode = {
        registeredCandidates: 0,
        pwdCandidates: 0,
        entrepreneurshipInterested: 0,
        cccTrainingRequired: 0,
        additionalTrainingRequired: 0,
        registeredVolunteers: 0,
        totalRemunerationToBePaid: 0,
        totalPaidRemuneration: 0,
      };

      consolidated.data.data.users.forEach((user: any) => {
        if (!(user.pincode in pincodeMapping)) {
          pincodeMapping[user.pincode] = {
            ...dataPerPincode,
            state: user.state,
            district: user.district,
            pincode: user.pincode,
          };
        }
        pincodeMapping[user.pincode].registeredCandidates += 1;
        pincodeMapping[user.pincode];
        if (user.pwdCategory === "Yes") {
          pincodeMapping[user.pincode].pwdCandidates += 1;
        }
        if (user.entrepreneurshipInterest === "Yes") {
          pincodeMapping[user.pincode].entrepreneurshipInterested += 1;
        }
        if (!user.cccCertificate) {
          pincodeMapping[user.pincode].cccTrainingRequired += 1;
        }
        if (user.selectedCourse) {
          pincodeMapping[user.pincode].additionalTrainingRequired += 1;
        }
      });

      // Scan all volunteers and update pincodeMapping with necessary fields
      consolidated.data.data.volunteers.forEach((volunteer: any) => {
        const userCount = volunteer.usersUnderVolunteer?.length || 0;
        if (!(volunteer.pincode in pincodeMapping)) {
          pincodeMapping[volunteer.pincode] = {
            ...dataPerPincode,
            state: volunteer.state,
            district: volunteer.district,
            pincode: volunteer.pincode,
          };
        }
        pincodeMapping[volunteer.pincode].registeredVolunteers += 1;
        pincodeMapping[volunteer.pincode].totalRemunerationToBePaid +=
          Math.min(userCount, 50) * 50 +
          Math.min(Math.max(userCount - 50, 0), 150) * 75 +
          Math.max(userCount - 200, 0) * 100;
      });

      setData(pincodeMapping);
    } catch (error) {
      console.error("Error fetching consolidated data:", error);
      setData({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [state, district, pincode]);

  const filteredData = Object.values(data).filter((obj: any) => {
    return (
      (state === "" || obj.state === state) &&
      (district === "" || obj.district === district) &&
      (pincode === "" || obj.pincode.startsWith(pincode))
    );
  });

  filteredData.sort((a: any, b: any) => {
    if (a.state !== b.state) {
      return a.state.localeCompare(b.state);
    }
    if (a.district !== b.district) {
      return a.district.localeCompare(b.district);
    }
    return a.pincode.localeCompare(b.pincode);
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilter = () => {
    setState("");
    setDistrict("");
    setPincode("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Consolidated Data</h1>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      )}
      {!loading && (
        <div>
          {/* Filters for Consolidated Report */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text font-medium">State:</label>
                <select
                  className="border border-gray-300 rounded-md w-40"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict("");
                  }}
                >
                  <option value="">Select State</option>
                  {STATE_OPTIONS.map((state: string) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text font-medium">District:</label>
                <select
                  className="border border-gray-300 rounded-md w-44"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={state === ""}
                >
                  <option value="">
                    {state !== "" ? "Select District" : "Choose State First"}
                  </option>
                  {(DISTRICT_OPTIONS[state] || []).map((state: string) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text font-medium">Pincode:</label>
              <input
                type="text"
                placeholder="Filter by Pincode"
                maxLength={6}
                className="border border-gray-300 rounded-md px-3 py-1 w-64"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                className="px-3 py-1 rounded-md bg-teal-600 text-white"
                onClick={() => {}}
              >
                &rarr;
              </button>
            </div>
            <button
              className="px-3 py-1 rounded-md bg-[#B56365] text-white hover:bg-[#b56364f8]"
              onClick={resetFilter}
            >
              Reset Filter
            </button>
          </div>

          {/* Consolidated Report Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-black border">State</th>
                  <th className="px-4 py-2 border-black border">District</th>
                  <th className="px-4 py-2 border-black border">Pincode</th>
                  <th className="px-4 py-2 border-black border">
                    Registered FEs
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Registered Candidates
                  </th>
                  <th className="px-4 py-2 border-black border">
                    PWD Candidates
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Entrepreneuship Interested Candidates
                  </th>
                  <th className="px-4 py-2 border-black border">
                    CCC Training Required Candidates
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Additional Job Role/Course Training Required Candidates
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Total Remuneration To Be Paid
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Total Paid Remuneration
                  </th>
                  <th className="px-4 py-2 border-black border">
                    Balance Remuneration To Be Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={15}
                      className="px-4 py-4 border font-semibold border-black text-start"
                    >
                      No matching records found
                    </td>
                  </tr>
                )}
                {paginatedData.map((elem: any) => (
                  <tr key={elem?.pincode} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-black border">
                      {elem?.state}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.district}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.pincode}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.registeredVolunteers}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.registeredCandidates}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.pwdCandidates}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.entrepreneurshipInterested}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.cccTrainingRequired}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      {elem?.additionalTrainingRequired}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      ₹ {elem?.totalRemunerationToBePaid}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      ₹ {elem?.totalPaidRemuneration}
                    </td>
                    <td className="px-4 py-2 border-black border">
                      ₹{" "}
                      {elem?.totalRemunerationToBePaid -
                        elem?.totalPaidRemuneration}
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
    </div>
  );
}
