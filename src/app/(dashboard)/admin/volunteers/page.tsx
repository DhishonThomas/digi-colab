"use client";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import VolunteerDetailsContent from "./components/VolunteerDetailsContent";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { STATE_OPTIONS, DISTRICT_OPTIONS } from "@/utils/constants";

export default function Page() {
  const [data, setData] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const itemsPerPage = 5;

  async function fetchData() {
    try {
      setLoading(true);
      const response = await adminApi.get("/volunteers");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [state, district, pincode, search]);

  const filteredData = data
    .filter(
      (elem: any) =>
        (elem.volunteerDetails.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
          elem.volunteerDetails.tempRegNumber
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        elem.volunteerDetails.state
          .toLowerCase()
          .includes(state.toLowerCase()) &&
        elem.volunteerDetails.district
          .toLowerCase()
          .includes(district.toLowerCase()) &&
        elem.volunteerDetails.pincode.startsWith(pincode)
    )
    .map((elem: any) => {
      const userCount = elem.users?.length || 0;
      const displayParameters = {
        cccTrainingRequiredMale: 0,
        cccTrainingRequiredFemale: 0,
        cccTrainingRequiredOthers: 0,
        entrepreneurshipInterest: 0,
        additionalJobRoleTrainingRequired: 0,
        remunerationToBePaid:
          Math.min(userCount, 50) * 50 +
          Math.min(Math.max(userCount - 50, 0), 150) * 75 +
          Math.max(userCount - 200, 0) * 100,
        paidRemuneration: 0,
      };
      for (const user of elem.users || []) {
        if (!user.cccCertificate) {
          if (user.gender === "Male") {
            displayParameters.cccTrainingRequiredMale += 1;
          } else if (user.gender === "Female") {
            displayParameters.cccTrainingRequiredFemale += 1;
          } else {
            displayParameters.cccTrainingRequiredOthers += 1;
          }
        }
        if (user.entrepreneurshipInterest === "Yes") {
          displayParameters.entrepreneurshipInterest += 1;
        }
        if (user.selectedCourse) {
          displayParameters.additionalJobRoleTrainingRequired += 1;
        }
      }
      return {
        ...elem,
        displayParameters,
      };
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilter = () => {
    setState("");
    setDistrict("");
    setPincode("");
    setSearch("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
  const [blockTarget, setBlockTarget] = useState<{
    regNumber: string;
    isBlocked: boolean;
  } | null>(null);

  async function handleBlockToggle() {
    if (!blockTarget) return;

    const encodedReg = encodeURIComponent(blockTarget.regNumber);

    try {
      const response = await adminApi.put(`/volunteer/block/${encodedReg}`, {
        block: blockTarget.isBlocked ? "false" : "true",
      });
      if (response.data.success) {
        // Update the state directly
        setData((prevData: any[]) =>
          prevData.map((item) =>
            item.volunteerDetails.tempRegNumber === blockTarget.regNumber
              ? {
                  ...item,
                  volunteerDetails: {
                    ...item.volunteerDetails,
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
      <h1 className="text-2xl font-bold text-center">Volunteers</h1>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
        </div>
      )}
      {!loading && (
        <div className="mt-4">
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
                  <th className="px-4 py-2 border border-black">Sl. No:</th>
                  <th className="px-4 py-2 border border-black">Name</th>
                  <th className="px-4 py-2 border border-black">
                    Registration No:
                  </th>
                  <th className="px-4 py-2 border border-black">State</th>
                  <th className="px-4 py-2 border border-black">District</th>
                  <th className="px-4 py-2 border border-black">Pincode</th>
                  <th className="px-4 py-2 border border-black">
                    CCC Training Required Candidates (Male)
                  </th>
                  <th className="px-4 py-2 border border-black">
                    CCC Training Required Candidates (Female)
                  </th>
                  <th className="px-4 py-2 border border-black">
                    CCC Training Required Candidates (Others)
                  </th>
                  <th className="px-4 py-2 border border-black">
                    Entrepreneuship Interested Candidates
                  </th>
                  <th className="px-4 py-2 border border-black">
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
                  <th className="px-4 py-2 border-black border">
                    Perform Actions
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
                {paginatedData.map((elem: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-black">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.volunteerDetails?.name}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.volunteerDetails?.tempRegNumber}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.volunteerDetails?.state}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.volunteerDetails?.district}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.volunteerDetails?.pincode}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.displayParameters?.cccTrainingRequiredMale}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.displayParameters?.cccTrainingRequiredFemale}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.displayParameters?.cccTrainingRequiredOthers}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {elem?.displayParameters?.entrepreneurshipInterest}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      {
                        elem?.displayParameters
                          ?.additionalJobRoleTrainingRequired
                      }
                    </td>
                    <td className="px-4 py-2 border border-black">
                      ₹ {elem?.displayParameters?.remunerationToBePaid}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      ₹ {elem?.displayParameters?.paidRemuneration}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      ₹ {""}
                      {elem?.displayParameters?.remunerationToBePaid -
                        elem?.displayParameters?.paidRemuneration}
                    </td>
                    <td className="px-4 py-2 border border-black">
                      <div className="flex justify-center gap-2">
                        {/*<button
                          disabled={elem?.volunteerDetails?.isPaid}
                          className={`px-3 py-1 rounded-md text-sm ${
                            elem?.volunteerDetails?.isPaid
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {elem?.volunteerDetails?.isPaid ? "Paid" : "Pay"}
                        </button>*/}

                        <button
                          className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                          onClick={() => {
                            handleView(elem?.volunteerDetails?.tempRegNumber);
                          }}
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
                          {elem?.volunteerDetails?.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                      </div>
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

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Volunteer Details"
            fullscreen
          >
            {selectedVolunteer && (
              <VolunteerDetailsContent data={selectedVolunteer} />
            )}
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
