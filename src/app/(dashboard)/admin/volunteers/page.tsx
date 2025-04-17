"use client";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import VolunteerDetailsContent from "./components/VolunteerDetailsContent";
const dummy = {
  success: true,
  data: [
    {
      candidateCount: 3,
      volunteerRegNumber: "ASF/FE/00001",
      volunteerName: "Megha Saju",
      volunteerEmail: "meghasajup05@gmail.com",
      isPaid: true,
    },
    {
      candidateCount: 5,
      volunteerRegNumber: "ASF/FE/00002",
      volunteerName: "Rahul Menon",
      volunteerEmail: "rahul.menon92@example.com",
      isPaid: false,
    },
    {
      candidateCount: 2,
      volunteerRegNumber: "ASF/FE/00003",
      volunteerName: "Anjali Raj",
      volunteerEmail: "anjali.raj@example.com",
      isPaid: true,
    },
    {
      candidateCount: 4,
      volunteerRegNumber: "ASF/FE/00004",
      volunteerName: "Deepak Nair",
      volunteerEmail: "deepak.nair@example.com",
      isPaid: false,
    },
    {
      candidateCount: 1,
      volunteerRegNumber: "ASF/FE/00005",
      volunteerName: "Sneha Varma",
      volunteerEmail: "sneha.varma@example.com",
      isPaid: true,
    },
    {
      candidateCount: 6,
      volunteerRegNumber: "ASF/FE/00006",
      volunteerName: "Arjun Das",
      volunteerEmail: "arjun.das@example.com",
      isPaid: true,
    },
    {
      candidateCount: 3,
      volunteerRegNumber: "ASF/FE/00007",
      volunteerName: "Divya Joseph",
      volunteerEmail: "divya.joseph@example.com",
      isPaid: false,
    },
    {
      candidateCount: 7,
      volunteerRegNumber: "ASF/FE/00008",
      volunteerName: "Kiran Thomas",
      volunteerEmail: "kiran.thomas@example.com",
      isPaid: true,
    },
    {
      candidateCount: 2,
      volunteerRegNumber: "ASF/FE/00009",
      volunteerName: "Lakshmi Babu",
      volunteerEmail: "lakshmi.babu@example.com",
      isPaid: false,
    },
    {
      candidateCount: 4,
      volunteerRegNumber: "ASF/FE/00010",
      volunteerName: "Vivek Krishnan",
      volunteerEmail: "vivek.krishnan@example.com",
      isPaid: true,
    },
  ],
};

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

  /*
  {
    "success": true,
    "totalVolunteers": 1,
    "data": [
        {
            "volunteerDetails": {
                "_id": "6800c4f1830a270887757baf",
                "name": "Megha Saju",
                "tempRegNumber": "ASF/FE/00001",
                "isBlocked": false
            },
            "userCount": 4
        }
    ]
}
  */
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
    onClick={() => {}}
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

    </div>
    
  );
}
