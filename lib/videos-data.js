// A tiny in-memory "database" so this demo doesn't need a real DB to run.
// Seeded once per server instance from the sample data below.
//
// IMPORTANT for production: on Vercel (serverless), this module can be
// re-initialized on cold starts and isn't shared across instances, so likes/
// comments/shares here are best-effort and NOT durable. Swap `store` for a
// real database (Postgres, MongoDB, etc.) behind the same function
// signatures below when you're ready to persist data for real.

const SAMPLE_COUNT = 12;
const VIDEO_SOURCES = Array.from(
  { length: SAMPLE_COUNT },
  (_, i) => `/videos/sample_${String(i + 1).padStart(2, "0")}.mp4`
);
const THUMB_SOURCES = Array.from(
  { length: SAMPLE_COUNT },
  (_, i) => `/thumbs/sample_${String(i + 1).padStart(2, "0")}.jpg`
);

const CREATORS = [
  "aarav.codes", "priya.travels", "kabir_fitness", "meera.eats", "dev_designs",
  "isha.dances", "rohan_tech", "nisha.styles", "vikram.vlogs", "ananya.art",
  "sahil_music", "tara.yoga", "arjun.cars", "diya.cooks", "karan.gaming",
];

const TITLES = [
  "Sunset road trip through the hills",
  "5 minute desk workout you can do anywhere",
  "How I built this in a weekend",
  "Street food tour, part 2",
  "Morning routine that changed my life",
  "Behind the scenes of the shoot",
  "This trick saved me hours every week",
  "Unboxing the new setup",
  "Quick recipe for busy weekdays",
  "Studio session, unreleased track",
  "Dance cover, first take",
  "Car detailing before and after",
  "Packing for a 2 week trip in one bag",
  "Sketching in the park today",
  "Level up your gaming setup",
  "Why I switched careers at 27",
  "Rainy day in the city",
  "Testing gear so you don't have to",
  "Weekend market finds",
  "A day in the life",
];

function pick(arr, i) {
  return arr[i % arr.length];
}

function buildVideos(count) {
  const videos = [];
  for (let i = 1; i <= count; i++) {
    videos.push({
      id: `vid_${String(i).padStart(3, "0")}`,
      title: pick(TITLES, i - 1),
      description:
        "Shared by the community. Tap in to watch the full clip, like it, or drop a comment.",
      creator: pick(CREATORS, i - 1),
      videoUrl: pick(VIDEO_SOURCES, i - 1),
      thumbnailUrl: pick(THUMB_SOURCES, i - 1),
      durationSeconds: 30 + ((i * 7) % 90),
      likes: 40 + ((i * 53) % 4000),
      shares: 2 + ((i * 11) % 300),
      comments: [
        {
          id: `c_${i}_1`,
          user: pick(CREATORS, i + 3),
          text: "This is so good!",
          createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
    });
  }
  return videos;
}

// `global` survives across hot-reloads/warm invocations in the same process,
// which keeps data stable during local dev instead of resetting on every
// file save.
const globalForStore = globalThis;
if (!globalForStore.__sociallyApprovedStore) {
  globalForStore.__sociallyApprovedStore = {
    videos: buildVideos(36),
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
