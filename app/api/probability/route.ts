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

    // 🔒 Validar que la pregunta esté en la lista blanca
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

    // Usamos hasta 20 canciones
    const tracksText = tracks
      .slice(0, 20)
      .map(
        (t, i) =>
          `${i + 1}. "${t.name}" – ${t.artist} (álbum: ${
            t.album ?? "N/A"
          })`
      )
      .join("\n");

    const systemPrompt =
      "Eres una IA que inventa probabilidades divertidas basadas en la música de una persona. " +
      "Responde siempre en español. No toques temas sensibles (autolesión, violencia sexual, odio, etc.). " +
      "Tu tarea es analizar la música y devolver una probabilidad divertida entre 0 y 100, más un pequeño texto.";

    const userPrompt = `
Pregunta del usuario: "${cleanedQuestion}"

Canciones más escuchadas de la persona:
${tracksText}

Responde SOLO en formato JSON válido con este formato EXACTO:
{
  "probability": 0-100 (número entero),
  "summary": "máx 4 líneas explicando por qué esa probabilidad encaja con la música",
  "shortLabel": "una versión corta de la pregunta, por ejemplo: 'volver con tu ex', 'superar a tu ex', etc."
}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
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
