// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react"; // 👈 para usar React.CSSProperties
import { signIn, signOut, useSession } from "next-auth/react";
import html2canvas from "html2canvas";

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string | null;
  previewUrl: string | null;
};

type ProbabilityResult = {
  question: string;
  probability: number;
  summary: string;
  shortLabel: string;
};

type RangeKey = "short_term" | "medium_term" | "long_term";

const PRESET_QUESTIONS = [
  "¿Cuál es la probabilidad de volver con mi ex?",
  "¿Cuál es la probabilidad de superar a mi ex?",
  "¿Cuál es la probabilidad de renunciar a mi trabajo?",
  "¿Cuál es la probabilidad de ser toxico?",
  "¿Cuál es la probabilidad de entrar en una relacion toxica?",
  "¿Cuál es la probabilidad de empezar a valorarme?",
];

const PERIODS: { key: RangeKey; label: string }[] = [
  { key: "short_term", label: "Últimas semanas" },
  { key: "medium_term", label: "Últimos 6 meses" },
  { key: "long_term", label: "Todo el tiempo" },
];

const PERIOD_DETAILS: Record<
  RangeKey,
  { label: string; subtitle: string; description: string }
> = {
  short_term: {
    label: "Últimas semanas",
    subtitle: "Mood reciente",
    description:
      "Este periodo refleja tus escuchas más recientes. Se enfoca en tu estado emocional actual y tus tendencias inmediatas.",
  },
  medium_term: {
    label: "Últimos 6 meses",
    subtitle: "Tendencia media",
    description:
      "Este periodo muestra tus gustos sostenidos en el tiempo. Es un balance entre lo nuevo y lo que realmente mantienes.",
  },
  long_term: {
    label: "Todo el tiempo",
    subtitle: "Tu esencia musical",
    description:
      "Este rango captura tu ADN musical: lo que más te ha gustado en general y define mejor tu esencia como oyente.",
  },
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function Home() {
  const { data: session, status } = useSession();

  const [selectedRange, setSelectedRange] = useState<RangeKey>("short_term");

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [errorTracks, setErrorTracks] = useState<string | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<string>(
    PRESET_QUESTIONS[0]
  );

  const [probLoading, setProbLoading] = useState(false);
  const [probError, setProbError] = useState<string | null>(null);
  const [probResult, setProbResult] = useState<ProbabilityResult | null>(null);

  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [comparisonResults, setComparisonResults] = useState<
    { key: RangeKey; probability: number | null }[] | null
  >(null);

  const postCardRef = useRef<HTMLDivElement | null>(null);
  const periodsCardRef = useRef<HTMLDivElement | null>(null);

  const [exportingPost, setExportingPost] = useState(false);
  const [exportingPeriods, setExportingPeriods] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // 1) Cargar canciones del periodo principal
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchTopTracks = async () => {
      try {
        setLoadingTracks(true);
        setErrorTracks(null);

        const res = await fetch(`/api/spotify/top-tracks?range=${selectedRange}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Error obteniendo canciones");
        }

        const data = await res.json();
        setTracks(data.tracks || []);
      } catch (err: any) {
        console.error(err);
        setErrorTracks(err.message || "Error inesperado");
      } finally {
        setLoadingTracks(false);
      }
    };

    fetchTopTracks();
  }, [status, selectedRange]);

  // 2) Botón único: calcula resultado principal + 3 periodos
  async function handleCalculateAll() {
    try {
      if (!session) {
        setProbError("Primero conecta tu Spotify.");
        setComparisonError("Primero conecta tu Spotify.");
        return;
      }

      const question = selectedPreset.trim();
      if (!question) {
        setProbError("Selecciona una pregunta.");
        setComparisonError("Selecciona una pregunta.");
        return;
      }

      setProbLoading(true);
      setComparisonLoading(true);
      setProbError(null);
      setComparisonError(null);
      setProbResult(null);
      setComparisonResults(null);
      setExportError(null);

      const results: { key: RangeKey; probability: number | null }[] = [];
      let mainResult: ProbabilityResult | null = null;

      for (const period of PERIODS) {
        try {
          let periodTracks: Track[] = [];

          if (period.key === selectedRange && tracks.length > 0) {
            periodTracks = tracks;
          } else {
            const tracksRes = await fetch(`/api/spotify/top-tracks?range=${period.key}`);
            if (!tracksRes.ok) {
              results.push({ key: period.key, probability: null });
              continue;
            }
            const tracksData = await tracksRes.json();
            periodTracks = tracksData.tracks || [];
          }

          if (!periodTracks.length) {
            results.push({ key: period.key, probability: null });
            continue;
          }

          const probRes = await fetch("/api/probability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question,
              tracks: periodTracks.map((t) => ({
                id: t.id,
                name: t.name,
                artist: t.artist,
                album: t.album,
              })),
            }),
          });

          if (!probRes.ok) {
            results.push({ key: period.key, probability: null });
            continue;
          }

          const probData = await probRes.json();
          const probability: number | null =
            typeof probData.probability === "number" ? probData.probability : null;

          results.push({ key: period.key, probability });

          if (period.key === selectedRange && probability !== null) {
            mainResult = {
              question: probData.question,
              probability,
              summary: probData.summary,
              shortLabel: probData.shortLabel,
            };
          }
        } catch {
          results.push({ key: period.key, probability: null });
        }
      }

      setComparisonResults(results);

      if (!mainResult) {
        setProbError("No se pudo calcular la probabilidad para el periodo seleccionado.");
      } else {
        setProbResult(mainResult);
      }
    } catch (err: any) {
      console.error(err);
      setProbError(err.message || "Error inesperado.");
      setComparisonError(err.message || "Error inesperado en la comparación.");
    } finally {
      setProbLoading(false);
      setComparisonLoading(false);
    }
  }

  // 3) Exportar como PNG (con imágenes y sin recortar texto)
  async function handleDownloadCard(element: HTMLDivElement | null, filename: string) {
    setExportError(null);

    if (!element) {
      setExportError("No se encontró la tarjeta para exportar.");
      return;
    }

    // Espera 1 frame para asegurar layout estable
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#020617",
        scale: 3, // 360x640 -> 1080x1920
        useCORS: true, // 👈 importante para que html2canvas intente cargar imágenes remotas
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      downloadDataUrl(dataUrl, filename);
    } catch (err: any) {
      console.error("Error exportando imagen:", err);
      setExportError(
        err?.message
          ? `No se pudo exportar: ${err.message}`
          : "No se pudo exportar la imagen."
      );
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  // Styles “safe” (HEX/RGB) para html2canvas
  const storyOuterStyle: React.CSSProperties = {
    width: 360,
    height: 640,
    borderRadius: 32,
    background: "#020617", // slate-950
    color: "#F8FAFC", // slate-50
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 24,
    gap: 16,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
  };

  const mutedText: React.CSSProperties = { color: "#94A3B8" }; // slate-400
  const mutedText2: React.CSSProperties = { color: "#64748B" }; // slate-500
  const borderTop: React.CSSProperties = { borderTop: "1px solid #1E293B" }; // slate-800

  const pillTop: React.CSSProperties = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#94A3B8",
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-950 text-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* … TODO LO DEMÁS IGUAL QUE TU CÓDIGO, HASTA LLEGAR A LA CARD EXPORTABLE … */}

        {/* Solo te pego la parte de la CARD para el post con los cambios pedidos */}

        {session && probResult && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
            {/* … encabezado, resumen y lista previa igual que ya lo tienes … */}

            {/* VISTA PARA POST */}
            <div className="mt-6 border-t border-slate-800 pt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">Vista para post</p>

                <button
                  type="button"
                  onClick={async () => {
                    setExportingPost(true);
                    await handleDownloadCard(
                      postCardRef.current,
                      "probabify_historia_periodo.png"
                    );
                    setExportingPost(false);
                  }}
                  disabled={exportingPost}
                  className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {exportingPost ? "Exportando..." : "Exportar historia de este periodo"}
                </button>
              </div>

              {exportError && <p className="text-red-400 text-sm">{exportError}</p>}

              {/* CARD EXPORTABLE (sin Tailwind colors) */}
              <div ref={postCardRef} style={storyOuterStyle}>
                <div style={pillTop}>
                  {PERIOD_DETAILS[selectedRange].label} · {PERIOD_DETAILS[selectedRange].subtitle}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 12, color: "#E2E8F0" }}>{probResult.question}</p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 56, fontWeight: 800, lineHeight: "56px" }}>
                      {probResult.probability}%
                    </span>
                    <span style={{ fontSize: 12, color: "#E2E8F0" }}>según tu Spotify</span>
                  </div>

                  {/* 👇 YA NO RECORTAMOS EL TEXTO, SE VE COMPLETO */}
                  <p
                    style={{
                      fontSize: 11,
                      lineHeight: "17px",
                      color: "#E2E8F0",
                      marginTop: 6,
                    }}
                  >
                    {probResult.summary}
                  </p>
                </div>

                <div style={{ marginTop: 8 }}>
                  <p
                    style={{
                      fontSize: 10,
                      ...mutedText,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 8,
                    }}
                  >
                    Canciones que más lo avalan
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {tracks.slice(0, 3).map((track) => (
                      <div
                        key={track.id}
                        style={{ display: "flex", alignItems: "center", gap: 12 }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "#0B1220",
                            border: "1px solid #1E293B",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {track.image && (
                            <img
                              src={track.image}
                              alt={track.name}
                              crossOrigin="anonymous" // 👈 para que html2canvas pueda usar la imagen
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}
                          >
                            {track.name}
                          </span>
                          <span style={{ fontSize: 11, ...mutedText }}>{track.artist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 14,
                    ...borderTop,
                    fontSize: 9,
                    ...mutedText2,
                  }}
                >
                  Generado con{" "}
                  <span style={{ fontWeight: 700, color: "#CBD5E1" }}>Probabify</span>{" "}
                  usando tu música top de Spotify.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* … la parte de comparación por periodos se mantiene igual,
            solo usa el nuevo handleDownloadCard y storyOuterStyle … */}
      </div>
    </main>
  );
}
