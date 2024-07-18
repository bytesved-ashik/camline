import Navbar from "@/components/common/navbar/Navbar";
import PageTitle from "@/components/ui/lead-banner/PageTitle";
import { ReactNode } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";

const Faqs = ({ dashboardRoute }: { dashboardRoute: string }) => {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <Navbar dashboardRoute={dashboardRoute} />
        <PageTitle title="Faqs" />
      </div>
    </>
  );
};

Faqs.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Faqs.authGuard = false;

export default Faqs;
