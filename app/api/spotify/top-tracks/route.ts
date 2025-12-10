import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // sacamos el accessToken haciendo cast a any para evitar el error de tipos
    const accessToken = (session as any)?.accessToken as string | undefined;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No autenticado con Spotify" },
        { status: 401 }
      );
    }

    const res = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=100&time_range=short_term",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Error Spotify top tracks:", data);
      return NextResponse.json(
        { error: "Error al obtener top tracks de Spotify" },
        { status: 500 }
      );
    }

    const data = await res.json();

    const tracks =
      data.items?.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists?.map((a: any) => a.name).join(", ") ?? "",
        album: item.album?.name ?? "",
        image: item.album?.images?.[0]?.url ?? null,
        previewUrl: item.preview_url ?? null,
      })) ?? [];

    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error("Error en /api/spotify/top-tracks:", error);
    return NextResponse.json(
      { error: "Error interno en top-tracks" },
      { status: 500 }
    );
  }
}