import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Probabify",
  description: "Probabilidades según tu Spotify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TopNav />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
