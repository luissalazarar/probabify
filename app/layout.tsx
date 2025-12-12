import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Link from "next/link";

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
        {/* navegación idioma + privacidad */}
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            display: "flex",
            gap: 12,
            zIndex: 50,
          }}
        >
          <Link
            href="/es/privacy-policy"
            style={{
              fontSize: 12,
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Privacidad
          </Link>

          <Link
            href="/en"
            style={{
              fontSize: 12,
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            EN
          </Link>
        </div>

        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
