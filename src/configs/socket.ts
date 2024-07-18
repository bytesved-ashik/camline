import { getSession } from "next-auth/react";
import io from "socket.io-client";
import { apiBaseUrl } from "../constants/environmentConstant";

export const initSocket = async () => {
  if (!apiBaseUrl) {
    throw new Error("Api base URL is empty");
  }
  const apiUrl = new URL(apiBaseUrl);
  const websocketUrl = apiUrl.href.replace(/^http/, "ws");
  const session = await getSession();

  if (!websocketUrl) {
    throw new Error("WebSocket URL is empty.");
  }

  if (!session?.accessToken) {
    throw new Error("No access token");
  }

  const socket = io(websocketUrl, {
    extraHeaders: {
      Authorization: session.accessToken,
    },
  });

  return socket;
};
