"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import LetterHeadButton from "./components/letterHead/LetterHeadButton";
import LetterheadPdf from "./components/letterHead/LetterheadPdf";

export interface signature {
  _id: string;
  userId:string;
  public_id:string;
  name: string;
  url: string;
}
// interface letterheadType{
//   file_name:string;
//   public_id:string;
//   url:string;
// }
const demo={
  _id: "",
  userId:"",
  public_id:"",
  name: "",
  url: "",
}

const LetterHeads = () => {
  const admin:any = useSelector((state: RootState) => state.admin);
  // console.log(admin?.admin?._id);

  const [IsSignatueModalOpen, setIsSignatueModalOpen] = useState(false);
  const [isaddsignatureModal, setIsaddsignatureModal] = useState(false);
  const [isupdateSignature,setIsupdateSignature]=useState(false)
  const [viewPdfModalOpen,setViewPdfModalOpen] = useState(false)
  const [letterheadTemplate,setLetterheadTemplate]=useState<any>("")

  const [signatureName, setSignatureName] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const [signatures, setSignatures] = useState<signature[]>([]);
  // const [selectedSignature,setSelectedSignature]=useState<signature>(demo)

  const [letterheadList,setLetterheadList]=useState([])


  const fetchLetterhead = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.get("/uploads/list-files");

      if (data) {
        // console.log(data);
        setLetterheadList(data.files);

      }
    } catch (error) {
      console.error("not getting",error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  const fetchSignatures = async () => {
    // setIsLoading(true);
    try {
      const { data } = await adminApi.get("/uploads/list");

      if (data) {
        console.log(data);
        setSignatures(data.images);
        console.log(signatures);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error("not getting",error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  // for signature form submit

  const handleSubmitSignature = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(signatureName);

    if (!signatureName || !signatureFile) {
      alert("Please provide both name and signature image.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", admin?.admin?._id);
    formData.append("userName", signatureName);
    formData.append("image", signatureFile);

    console.log(formData);


   

    try {
      const response = await adminApi.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);

      // Optional: Refresh signature list or close modal
      setIsaddsignatureModal(false);
      setSignatureName("");
      setSignatureFile(null);
      fetchSignatures(); // re-fetch the updated list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload signature.");
    }
  };

  const deleteSignature=async(id:string)=>{
    try {
      const { data } = await adminApi.delete(`uploads/delete/${id}`);

      if (data) {
        console.log(data);
        // setSignatures(data.images);
        console.log(signatures);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  }

  const editSignature=async(id:string)=>{
       // setIsLoading(true);
    try {
      const { data } = await adminApi.put(`uploads/edit/${id}`);

      if (data) {
        console.log(data);
        setSignatures(data.images);
        console.log(signatures);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  }
  const deleteLetterhead=async(id:string)=>{
        
    try {
      const { data } = await adminApi.delete(`uploads/delete-file/${id}`);

      if (data) {
        console.log(data);
        // setSignatures(data.images);

        // setFilteredRoles(data.roles);
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  }

  useEffect(() => {
    fetchSignatures();
    fetchLetterhead()
  }, []);

  return (
    <div>
      <div className="flex gap-10">
        <LetterHeadButton signatures={signatures} />
        <button
          className="px-5 py-2 mx-3 bg-[#B56365] text-white hover:bg-[#b56364f8]"
          onClick={() => setIsSignatueModalOpen(true)}
        >
          add signatue
        </button>
      </div>
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
                  {letterheadList.map((role:any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{role.subject}</td>
                      {/* <td className="px-4 py-2 border-b">{truncateText(role.description)}</td> */}
                      <td className="px-4 py-2 border-b space-x-2">
                        <button
                          onClick={() => {
                            setLetterheadTemplate(role)
                            // viewLetterhead(role);
                            setViewPdfModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteLetterhead(role._id)}
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

      {/* Modal for signature list */}
      <Modal
      isOpen={viewPdfModalOpen}
      onClose={() => setViewPdfModalOpen(false)}
      title="Lettr Head"
      size="large" // or "small", "large", "fullscreen"
      fullscreen={true}
      overFlow={true}>
        <LetterheadPdf data={letterheadTemplate}/>

      </Modal>
      <Modal
        isOpen={IsSignatueModalOpen}
        onClose={() => setIsSignatueModalOpen(false)}
        title="signature"
        size="fullscreen" // or "small", "large", "fullscreen"
        fullscreen={true}
        overFlow={true}
      >
        <div className="flex justify-end mx-20">
          <button
            className="px-5 py-2 m-3 bg-[#B56365] text-white hover:bg-[#b56364f8]"
            onClick={() => setIsaddsignatureModal(true)}
          >
            add signature
          </button>
        </div>
        <table className="min-w-full bg-white bg-[url('/images/watermark_logo.png')] bg-center bg-no-repeat bg-contain border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th></th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">action</th>
            </tr>
          </thead>
          <tbody>
            {signatures.length > 0 &&
              signatures.map((role, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-5 py-2 w-32 h-[20px]">
                    <Image
                      src={role.url}
                      alt="Profile Picture"
                      width={60}
                      height={10}
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{role.name}</td>
                  <td>
                    <button className="px-3 mx-2 py-1 rounded-md text-sm bg-[#B56365] text-white hover:bg-[#b56364f8]"
                    onClick={()=>setIsupdateSignature(true)}>edit</button>
                    <button className="px-3 mx-2 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                    onClick={()=>deleteSignature(role.public_id)}>delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Modal>

      {/* Modal for add signature form */}
      <Modal
        isOpen={isaddsignatureModal}
        onClose={() => setIsaddsignatureModal(false)}
        title="Signature"
        size="small"
      >
        <form
          className="w-full px-4 py-2 space-y-4"
          onSubmit={handleSubmitSignature}
        >
          {/* Name Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
            />
          </div>

          {/* File Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Signature Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSignatureFile(e.target.files[0]);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-[#B56365] file:text-white
                   hover:file:bg-[#b56364f8]"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            >
              Save Signature
            </button>
          </div>
        </form>
      </Modal>

{/* modal for update signature */}
      <Modal
        isOpen={isupdateSignature}
        onClose={() => setIsupdateSignature(false)}
        title="Signature"
        size="small"
      >
        <form
          className="w-full px-4 py-2 space-y-4"
          onSubmit={handleSubmitSignature}
        >
          {/* Name Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B56365]"
            />
          </div>

          {/* File Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Signature Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSignatureFile(e.target.files[0]);
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-[#B56365] file:text-white
                   hover:file:bg-[#b56364f8]"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            >
              Save Signature
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LetterHeads;
