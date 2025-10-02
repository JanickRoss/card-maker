"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket() {
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

    socketRef.current = io(socketUrl, {
      transports: ["websocket", "polling"],
    }) as TypedSocket;

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}
