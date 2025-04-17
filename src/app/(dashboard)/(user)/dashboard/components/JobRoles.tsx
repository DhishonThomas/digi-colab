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
  {
    id: "it",
    name: "Information Technology",
    courses: [
      {
        id: "it1",
        title: "Web Developer",
        description: "Build and maintain websites.",
      },
      {
        id: "it2",
        title: "Network Administrator",
        description: "Manage and configure computer networks.",
      },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    courses: [
      {
        id: "const1",
        title: "Construction Worker",
        description: "Basic skills in construction site operations.",
      },
      {
        id: "const2",
        title: "Masonry Technician",
        description: "Learn bricklaying and concrete work.",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    courses: [
      {
        id: "health1",
        title: "Nursing Assistant",
        description: "Assist in patient care and hygiene.",
      },
      {
        id: "health2",
        title: "Medical Billing Specialist",
        description: "Handle patient billing and insurance claims.",
      },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    courses: [
      {
        id: "hosp1",
        title: "Hotel Front Desk Agent",
        description: "Manage guest check-in and inquiries.",
      },
      {
        id: "hosp2",
        title: "Housekeeping Specialist",
        description: "Clean and maintain guest rooms.",
      },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    courses: [
      {
        id: "retail1",
        title: "Retail Sales Associate",
        description: "Sell products and assist customers.",
      },
      {
        id: "retail2",
        title: "Inventory Clerk",
        description: "Manage stock and inventory records.",
      },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    courses: [
      {
        id: "agri1",
        title: "Farm Technician",
        description: "Operate machinery and manage crops.",
      },
      {
        id: "agri2",
        title: "Dairy Farm Assistant",
        description: "Assist in dairy production and milking.",
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    courses: [
      {
        id: "beauty1",
        title: "Beautician",
        description: "Basic grooming and beauty services.",
      },
      {
        id: "beauty2",
        title: "Spa Therapist",
        description: "Perform massages and spa treatments.",
      },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    courses: [
      {
        id: "plumb1",
        title: "Plumber Assistant",
        description: "Support pipe installations and repairs.",
      },
      {
        id: "plumb2",
        title: "Drainage Technician",
        description: "Handle drainage systems and maintenance.",
      },
    ],
  },
  {
    id: "welding",
    name: "Welding",
    courses: [
      {
        id: "weld1",
        title: "Welding Technician",
        description: "Learn MIG and TIG welding techniques.",
      },
      {
        id: "weld2",
        title: "Metal Fabricator",
        description: "Fabricate metal parts and structures.",
      },
    ],
  },
  {
    id: "hvac",
    name: "HVAC",
    courses: [
      {
        id: "hvac1",
        title: "HVAC Installer",
        description: "Install heating and cooling systems.",
      },
      {
        id: "hvac2",
        title: "Refrigeration Mechanic",
        description: "Maintain refrigeration systems.",
      },
    ],
  },
  {
    id: "logistics",
    name: "Logistics",
    courses: [
      {
        id: "log1",
        title: "Warehouse Operator",
        description: "Handle goods in a warehouse environment.",
      },
      {
        id: "log2",
        title: "Forklift Operator",
        description: "Operate forklifts safely.",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    courses: [
      {
        id: "fin1",
        title: "Bookkeeper",
        description: "Maintain financial records and transactions.",
      },
      {
        id: "fin2",
        title: "Payroll Assistant",
        description: "Assist with employee payroll processing.",
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    courses: [
      {
        id: "edu1",
        title: "Teacher Assistant",
        description: "Support classroom instruction.",
      },
      {
        id: "edu2",
        title: "Early Childhood Educator",
        description: "Teach and care for young children.",
      },
    ],
  },

  {
    id: "media",
    name: "Media",
    courses: [
      {
        id: "media1",
        title: "Video Editor",
        description: "Edit and produce digital videos.",
      },
      {
        id: "media2",
        title: "Photographer",
        description: "Capture professional photos.",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    courses: [
      {
        id: "fashion1",
        title: "Fashion Designer",
        description: "Create clothing and fashion accessories.",
      },
      {
        id: "fashion2",
        title: "Tailor",
        description: "Alter and repair clothing.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    courses: [
      {
        id: "mkt1",
        title: "Digital Marketer",
        description: "Promote brands online.",
      },
      {
        id: "mkt2",
        title: "Social Media Executive",
        description: "Manage social media channels.",
      },
    ],
  },
  {
    id: "security",
    name: "Security",
    courses: [
      {
        id: "sec1",
        title: "Security Guard",
        description: "Ensure safety of premises and people.",
      },
      {
        id: "sec2",
        title: "CCTV Operator",
        description: "Monitor security cameras.",
      },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    courses: [
      {
        id: "trans1",
        title: "Driver",
        description: "Drive safely and maintain vehicle records.",
      },
      {
        id: "trans2",
        title: "Fleet Coordinator",
        description: "Manage transportation schedules.",
      },
    ],
  },
  {
    id: "food",
    name: "Food & Beverage",
    courses: [
      {
        id: "food1",
        title: "Chef Assistant",
        description: "Support food preparation in kitchens.",
      },
      {
        id: "food2",
        title: "Bartender",
        description: "Serve beverages in restaurants and bars.",
      },
    ],
  },
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
  {
    id: "it",
    name: "Information Technology",
    courses: [
      {
        id: "it1",
        title: "Web Developer",
        description: "Build and maintain websites.",
      },
      {
        id: "it2",
        title: "Network Administrator",
        description: "Manage and configure computer networks.",
      },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    courses: [
      {
        id: "const1",
        title: "Construction Worker",
        description: "Basic skills in construction site operations.",
      },
      {
        id: "const2",
        title: "Masonry Technician",
        description: "Learn bricklaying and concrete work.",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    courses: [
      {
        id: "health1",
        title: "Nursing Assistant",
        description: "Assist in patient care and hygiene.",
      },
      {
        id: "health2",
        title: "Medical Billing Specialist",
        description: "Handle patient billing and insurance claims.",
      },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    courses: [
      {
        id: "hosp1",
        title: "Hotel Front Desk Agent",
        description: "Manage guest check-in and inquiries.",
      },
      {
        id: "hosp2",
        title: "Housekeeping Specialist",
        description: "Clean and maintain guest rooms.",
      },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    courses: [
      {
        id: "retail1",
        title: "Retail Sales Associate",
        description: "Sell products and assist customers.",
      },
      {
        id: "retail2",
        title: "Inventory Clerk",
        description: "Manage stock and inventory records.",
      },
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    courses: [
      {
        id: "agri1",
        title: "Farm Technician",
        description: "Operate machinery and manage crops.",
      },
      {
        id: "agri2",
        title: "Dairy Farm Assistant",
        description: "Assist in dairy production and milking.",
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    courses: [
      {
        id: "beauty1",
        title: "Beautician",
        description: "Basic grooming and beauty services.",
      },
      {
        id: "beauty2",
        title: "Spa Therapist",
        description: "Perform massages and spa treatments.",
      },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    courses: [
      {
        id: "plumb1",
        title: "Plumber Assistant",
        description: "Support pipe installations and repairs.",
      },
      {
        id: "plumb2",
        title: "Drainage Technician",
        description: "Handle drainage systems and maintenance.",
      },
    ],
  },
  {
    id: "welding",
    name: "Welding",
    courses: [
      {
        id: "weld1",
        title: "Welding Technician",
        description: "Learn MIG and TIG welding techniques.",
      },
      {
        id: "weld2",
        title: "Metal Fabricator",
        description: "Fabricate metal parts and structures.",
      },
    ],
  },
  {
    id: "hvac",
    name: "HVAC",
    courses: [
      {
        id: "hvac1",
        title: "HVAC Installer",
        description: "Install heating and cooling systems.",
      },
      {
        id: "hvac2",
        title: "Refrigeration Mechanic",
        description: "Maintain refrigeration systems.",
      },
    ],
  },
  {
    id: "logistics",
    name: "Logistics",
    courses: [
      {
        id: "log1",
        title: "Warehouse Operator",
        description: "Handle goods in a warehouse environment.",
      },
      {
        id: "log2",
        title: "Forklift Operator",
        description: "Operate forklifts safely.",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    courses: [
      {
        id: "fin1",
        title: "Bookkeeper",
        description: "Maintain financial records and transactions.",
      },
      {
        id: "fin2",
        title: "Payroll Assistant",
        description: "Assist with employee payroll processing.",
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    courses: [
      {
        id: "edu1",
        title: "Teacher Assistant",
        description: "Support classroom instruction.",
      },
      {
        id: "edu2",
        title: "Early Childhood Educator",
        description: "Teach and care for young children.",
      },
    ],
  },

  {
    id: "media",
    name: "Media",
    courses: [
      {
        id: "media1",
        title: "Video Editor",
        description: "Edit and produce digital videos.",
      },
      {
        id: "media2",
        title: "Photographer",
        description: "Capture professional photos.",
      },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    courses: [
      {
        id: "fashion1",
        title: "Fashion Designer",
        description: "Create clothing and fashion accessories.",
      },
      {
        id: "fashion2",
        title: "Tailor",
        description: "Alter and repair clothing.",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    courses: [
      {
        id: "mkt1",
        title: "Digital Marketer",
        description: "Promote brands online.",
      },
      {
        id: "mkt2",
        title: "Social Media Executive",
        description: "Manage social media channels.",
      },
    ],
  },
  {
    id: "security",
    name: "Security",
    courses: [
      {
        id: "sec1",
        title: "Security Guard",
        description: "Ensure safety of premises and people.",
      },
      {
        id: "sec2",
        title: "CCTV Operator",
        description: "Monitor security cameras.",
      },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    courses: [
      {
        id: "trans1",
        title: "Driver",
        description: "Drive safely and maintain vehicle records.",
      },
      {
        id: "trans2",
        title: "Fleet Coordinator",
        description: "Manage transportation schedules.",
      },
    ],
  },
  {
    id: "food",
    name: "Food & Beverage",
    courses: [
      {
        id: "food1",
        title: "Chef Assistant",
        description: "Support food preparation in kitchens.",
      },
      {
        id: "food2",
        title: "Bartender",
        description: "Serve beverages in restaurants and bars.",
      },
    ],
  },
  {
    id: "textile",
    name: "Textile",
    courses: [
      {
        id: "textile1",
        title: "Textile Operator",
        description: "Operate textile machinery.",
      },
      {
        id: "textile2",
        title: "Garment Checker",
        description: "Inspect finished garments for quality.",
      },
    ],
  },
  {
    id: "mining",
    name: "Mining",
    courses: [
      {
        id: "mining1",
        title: "Mining Technician",
        description: "Support mineral extraction processes.",
      },
      {
        id: "mining2",
        title: "Blasting Assistant",
        description: "Assist in controlled blasting operations.",
      },
    ],
  },
  {
    id: "marine",
    name: "Marine",
    courses: [
      {
        id: "marine1",
        title: "Marine Mechanic",
        description: "Repair boat engines and systems.",
      },
      {
        id: "marine2",
        title: "Deckhand",
        description: "Assist in marine vessel operations.",
      },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    courses: [
      {
        id: "legal1",
        title: "Paralegal Assistant",
        description: "Support legal documentation and research.",
      },
      {
        id: "legal2",
        title: "Court Clerk",
        description: "Assist in court procedures and records.",
      },
    ],
  },
];

const JobRolesList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const displayedCourses = selectedCategory
    ? jobRoles.find((role) => role.id === selectedCategory)?.courses || []
    : jobRoles.flatMap((role) => role.courses);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = displayedCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(displayedCourses.length / itemsPerPage);

  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id === selectedCourseId ? null : id); // toggle select
  };

  const handleSubmit = () => {
    if (selectedCourseId) {
      alert(`Selected Course: ${selectedCourseId}`);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-10">
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

      {/* Category List */}
      {showCategories && (
        <div className="border rounded-xl bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 max-h-72 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {jobRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedCategory(role.id)}
              className={`text-left px-4 py-2 rounded-lg transition-all duration-150 whitespace-normal text-sm ${
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

      {/* Course Cards */}
      <div className="p-6 rounded-xl shadow-lg bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200">
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
              <p className="text-gray-600 text-sm mt-2">{course.description}</p>
            </div>
          ))}

          {paginatedCourses.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No courses available.
            </p>
          )}
        </div>

        {/* Pagination */}
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

        {/* Submit Button */}
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
    </div>
  );
};

export default JobRolesList;
