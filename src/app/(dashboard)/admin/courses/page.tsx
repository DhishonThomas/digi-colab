"use client";
import React, { useEffect, useState, useRef } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import SuccessModal from "@/components/ui/SuccessModal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";

interface Course {
  _id: string;
  title: string;
  description: string;
  image?: string;
  jobRole?: any;
}

interface JobRole {
  _id: string;
  name: string;
}

const defaultImage = "/images/default-course.png";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState<string | null>(null);
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
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const coursesPerPage = 5;

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data } = await adminApi.get("/courses");
      console.log("Courses data:", data);
      let k={
        "success": true,
        "courses": [
            {
                "_id": "6809da9fd011d673f49de174",
                "title": "Electronics",
                "description": "nfjshfkjsdcfl",
                "__v": 0,
                "jobRoles": [
                    {
                        "id": "6809dbdcd011d673f49de17f",
                        "name": "nfjhf",
                        "description": "husdhfjkds"
                    }
                ]
            },
            {
                "_id": "662a1234abcd5678ef901234",
                "title": "Organize work and resources (Service)",
                "description": "Focuses on workplace safety, hygiene, quality standards, and resource management. NOS Code: ASC/N9801",
                "jobRoles": [
                    {
                        "id": "662a9999abcd5678ef901999",
                        "name": "Four Wheeler Service Assistant",
                        "description": "Supports the technician in routine servicing, repair, and maintenance of four wheeler vehicles."
                    }
                ]
            }
        ],
        "jobRoles": [
            {
                "_id": "6809dbdcd011d673f49de17f",
                "name": "nfjhf",
                "description": "husdhfjkds",
                "courses": [
                    {
                        "_id": "6809da9fd011d673f49de174",
                        "title": "Electronics",
                        "description": "nfjshfkjsdcfl",
                        "__v": 0
                    }
                ],
                "__v": 0
            },
            {
                "_id": "662a9999abcd5678ef901999",
                "name": "Four Wheeler Service Assistant",
                "description": "Supports the technician in routine servicing, repair, and maintenance of four wheeler vehicles.",
                "courses": [
                    {
                        "_id": "662a1234abcd5678ef901234",
                        "title": "Organize work and resources (Service)",
                        "description": "Focuses on workplace safety, hygiene, quality standards, and resource management. NOS Code: ASC/N9801"
                    }
                ]
            }
        ]
    }
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

  const fetchJobRoles = async () => {
    try {
      const { data } = await adminApi.get("/jobroles");
      if (data.success) setJobRoles(data.roles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchJobRoles();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!isEditing && !selectedJobRoleId) {
        alert("Please select a job role.");
        return;
      }
    try {
        const payload = {
            ...formData,
            jobRoleId: selectedJobRoleId || (selectedCourse?.jobRole?.[0]?.id || null),
          };      if (isEditing && selectedCourse) {
        await adminApi.put(`/edit-courses/${selectedCourse._id}`, payload);
        setSuccessMessage("Course updated successfully!");
      } else {
        await adminApi.post("/courses", payload);
        setSuccessMessage("Course created successfully!");
      }
      setShowSuccessModal(true);
      setCreateModalOpen(false);
      setFormData({ title: "", description: "", image: "" });
      setSelectedJobRoleId(null);
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
    setSelectedJobRoleId(null);
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
    setSelectedJobRoleId(course.jobRole?._id || null);
    setCreateModalOpen(true);
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setViewModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 border border-gray-300 rounded-md"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginateData.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <img
                    src={course.image || defaultImage}
                    className="h-10 w-10 rounded-full object-cover mx-auto"
                    alt="course"
                  />
                </td>
                <td className="px-4 py-2 border-b">{course.title}</td>
                <td className="px-4 py-2 border-b">
                  {course.description.length > 60
                    ? course.description.slice(0, 60) + "..."
                    : course.description}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button onClick={() => openViewModal(course)} className="text-blue-600">View</button>
                  <button onClick={() => openEditModal(course)} className="text-green-600">Edit</button>
                  <button onClick={() => setDeleteTargetId(course._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      <Modal
  isOpen={createModalOpen}
  size="large"
  onClose={() => setCreateModalOpen(false)}
  title={isEditing ? "Edit Course" : "Add Course"}
>
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Title"
      className="w-full border p-2 rounded"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    />
    <textarea
      placeholder="Description"
      className="w-full border p-2 rounded"
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    />

    {/* Image Preview + Upload */}
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Course Image</h3>
      <div
        className="relative w-full max-w-[300px] h-[200px] rounded-lg overflow-hidden cursor-pointer border"
        onClick={() => imageInputRef.current?.click()}
      >
        <img
          src={formData.image || defaultImage}
          alt="Course Preview"
          className="w-full h-full object-contain"
        />
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>

    {/* Job Role Selection */}
    <div>
      <h3 className="text-sm font-semibold mb-2">Select Job Role</h3>
      <div className="rounded-xl bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 max-h-60 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {jobRoles.map((role) => (
          <button
            key={role._id}
            onClick={() => setSelectedJobRoleId(role._id)}
            className={`text-left px-4 py-2 rounded-lg transition-all text-sm ${
              selectedJobRoleId === role._id
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "hover:bg-blue-50 text-gray-800"
            }`}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={handleCreateOrUpdate}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      {isEditing ? "Update" : "Create"}
    </button>
  </div>
</Modal>

{selectedCourse && (
  <Modal
    isOpen={viewModalOpen}
    onClose={() => setViewModalOpen(false)}
    title="Course Details"
  >
    <div className="space-y-4">
      <div className="w-full max-w-[300px] h-[200px] mx-auto rounded-lg overflow-hidden border">
        <img
          src={selectedCourse.image || defaultImage}
          alt="Course"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
      <p className="text-gray-700">{selectedCourse.description}</p>
      {selectedCourse.jobRole && (
        <p className="text-sm text-gray-600">Job Role: {selectedCourse.jobRole.name}</p>
      )}
    </div>
  </Modal>
)}


      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        confirmButtonText="Yes, Delete"
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default CoursesPage;
