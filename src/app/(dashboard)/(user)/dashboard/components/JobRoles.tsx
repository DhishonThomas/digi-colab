import userApi from "@/utils/axios_Interceptors/userApiService";
import React, { useEffect, useState } from "react";

const jobRoles = [
  {
    id: "automotive",
    name: "Automotive",
    courses: [
      {
        id: "auto1",
        title: "Automotive Service Technician",
        description: "Learn to service and maintain vehicles.",
      },
      {
        id: "auto2",
        title: "Automotive Painter",
        description: "Master the art of automotive painting.",
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    courses: [
      {
        id: "elec1",
        title: "Electronics Repair Technician",
        description: "Repair and maintain electronic devices.",
      },
      {
        id: "elec2",
        title: "Circuit Design Engineer",
        description: "Design and test electronic circuits.",
      },
    ],
  },
];

const JobRolesList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const itemsPerPage = 20;

  
  const displayedCourses = selectedCategory
    ? jobRoles.find((role) => role.id === selectedCategory)?.courses || []
    : jobRoles.flatMap((role) => role.courses);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = displayedCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(displayedCourses.length / itemsPerPage);
const checkIsSubmitted=async()=>{
  const response=await userApi.get("/dashboard/course-selection");

  console.log("this is course selection data",response.data);
  if(response.data.success){
    setIsSubmitted(true)
  }else{
    setIsSubmitted(false)
  }
}
  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id === selectedCourseId ? null : id);
  };

  const handleSubmit = () => {
    if (selectedCourseId) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-10">
      {!isSubmitted ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Explore Job Roles & Courses
            </h2>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
            >
              {showCategories ? "Hide Categories" : "Show Categories"}
            </button>
          </div>

          {showCategories && (
            <div className="border rounded-xl bg-white border-gray-200 max-h-72 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {jobRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedCategory(role.id)}
                  className={`text-left px-4 py-2 rounded-lg transition-all duration-150 text-sm ${
                    selectedCategory === role.id
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-blue-50 text-gray-800"
                  }`}
                >
                  {role.name}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold text-sm"
              >
                View All
              </button>
            </div>
          )}

          <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              {selectedCategory
                ? jobRoles.find((role) => role.id === selectedCategory)?.name +
                  " Courses"
                : "All Courses"}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className={`border rounded-lg p-5 cursor-pointer transition shadow-sm hover:shadow-md bg-gray-50 ${
                    selectedCourseId === course.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <h4 className="text-lg font-bold text-gray-800">
                    {course.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">
                    {course.description}
                  </p>
                </div>
              ))}

              {paginatedCourses.length === 0 && (
                <p className="text-gray-500 text-center col-span-full">
                  No courses available.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {selectedCourseId && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                >
                  Submit Selected Course
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-3xl font-bold text-green-600">
            Course Submitted Successfully!
          </h3>
          <p className="text-gray-600 mt-4">
            Thank you for submitting your course.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobRolesList;
