"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SuccessModal from "@/components/ui/SuccessModal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";

export interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
}

const defaultImage = "/images/courses-dummy.png"; // Your default image path

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image: "" });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 5;

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.get("/courses");
      if (data.success) {
        setCourses(data.courses);
        setFilteredCourses(data.courses);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditing && selectedCourse) {
        await adminApi.put(`/courses/${selectedCourse._id}`, formData);
        setSuccessMessage("Course updated successfully!");
      } else {
        await adminApi.post("/courses", formData);
        setSuccessMessage("Course created successfully!");
      }
      setShowSuccessModal(true);
      setCreateModalOpen(false);
      setFormData({ title: "", description: "", image: "" });
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await adminApi.delete(`/courses/${deleteTargetId}`);
      setSuccessMessage("Course deleted successfully!");
      setShowSuccessModal(true);
      fetchCourses();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const paginateData = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ title: "", description: "", image: "" });
    setCreateModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({ 
      title: course.title, 
      description: course.description, 
      image: course.image || "" 
    });
    setCreateModalOpen(true);
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setViewModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Top Title + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginateData.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <img
                    src={course.image || defaultImage}
                    alt="Course"
                    className="h-10 w-10 rounded-full object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border-b">{course.title}</td>
                <td className="px-4 py-2 border-b">
                  {course.description.length > 50
                    ? course.description.slice(0, 50) + "..."
                    : course.description}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => openViewModal(course)}
                    className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="px-3 py-1 rounded-md text-sm bg-green-500 text-white hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(course._id)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={isEditing ? "Edit Course" : "Add Course"}
      >
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Enter course description"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button
            onClick={handleCreateOrUpdate}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      {/* View Modal */}
      {selectedCourse && (
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Course Details">
          <div className="space-y-4">
            <img
              src={selectedCourse.image || defaultImage}
              alt="Course"
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
            <p className="text-gray-700">{selectedCourse.description}</p>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
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

export default CoursesPage;
