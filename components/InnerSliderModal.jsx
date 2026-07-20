"use client";

import { useEffect, useRef, useState } from "react";
import VideoPlayerCard from "./VideoPlayerCard";
import CommentsPanel from "./CommentsPanel";
import { CloseIcon, ChevronLeft, ChevronRight } from "./icons";

const SWIPE_THRESHOLD = 50;

export default function InnerSliderModal({ videos, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [commentsFor, setCommentsFor] = useState(null);
  const touchStartX = useRef(null);

  const goNext = () => setIndex((i) => Math.min(i + 1, videos.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -SWIPE_THRESHOLD) goNext();
    if (delta > SWIPE_THRESHOLD) goPrev();
    touchStartX.current = null;
  }

  // Only ever mount the 3 videos that are visibly on screen (prev / current /
  // next). Everything else in the 20-40 video set stays unmounted, which is
  // what keeps this performant regardless of how many videos exist.
  const visible = [index - 1, index, index + 1].filter((i) => i >= 0 && i < videos.length);

  return (
    <div className="modal-overlay" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <CloseIcon />
      </button>

      <div className="inner-slider">
        <button className="nav-arrow" onClick={goPrev} disabled={index === 0} aria-label="Previous video">
          <ChevronLeft />
        </button>

        <div className="player-track">
          {visible.map((i) => (
            <VideoPlayerCard
              key={videos[i].id}
              video={videos[i]}
              isCenter={i === index}
              onOpenComments={setCommentsFor}
            />
          ))}
        </div>

        <button
          className="nav-arrow"
          onClick={goNext}
          disabled={index === videos.length - 1}
          aria-label="Next video"
        >
          <ChevronRight />
        </button>
      </div>

      {commentsFor && <CommentsPanel video={commentsFor} onClose={() => setCommentsFor(null)} />}
    </div>
  );
}
