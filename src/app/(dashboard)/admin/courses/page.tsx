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
  jobRoles?: any;
  qualifications?: string;
}

interface JobRole {
  _id: string;
  name: string;
}

const defaultImage = "/images/courses-dummy.png";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState<string | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", image: "",qualifications:"" });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
const [imageFile,setImageFile]=useState<File | null>(null);
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
      // Create a FormData object
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("jobRoles", selectedJobRoleId || (selectedCourse?.jobRoles?.[0]?.id || courses[0]?.jobRoles?.[0]?.id));
      form.append("qualifications", formData.qualifications);
      if (imageFile) {
        form.append("image", imageFile); // Key "image" should match what the server expects
      }
  
      if (isEditing && selectedCourse) {
        // Update the course
        await adminApi.put(`/edit-courses/${selectedCourse._id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Course updated successfully!");
      } else {
        // Create a new course
        await adminApi.post("/courses", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Course created successfully!");
      }
  
      setShowSuccessModal(true);
      setCreateModalOpen(false);
      setFormData({ title: "", description: "", image: "",qualifications:"" });
      setSelectedJobRoleId(null);
      setImageFile(null); // Clear the image file
      fetchCourses();
    } catch (error) {
      console.error("Error creating or updating course:", error);
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
    setImageFile(file);
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };


  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ title: "", description: "", image: "",qualifications:"" });
    setSelectedJobRoleId(null);
    setImageFile(null);

    setCreateModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setIsEditing(true);
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      image: course.image || "",
      qualifications: course.qualifications || "",
    });
    setSelectedJobRoleId(course.jobRoles?._id || null);
    setImageFile(null);

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
          className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8]"
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
  <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain  border border-gray-200 text-center">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 border-b">Image</th>
        <th className="px-4 py-2 border-b">Title</th>
        <th className="px-4 py-2 border-b">Description</th>
        <th className="px-4 py-2 border-b">Job Roles</th>
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
          <td className="px-4 py-2 border-b">
            {course.jobRoles.length > 0 ? (
              <ul className="list-disc list-inside text-left">
                {course.jobRoles.map((role:any) => (
                  <li key={role.roleId} className="text-sm text-gray-600">
                    {role.roleName}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-gray-500">No roles assigned</span>
            )}
          </td>
          <td className="px-4 py-2 border-b space-x-2">
            <button
              onClick={() => openViewModal(course)}
              className="text-blue-600"
            >
              View
            </button>
            <button
              onClick={() => openEditModal(course)}
              className="text-green-600"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteTargetId(course._id)}
              className="text-red-600"
            >
              Delete
            </button>
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
fullscreen 

onClose={() => setCreateModalOpen(false)}
  title={isEditing ? "Edit Course" : "Add Course"}
>
  <div className="border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]">
    
    {/* Container with increased width */}
    <div className="w-full max-w-5xl mx-auto space-y-6">

      {/* Top Section: Image & Job Roles */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left: Image Upload */}
        <div className="flex-1 space-y-4 ">
          <h3 className="text-base font-bold text-gray-700">Course Image</h3>
          <div
            className="w-full border-4 border-[#B56365] max-w-[300px] h-[250px]  rounded-lg overflow-hidden cursor-pointer"
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

        {/* Right: Job Role Selection */}
        <div className="flex-1 space-y-2">
          <h3 className="text-base mt-1 font-bold text-gray-700">Select Job Role</h3>
          <div className="rounded-xl bg-transparent bg-opacity-90 border-4 border-[#B56365]  max-h-60 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
      </div>

      {/* Bottom Section: Title + Description */}
      <div className="space-y-6 px-2">
  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">Title</h3>
    <input
      type="text"
      placeholder="Enter course title"
      className="w-full p-4 rounded-md bg-transparent shadow-lg transition-all border-0 border-t-4 border-t-gray-300 focus:border-t-[#B56365] focus:ring-0 outline-none"
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    />
  </div>

  <div>
    <h3 className="text-base font-semibold text-gray-800 mb-1">Description</h3>
    <textarea
      placeholder="Enter course description"
      className="w-full p-4 rounded-md bg-transparent shadow-lg transition-all border-0 border-t-4 border-t-gray-300 focus:border-t-[#B56365] focus:ring-0 outline-none resize-none"
      rows={4}
      value={formData.description}
      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    />
  </div>

  <div>
  <h3 className="text-base font-semibold text-gray-800 mb-1">Education Qualification</h3>
  <select
    className="w-full p-4 rounded-md bg-transparent shadow-lg transition-all border-0 border-t-4 border-t-gray-300 focus:border-t-[#B56365] focus:ring-0 outline-none"
    value={formData.qualifications}
    onChange={(e) =>
      setFormData({ ...formData, qualifications: e.target.value })
    }
  >
    <option value="" disabled>Select qualification</option>
    <option value="5th">5th</option>
    <option value="6th">6th</option>
    <option value="7th">7th</option>
    <option value="8th">8th</option>
    <option value="9th">9th</option>
    <option value="10th">10th</option>
    <option value="ITI">ITI</option>
  </select>
</div>


  <div className="flex justify-center">
    <div className="w-1/2">
      <button
        onClick={handleCreateOrUpdate}
        className="w-full py-3 rounded-md bg-[#B56365] text-white text-base font-semibold hover:bg-[#a65052] transition-all duration-300 shadow-md"
      >
        {isEditing ? "Update" : "Create"}
      </button>
    </div>
  </div>
</div>


    </div>
  </div>
</Modal>


{selectedCourse && (
  <Modal
    isOpen={viewModalOpen}
    onClose={() => setViewModalOpen(false)}
    title="Course Details"
  >
    <div className="space-y-8 rounded-xl bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 ">
      <div className="w-full max-w-[300px] h-[200px] mx-auto rounded-lg overflow-hidden border">
        <img
          src={selectedCourse.image || defaultImage}
          alt="Course"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
      <p className="text-gray-700">{selectedCourse.description}</p>
      {selectedCourse.jobRoles && (
        <p className="text-xl font-bold text-gray-600">Job Role: {selectedCourse?.jobRoles[0]?.roleName}</p>
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
