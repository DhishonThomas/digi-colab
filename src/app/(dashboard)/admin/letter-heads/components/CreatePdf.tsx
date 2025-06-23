

import ReactDOMServer from "react-dom/server";
import LetterheadPdf from "./LetterheadPdf";
import adminApi from "@/utils/axios_Interceptors/adminApiService";

import { LetterHeadData, signature } from "@/app/(dashboard)/admin/letter-heads/page";

// ==============for pdf creation================
  export const handleCreatePdf = async (letterheadData: LetterHeadData,signatures:signature[]) => {
    const data = letterheadData;

    const sig:signature = signatures.find(
      (item) => item._id === letterheadData.image_id
    )!;

    // Render component to static HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <LetterheadPdf data={data} signature={sig} />
    );


    // Send to external API
    try {
      const response: any = await adminApi.post(
        "/pdf/generatepdf",

        {
          htmlContent: htmlContent,
          subject: data.subject,
          letterHeadId: data._id,
        }, // or use FormData if required
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
console.log("PDF generated successfully:", response.data);
      // Handle PDF response (download it)
      return response.data; // Assuming the API returns the PDF URL or blob
    } catch (error) {
      console.error("Error sending to external API:", error);
    }
  };
