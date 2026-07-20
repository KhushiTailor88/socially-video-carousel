import { NextResponse } from "next/server";
import { recordShare } from "../../../lib/videos-data";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { videoId, platform } = body;

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 });
  }

  const result = recordShare(videoId, platform);
  if (!result) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
