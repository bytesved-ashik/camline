import Head from "next/head";
import { Router } from "next/router";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/cache";

// ** Theme Imports

import themeConfig from "src/configs/themeConfig";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import UserLayout from "src/layouts/UserLayout";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import WindowWrapper from "src/@core/components/window-wrapper";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import { SettingsConsumer, SettingsProvider } from "src/@core/context/settingsContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";

// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";
import "src/iconify-bundle/icons-bundle-react";

// ** Global css styles
import "../../styles/globals.css";
import "../../styles/toast.css";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionDataProvider } from "@/store/sessionData/sessionData.provider";
import { SocketProvider } from "@/store/socket/socket.provider";

// import AuthGuardWrapper from "@/utils/withAuth";
import { PropsWithChildren } from "react";
import AuthGuard from "@/@core/components/auth/AuthGuard";
import { Session } from "next-auth";
import { BalanceProvider } from "@/store/wallet/balance.provider";
import { ROLE } from "@/enums/role.enums";
import GoogleAnalytics from "@/components/googleAnalytics/GoogleAnalytics";

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
  session: any;
};
type GuardProps = {
  authGuard: boolean | ROLE[];
  session?: Session | null;
};

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard }: PropsWithChildren<GuardProps>) => {
  if ((Array.isArray(authGuard) && authGuard.length === 0) || !authGuard) {
    return <>{children}</>;
  }

  return (
    <AuthGuard fallback={<Spinner />} guard={authGuard}>
      <BalanceProvider>{children}</BalanceProvider>
    </AuthGuard>
  );
};

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);

  const setConfig = Component.setConfig ?? undefined;

  const authGuard = Component.authGuard ?? true;

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{`${themeConfig.templateName} - Find qualified & experienced therapists `}</title>
          <meta
            name="description"
            content={`${themeConfig.templateName} – Find qualified &
  experienced therapists.`}
          />
          <meta
            name="keywords"
            content="Find qualified &
  experienced therapists "
          />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <GoogleAnalytics />
        <SessionProvider session={props.session}>
          <SocketProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <WindowWrapper>
                        <Guard authGuard={authGuard}>
                          <SessionDataProvider>{getLayout(<Component {...pageProps} />)}</SessionDataProvider>
                          <Toaster position={settings.toastPosition} toastOptions={{ className: "react-hot-toast" }} />
                        </Guard>
                      </WindowWrapper>
                      <ReactHotToast></ReactHotToast>
                    </ThemeComponent>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </SocketProvider>
        </SessionProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default App;
