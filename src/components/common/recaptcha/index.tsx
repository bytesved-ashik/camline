import { forwardRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Router from "next/router";
import { googleReCaptchaSiteKey } from "src/constants/environmentConstant";
import * as toast from "src/utils/toast";

interface IProps {
  error: string;
  googleReCaptchaEnabled: boolean;
}

// eslint-disable-next-line react/display-name
const GoogleReCaptcha = forwardRef<any, IProps>((props: IProps, ref) => {
  if (!googleReCaptchaSiteKey) {
    throw new Error("No reCaptchaSiteKey");
  }
  const { error, googleReCaptchaEnabled } = props;
  const onRouteChangeStart = () => {
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  };

  useEffect(() => {
    Router.events.on("routeChangeStart", onRouteChangeStart);
    if (error) toast.error("Please verify that you are not a robot.");

    return () => {
      Router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [error]);

  return <>{googleReCaptchaEnabled && <ReCAPTCHA ref={ref} sitekey={googleReCaptchaSiteKey} />}</>;
});
export default GoogleReCaptcha;
