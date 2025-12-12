// app/api/spotify/top-tracks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 🛑 Verificar sesión Spotify
    if (!session || !(session as any).accessToken) {
      return NextResponse.json(
        { error: "No autenticado con Spotify" },
        { status: 401 }
      );
    }

    const accessToken = (session as any).accessToken;

    // 🔁 Leer periodo desde querystring
    const url = new URL(req.url);
    const range = url.searchParams.get("range") ?? "short_term"; // default

    const validRanges = ["short_term", "medium_term", "long_term"];
    const timeRange = validRanges.includes(range) ? range : "short_term";

    // 🎯 Obtener top tracks (hasta 50)
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 🚨 Token expirado
    if (spotifyRes.status === 401) {
      console.error("⚠️ Spotify: token expirado");
      return NextResponse.json(
        {
          error:
            "Tu sesión de Spotify expiró. Cierra sesión y vuelve a iniciar.",
        },
        { status: 401 }
      );
    }

    if (!spotifyRes.ok) {
      const err = await spotifyRes.json().catch(() => ({}));
      console.error("⚠️ Error Spotify top tracks:", err);

      return NextResponse.json(
        { error: "Error obteniendo canciones desde Spotify" },
        { status: spotifyRes.status }
      );
    }

    const data = await spotifyRes.json();

    // 🎵 Normalizar tracks
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
    console.error("❌ Error en /api/spotify/top-tracks:", error);

    return NextResponse.json(
      { error: "Error interno en /api/spotify/top-tracks" },
      { status: 500 }
    );
  }
}
