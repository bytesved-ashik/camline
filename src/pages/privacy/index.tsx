import Navbar from "@/components/common/navbar/Navbar";
import PageTitle from "@/components/ui/lead-banner/PageTitle";
import { ReactNode } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";

const PrivacyPolicies = ({ dashboardRoute }: { dashboardRoute: string }) => {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <Navbar dashboardRoute={dashboardRoute} />
        <PageTitle title="Privacy Policy" />
      </div>
    </>
  );
};

PrivacyPolicies.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

PrivacyPolicies.authGuard = false;

export default PrivacyPolicies;
