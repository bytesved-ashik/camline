import PageTitle from "@/components/ui/lead-banner/PageTitle";

import { ReactNode } from "react";

import BlankLayout from "src/@core/layouts/BlankLayout";

const Contact = () => {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <>
          <div style={{ minHeight: "100vh", background: "#fff" }}>
            <PageTitle title="Emergency Contacts" />
          </div>
        </>
      </div>
    </>
  );
};

Contact.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Contact.authGuard = false;

export default Contact;
