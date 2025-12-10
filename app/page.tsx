"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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

// Detalle extendido por periodo (para el texto tipo Receiptify)
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

export default function Home() {
  const { data: session, status } = useSession();

  // Periodo principal seleccionado
  const [selectedRange, setSelectedRange] = useState<RangeKey>("short_term");

  // Top tracks del periodo principal
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [errorTracks, setErrorTracks] = useState<string | null>(null);

  // Pregunta
  const [selectedPreset, setSelectedPreset] = useState<string>(
    PRESET_QUESTIONS[0]
  );

  // Resultado principal (periodo seleccionado)
  const [probLoading, setProbLoading] = useState(false);
  const [probError, setProbError] = useState<string | null>(null);
  const [probResult, setProbResult] = useState<ProbabilityResult | null>(null);

  // Comparación por periodos
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [comparisonResults, setComparisonResults] = useState<
    { key: RangeKey; probability: number | null }[] | null
  >(null);

  // 🔁 Cargar top tracks del periodo principal cuando cambie el rango o la sesión
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchTopTracks = async () => {
      try {
        setLoadingTracks(true);
        setErrorTracks(null);

        const res = await fetch(
          `/api/spotify/top-tracks?range=${selectedRange}`
        );
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

  // 🧮 ÚNICO BOTÓN:
  // Calcula probabilidad del periodo seleccionado + las 3 probabilidades por periodo
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

      const results: { key: RangeKey; probability: number | null }[] = [];
      let mainResult: ProbabilityResult | null = null;

      // Recorremos los 3 periodos.
      // Para el periodo seleccionado reutilizamos los tracks ya cargados.
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
              console.error(`Error obteniendo tracks de ${period.key}`);
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
            console.error(`Error calculando probabilidad para ${period.key}`);
            results.push({ key: period.key, probability: null });
            continue;
          }

          const probData = await probRes.json();
          const probability: number | null =
            typeof probData.probability === "number"
              ? probData.probability
              : null;

          results.push({ key: period.key, probability });

          // Si es el periodo seleccionado, ese es el resultado principal
          if (period.key === selectedRange && probability !== null) {
            mainResult = {
              question: probData.question,
              probability,
              summary: probData.summary,
              shortLabel: probData.shortLabel,
            };
          }
        } catch (innerErr) {
          console.error(`Error en periodo ${period.key}:`, innerErr);
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

  // Cargando sesión
  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Cargando sesión...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-950 text-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Probabify</h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Conecta tu Spotify, elige una pregunta y te devolvemos una
            probabilidad inventada (pero coherente con tu música) lista para
            pantallazo y post.
          </p>
        </header>

        {/* Auth */}
        <section className="flex flex-col items-center gap-3">
          {!session && (
            <button
              onClick={() => signIn("spotify")}
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition"
            >
              Conectar con Spotify
            </button>
          )}

          {session && (
            <>
              <p className="text-sm text-slate-300">
                Sesión iniciada como{" "}
                <span className="font-semibold">
                  {session.user?.name ?? session.user?.email}
                </span>
              </p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-full border border-slate-500 text-slate-200 hover:bg-slate-800 transition text-xs"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </section>

        {/* Selector de periodo principal – estilo Receiptify */}
        {session && (
          <section className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Selecciona el periodo de análisis
            </p>

            <div className="flex flex-wrap gap-3">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedRange(p.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                    selectedRange === p.key
                      ? "bg-emerald-500 text-slate-950 border-emerald-400"
                      : "border-slate-700 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {PERIOD_DETAILS[p.key].label}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mt-1">
              {PERIOD_DETAILS[selectedRange].description}
            </p>
          </section>
        )}

        {/* Top tracks del periodo seleccionado */}
        {session && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5">
            <h2 className="text-lg font-semibold mb-2">
              Tus canciones top ({PERIOD_DETAILS[selectedRange].label})
            </h2>

            {loadingTracks && (
              <p className="text-slate-300 text-sm">Cargando canciones...</p>
            )}

            {errorTracks && (
              <p className="text-red-400 text-sm">{errorTracks}</p>
            )}

            {!loadingTracks && !errorTracks && tracks.length === 0 && (
              <p className="text-slate-400 text-sm">
                No encontramos canciones top para este periodo. Escucha algo en
                Spotify y vuelve a intentar.
              </p>
            )}

            <ul className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
              {tracks.slice(0, 50).map((track) => (
                <li
                  key={track.id}
                  className="flex items-center gap-3 bg-slate-900 rounded-xl px-3 py-2"
                >
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {track.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {track.artist} · {track.album}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Probabilidad principal + botón único */}
        {session && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Calcula tu probabilidad</h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Pregunta predefinida
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500"
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
                className="mt-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed self-start"
              >
                {probLoading || comparisonLoading
                  ? "Calculando probabilidades..."
                  : "Calcular probabilidad y ver por periodos"}
              </button>

              {probError && (
                <p className="text-red-400 text-sm mt-1">{probError}</p>
              )}
            </div>

            {probResult && (
              <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Resultado – {PERIOD_DETAILS[selectedRange].label}
                  </p>
                  <p className="text-xs text-slate-500 mb-1">
                    {PERIOD_DETAILS[selectedRange].subtitle}
                  </p>
                  <p className="text-sm text-slate-300 mb-1">
                    {probResult.question}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {probResult.probability}%
                    </span>
                    <span className="text-slate-400 text-sm">
                      probabilidad según tu Spotify
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">
                    {probResult.summary}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                    Canciones que más lo avalan (ejemplo)
                  </p>
                  <ul className="space-y-2">
                    {tracks.slice(0, 3).map((track) => (
                      <li
                        key={track.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        {track.image && (
                          <img
                            src={track.image}
                            alt={track.name}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {track.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {track.artist}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Comparación por periodos – siempre visible */}
        {session && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              Comparar esta pregunta por periodos
            </h2>
            <p className="text-sm text-slate-300">
              Calculamos la misma pregunta usando tu música de las últimas
              semanas, los últimos 6 meses y todo el tiempo.
            </p>

            {comparisonError && (
              <p className="text-red-400 text-sm mt-1">
                {comparisonError}
              </p>
            )}

            {comparisonLoading && (
              <p className="text-slate-300 text-sm">
                Calculando probabilidades para cada periodo...
              </p>
            )}

            {comparisonResults && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {comparisonResults.map((r) => (
                  <div
                    key={r.key}
                    className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 flex flex-col gap-1"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {PERIOD_DETAILS[r.key].label}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-1">
                      {PERIOD_DETAILS[r.key].subtitle}
                    </p>
                    {r.probability === null ? (
                      <p className="text-xs text-slate-500">
                        Sin datos suficientes para este periodo.
                      </p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          {r.probability}%
                        </span>
                      </div>
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
