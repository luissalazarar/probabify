import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import TopNav from "@/components/TopNav";
import Script from "next/script";

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
      <head>
        <Script
          id="adsbygoogle-init"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4130755623732766"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <TopNav />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
