"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import adminApi from "@/utils/axios_Interceptors/adminApiService";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ReactDOMServer from "react-dom/server";
import LetterheadPdf from "./LetterheadPdf";

export interface signature {
  _id: string;
  userId:string;
  public_id:string;
  name: string;
  url: string;
}

interface LetterHeadButtonProps {
  signatures: signature[];
}

type FileWithCustomName = {
  file: File;
  customName: string;
};

const LetterHeadButton = ({ signatures }: LetterHeadButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsSignatueModalOpen, setIsSignatueModalOpen] = useState(false);

  const [letterContent, setLetterContent] = useState<string>("");
  const [letterSubject, setLetterSubject] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<string>("");

  const [selectedFiles, setSelectedFiles] = useState<FileWithCustomName[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithCustomName[]>([]);


  const handleSelectignature = (id: string) => {
    setSelectedSignature(id);
    setIsSignatueModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        customName: file.name,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, customName: newName } : item
      )
    );
  };

  const handleUpload = () => {
    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    setSelectedFiles([]); // Clear selected files
  };

  const handleUploadLetterhead = async () => {
    const formData = new FormData();
  
    // Add files and custom names to formData
    uploadedFiles.forEach((item, index) => {
      formData.append(`files[${index}][file]`, item.file);
      formData.append(`files[${index}][name]`, item.customName);
    });
  
    // Add additional data to the formData
    formData.append("subject", letterSubject);
    formData.append("body_text", letterContent);
    formData.append("image_id", selectedSignature);
  
    try {
      // Make the API call using await
      const response = await adminApi.post("/uploads/file-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setIsModalOpen(false)
      convertpdf(response.data)
      // Handle the response
      console.log("Files uploaded successfully:", response.data);
    } catch (error) {
      // Handle error
      console.error("Error uploading files:", error);
    }
  };

  const convertpdf= async(data:any)=>{

  //   const htmlString = ReactDOMServer.renderToStaticMarkup(
  //     <LetterheadPdf
  //       data={data}
  //     />
  //   );
  //   const html= `
  //   <!DOCTYPE html>
  //   <html>
  //     <head>
  //       <meta charset="utf-8" />
  //       <title>Letterhead PDF</title>
  //       <script src="https://cdn.tailwindcss.com"></script>
  //       <style>
  //         body { margin: 0; font-family: sans-serif; }
  //       </style>
  //     </head>
  //     <body>${htmlString}</body>
  //   </html>
  // `;

  
  const htmlContent="<div>fheyufguiewhfui</div>"
  
    // Prepare your HTML content (you can use the HTML from the LetterheadPdf component)
  //   const htmlContent = `
  //   <html>
  //     <head>
  //       <style>
  //         .letterhead {
  //           font-family: Arial, sans-serif;
  //           padding: 20px;
  //         }
  //         .header {
  //           background: linear-gradient(to right, #cfd9df, #e2e8f0);
  //           padding: 20px;
  //         }
  //         .header-content h1 {
  //           font-size: 32px;
  //           font-weight: bold;
  //           text-align: center;
  //         }
  //         .header-content p {
  //           text-align: center;
  //           font-size: 18px;
  //           color: #555;
  //         }
  //         .company-info p {
  //           text-align: center;
  //           font-size: 12px;
  //           color: #777;
  //         }
  //         .body {
  //           display: flex;
  //         }
  //         .left-column {
  //           width: 30%;
  //           padding: 15px;
  //           border-right: 2px solid #ccc;
  //         }
  //         .right-column {
  //           width: 70%;
  //           padding: 15px;
  //         }
  //         .subject, .content {
  //           margin-bottom: 20px;
  //         }
  //         .footer {
  //           text-align: center;
  //           font-size: 12px;
  //           color: #777;
  //           margin-top: 30px;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="letterhead">
  //         <div class="header">
  //           <div class="header-content">
  //             <h1>ANARA SKILLS FOUNDATION</h1>
  //             <p>BUILDING SKILLS, SHAPING TOMORROW</p>
  //           </div>
  //           <div class="company-info">
  //             <p>(CIN:U88900KA2024NPL193940)</p>
  //             <p>A Company incorporated in Bengaluru, Karnataka under Section 8 of the Companies Act, 2013</p>
  //           </div>
  //         </div>
  
  //         <div class="body">
  //           <div class="left-column">
  //             <div class="person">
  //               <h3>Subodh Saxena</h3>
  //               <h5>Founder & CEO</h5>
  //             </div>
  //             <div class="person">
  //               <h3>Sumita Saxena</h3>
  //               <h5>Founder & CPO</h5>
  //             </div>
  //             <!-- More people here -->
  //           </div>
  
  //           <div class="right-column">
  //             <div class="subject">
  //               <p>Subject: Type your subject here...</p>
  //             </div>
  //             <div class="content">
  //               <p>Type your letter content here...</p>
  //             </div>
  //             <!-- Optional files section -->
  //             <div class="files">
  //               <h3>Attached Files:</h3>
  //               <ul>
  //                 <li><a href="#">File 1</a></li>
  //                 <li><a href="#">File 2</a></li>
  //               </ul>
  //             </div>
  //           </div>
  //         </div>
  
  //         <div class="footer">
  //           <p>Company Registration Number: 12345678 • VAT Number: GB123456789</p>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
  // `;
  
  
  
  //   try {
  //     // Send POST request with HTML content
  //     const response = await axios.post('http://your-api-url/generate-pdf', {
  //       htmlContent: htmlContent,
  //       subject: 'Your Subject Here',  // Add subject if needed
  //     });
  
  //     // If PDF is generated successfully, response will contain the PDF URL
  //     console.log('PDF generated successfully:', response.data.url);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // };
  


  try {
    const response = await adminApi.post('/pdf/generatepdf', {
      htmlContent: htmlContent,
      subject:"pdf",
      
    });

    if (response.data?.url) {
      console.log('PDF link:', response.data.url);
      return response.data.url; // Return the PDF URL
    } else {
      console.error('No PDF link returned');
      return null;
    }

  } catch (err) {
    console.error('Error generating PDF:', err);
    return null;
  }
  }
  

  return (
    <div>
      <button
        className="px-5 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8]"
        onClick={() => setIsModalOpen(true)}
      >
        Letter Head
      </button>
      <button onClick={convertpdf}>generate pdf</button>

      {/* Modal foe Letter head */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Letter Head"
        size="fullscreen" // or "small", "large", "fullscreen"
        fullscreen={true}
        overFlow={true}
      >
        <div className="flex justify-center p-4">
          {/* A5 Container */}
          <div
            className="bg-white shadow-lg"
            style={{
              width: "210mm", // A4 width
              height: "297mm", // A4 height
              padding: "", // Standard letterhead padding
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Letterhead Header */}
            <div className="  pb-4 p-10 text-center bg-gradient-to-r from-slate-100 to-white">
              <div className="mb-6">
                <h1 className="text-4xl font-light text-gray-800 underline ">
                  ANARA SKILLS FOUNDATION
                </h1>
                <p className="text-gray-600 text-lg">
                  BUILDING SSKILLS, SHAPING TOMORROW
                </p>
              </div>
              <div className="">
                <p className="text-gray-600 ">(CIN:U88900KA2024NPL193940)</p>
                <p className="text-gray-600 text-sm">
                  A Company incorporated in Bengaluru,Karnataka under Section 8
                  of the companies Act,2013
                </p>
              </div>
            </div>

            {/* Letter Content */}
            <div className="mb-8 ">
              <div className="grid grid-cols-10">
                <div className="col-span-3  h-full border-r-4 border-zinc-500  p-3">
                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Subodh Saxena</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Executive Officer (CEO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Sumita Saxena</h3>
                    <h5 className="text-[10px] font-light tracking-tight">
                      Founder & Chief People Officer (CPO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Dipa Padmakumar</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Operating Officer (COO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Baiju K J</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Technology Officer (CTO)
                    </h5>
                  </div>

                  <div className="w-full h-40">
                    <h3 className="text-md font-semibold">Shruti Lokre</h3>
                    <h5 className="text-[10px] font-light">
                      Founder & Chief Legal Officer (CLO)
                    </h5>
                  </div>
                  <button
                    className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
                    onClick={() => setIsSignatueModalOpen(true)}
                  >
                    add signature
                  </button>
                </div>
                <div className="col-span-7">
                  <div className="col-span-7 p-4">
                    {/* Subject Field */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) =>
                        setLetterSubject(e.currentTarget.innerText)
                      }
                      className="mb-4 p-2 border border-gray-300 rounded text-sm outline-none"
                    >
                      Subject: Type your subject here...
                    </div>

                    {/* Content Field */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) =>
                        setLetterContent(e.currentTarget.innerText)
                      }
                      className="p-4 border border-gray-300 rounded text-sm outline-none min-h-[200px]"
                    >
                      Type your letter content here...
                    </div>

                    {/* Uploaded Files Display */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold mb-2">
                          Attached Files:
                        </h3>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedFiles.map((item, index) => (
                            <li key={index} className="text-center">
                              <img
                                src={URL.createObjectURL(item.file)}
                                alt={item.customName}
                                className="w-32 h-32 object-cover rounded mx-auto"
                              />
                              <p className="mt-1 text-sm text-blue-600">
                                {item.customName}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* File Upload */}

                    <div className="mt-4 space-y-4">
                      {/* File Input */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Attach files:
                        </label>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[#B56365] file:text-white
          hover:file:bg-[#b56364f8]"
                        />
                      </div>

                      {/* List of Selected Files */}
                      {selectedFiles.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2">
                            Selected Files:
                          </h3>
                          <ul className="space-y-3">
                            {selectedFiles.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <span className="text-sm text-gray-600 ">
                                  {item.file.name}
                                </span>
                                <span>
                                  <label
                                    htmlFor="filename"
                                    className="font-semibold"
                                  >
                                    Filename
                                  </label>
                                  <input
                                    type="text"
                                    value={item.customName}
                                    onChange={(e) =>
                                      handleNameChange(index, e.target.value)
                                    }
                                    className="border border-gray-300 rounded px-2 py-1 text-sm my-1"
                                    placeholder="Enter custom name"
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>

                          <button
                            onClick={handleUpload}
                            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Upload
                          </button>
                        </div>
                      )}
                    </div>

                    {/* <div className="mt-4 ">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Attach a file:
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#B56365] file:text-white
                hover:file:bg-[#b56364f8]"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Footer */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-500">
              <p>
                Company Registration Number: 12345678 • VAT Number: GB123456789
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-[#B56365] text-white rounded-md hover:bg-[#b56364f8]"
            onClick={handleUploadLetterhead}
          >
            Save Letterhead
          </button>
        </div>
      </Modal>

      {/* Modal for signature list */}
      <Modal
        isOpen={IsSignatueModalOpen}
        onClose={() => setIsSignatueModalOpen(false)}
        title="signature"
        size="small" // or "small", "large", "fullscreen"
      >
        <div className="overflow-y-auto">
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
                    <td className=" w-32 h-[20px]">
                      <Image
                        src={role.url}
                        alt="Profile Picture"
                        width={60}
                        height={10}
                      />
                    </td>
                    <td className="px-4 py-2 border-b">{role.name}</td>
                    <td className="px-4 py-2 border-b">
                      <button onClick={() => handleSelectignature(role.userId)}>
                        add
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default LetterHeadButton;
