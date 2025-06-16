import AuthLayout from "@/components/layout/AuthLayout";
import React from "react";

const TermsAndConditions = () => {
  return (
    <AuthLayout hideScroll maxWidth="999px">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Terms and Conditions for the Candidates
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Consent</h2>
          <p>
            I hereby voluntarily, explicitly and unambiguously consent to
            collect, use, retain/hold and transfer my personal data/information
            as detailed above (‘Personal Data’) by Anara Skills Foundation (ASF)
            for the exclusive purpose of processing my candidature for the skill
            training courses selected by me, in electronic or other form. I
            understand that the Personal Data may be transferred to third
            parties assisting in processing my candidature as aforesaid and I
            voluntarily consent and authorize such transfer of Personal Data for
            the exclusive purpose of processing my candidature.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Acknowledgement</h2>
          <ol className="list-[lower-roman] list-inside space-y-2">
            <li>That I have read and understood the contents of this form;</li>
            <li>
              That I have voluntarily provided all the information in this form;
            </li>
            <li>
              That this information is being provided to the ASF for
              verification purposes;
            </li>
            <li>
              I have not been convicted of any crime and there are no pending
              litigations, enquiries and complaints of any nature whatsoever
              against me.
            </li>
            <li>
              That providing false and misleading information may result in
              rejection of my application in totality.
            </li>
            <li>
              This application is not a guarantee of my selection for the skill
              training courses identified by me;
            </li>
            <li>
              My selection is subject to the terms and conditions and
              pre-selection criteria laid down by respective skill training
              institutes/centres.
            </li>
            <li>
              Anara Skills Foundation (ASF) is not responsible in any manner
              whatsoever in selection/non-selection and I shall not hold “ASF”
              responsible in any manner, in case of my non-selection;
            </li>
            <li>
              My application shall be processed subject to the ASF’s
              pre-selection criteria;
            </li>
            <li>
              If I do not meet the ASF’s pre-selection criteria, ASF is at
              liberty to reject my application;
            </li>
            <li>
              In case of my selection, I agree to pay the entire training fee
              including examination/assessment fee, if any, as prescribed by the
              concerned training institute/centre. I understand that on
              successful completion of the training, assessment and
              certification, the entire amount paid by me towards training fee
              and examination/assessment fee, if any, shall be re-imbursed to me
              by ASF directly in the bank account details given by me to ASF at
              the time of my registration.
            </li>
          </ol>
        </section>
      </div>
    </AuthLayout>
  );
};

export default TermsAndConditions;
