import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export interface ISocketState {
  socket?: Socket;
}

export const SocketState = createContext<ISocketState>({} as ISocketState);
SocketState.displayName = "SessionState";

export function useSocket() {
  return useContext(SocketState);
}
