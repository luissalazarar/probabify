import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { SessionProvider } from "@/components/SessionProvider";

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
        {/* Header mínimo solo para links legales */}
        <header
          style={{
            width: "100%",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link
            href="/privacy-policy"
            style={{
              fontSize: 13,
              color: "#CBD5E1",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
        </header>

        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
