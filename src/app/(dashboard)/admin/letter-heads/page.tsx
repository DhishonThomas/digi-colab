"use client";
import SuccessModal from "@/components/ui/SuccessModal";

import { ChangeEvent, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import ListLetterhead from "./components/ListLetterhead";
import Signature from "./components/Signature";
import NoData from "@/components/ui/NoData";
import SpinLoading from "@/components/loading/spinLoading";

export interface signature {
  _id: string;
  userId: string;
  public_id: string;
  name: string;
  url: string;
}
export type FileItem = {
  _id: string;
  subject: string;
  body_text: string;
  image_id: string;
  public_id: string[]; // assuming it's an array of strings
};

export interface FileLinkItem {
  public_id: string;
  url: string;
  file_name: string;
}

export interface LetterHeadData {
  _id: string;
  subject: string;
  body_text: string;
  file_link: FileLinkItem[];
  public_id: string[]; // array of public_id strings
  image_id: string;
  createdAt: string; // ISO string
  __v: number;
}

export interface SendMessage {
  _id: string;
  email: string;
  subject: string;
  message: string;
  cloudinaryUrl: string;
  sendAt: string; // if you have this
  updatedAt?: string; // optional fields
}

type Letterhead = {
  _id: string;
  subject: string;
  cloudinary_url: string;
  public_id: string;
  createdAt: string; // or `Date` if you plan to parse it into a Date object
  __v: number;
  letter_head_id: string;
};

const LetterHeads = () => {
  const [message, setMessage] = useState<SendMessage[]>([]);
  const [filteredData, setFilteredData] = useState<SendMessage[]>([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isMessageViewModalOpen, setIsMessageViewModalOpen] = useState(false);
  const [isMessageView, setIsMessageView] = useState({
    email: "",
    subject: "",
    message: "",
    cloudinaryUrl: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const [selectedLetterhead, setSelectedLetterhead] =
    useState<Letterhead | null>(null);
  const [letterheadPdf, setLetterheadPdf] = useState<Letterhead[]>([]);
  const [filteredPdf, setFilteredPdf] = useState<Letterhead[]>([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // =========== For get all letterhead pdf ===============
  const fetchPdf = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.post("/pdf/list-letterheads", {
        id: "",
      });
      if (data) {
        setLetterheadPdf(
          [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // ========= For get all send mails ============
  const fetchMessages = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.post("/pdf/list-sent-messages", {
        email: "",
      });

      if (data) {
        setMessage(
          [...data].sort(
            (a, b) =>
              new Date(b.sendAt).getTime() - new Date(a.sendAt).getTime()
          )
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // ========= For send email ============
  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    // setIsLoading(true);

    try {
      const mailData = {
        ...formData,
        cloudinaryUrl: selectedLetterhead?.cloudinary_url,
        letterHeadId: selectedLetterhead?.letter_head_id,
      };

      const { data } = await adminApi.post("/pdf/send-mail", mailData);
      if (data) {
        setSuccessMessage(data.message);
        setShowSuccessModal(true);
        fetchMessages();
        setIsSendModalOpen(false);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  const handlePdfSearch = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();

    const result = letterheadPdf.filter((item) => {
      // Match email (partial match)
      const subMatch = item.subject.toLowerCase().includes(term);

      return subMatch;
    });

    setFilteredPdf(result);
  };

  useEffect(() => {
    setFilteredPdf(letterheadPdf);
  }, [letterheadPdf]);
  useEffect(() => {
    setFilteredData(message);
  }, [message]);
  useEffect(() => {
    fetchMessages();
    fetchPdf();
  }, [isSendModalOpen]);
  const [currentPage, setCurrentPage] = useState(1);
  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();

    const result = message.filter((item) => {
      // Match email (partial match)
      const emailMatch = item.email.toLowerCase().includes(term);

      // Format date as DD-MM-YYYY
      const dateObj = new Date(item.sendAt);
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        "0"
      )}-${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}-${dateObj.getFullYear()}`;

      // Match date (exact or partial match)
      const dateMatch = formattedDate.includes(term);

      return emailMatch || dateMatch;
    });

    setFilteredData(result);
    setCurrentPage(1);
  };
  const rolesPerPage = 10;

  const paginateData = filteredData.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rolesPerPage);

  const handleMessageView = (id: any) => {
    const result = paginateData.filter((item: SendMessage) => item._id === id);
    setIsMessageViewModalOpen(true);
    setIsMessageView(result[0]);
  };

  let dataView = [
    { name: "email", value: isMessageView.email },
    { name: "subject", value: isMessageView.subject },
    { name: "message", value: isMessageView.message },
  ];
const formattedDate = (dateString:any) => {
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime())
    ? "N/A" // Fallback for invalid dates
    : new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(parsedDate);
};


if(isLoading) {
  return(
    <SpinLoading/>
  )
}
  return (
    <div>
      <div className="flex gap-10">
        <button
          className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Letter Head
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Letter Head"
          size="fullscreen" // or "small", "large", "fullscreen"
          fullscreen={true}
          overFlow={true}
        >
          <ListLetterhead />
        </Modal>

        <Signature />

        <button
          onClick={() => setIsSendModalOpen(true)}
          className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
        >
          send mail
        </button>
      </div>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="search"
          className="p-3 my-3 rounded-full w-72 mx-36"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
        />
      </div>
      {paginateData.length === 0 ? (
        <NoData
          message="No Emails Found"
          description="It seems there are no emails to display right now. Please check back later or send a new email to get started."
          actionText="Send Your First Email"
        />
      ) : (
        <div>
          <div>
            <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Subject</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginateData.map((role: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{role.email}</td>
                    <td className="px-4 py-2 border-b">{role.subject}</td>
                    <td className="px-4 py-2 border-b">
                     {
  role.sentAt ? formattedDate(role.sentAt) : "N/A"
}
                    </td>
                    <td className="px-4 py-2 border-b space-x-2 flex gap-3">
                      <button
                        className="px-3 py-1 m-auto rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                        title="View Email Details"
                        onClick={() => handleMessageView(role._id)}
                      >
                        View
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
        </div>
      )}

      {/* Modal forView mail form */}
      <Modal
        isOpen={isMessageViewModalOpen}
        onClose={() => {
          setIsMessageViewModalOpen(false);
        }}
        title="View Message "
        size="large"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]">
          <div className="space-y-4">
            {dataView.map((value) => (
              <div
                key={value.name}
                className="p-4 rounded-md bg-transparent shadow-lg border-0 border-b-4 border-b-gray-300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {value.name}
                </label>
                <input
                  type="text"
                  name={value.name}
                  value={value.value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-700">
                Attached letterhead
              </h3>

              {isMessageView ? (
                <div>
                  <iframe
                    src={isMessageView.cloudinaryUrl}
                    width="100%"
                    height="400px"
                    className="rounded"
                    // title={`pdf-${index}`}
                  />
                  <p className="mt-2 text-center text-sm font-medium">
                    {isMessageView.subject}
                  </p>
                </div>
              ) : (
                ""
              )}
              <input type="file" accept="image/*" className="hidden" />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsMessageViewModalOpen(false)}
                className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
              >
                close
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal forSend mail form */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Letter Head"
        size="large"
      >
        <form
          onSubmit={handleSendMail}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]"
        >
          {/* Left Column: Form Fields */}
          <div className="space-y-4">
            {["email", "subject", "message"].map((field) => (
              <div
                key={field}
                className="p-4 rounded-md bg-transparent shadow-lg border-0 border-b-4 border-b-gray-300"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
                />
              </div>
            ))}
            <div className="flex justify-end w-full ">
              <div
                className="px-5 py-2 rounded-md bg-[#B56365] text-white hover:bg-[#b56364f8] mx-4"
                onClick={() => setShowPdfModal(true)}
              >
                Attach pdf
              </div>
            </div>
          </div>

          {/* Right Column: Signature Upload + Submit */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-700">
                Attached letterhead
              </h3>

              {selectedLetterhead ? (
                <div>
                  <iframe
                    src={selectedLetterhead.cloudinary_url}
                    width="100%"
                    height="400px"
                    className="rounded"
                    // title={`pdf-${index}`}
                  />
                  <p className="mt-2 text-center text-sm font-medium">
                    {selectedLetterhead.subject}
                  </p>
                </div>
              ) : (
                ""
              )}
              <input type="file" accept="image/*" className="hidden" />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
              >
                send mail
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal for all letterhead pdf */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title="Letter Head"
        size="large"
        overFlow={true}
      >
        {filteredPdf.length === 0 ? (<NoData
  message="No PDFs Created"
  description="It looks like there are no PDFs created with the letterhead yet. Generate a new PDF to see it listed here."
  actionText="Create a PDF"
/>
):(

  <div>
    <div className="flex justify-end">
          <input
            type="text"
            placeholder="search"
            className="p-3 my-3 rounded-full w-72 mx-36 border"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePdfSearch(e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
          {filteredPdf.map((item, index) => (
            <div
              key={index}
              className="w-full h-full flex flex-col items-center shadow-md p-2 rounded cursor-pointer"
              onClick={() => {
                setSelectedLetterhead(item);
                setShowPdfModal(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedLetterhead(item);
                  setShowPdfModal(false);
                }
              }}
            >
              <iframe
                src={item.cloudinary_url}
                width="100%"
                height="450px"
                className="rounded cursor-pointer"
                title={`pdf-${index}`}
                loading="lazy"
              />

              <p className="mt-2 text-center text-sm font-medium">
                {item.subject}
              </p>
              <button
                className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8]"
                onClick={() => {
                  setSelectedLetterhead(item);
                  setShowPdfModal(false);
                }}
              >
                Attach
              </button>
            </div>
          ))}
        </div>
  </div>
)}
        
      </Modal>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default LetterHeads;
