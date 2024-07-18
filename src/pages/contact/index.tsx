import Navbar from "@/components/common/navbar/Navbar";

import PageTitle from "@/components/ui/lead-banner/PageTitle";

import { ReactNode } from "react";

import BlankLayout from "src/@core/layouts/BlankLayout";

const Contact = ({ dashboardRoute }: { dashboardRoute: string }) => {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <>
          <div style={{ minHeight: "100vh", background: "#fff" }}>
            <Navbar dashboardRoute={dashboardRoute} />

            <PageTitle title="Contact" />
          </div>
        </>
      </div>
    </>
  );
};

Contact.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Contact.authGuard = false;

export default Contact;
