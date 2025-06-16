import React from "react";
import { LetterHeadData,signature } from "@/app/(dashboard)/admin/letter-heads/page";

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
            height: "290mm",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div
  style={{
    background: 'linear-gradient(to right, #f1f5f9 45%, #f1f5f9 46%, #ffffff 54%, #ffffff 55%)',
    padding: '2.5rem',
    textAlign: 'center',
  }}
>
  <div style={{ marginBottom: '1.5rem' }}>
    <h1 style={{ fontSize: '2.25rem', fontWeight: 300, color: '#1f2937', textDecoration: 'underline' }}>
      ANARA SKILLS FOUNDATION
    </h1>
    <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
      BUILDING SKILLS, SHAPING TOMORROW
    </p>
  </div>
  <div>
    <p style={{ color: '#4b5563' }}>(CIN:U88900KA2024NPL193940)</p>
    <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
      A Company incorporated in Bengaluru, Karnataka under Section 8 of the Companies Act, 2013
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
                  {data.subject}
                </div>
                <div className="p-4  text-sm min-h-[200px]">
                  {data.body_text}
                </div>

                {/* Files Section */}
                {hasFiles && (
                  <div className="mt-6 ">
                    <h3 className="text-sm font-semibold mb-2">
                      Attached Files:
                    </h3>
                    <ul className=" mt-5 mx-8">
                      {data.file_link.map((item: any, index: number) => (
                        <li key={index} className=" text-blue-700 m-2">
                          <a href={item.url}>{item.file_name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Other content above */}
                <div className=" absolute bottom-32 left-50 right-0mb-4 ml-4">
                <img
  src={signature.url}
  alt="Signature"
  width="60"
  height="10"
/>

                </div>
              </div>
            </div>
          </div>

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
