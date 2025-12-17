// app/es/page.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type React from "react"; // for React.CSSProperties
import { signIn, signOut, useSession } from "next-auth/react";
import * as htmlToImage from "html-to-image";

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
  representativeTrackIds?: string[]; // 👈 new
};

type RangeKey = "short_term" | "medium_term" | "long_term";

const PRESET_QUESTIONS = [
  "¿Cuál es la probabilidad de volver con mi ex?",
  "¿Cuál es la probabilidad de superar a mi ex?",
  "¿Cuál es la probabilidad de renunciar a mi trabajo?",
  "¿Cuál es la probabilidad de ser tóxico?",
  "¿Cuál es la probabilidad de entrar en una relación tóxica?",
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
    subtitle: "Estado reciente",
    description:
      "Este periodo refleja lo que has escuchado más recientemente. Se enfoca en tu estado actual y tendencias inmediatas.",
  },
  medium_term: {
    label: "Últimos 6 meses",
    subtitle: "Tendencia de mediano plazo",
    description:
      "Este periodo muestra tus gustos sostenidos en el tiempo. Es un balance entre lo nuevo y lo que realmente sigues escuchando.",
  },
  long_term: {
    label: "Todo el tiempo",
    subtitle: "Tu esencia musical",
    description:
      "Este rango captura tu ADN musical: lo que más has escuchado en general y lo que mejor te define como oyente.",
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

async function nextPaintTwice() {
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
}

async function waitForImages(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    imgs.map(async (img) => {
      if (!img.src) return;

      if (img.complete && img.naturalWidth > 0) {
        if ("decode" in img) {
          try {
            // @ts-ignore
            await img.decode();
          } catch {}
        }
        return;
      }

      await new Promise<void>((resolve) => {
        const done = async () => {
          img.removeEventListener("load", done);
          img.removeEventListener("error", done);

          if ("decode" in img) {
            try {
              // @ts-ignore
              await img.decode();
            } catch {}
          }

          resolve();
        };

        img.addEventListener("load", done);
        img.addEventListener("error", done);
      });
    })
  );
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
  const periodsCardRef = useRef<HTMLDivElement | null>(null); // compatibility

  const [exportingPost, setExportingPost] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // ✅ cache for preloads
  const preloadCacheRef = useRef<Map<string, Promise<void>>>(new Map());

  function preloadImage(url: string) {
    const cache = preloadCacheRef.current;
    if (cache.has(url)) return cache.get(url)!;

    const p = new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        if ("decode" in img) {
          try {
            // @ts-ignore
            await img.decode();
          } catch {}
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });

    cache.set(url, p);
    return p;
  }

  async function preloadUrls(urls: string[]) {
    const unique = Array.from(new Set(urls.filter(Boolean)));
    await Promise.all(unique.map((u) => preloadImage(u)));
  }

  // ✅ Derive “most supporting” tracks from representativeTrackIds
  const supportingTracks = useMemo(() => {
    if (!probResult) return tracks.slice(0, 3);

    const ids = probResult.representativeTrackIds ?? [];
    if (!ids.length) return tracks.slice(0, 3);

    const map = new Map(tracks.map((t) => [t.id, t] as const));
    const picked = ids.map((id) => map.get(id)).filter(Boolean) as Track[];

    // fallback if something fails
    return picked.length ? picked : tracks.slice(0, 3);
  }, [probResult, tracks]);

  // ✅ Preload covers used in the exportable card
  useEffect(() => {
    const urls = supportingTracks.map((t) => t.image).filter(Boolean) as string[];
    if (urls.length) {
      preloadUrls(urls).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportingTracks]);

  // 1) Load tracks for the main period
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchTopTracks = async () => {
      try {
        setLoadingTracks(true);
        setErrorTracks(null);

        const res = await fetch(`/api/spotify/top-tracks?range=${selectedRange}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Error al traer las canciones");
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

  // 2) Single button: calculate main result + 3 periods
  async function handleCalculateAll() {
    try {
      if (!session) {
        setProbError("Conecta tu Spotify primero.");
        setComparisonError("Conecta tu Spotify primero.");
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
            const tracksRes = await fetch(
              `/api/spotify/top-tracks?range=${period.key}`
            );
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
            typeof probData.probability === "number"
              ? probData.probability
              : null;

          results.push({ key: period.key, probability });

          if (period.key === selectedRange && probability !== null) {
            mainResult = {
              question: probData.question,
              probability,
              summary: probData.summary,
              shortLabel: probData.shortLabel,
              representativeTrackIds: Array.isArray(probData.representativeTrackIds)
                ? probData.representativeTrackIds
                : [],
            };
          }
        } catch {
          results.push({ key: period.key, probability: null });
        }
      }

      setComparisonResults(results);

      if (!mainResult) {
        setProbError(
          "No se pudo calcular la probabilidad para el periodo seleccionado."
        );
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

  // 3) Export as PNG using html-to-image (ratio 360x640 → 1080x1920)
  async function handleDownloadCard(
    element: HTMLDivElement | null,
    filename: string
  ) {
    setExportError(null);

    if (!element) {
      setExportError("No se encontró la tarjeta para exportar.");
      return;
    }

    try {
      // ✅ 1) explicit preload (especially first time)
      const urls = supportingTracks.map((t) => t.image).filter(Boolean) as string[];
      if (urls.length) {
        await preloadUrls(urls);
      }

      // ✅ 2) wait for DOM to paint loaded images
      await nextPaintTwice();

      // ✅ 3) ensure <img> elements are fully loaded
      await waitForImages(element);

      // ✅ 4) export
      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        backgroundColor: undefined,
        width: 360,
        height: 640,
        pixelRatio: 3, // 360x640 * 3 = 1080x1920 (IG Story)
      });

      downloadDataUrl(dataUrl, filename);
    } catch (err: any) {
      console.error("Error exporting image:", err);
      setExportError(
        err?.message
          ? `No se pudo exportar: ${err.message}`
          : "No se pudo exportar la imagen."
      );
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#054d61] to-[#049990] text-slate-100">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  // Styles “safe” (HEX/RGB) for html-to-image
  const storyOuterStyle: React.CSSProperties = {
    width: 360,
    height: 640,
    borderRadius: 32,
    background: "linear-gradient(135deg, #054d61, #049990)",
    color: "#F8FAFC",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 24,
    gap: 16,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
  };

  const mutedText: React.CSSProperties = { color: "#D1E5F0" };
  const mutedText2: React.CSSProperties = { color: "#A8C6D8" };
  const borderTop: React.CSSProperties = { borderTop: "1px solid #1E293B" };

  const pillTop: React.CSSProperties = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#E2F3F8",
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#054d61] to-[#049990] text-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Probabify</h1>
          <p className="text-slate-100 max-w-xl mx-auto">
            Conecta tu Spotify, elige una pregunta y te devolveremos una probabilidad calculada por IA
            (inventada, pero coherente con tu música) lista para compartir.
          </p>
        </header>

        {/* ✅ Added: pre-login content so the page has indexable value before auth */}
        {!session && (
          <section className="bg-slate-950/50 rounded-2xl p-5 md:p-6 border border-slate-800/60">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  ¿Qué es Probabify?
                </h2>
                <p className="text-slate-200 mt-2 leading-relaxed">
                  Probabify es una herramienta divertida que convierte tu forma de escuchar Spotify en
                  una “probabilidad” compartible. Tú eliges una pregunta (amor, hábitos, ánimo,
                  decisiones) y generamos un número con una explicación corta que calza con tus top tracks.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">¿Cómo funciona?</h3>
                <ul className="mt-2 space-y-2 text-slate-200">
                  <li className="flex gap-2">
                    <span className="text-emerald-300 font-semibold">1.</span>
                    <span>
                      Conecta Spotify para leer tus canciones más escuchadas en distintos periodos.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-300 font-semibold">2.</span>
                    <span>
                      Elige una pregunta y un periodo (últimas semanas, últimos 6 meses o todo el tiempo).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-300 font-semibold">3.</span>
                    <span>
                      Calculamos una probabilidad + resumen y destacamos canciones “representativas”.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-300 font-semibold">4.</span>
                    <span>
                      Exporta la story como PNG y súbela donde quieras.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-sm font-semibold mb-1">Casos de uso</p>
                  <ul className="text-sm text-slate-200 space-y-1">
                    <li>• “¿Voy a superar a mi ex?”</li>
                    <li>• “¿Estoy por renunciar a mi trabajo?”</li>
                    <li>• “¿Mi ánimo está mejorando?”</li>
                    <li>• “¿Qué tan consistente es esto en el tiempo?”</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                  <p className="text-sm font-semibold mb-1">Nota</p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    El resultado es intencionalmente “inventado” para entretener — pero se genera de forma
                    consistente con tu perfil musical, así que se siente personal y compartible.
                  </p>
                </div>
              </div>

              {/* ✅ Added: FAQs (still pre-login) */}
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <h3 className="text-lg font-semibold">Preguntas frecuentes</h3>
                <div className="mt-3 space-y-3 text-slate-200">
                  <div>
                    <p className="text-sm font-semibold">¿Probabify es “exacto”?</p>
                    <p className="text-sm leading-relaxed">
                      No. Es un resultado divertido y compartible generado con tus patrones de escucha en Spotify.
                      El objetivo es entretenimiento + una story personalizada.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">¿Qué datos usan?</p>
                    <p className="text-sm leading-relaxed">
                      Tus top tracks de Spotify para el periodo seleccionado (últimas semanas, últimos 6 meses o todo el tiempo).
                      Con esa lista se genera la probabilidad y el resumen.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">¿Publican algo en mi Spotify?</p>
                    <p className="text-sm leading-relaxed">
                      No. La app solo lee tus top tracks (con tu permiso) y genera una imagen descargable.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">¿Puedo pedir nuevas preguntas o features?</p>
                    <p className="text-sm leading-relaxed">
                      Sí. Escríbenos al contacto de abajo e incluye ejemplos de preguntas que quieras que agreguemos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold mb-1">Contacto</p>
                <p className="text-sm text-slate-200">
                  Consultas, feedback o alianzas:{" "}
                  <a
                    href="mailto:contact@sarecorp.com"
                    className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                  >
                    contact@sarecorp.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="flex flex-col items-center gap-3">
          {!session && (
            <button
              onClick={() => signIn("spotify")}
              className="px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold transition"
            >
              Conectar con Spotify
            </button>
          )}

          {session && (
            <>
              <p className="text-sm text-slate-100">
                Sesión iniciada como{" "}
                <span className="font-semibold">
                  {session.user?.name ?? session.user?.email}
                </span>
              </p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-full border border-slate-100/60 text-slate-50 hover:bg-slate-100/10 transition text-xs"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </section>

        {session && (
          <section className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-slate-100/80">
              Selecciona el periodo de análisis
            </p>

            <div className="flex flex-wrap gap-3">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedRange(p.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                    selectedRange === p.key
                      ? "bg-emerald-400 text-slate-950 border-emerald-300"
                      : "border-slate-100/70 text-slate-50 hover:bg-slate-100/10"
                  }`}
                >
                  {PERIOD_DETAILS[p.key].label}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-100/90 leading-relaxed mt-1">
              {PERIOD_DETAILS[selectedRange].description}
            </p>
          </section>
        )}

        {session && (
          <section className="bg-slate-950/60 rounded-2xl p-4 md:p-5 border border-slate-800/60">
            <h2 className="text-lg font-semibold mb-2">
              Tus top tracks ({PERIOD_DETAILS[selectedRange].label})
            </h2>

            {loadingTracks && (
              <p className="text-slate-200 text-sm">Cargando canciones...</p>
            )}
            {errorTracks && (
              <p className="text-red-300 text-sm">{errorTracks}</p>
            )}

            {!loadingTracks && !errorTracks && tracks.length === 0 && (
              <p className="text-slate-200 text-sm">
                No encontramos top tracks para este periodo. Escucha algo en Spotify y vuelve a intentar.
              </p>
            )}

            <ul className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
              {tracks.slice(0, 50).map((track) => (
                <li
                  key={track.id}
                  className="flex items-center gap-3 bg-slate-900/80 rounded-xl px-3 py-2"
                >
                  {track.image && (
                    <img
                      crossOrigin="anonymous"
                      src={track.image}
                      alt={track.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{track.name}</span>
                    <span className="text-xs text-slate-300">
                      {track.artist} · {track.album}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {session && (
          <section className="bg-slate-950/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4 border border-slate-800/60">
            <h2 className="text-lg font-semibold">Calcula tu probabilidad</h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Pregunta predefinida</label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500"
                >
                  {PRESET_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCalculateAll}
                disabled={probLoading || comparisonLoading}
                className="mt-2 px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed self-start"
              >
                {probLoading || comparisonLoading
                  ? "Calculando probabilidades..."
                  : "Calcular probabilidad y comparar periodos"}
              </button>

              {probError && <p className="text-red-300 text-sm mt-1">{probError}</p>}
            </div>

            {probResult && (
              <>
                <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                      Resultado – {PERIOD_DETAILS[selectedRange].label}
                    </p>
                    <p className="text-xs text-slate-500 mb-1">
                      {PERIOD_DETAILS[selectedRange].subtitle}
                    </p>
                    <p className="text-sm text-slate-200 mb-1">
                      {probResult.question}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        {probResult.probability}%
                      </span>
                      <span className="text-slate-300 text-sm">
                        probabilidad según tu Spotify
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 mt-2">
                      {probResult.summary}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                      Canciones más representativas
                    </p>
                    <ul className="space-y-2">
                      {supportingTracks.map((track) => (
                        <li key={track.id} className="flex items-center gap-3 text-sm">
                          {track.image && (
                            <img
                              crossOrigin="anonymous"
                              src={track.image}
                              alt={track.name}
                              className="w-8 h-8 rounded-md object-cover"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold">{track.name}</span>
                            <span className="text-xs text-slate-400">{track.artist}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* POST VIEW */}
                <div className="mt-6 border-t border-slate-800 pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Vista previa del post
                    </p>

                    <button
                      type="button"
                      onClick={async () => {
                        setExportingPost(true);
                        await handleDownloadCard(
                          postCardRef.current,
                          "probabify_story_periodo.png"
                        );
                        setExportingPost(false);
                      }}
                      disabled={exportingPost}
                      className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {exportingPost ? "Exportando..." : "Exportar story de este periodo"}
                    </button>
                  </div>

                  {exportError && <p className="text-red-300 text-sm">{exportError}</p>}

                  {/* EXPORTABLE CARD */}
                  <div ref={postCardRef} style={storyOuterStyle}>
                    <div style={pillTop}>Probabify.com</div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        flex: 1,
                        minHeight: 0,
                      }}
                    >
                      <div style={{ flexShrink: 0, paddingTop: 2 }}>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#E2E8F0",
                            opacity: 0.9,
                            marginBottom: 8,
                          }}
                        >
                          {probResult.question}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 56,
                              fontWeight: 800,
                              lineHeight: "56px",
                            }}
                          >
                            {probResult.probability}%
                          </span>
                          <span style={{ fontSize: 12, color: "#E2E8F0" }}>
                            según tu Spotify
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          color: "#E2E8F0",
                          marginTop: 6,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {probResult.summary}
                      </p>
                    </div>

                    <div style={{ marginTop: 0 }}>
                      <p
                        style={{
                          fontSize: 10,
                          ...mutedText,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: 8,
                        }}
                      >
                        Canciones más representativas
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {supportingTracks.map((track) => (
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
                              {track.image ? (
                                <img
                                  crossOrigin="anonymous"
                                  src={track.image}
                                  alt={track.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : null}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#F8FAFC",
                                }}
                              >
                                {track.name}
                              </span>
                              <span style={{ fontSize: 11, ...mutedText }}>
                                {track.artist}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {comparisonResults && (
                      <div style={{ marginTop: 12 }}>
                        <p
                          style={{
                            fontSize: 10,
                            ...mutedText,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            marginBottom: 6,
                          }}
                        >
                          Resumen por periodo
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {comparisonResults.map((r) => (
                            <div
                              key={r.key}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    ...mutedText,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.12em",
                                  }}
                                >
                                  {PERIOD_DETAILS[r.key].label}
                                </span>
                                <span style={{ fontSize: 11, ...mutedText2 }}>
                                  {PERIOD_DETAILS[r.key].subtitle}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontSize: 20,
                                  fontWeight: 700,
                                  color: "#F8FAFC",
                                }}
                              >
                                {r.probability === null ? "—" : `${r.probability}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                      <span style={{ fontWeight: 700, color: "#CBD5E1" }}>
                        Probabify
                      </span>{" "}
                      usando tu top de Spotify.
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {session && (
          <section className="bg-slate-950/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4 border border-slate-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Compara la misma pregunta por periodo</h2>
                <p className="text-sm text-slate-200">
                  Calculamos la misma pregunta usando tu música de las últimas semanas, los últimos 6 meses y todo el tiempo.
                </p>
              </div>
            </div>

            {comparisonError && (
              <p className="text-red-300 text-sm mt-1">{comparisonError}</p>
            )}
            {comparisonLoading && (
              <p className="text-slate-200 text-sm">
                Calculando probabilidades para cada periodo...
              </p>
            )}

            {comparisonResults && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {comparisonResults.map((r) => (
                  <div
                    key={r.key}
                    className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-3 flex flex-col gap-1"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      {PERIOD_DETAILS[r.key].label}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-1">
                      {PERIOD_DETAILS[r.key].subtitle}
                    </p>
                    {r.probability === null ? (
                      <p className="text-xs text-slate-500">
                        No hay suficiente data para este periodo.
                      </p>
                    ) : (
                      <span className="text-3xl font-bold">{r.probability}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
