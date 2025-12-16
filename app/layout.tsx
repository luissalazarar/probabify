import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import TopNav from "@/components/TopNav";
import Adsense from "@/components/Adsense";

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
        <SessionProvider>
          {/* ✅ Carga el script SOLO si hay sesión */}
          <Adsense />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
