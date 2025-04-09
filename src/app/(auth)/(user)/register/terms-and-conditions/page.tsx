import AuthLayout from "@/components/layout/AuthLayout";
import React from "react";

const TermsAndConditions = () => {
  return (
    <AuthLayout hideScroll maxWidth="999px">
      <h1 className="text-3xl font-bold mb-6 text-center">Candidate Declaration</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Acknowledgements</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>This application is not a guarantee of my selection for the selected skill training course.</li>
            <li>My selection is subject to the terms and conditions and pre-selection criteria set by the skill training institutes/centres.</li>
            <li>The Company is not responsible for my selection or non-selection, and I will not hold the Company liable.</li>
            <li>My application is subject to the Company’s pre-selection criteria.</li>
            <li>If I do not meet the criteria, the Company may reject my application without any liability.</li>
            <li>If selected, the Company may pay the course fee directly to the institute, either in part or full, lump sum or in installments.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Background & Disclosures</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>I have never been convicted of any crime.</li>
            <li>There are no pending litigations, inquiries, or complaints against me.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Consent</h2>
          <p>
            I voluntarily, explicitly, and unambiguously consent to the collection, use, retention, and transfer of my personal data by the Company
            for the exclusive purpose of processing my candidature. I understand that my data may be shared with third parties involved in processing
            my application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Final Acknowledgement</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>I have read and understood the contents of this declaration.</li>
            <li>I have voluntarily provided the required information truthfully and accurately.</li>
            <li>I understand that any false or misleading information may lead to the rejection of my application.</li>
          </ul>
        </section>
      </div>
    </AuthLayout>

  );
};

export default TermsAndConditions;
