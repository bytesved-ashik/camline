import { useState, PropsWithChildren, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";
import { SocketState } from "./useSocket";
import { initSocket } from "@/configs/socket";
import { useSession } from "next-auth/react";

export function SocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket>();
  const { data: session } = useSession();

  const socketInitialize = useCallback(async () => {
    const socket = await initSocket();
    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on("disconnect", () => {
      setSocket(undefined);
    });

    return socket;
  }, [setSocket]);

  useEffect(() => {
    if (!session || !session.user) {
      if (socket) socket.disconnect();

      return;
    }

    if (session && !socket)
      socketInitialize().catch((error) => {
        console.error(error);
      });

    return () => {
      if (!session && socket) socket.disconnect();
    };
  }, [session, socket, socketInitialize]);

  return <SocketState.Provider value={{ socket }}>{children}</SocketState.Provider>;
}
