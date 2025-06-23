import React from "react";
import { LetterHeadData,signature } from "@/app/(dashboard)/admin/letter-heads/page";
import Image from "next/image";
import { logo_anara } from "@/utils/constants";

interface PropsType {
  data: LetterHeadData;
  signature: signature;
}

const LetterheadPdf = ({ data, signature }: PropsType) => {
  const hasFiles = Array.isArray(data?.file_link) && data.file_link.length > 0;

  return (
    <div>
      <div className="flex justify-center p-4">
        <div
          className="bg-white shadow-lg"
          style={{
            width: "210mm",
            height: "297mm", // Adjusted to standard A4 height
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between h-[180px] px-6"
            style={{
              background: "linear-gradient(to right, #c4c4c4 35%, #ffffff 60%)",
            }}
          >
            {/* Text Section - vertically stacked, centered */}
            <div className="pl-16 flex flex-col justify-center text-center flex-1">
              <h1 className="text-4xl font-light text-gray-800 underline mb-2">
                ANARA SKILLS FOUNDATION
              </h1>
              <p className="text-gray-600 text-lg mb-4">www.anaraskills.org</p>
              <p className="text-gray-600 text-base">
                (CIN:U88900KA2024NPL193940)
              </p>
            </div>

            {/* Logo Image */}
            <div className="flex-shrink-0 pl-10">
              <img
                src={logo_anara}
                alt="Anara Skills Foundation Logo"
                style={{
                  width: "170px",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="mb-8">
            <div className="grid grid-cols-10">
              {/* Left Column */}
              <div className="col-span-3 h-full border-r-4 border-zinc-500 p-3">
                {[
                  {
                    name: "Subodh Saxena",
                    title: "Founder & Chief Executive Officer (CEO)",
                  },
                  {
                    name: "Sumita Saxena",
                    title: "Founder & Chief People Officer (CPO)",
                  },
                  {
                    name: "Dipa Padmakumar",
                    title: "Founder & Chief Operating Officer (COO)",
                  },
                  {
                    name: "Baiju K J",
                    title: "Founder & Chief Technology Officer (CTO)",
                  },
                  {
                    name: "Shruti Lokre",
                    title: "Founder & Chief Legal Officer (CLO)",
                  },
                ].map((person, index) => (
                  <div className="w-full h-40" key={index}>
                    <h3 className="text-md font-semibold">{person.name}</h3>
                    <h5 className="text-[10px] font-light tracking-tight">
                      {person.title}
                    </h5>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="col-span-7 p-4">
                <div className="mb-4 p-2 text-sm">{data.subject}</div>
                <div className="p-4 text-sm min-h-[200px]">{data.body_text}</div>

                {/* Files Section */}
                {hasFiles && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">Attached Files:</h3>
                    <ul className="mt-5 mx-8">
                      {data.file_link.map((item: any, index: number) => (
                        <li key={index} className="text-blue-700 m-2">
                          <a href={item.url}>{item.file_name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Signature Section */}
                <div
                  className="absolute bottom-8 left-16"
                  style={{
                    width: "100px",
                    height: "auto",
                  }}
                >
                  <img
                    src={signature.url}
                    alt="Signature"
                    style={{ width: "60px", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterheadPdf;
