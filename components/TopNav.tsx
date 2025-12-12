"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname() || "/";
  const isEn = pathname.startsWith("/en");
  const locale = isEn ? "en" : "es";

  // Mantén la misma ruta al cambiar idioma (si existe)
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "";
  const toEs = `/es${rest}`;
  const toEn = `/en${rest}`;

  const privacyHref = `/${locale}/privacy-policy`;
  const switchHref = isEn ? toEs : toEn;

  return (
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
        href={privacyHref}
        style={{
          fontSize: 12,
          textDecoration: "none",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {isEn ? "Privacy" : "Privacidad"}
      </Link>

      <Link
        href={switchHref}
        style={{
          fontSize: 12,
          textDecoration: "none",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {isEn ? "ES" : "EN"}
      </Link>
    </div>
  );
}
