import { ReactNode, useEffect } from "react";
import LoginComponent from "src/components/common/login";
import { DEFAULT_ROUTE, LOGIN_ROUTE } from "@/enums/defaultRoute.enums";
import BlankLayout from "@/@core/layouts/BlankLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { setCookie } from "@/@core/utils/cookie-handler";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) {
      router.push(LOGIN_ROUTE[session.user.role]);
      sessionStorage.setItem("isFirstTime", "");
      localStorage.setItem("TCUSER", session.user.role);
      setCookie("isLogin", "true", 1);
    }
  }, [router, session]);

  return <LoginComponent />;
}
Login.authGuard = false;
Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export async function getServerSideProps(context: any) {
  const authSession = await getServerSession(context.req, context.res, authOptions);

  if (authSession && authSession.user) {
    return {
      redirect: {
        destination: DEFAULT_ROUTE[authSession.user.role],
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
