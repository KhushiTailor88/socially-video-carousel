// A tiny in-memory "database" so this demo doesn't need a real DB to run.
// Seeded once per server instance from the sample data below.
//
// IMPORTANT for production: on Vercel (serverless), this module can be
// re-initialized on cold starts and isn't shared across instances, so likes/
// comments/shares here are best-effort and NOT durable. Swap `store` for a
// real database (Postgres, MongoDB, etc.) behind the same function
// signatures below when you're ready to persist data for real.

const USER_VIDEO_DATA = [
  {
    id: "video-1",
    title: "Sunset Drive",
    description: "A cinematic travel reel with rooftop views.",
    thumbnail: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 124,
    shares: 19,
    comments: ["Stunning!", "Love this shot."],
  },
  {
    id: "video-2",
    title: "City Nights",
    description: "Neon reflections and after-hours energy.",
    thumbnail: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 98,
    shares: 7,
    comments: [],
  },
  {
    id: "video-3",
    title: "Ocean Breeze",
    description: "Relaxing waves and sea foam.",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 145,
    shares: 12,
    comments: [],
  },
  {
    id: "video-4",
    title: "Adventure Loop",
    description: "Fast-paced clips from a mountain trail.",
    thumbnail: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 72,
    shares: 5,
    comments: [],
  },
  {
    id: "video-5",
    title: "Golden Hour",
    description: "Warm tones and gentle motion.",
    thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 133,
    shares: 10,
    comments: [],
  },
  {
    id: "video-6",
    title: "Coffee Run",
    description: "Quick morning routine in motion.",
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 88,
    shares: 4,
    comments: [],
  },
  {
    id: "video-7",
    title: "Weekend Market",
    description: "Color, texture, and street energy.",
    thumbnail: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 109,
    shares: 8,
    comments: [],
  },
  {
    id: "video-8",
    title: "Studio Session",
    description: "Music and visuals in a warm studio setup.",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 156,
    shares: 13,
    comments: [],
  },
  {
    id: "video-9",
    title: "Desert Glow",
    description: "A calm drive through warm landscapes.",
    thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 95,
    shares: 6,
    comments: [],
  },
  {
    id: "video-10",
    title: "Snowline",
    description: "Winter light and crisp mountain air.",
    thumbnail: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 121,
    shares: 9,
    comments: [],
  },
  {
    id: "video-11",
    title: "Palm View",
    description: "Sunlit tropical roads and scenery.",
    thumbnail: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 112,
    shares: 11,
    comments: [],
  },
  {
    id: "video-12",
    title: "Night Market",
    description: "Lights, lanterns, and late-night snacks.",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    likes: 137,
    shares: 15,
    comments: [],
  },
];

function buildVideos(data) {
  return data.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    creator: `creator_${String(index + 1).padStart(2, "0")}`,
    videoUrl: item.videoUrl,
    thumbnailUrl: item.thumbnail,
    durationSeconds: 24 + (index % 6) * 5,
    likes: item.likes ?? 0,
    shares: item.shares ?? 0,
    comments: (item.comments || []).map((comment, commentIndex) => ({
      id: `${item.id}_comment_${commentIndex + 1}`,
      user: "guest",
      text: typeof comment === "string" ? comment : comment.text,
      createdAt: new Date(Date.now() - (commentIndex + 1) * 3600_000).toISOString(),
    })),
    createdAt: new Date(Date.now() - (index + 1) * 86_400_000).toISOString(),
  }));
}

// `global` survives across hot-reloads/warm invocations in the same process,
// which keeps data stable during local dev instead of resetting on every
// file save.
const globalForStore = globalThis;
if (!globalForStore.__sociallyApprovedStore) {
  globalForStore.__sociallyApprovedStore = {
    videos: buildVideos(USER_VIDEO_DATA),
    likedBy: new Set(), // "videoId::userId"
  };
}
const store = globalForStore.__sociallyApprovedStore;

export function getAllVideos() {
  return store.videos;
}

export function getVideoById(id) {
  return store.videos.find((v) => v.id === id) || null;
}

export function toggleLike(videoId, userId) {
  const video = getVideoById(videoId);
  if (!video) return null;

  const key = `${videoId}::${userId}`;
  let liked;
  if (store.likedBy.has(key)) {
    store.likedBy.delete(key);
    video.likes = Math.max(0, video.likes - 1);
    liked = false;
  } else {
    store.likedBy.add(key);
    video.likes += 1;
    liked = true;
  }
  return { videoId, likes: video.likes, liked };
}

export function recordShare(videoId, platform) {
  const video = getVideoById(videoId);
  if (!video) return null;
  video.shares += 1;
  return { videoId, shares: video.shares, platform: platform || "unknown" };
}

export function addComment(videoId, user, text) {
  const video = getVideoById(videoId);
  if (!video) return null;
  const comment = {
    id: `c_${videoId}_${Date.now()}`,
    user: user || "guest",
    text: String(text).slice(0, 500),
    createdAt: new Date().toISOString(),
  };
  video.comments.push(comment);
  return comment;
}
