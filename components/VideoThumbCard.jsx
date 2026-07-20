"use client";

import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { PlayIcon, HeartIcon } from "./icons";

// The outer slider intentionally never mounts a <video> element per card —
// with 20-40 items that would tank performance. It only lazy-loads a
// thumbnail image once the card scrolls into view, and hands off to the
// Inner Slider modal (which does the real video playback) on click.
export default function VideoThumbCard({ video, onOpen }) {
  const { elementRef, hasEnteredOnce } = useIntersectionObserver({
    root: null,
    rootMargin: "200px",
    threshold: 0.01,
  });

  return (
    <div className="outer-card" ref={elementRef} onClick={onOpen}>
      {hasEnteredOnce ? (
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
      ) : (
        <div className="thumb-skeleton" />
      )}
      <div className="play-badge">
        <PlayIcon color="#fff" />
      </div>
      <div className="card-meta">
        <div className="handle">@{video.creator}</div>
        <div className="likes">
          <HeartIcon width={12} height={12} filled />
          {video.likes.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
