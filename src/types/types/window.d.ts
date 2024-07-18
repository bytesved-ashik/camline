import ReCAPTCHA from "react-google-recaptcha";

declare global {
  interface Window {
    grecaptcha: ReCAPTCHA;
  }
}
