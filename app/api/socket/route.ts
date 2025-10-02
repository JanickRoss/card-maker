import { NextRequest } from "next/server";
import { Server as HTTPServer } from "http";
import { initSocketServer } from "@/lib/socket/server";

// Global variable to store socket server
let socketInitialized = false;

export async function GET(req: NextRequest) {
  if (!socketInitialized) {
    // Get the HTTP server from Next.js
    const httpServer = (global as any).httpServer as HTTPServer;

    if (httpServer) {
      initSocketServer(httpServer);
      socketInitialized = true;
      console.log("✅ Socket.IO server initialized");
    }
  }

  return new Response(JSON.stringify({ message: "Socket server ready" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
