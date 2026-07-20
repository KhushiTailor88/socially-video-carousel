import { NextResponse } from "next/server";
import { addComment } from "../../../lib/videos-data";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { videoId, user, text } = body;

  if (!videoId || !text) {
    return NextResponse.json({ error: "videoId and text are required" }, { status: 400 });
  }

  const comment = addComment(videoId, user, text);
  if (!comment) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(comment, { status: 201 });
}
