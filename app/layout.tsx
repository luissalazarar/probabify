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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4130755623732766"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <TopNav />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
