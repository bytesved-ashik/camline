// ** React Imports
import { ReactElement, useEffect, PropsWithChildren } from "react";

// ** Next Import
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ROLE } from "@/enums/role.enums";

interface AuthGuardProps {
  fallback: ReactElement | null;
  guard: boolean | ROLE[];
}

const AuthGuard = ({ children, fallback, guard }: PropsWithChildren<AuthGuardProps>) => {
  const { route, isReady, replace } = useRouter();
  const { data: session, status } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;

  useEffect(() => {
    const currentPath = router.pathname;
    if (!isReady) {
      return;
    }

    if (status === "loading") return;

    if (!session?.user) {
      replace("/auth/login");

      return;
    }

    if (currentPath.includes("/dashboard") && userRole === "therapist" && !currentPath.includes("/therapist-dashboard")) {
      replace("/therapist-dashboard/dashboard");

      return;
    }

    if (Array.isArray(guard) && !guard.includes(session.user.role)) {
      replace("/401");

      return;
    }
  }, [route, guard, status, isReady, session?.user, replace, router]);

  if (status === "loading") {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
