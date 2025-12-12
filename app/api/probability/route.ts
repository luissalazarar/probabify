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

    // Usamos hasta 50 canciones
    const tracksText = tracks
      .slice(0, 50)
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
      "Cuando analices la música, prioriza el contenido, el mensaje y la letra conocida de las canciones " +
      "(la temática real de cada canción según tu conocimiento general), y usa el título o el nombre del álbum " +
      "solo como apoyo cuando no tengas clara la letra. " +
      "La probabilidad que devuelves debe ser un NÚMERO ENTERO entre 0 y 100, pero procura no usar siempre múltiplos de 5 " +
      "ni repetir siempre los mismos valores (como 35, 65, 75); elige números variados (por ejemplo 42, 67, 81, etc.). " +
      "Tu tarea es, a partir de esas canciones, devolver una probabilidad divertida entre 0 y 100, más un pequeño texto que explique la lógica.";

    const userPrompt = `
Pregunta del usuario: "${cleanedQuestion}"

Canciones más escuchadas de la persona (usa su letra/temática conocida, no solo el título):
${tracksText}

Instrucciones:
- Analiza principalmente el tono, la temática y el mensaje de la LETRA de estas canciones (según tu conocimiento general).
- Si no conoces la letra de alguna canción, puedes inferir un poco por el título, el artista o el estilo habitual del artista, pero sin inventar detalles concretos.
- Combina todo para estimar una probabilidad entre 0 y 100 coherente con el mood general de la música.
- Mantén un tono ligero, tipo horóscopo musical, sin dar consejos profesionales.

Responde SOLO en formato JSON válido con este formato EXACTO:
{
  "probability": 0-100,
  "summary": "máx 2 líneas explicando por qué esa probabilidad encaja con la música y su letra/mensaje",
  "shortLabel": "una versión corta de la pregunta, por ejemplo: 'volver con tu ex', 'superar a tu ex', etc."
}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1.0,
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
