// app/[locale]/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import Link from "next/link";

type Locale = "es" | "en";

export const metadata: Metadata = {
  title: "Probabify",
  description: "Probabilidades según tu Spotify",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const safeLocale: Locale = params.locale === "en" ? "en" : "es";

  return (
    <html lang={safeLocale}>
      <body>
        {/* nav mínima arriba derecha */}
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
            href={`/${safeLocale}/privacy-policy`}
            style={{
              fontSize: 12,
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {safeLocale === "es" ? "Privacidad" : "Privacy"}
          </Link>

          <Link
            href={safeLocale === "es" ? "/en" : "/es"}
            style={{
              fontSize: 12,
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {safeLocale === "es" ? "EN" : "ES"}
          </Link>
        </div>

        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
