import { eraseCookie } from "@/@core/utils/cookie-handler";
import { signOut } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";

const Logout = () => {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
    eraseCookie("isLogin");
  }, []);

  return <></>;
};

Logout.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Logout.authGuard = false;

export default Logout;
