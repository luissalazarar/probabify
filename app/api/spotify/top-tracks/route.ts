// app/api/spotify/top-tracks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// ⬇️ AJUSTA ESTA RUTA SEGÚN TU PROYECTO
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session as any).accessToken) {
      return NextResponse.json(
        { error: "No autenticado con Spotify" },
        { status: 401 }
      );
    }

    const accessToken = (session as any).accessToken as string;

    // 🔁 Leer periodo desde querystring
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "short_term"; // short_term | medium_term | long_term

    // ✅ Spotify permite hasta 50
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${range}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!spotifyRes.ok) {
      const err = await spotifyRes.json().catch(() => ({}));
      console.error("Error Spotify top tracks:", err);
      return NextResponse.json(
        { error: "Error obteniendo canciones desde Spotify" },
        { status: spotifyRes.status }
      );
    }

    const data = await spotifyRes.json();

    const tracks =
      (data.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.map((a: any) => a.name).join(", ") ?? "",
        album: item.album?.name ?? "",
        image:
          item.album?.images?.[0]?.url ??
          item.album?.images?.[1]?.url ??
          null,
        previewUrl: item.preview_url ?? null,
      })) ?? [];

    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error("Error en /api/spotify/top-tracks:", error);
    return NextResponse.json(
      { error: "Error interno en /api/spotify/top-tracks" },
      { status: 500 }
    );
  }
}
