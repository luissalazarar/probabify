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

const PRESET_QUESTIONS = [
  "¿Cuál es la probabilidad de volver con mi ex?",
  "¿Cuál es la probabilidad de superar a mi ex?",
  "¿Cuál es la probabilidad de renunciar a mi trabajo?",
  "¿Cuál es la probabilidad de ser toxico?",
  "¿Cuál es la probabilidad de entrar en una relacion toxica?",
  "¿Cuál es la probabilidad de empezar a valorarme?",
];

export default function Home() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [errorTracks, setErrorTracks] = useState<string | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<string>(
    PRESET_QUESTIONS[0]
  );

  const [probLoading, setProbLoading] = useState(false);
  const [probError, setProbError] = useState<string | null>(null);
  const [probResult, setProbResult] = useState<ProbabilityResult | null>(null);

  // Obtener top tracks al autenticar
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchTopTracks = async () => {
      try {
        setLoadingTracks(true);
        setErrorTracks(null);

        const res = await fetch("/api/spotify/top-tracks");
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
  }, [status]);

  async function handleCalculateProbability() {
    try {
      if (!session) {
        setProbError("Primero conecta tu Spotify.");
        return;
      }

      if (tracks.length === 0) {
        setProbError("Necesitamos algunas canciones para analizar.");
        return;
      }

      const question = selectedPreset.trim();

      setProbLoading(true);
      setProbError(null);
      setProbResult(null);

      const res = await fetch("/api/probability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          tracks: tracks.map((t) => ({
            id: t.id,
            name: t.name,
            artist: t.artist,
            album: t.album,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.safeMessage || data.error || "Error calculando probabilidad");
      }

      setProbResult({
        question: data.question,
        probability: data.probability,
        summary: data.summary,
        shortLabel: data.shortLabel,
      });
    } catch (err: any) {
      console.error(err);
      setProbError(err.message || "Error inesperado");
    } finally {
      setProbLoading(false);
    }
  }

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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Probabify
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Conecta tu Spotify, elige una pregunta y te devolvemos
            una probabilidad inventada (pero coherente con tu música)
            lista para pantallazo y post.
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

        {/* Top tracks */}
        {session && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5">
            <h2 className="text-lg font-semibold mb-2">
              Tus canciones top (últimas semanas)
            </h2>

            {loadingTracks && (
              <p className="text-slate-300 text-sm">
                Cargando canciones...
              </p>
            )}

            {errorTracks && (
              <p className="text-red-400 text-sm">{errorTracks}</p>
            )}

            {!loadingTracks && !errorTracks && tracks.length === 0 && (
              <p className="text-slate-400 text-sm">
                No encontramos canciones top. Escucha algo en Spotify
                y vuelve a intentar.
              </p>
            )}

            <ul className="space-y-2 mt-2">
              {tracks.slice(0, 5).map((track) => (
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

        {/* Probabilidad */}
        {session && (
          <section className="bg-slate-900/60 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              Calcula tu probabilidad
            </h2>

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
                onClick={handleCalculateProbability}
                disabled={probLoading}
                className="mt-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed self-start"
              >
                {probLoading
                  ? "Calculando..."
                  : "Calcular probabilidad"}
              </button>

              {probError && (
                <p className="text-red-400 text-sm mt-1">
                  {probError}
                </p>
              )}
            </div>

            {probResult && (
              <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Resultado
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
                    Canciones que más lo avalan
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
      </div>
    </main>
  );
}
