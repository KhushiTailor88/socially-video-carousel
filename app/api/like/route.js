import { NextResponse } from "next/server";
import { toggleLike } from "../../../lib/videos-data";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { videoId } = body;
  const userId = body.userId || request.headers.get("x-forwarded-for") || "anon";

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 });
  }

  const result = toggleLike(videoId, userId);
  if (!result) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
