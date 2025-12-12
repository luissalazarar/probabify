import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Safari se porta mejor con esto
        "User-Agent": "Mozilla/5.0",
      },
      cache: "force-cache",
    });

    if (!res.ok || !res.body) {
      return new NextResponse("Image fetch failed", { status: 500 });
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Error proxying image", { status: 500 });
  }
}
