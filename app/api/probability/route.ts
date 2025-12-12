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
  "¿Cuál es la probabilidad de volver con mi ex?",
  "¿Cuál es la probabilidad de superar a mi ex?",
  "¿Cuál es la probabilidad de renunciar a mi trabajo?",
  "¿Cuál es la probabilidad de ser toxico?",
  "¿Cuál es la probabilidad de entrar en una relacion toxica?",
  "¿Cuál es la probabilidad de empezar a valorarme?",
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
      return NextResponse.json(
        { error: "Falta la pregunta" },
        { status: 400 }
      );
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
    const tracksText = tracks
      .slice(0, 50)
      .map(
        (t, i) =>
          `${i + 1}. "${t.name}" – ${t.artist} (álbum: ${
            t.album ?? "N/A"
          })`
      )
      .join("\n");

    const systemPrompt = `
Eres una IA que analiza perfiles musicales y genera probabilidades ficticias pero coherentes.
Responde siempre en español.

Reglas importantes:
- Analiza TODAS las canciones proporcionadas.
- Identifica primero cuáles canciones representan MEJOR el mood dominante del usuario.
- No asumas que las primeras canciones son las más importantes.
- Basa tu probabilidad principalmente en las canciones más representativas del conjunto.
- Las demás canciones solo sirven como contexto secundario.
- Prioriza la temática y mensaje real de las letras (según tu conocimiento general).
- Evita temas sensibles (autolesión, violencia, odio, etc.).
- Devuelve un porcentaje ENTERO entre 0 y 100.
- Evita repetir siempre los mismos números (no abusar de 50, 75, 80).
- Tono ligero, tipo horóscopo musical. No des consejos profesionales.
`.trim();

    const userPrompt = `
Pregunta:
"${cleanedQuestion}"

Canciones más escuchadas (lista completa, no orden de importancia):
${tracksText}

Proceso obligatorio (interno):
1. Analiza TODAS las canciones.
2. Determina cuáles reflejan mejor el mood emocional dominante.
3. Basa la probabilidad principalmente en ese subconjunto representativo.
4. Usa el resto solo como apoyo contextual.

Responde SOLO en JSON válido con este formato EXACTO:
{
  "probability": 0-100,
  "summary": "máx 1.5 líneas explicando la lógica basada en el mood general",
  "shortLabel": "versión corta de la pregunta"
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

    return NextResponse.json({
      question: cleanedQuestion,
      probability,
      summary: parsed.summary ?? "",
      shortLabel: parsed.shortLabel ?? cleanedQuestion,
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
