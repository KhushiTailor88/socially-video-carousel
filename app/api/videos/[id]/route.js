import { NextResponse } from "next/server";
import { getVideoById } from "../../../../lib/videos-data";

export async function GET(_request, { params }) {
  const video = getVideoById(params.id);
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  return NextResponse.json(video);
}
