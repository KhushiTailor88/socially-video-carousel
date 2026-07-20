import { NextResponse } from "next/server";
import { getAllVideos } from "../../../lib/videos-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const videos = getAllVideos();
  return NextResponse.json({ total: videos.length, videos });
}
