import Navbar from "@/components/common/navbar/Navbar";
import PageTitle from "@/components/ui/lead-banner/PageTitle";
import { ReactNode } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";

const MentalHealth = ({ dashboardRoute }: { dashboardRoute: string }) => {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <Navbar dashboardRoute={dashboardRoute} />
        <PageTitle title="Mental Health Conditions" />
      </div>
    </>
  );
};

MentalHealth.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

MentalHealth.authGuard = false;

export default MentalHealth;
