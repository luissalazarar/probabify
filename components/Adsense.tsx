"use client";

import Script from "next/script";
import { useSession } from "next-auth/react";

export default function Adsense() {
  const { status } = useSession();

  // ✅ NO mostrar ads en login (cuando no hay sesión)
  if (status !== "authenticated") return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4130755623732766"
      crossOrigin="anonymous"
    />
  );
}