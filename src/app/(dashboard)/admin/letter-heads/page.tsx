"use client";
import SuccessModal from "@/components/ui/SuccessModal";

import { ChangeEvent, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import ListLetterhead from "./components/ListLetterhead";
import LetterHeadButton from "./components/LetterHeadButton";
import Signature from "./components/Signature";

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

export interface SentMessage {
  _id: string;
  email: string;
  subject: string;
  message: string;
  cloudinaryUrl: string;
  sentAt: string; // if you have this
  updatedAt?: string; // optional fields
}

type Letterhead = {
  _id: string;
  subject: string;
  cloudinary_url: string;
  public_id: string;
  createdAt: string; // or `Date` if you plan to parse it into a Date object
  __v: number;
  letter_head_id:string;
};

const LetterHeads = () => {
  const [message, setMessage] = useState<SentMessage[]>([]);
  const [filteredData, setFilteredData] = useState<SentMessage[]>([]); 
  const [letterheadList, setLetterheadList] = useState<LetterHeadData[]>([]);
  const [signatures, setSignatures] = useState<signature[]>([]);
  const [isSentModalOpen,setIsSentModalOpen]=useState(false)
  const [showPdfModal,setShowPdfModal]=useState(false)
  const [formData, setFormData] = useState({
  email: "",
  subject: "",
  message: "",
});
const [selectedLetterhead,setSelectedLetterhead]=useState<Letterhead|null>(null)
const [letterheadPdf,setLetterheadPdf]=useState<Letterhead[]>([])
const [filteredPdf,setFilteredPdf]=useState<Letterhead[]>([])

 const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

// =========== For get all letterhead pdf ===============
const fetchPdf=async()=>{
   // setIsLoading(true);
    try {
      const { data } = await adminApi.post("/pdf/list-letterheads", {
        id: "",
      });
      console.log(1111, data);
      if (data) {
        
        setLetterheadPdf([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        console.log(1111, data);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

// ========= For get all sent mails ============
  const fetchMessages = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.post("/pdf/list-sent-messages", {
        email: "",
      });
      if (data) {
setMessage([...data].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // ========= For get all letterhead templates ============
  const fetchLetterhead = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.get("/uploads/list-files");

      if (data) {
        console.log(1111,data);
        setLetterheadList(data.files);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };
// ========= For get all signatures ============
  const fetchSignatures = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.get("/uploads/list");

      if (data) {
        // console.log(data);
        setSignatures(data.images);
        // console.log(signatures);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // ========= For sent email ============
  const handleSentMail=async(e: React.FormEvent) => {
  e.preventDefault();
  // setIsLoading(true);

    try {
        const mailData={
    ...formData,
    cloudinaryUrl:selectedLetterhead?.cloudinary_url,
    letterHeadId:selectedLetterhead?.letter_head_id
  }
  console.log(mailData);
  
      const { data } = await adminApi.post("/pdf/send-mail", mailData);
      console.log(2222, data);
      if (data) {
        setSuccessMessage(data.message)
        setShowSuccessModal(true)
            fetchMessages();
setIsSentModalOpen(false)      }
    } catch (error) {
      console.error("not getting", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  }


const handlePdfSearch=(searchTerm:string)=>{
const term = searchTerm.toLowerCase();

  const result = letterheadPdf.filter(item => {
    // Match email (partial match)
    const subMatch = item.subject.toLowerCase().includes(term);

    return subMatch
  });

  setFilteredPdf(result);
}

useEffect(()=>{
  setFilteredPdf(letterheadPdf)
},[letterheadPdf])
useEffect(()=>{
  setFilteredData(message)
},[message])
  useEffect(() => {
    fetchMessages();
    fetchSignatures();
    fetchLetterhead();
    fetchPdf()
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const handleSearch = (searchTerm:string) => {
    const term = searchTerm.toLowerCase();
  
    const result = message.filter(item => {
      // Match email (partial match)
      const emailMatch = item.email.toLowerCase().includes(term);
  
      // Format date as DD-MM-YYYY
      const dateObj = new Date(item.sentAt);
      const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
  
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



  return (
    <div>
      <div className="flex gap-10">
        <ListLetterhead
          signatures={signatures}
          letterheadList={letterheadList}
          fetchLetterhead={fetchLetterhead}
        />
        <LetterHeadButton signatures={signatures} />
        
        <Signature />

        <button onClick={()=>setIsSentModalOpen(true)}
          className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
          >sent mail</button>
         
      </div>
       <div className="flex justify-end">
          <input
            type="text"
            placeholder="search"
            className="p-3 my-3 rounded-full w-72 mx-36"
  onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          />
        </div>
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
            {paginateData.map((role: SentMessage, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{role.email}</td>
                <td className="px-4 py-2 border-b">{role.subject}</td>
                <td className="px-4 py-2 border-b">{new Intl.DateTimeFormat('en-GB').format(new Date(role.sentAt))}</td>
                <td className="px-4 py-2 border-b space-x-2 flex gap-3">
                  <button
                    className="px-3 py-1 m-auto rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                    title="View Email Details"
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

{/* Modal forSent mail form */}
  <Modal
  isOpen={isSentModalOpen}
  onClose={() => setIsSentModalOpen(false)}
  title="Letter Head"
  size="large"
>
  <form
    onSubmit={handleSentMail}
    className="grid grid-cols-1 md:grid-cols-2 gap-6 border-4 border-[#B56365] rounded-lg bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain text-left px-6 py-6 overflow-y-auto max-h-[90vh]"
  >
    {/* Left Column: Form Fields */}
    <div className="space-y-4">
      {[ "email", "subject", "message"].map((field) => (
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
                className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] mx-4"
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
        
        
        {selectedLetterhead?<div>
           <iframe
        src={selectedLetterhead.cloudinary_url}
        width="100%"
        height="400px"
        className="rounded"
        // title={`pdf-${index}`}
      />
      <p className="mt-2 text-center text-sm font-medium">{selectedLetterhead.subject}</p>
        </div>:""}
        <input
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
        >
          sent mail
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
    if (e.key === 'Enter' || e.key === ' ') {
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


      <p className="mt-2 text-center text-sm font-medium">{item.subject}</p>
      <button
        className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8]"
onClick={() => {
    setSelectedLetterhead(item);
    setShowPdfModal(false);
  }}      >
        Attach
      </button>
    </div>
  ))}
</div>
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
