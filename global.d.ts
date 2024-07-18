declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

declare module "@antmedia/webrtc_adaptor/dist/es/webrtc_adaptor";

declare module "@stripe/react-stripe-js";
