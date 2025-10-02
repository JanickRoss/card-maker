import type { Metadata } from "next";
import "./globals.css";
import { SocketProvider } from "@/components/providers/SocketProvider";

export const metadata: Metadata = {
  title: "Card Game Maker",
  description: "Create and play multiplayer card games online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
