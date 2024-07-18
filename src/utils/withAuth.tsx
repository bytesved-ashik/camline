import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface AuthGuardWrapperProps {
  children: React.ReactNode;
}

const AuthGuardWrapper: React.FC<AuthGuardWrapperProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    const allowedPaths = [
      "/",
      "/401",
      "/404",
      "/500",
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/otp",
      "/auth/reset-password",
      "/terms",
      "/about",
      "/faqs",
      "/how-it-works",
      "/mental-health",
      "/privacy",
      "/type-of-therapies",
      "/work-with-us"
    ];

    const userRole = session?.user?.role;
    const userPaths = ["/dashboard"];

    const isAllowedPath = () => allowedPaths.includes(currentPath);

    const shouldRedirectToLogin = () => {
      if (!session) {
        router.replace("/auth/login");

        return true;
      }

      return false;
    };

    const shouldRedirectBasedOnUserRole = () => {
      if (currentPath.includes("/therapist-dashboard") && userRole !== "therapist") {
        router.push("/401");

        return true;
      }

      if (userPaths.includes(currentPath) && userRole !== "user") {
        router.push("/401");

        return true;
      }

      return false;
    };

    if (!isAllowedPath() && (shouldRedirectToLogin() || shouldRedirectBasedOnUserRole())) {
      return;
    }
  }, [session, status, router, currentPath]);

  if (status === "loading") {
    return null;

  }

  return <>{children}</>;
};

export default AuthGuardWrapper;
