

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

    // Wrap in full HTML structure
    const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Letterhead</title>
            <style>
              body { font-family: sans-serif; }
              /* Optionally inline some custom styles */
            </style>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

    // Send to external API
    try {
      const response: any = await adminApi.post(
        "/pdf/generatepdf",

        {
          htmlContent: fullHtml,
          subject: data.subject,
          letterHeadId: data._id,
        }, // or use FormData if required
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle PDF response (download it)
    } catch (error) {
      console.error("Error sending to external API:", error);
    }
  };
