"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SuccessModal from "@/components/ui/SuccessModal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";

export interface JobRole {
  _id: string;
  name: string;
  description: string;
  courses: [];
}

const JobRolesPage = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<JobRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rolesPerPage = 5;

  const fetchJobRoles = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.get("/jobroles");
      if (data.success) {
        setJobRoles(data.roles);
        setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const handleCreateJobRole = async () => {
    try {
      await adminApi.post("/jobroles", formData);
      setSuccessMessage("Job role created successfully!");
      setShowSuccessModal(true);
      setCreateModalOpen(false);
      setFormData({ name: "", description: "" });
      fetchJobRoles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.delete(`/jobroles/${deleteTargetId}`);
      setSuccessMessage("Job role deleted successfully!");
      setShowSuccessModal(true);
      fetchJobRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = jobRoles.filter((role) =>
      role.name.toLowerCase().includes(query)
    );
    setFilteredRoles(filtered);
    setCurrentPage(1);
  };

  const paginateData = filteredRoles.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const truncateText = (text: string, limit = 50) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Job Roles</h1>
   {/* Title + Add Button */}
   <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Job Roles</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8]"
        >
          + Add Job Role
        </button>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData.map((role: JobRole, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{role.name}</td>
                <td className="px-4 py-2 border-b">{truncateText(role.description)}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRole(role);
                      setViewModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(role._id)}
                    className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
      {/* Create Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Job Role">
        <div className="space-y-8 rounded-xl bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 overflow-y-auto">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Job Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter role name"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter description"
            />
          </div>
          <button
            onClick={handleCreateJobRole}
            className="w-full bg-[#B56365] text-white hover:bg-[#b56364f8]"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* View Modal */}
      {selectedRole && (
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={selectedRole.name}>
          <div className="space-y-4">
            <p className="text-gray-700">{selectedRole.description}</p>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Courses:</h3>
              {selectedRole.courses.length ? (
                <ul className="list-disc ml-5 space-y-1">
                  {selectedRole.courses.map((course: any) => (
                    <li key={course._id} className="text-gray-600">
                      {course.title} - {course.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No courses attached</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Job Role"
        message="Are you sure you want to delete this job role?"
        confirmButtonText="Yes, Delete"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default JobRolesPage;
