// Same-origin API routes -- no proxy, no CORS, no env var needed, since
// Next.js serves the frontend and the API from the same deployment.

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchVideos() {
  const res = await fetch("/api/videos", { cache: "no-store" });
  const data = await handle(res);
  return data.videos;
}

export async function likeVideo(videoId, userId) {
  const res = await fetch("/api/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, userId }),
  });
  return handle(res);
}

export async function shareVideo(videoId, platform) {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, platform }),
  });
  return handle(res);
}

export async function postComment(videoId, user, text) {
  const res = await fetch("/api/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, user, text }),
  });
  return handle(res);
}
