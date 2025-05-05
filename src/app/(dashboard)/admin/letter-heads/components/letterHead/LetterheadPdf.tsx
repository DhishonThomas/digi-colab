import Image from "next/image";
import React from "react";

const LetterheadPdf = ({ data }: any) => {
    console.log (data)
  const hasFiles = Array.isArray(data?.file_link) && data.file_link.length > 0;

  return (
    <div>
      <div className="flex justify-center p-4">
        <div
          className="bg-white shadow-lg"
          style={{
            width: "210mm",
            height: "297mm",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div className="pb-4 p-10 text-center bg-gradient-to-r from-slate-100 to-white">
            <div className="mb-6">
              <h1 className="text-4xl font-light text-gray-800 underline">
                ANARA SKILLS FOUNDATION
              </h1>
              <p className="text-gray-600 text-lg">
                BUILDING SKILLS, SHAPING TOMORROW
              </p>
            </div>
            <div>
              <p className="text-gray-600">(CIN:U88900KA2024NPL193940)</p>
              <p className="text-gray-600 text-sm">
                A Company incorporated in Bengaluru, Karnataka under Section 8
                of the Companies Act, 2013
              </p>
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
                <div className="mb-4 p-2   text-sm">
                  Subject: Type your subject here...
                </div>
                <div className="p-4  text-sm min-h-[200px]">
                  {data.body_text}
                </div>

                {/* Files Section */}
                {hasFiles && (
                  <div className="mt-6 flex">
                    <h3 className="text-sm font-semibold mb-2">
                      Attached Files:
                    </h3>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {data.file_link.map((item: any, index: number) => (
                        <li key={index} className="text-center text-blue-700">
                          <a href={item.url}>{item.file_name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div>
            <Image
              src={data.}
              alt="Profile Picture"
              width={60}
              height={10}
            />
          </div> */}

          {/* Footer */}
          <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-gray-500">
            <p>
              Company Registration Number: 12345678 • VAT Number: GB123456789
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterheadPdf;
