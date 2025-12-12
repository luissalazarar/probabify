// app/api/probability/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
};

// 🎯 LISTA BLANCA – SOLO ESTAS PREGUNTAS SON PERMITIDAS
const allowedQuestions = [
  // ES
  "¿Cuál es la probabilidad de volver con mi ex?",
  "¿Cuál es la probabilidad de superar a mi ex?",
  "¿Cuál es la probabilidad de renunciar a mi trabajo?",
  "¿Cuál es la probabilidad de ser toxico?",
  "¿Cuál es la probabilidad de entrar en una relacion toxica?",
  "¿Cuál es la probabilidad de empezar a valorarme?",

  // EN
  "What is the probability of getting back with my ex?",
  "What is the probability of getting over my ex?",
  "What is the probability of quitting my job?",
  "What is the probability of being toxic?",
  "What is the probability of getting into a toxic relationship?",
  "What is the probability of starting to value myself?",
];

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no configurada en el servidor" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { question, tracks } = body as {
      question?: string;
      tracks?: Track[];
    };

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Falta la pregunta" }, { status: 400 });
    }

    const cleanedQuestion = question.trim();

    // 🔒 Validar whitelist
    if (!allowedQuestions.includes(cleanedQuestion)) {
      return NextResponse.json(
        {
          error: "Pregunta no permitida",
          safeMessage:
            "Solo puedes usar las preguntas preestablecidas disponibles en la aplicación.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json(
        { error: "Faltan las canciones para analizar" },
        { status: 400 }
      );
    }

    // 🔹 Hasta 50 canciones
    const trimmedTracks = tracks.slice(0, 50);

    // OJO: incluimos ID en el texto para que el modelo pueda referenciarlos
    const tracksText = trimmedTracks
      .map(
        (t, i) =>
          `${i + 1}. [id:${t.id}] "${t.name}" – ${t.artist} (álbum: ${
            t.album ?? "N/A"
          })`
      )
      .join("\n");

    const idList = trimmedTracks.map((t) => t.id).join(", ");

    const isEnglish = cleanedQuestion.startsWith("What ");

    const systemPrompt = `
Eres una IA que analiza perfiles musicales y genera probabilidades ficticias pero coherentes.

Idioma:
- Si la pregunta está en inglés, responde en inglés.
- Si la pregunta está en español, responde en español.

Reglas importantes:
- Analiza TODAS las canciones proporcionadas.
- Identifica cuáles canciones representan MEJOR el mood dominante del usuario.
- No asumas que las primeras canciones son las más importantes.
- Basa tu probabilidad principalmente en las canciones más representativas del conjunto.
- Prioriza la temática y mensaje real de las letras (según tu conocimiento general).
- Evita temas sensibles (autolesión, violencia, odio, etc.).
- Devuelve un porcentaje ENTERO entre 0 y 100.
- Evita repetir siempre los mismos números (no abusar de 50, 75, 80).
- Tono ligero, tipo horóscopo musical. No des consejos profesionales.

Salida obligatoria:
- Además de probability/summary/shortLabel, debes devolver representativeTrackIds:
  un arreglo de EXACTAMENTE 3 ids (strings) tomados ÚNICAMENTE de la lista permitida.
`.trim();

    const userPrompt = `
Question:
"${cleanedQuestion}"

Top tracks (full list; order does NOT imply importance):
${tracksText}

Allowed IDs (you can ONLY pick from here):
${idList}

Instructions:
- Pick EXACTLY 3 songs that best represent the dominant mood and that most “support” the probability.
- Return their ids in representativeTrackIds (they must exist in the allowed list).
- Do not invent ids.

Respond ONLY in valid JSON with this EXACT format:
{
  "probability": 0-100,
  "summary": "max 1.5 lines explaining the logic based on overall mood",
  "shortLabel": "short version of the question",
  "representativeTrackIds": ["id1","id2","id3"]
}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1.05,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = JSON.parse(
        content.replace(/```json/gi, "").replace(/```/g, "").trim()
      );
    }

    const probability = Math.min(
      100,
      Math.max(0, Math.round(parsed.probability ?? 0))
    );

    // Validar representativeTrackIds
    const allowedIdSet = new Set(trimmedTracks.map((t) => t.id));
    const repIdsRaw: unknown = parsed.representativeTrackIds;

    let representativeTrackIds: string[] = [];
    if (Array.isArray(repIdsRaw)) {
      representativeTrackIds = repIdsRaw
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter((x) => x && allowedIdSet.has(x));
    }

    // Queremos EXACTAMENTE 3 ids. Si faltan, rellenamos con tracks del set.
    if (representativeTrackIds.length < 3) {
      const fallback = trimmedTracks.map((t) => t.id);
      for (const id of fallback) {
        if (!representativeTrackIds.includes(id)) {
          representativeTrackIds.push(id);
        }
        if (representativeTrackIds.length === 3) break;
      }
    } else if (representativeTrackIds.length > 3) {
      representativeTrackIds = representativeTrackIds.slice(0, 3);
    }

    return NextResponse.json({
      question: cleanedQuestion,
      probability,
      summary: parsed.summary ?? "",
      shortLabel: parsed.shortLabel ?? cleanedQuestion,
      representativeTrackIds,
      modelRaw: content,
    });
  } catch (error: any) {
    console.error("Error en /api/probability:", error);

    return NextResponse.json(
      {
        error: "Error interno en /api/probability",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
