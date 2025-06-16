import AuthLayout from "@/components/layout/AuthLayout";
import React from "react";

const VolunteerTerms = () => {
  return (
    <AuthLayout hideScroll maxWidth="999px">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Terms and Conditions for the Volunteers (Field Executives)
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            (I) Commitment to Volunteering
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              I hereby declare that:
              <ol className="list-[lower-roman] list-inside ml-6 space-y-2">
                <li>
                  I understand the scope of the activities and responsibilities
                  as a volunteer (Field Executive);
                </li>
                <li>
                  I have not been convicted of any crime and there are no
                  pending litigations, enquiries and complaints of any nature
                  whatsoever against me.
                </li>
                <li>
                  I understand that volunteering work does not and is not
                  intended to mean any kind of full-time/part-time employment;
                </li>
                <li>
                  I am committed to providing my skills, services and time in
                  line with the scope of activities and responsibilities
                  associated with volunteering;
                </li>
                <li>
                  I shall abide by the rules, regulations and procedures of
                  Anara Skills Foundation (ASF);
                </li>
                <li>
                  I understand and accept that “ASF” shall pay remuneration
                  based on total number of candidates registered by me as part
                  of the volunteering activity.
                </li>
                <li>
                  I understand and accept that “ASF” shall pay additional
                  remuneration based on the successful completion of training,
                  assessment and certification of the candidates registered by
                  me through designated agencies as part of the volunteering
                  activity;
                </li>
              </ol>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">(II) Consent</h2>
          <ol className="list-[lower-roman] list-inside space-y-2">
            <li>
              I hereby voluntarily, explicitly and unambiguously consent to
              collect, use, retain/hold and transfer, my personal
              data/information (‘Personal Data’) by “ASF” for the exclusive
              purpose of implementing, administering and managing my
              volunteering activities in electronic or other form. I understand
              that my “Personal Data” may be transferred to third parties
              assisting in implementing, administering and managing volunteering
              activities and I voluntarily consent and authorise to such
              transfer of “Personal Data” for the exclusive purpose of my
              volunteering activities.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">(III) Acknowledgement</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              I understand, accept and acknowledge as under:
              <ol className="list-[lower-roman] list-inside ml-6 space-y-2">
                <li>
                  That I have read and understood the contents of this
                  Declaration;
                </li>
                <li>
                  That I have voluntarily provided all the information in this
                  Declaration and the information/documents provided by me are
                  correct to the best of my knowledge and belief;
                </li>
                <li>
                  That this information is being provided to “ASF” for
                  verification purposes;
                </li>
                <li>
                  That providing false and misleading information may result in
                  termination/revocation of my volunteering with “ASF”.
                </li>
              </ol>
            </li>
          </ol>
        </section>
      </div>
    </AuthLayout>
  );
};

export default VolunteerTerms;
