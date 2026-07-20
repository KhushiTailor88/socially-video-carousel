# Socially Approved – Video Carousel (Next.js)

Same feature set as the original brief, rebuilt as a single Next.js app so
there's nothing separate to deploy: the App Router's Route Handlers replace
the Express backend, and the sample videos are served straight out of
`public/` — one Vercel project, no CORS, no proxy, no environment variables
to wire up.

```
socially-approved-next/
├── app/
│   ├── page.jsx              Home page (outer slider)
│   ├── layout.jsx            Root layout, fonts
│   ├── globals.css           Design tokens + all styles
│   └── api/
│       ├── videos/route.js              GET  /api/videos
│       ├── videos/[id]/route.js         GET  /api/videos/:id
│       ├── videos/[id]/comments/route.js GET /api/videos/:id/comments
│       ├── like/route.js                POST /api/like
│       ├── share/route.js               POST /api/share
│       └── comment/route.js             POST /api/comment
├── components/                Outer slider, inner slider modal, player card, comments panel
├── hooks/useIntersectionObserver.js
├── lib/
│   ├── videos-data.js         In-memory "database", seeded with 36 videos
│   └── api.js                 Client-side fetch wrappers (same-origin, no config needed)
└── public/
    ├── videos/sample_01..12.mp4   self-hosted sample clips (ffmpeg-generated, ~62KB each)
    └── thumbs/sample_01..12.jpg   matching thumbnails
```

## Run locally

```bash
npm install
npm run dev       # http://localhost:3000
```

That's it — one process, one port. No second terminal, no backend to start
separately.

## Deploy to Vercel

1. Push this folder to a GitHub repo (as the **repo root**, not nested
   inside another folder — Next.js apps deploy cleanly when `package.json`
   is at the root Vercel looks at).
2. Import the repo in Vercel. Framework preset auto-detects as **Next.js**.
   No Root Directory override, no environment variables, no build command
   changes needed — the defaults are already correct.
3. Deploy.

If your GitHub repo has this project inside a subfolder (e.g. alongside the
old `backend`/`frontend` folders from a previous attempt), set **Root
Directory** to that subfolder's name in Vercel's project settings — that's
the one setting that matters.

## Feature-to-code map

**Outer slider (20–40 videos, no lag)** — `components/OuterSlider.jsx` +
`VideoThumbCard.jsx`. Never mounts a real `<video>` per card; each card
lazily loads only a thumbnail `<img>` once it scrolls into view via
`IntersectionObserver` (`hooks/useIntersectionObserver.js`).

**Inner slider (modal, 3-up carousel)** — `components/InnerSliderModal.jsx`.
Only the previous/current/next video are ever mounted as real
`VideoPlayerCard`s; everything else in the 36-video catalog stays unmounted,
which is what keeps total active `<video>` elements far under the ~10
target regardless of catalog size. Supports touch swipe, arrow-key
navigation, and on-screen prev/next buttons.

**Per-video controls** — `components/VideoPlayerCard.jsx`:
- Lazy-loads its `src` only once it has entered the viewport at least once.
- Autoplays (muted, per browser policy) only while it's the centered card
  *and* actually intersecting the viewport; pauses immediately otherwise.
- Play/pause, mute/unmute, a click-to-seek progress bar, a loading spinner
  driven by the video element's `waiting`/`playing` events, and an
  error + **Retry** state (with an 8s stall-detection timeout) for any clip
  that fails or hangs — no more infinite spinners.
- Like button with optimistic UI, reconciled against `POST /api/like`.
- Share button opens a small menu (copy link, WhatsApp, Instagram, X) and
  posts to `POST /api/share`.
- Comment button opens `CommentsPanel.jsx`, listing existing comments and
  posting new ones via `POST /api/comment`.

## About the data layer

`lib/videos-data.js` is an in-memory store seeded with 36 videos on module
load — enough to demonstrate every required endpoint (`GET /api/videos`,
`POST /like`, `POST /share`, plus the optional `POST /comment`) without
needing a real database for this task.

**Production note:** on Vercel's serverless runtime, in-memory state isn't
guaranteed to persist across cold starts or be shared between instances, so
likes/comments/shares here are best-effort, not durable. When you're ready
to make that real, swap the functions in `lib/videos-data.js` (`getAllVideos`,
`toggleLike`, `recordShare`, `addComment`) for calls to a real database —
Vercel Postgres, MongoDB Atlas, Supabase, etc. all work well with Route
Handlers — and none of the API route files or frontend code need to change,
since they only talk to those function signatures.

## Regenerating the sample videos

The 12 sample clips are tiny synthetic test patterns generated with
`ffmpeg` (colored backgrounds + a tone + a label, no external footage). To
regenerate them or swap in real content, drop your own `.mp4`/`.jpg` files
into `public/videos` / `public/thumbs` following the `sample_NN.mp4`
naming convention, or edit `VIDEO_SOURCES`/`THUMB_SOURCES` in
`lib/videos-data.js` to point at different filenames or counts entirely.
