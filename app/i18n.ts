// app/i18n.ts
export type Locale = "es" | "en";

export const STRINGS: Record<Locale, Record<string, string>> = {
  es: {
    title: "Probabify",
    subtitle:
      "Conecta tu Spotify, elige una pregunta y te devolvemos una probabilidad inventada (pero coherente con tu música) lista para post.",
    connect: "Conectar con Spotify",
    logout: "Cerrar sesión",
    loadingSession: "Cargando sesión...",
  },
  en: {
    title: "Probabify",
    subtitle:
      "Connect Spotify, pick a question and we’ll return a made-up probability (but consistent with your music) ready to post.",
    connect: "Connect with Spotify",
    logout: "Sign out",
    loadingSession: "Loading session...",
  },
};
