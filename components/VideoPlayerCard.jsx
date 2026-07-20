"use client";

import { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { likeVideo, shareVideo } from "../lib/api";
import {
  PlayIcon,
  MuteIcon,
  UnmuteIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
} from "./icons";

const SHARE_PLATFORMS = ["Copy link", "WhatsApp", "Instagram", "X"];

export default function VideoPlayerCard({ video, isCenter, onOpenComments }) {
  const videoRef = useRef(null);
  const { elementRef, isIntersecting, hasEnteredOnce } = useIntersectionObserver({
    rootMargin: "100px",
    threshold: 0.4,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(video.likes);
  const [liked, setLiked] = useState(false);
  const [shares, setShares] = useState(video.shares);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Lazy-load: only attach a real src once the card has entered the viewport.
  const shouldLoad = hasEnteredOnce;

  // Some failed/blocked requests never fire the video element's `error`
  // event -- they just stall silently. This surfaces a stuck load as an
  // error instead of spinning forever with no explanation.
  useEffect(() => {
    if (!shouldLoad || hasError) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (videoRef.current && videoRef.current.readyState < 2) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [shouldLoad, loadAttempt, hasError]);

  function retryLoad() {
    setHasError(false);
    setIsLoading(true);
    setLoadAttempt((n) => n + 1);
    if (videoRef.current) videoRef.current.load();
  }

  // Play only the centered card, and only while it's actually in view —
  // this is what keeps active playing/decoding video elements to a minimum.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    if (isCenter && isIntersecting) {
      const playPromise = el.play();
      if (playPromise) playPromise.then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [isCenter, isIntersecting, shouldLoad]);

  function handleTimeUpdate() {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  }

  function handleSeek(e) {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
  }

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
  }

  async function handleLike() {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    try {
      const res = await likeVideo(video.id, "demo-user");
      setLikes(res.likes);
      setLiked(res.liked);
    } catch {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  }

  async function handleShare(platform) {
    setShareOpen(false);
    try {
      const res = await shareVideo(video.id, platform);
      setShares(res.shares);
    } catch {
      /* non-fatal for this demo */
    }
    if (platform === "Copy link") {
      const link = `${window.location.origin}/video/${video.id}`;
      try {
        await navigator.clipboard.writeText(link);
        setToast("Link copied");
      } catch {
        setToast(link);
      }
    } else {
      setToast(`Shared to ${platform}`);
    }
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <div ref={elementRef} className={`player-card ${isCenter ? "center" : "side"}`}>
      {shouldLoad && !hasError ? (
        <video
          ref={videoRef}
          src={`${video.videoUrl}${loadAttempt ? `?retry=${loadAttempt}` : ""}`}
          muted={isMuted}
          playsInline
          loop
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          onClick={togglePlay}
        />
      ) : (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {isLoading && shouldLoad && !hasError && (
        <div className="spinner">
          <div className="spinner-ring" />
        </div>
      )}

      {hasError && (
        <div className="spinner">
          <div style={{ textAlign: "center", color: "#fff", fontSize: 13, padding: "0 20px" }}>
            <div style={{ marginBottom: 10 }}>Couldn&apos;t load this video.</div>
            <button
              onClick={retryLoad}
              style={{
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {shouldLoad && !hasError && (
        <div className="progress-bar-track" onClick={handleSeek}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {shouldLoad && !hasError && (
        <button className="mute-btn" onClick={toggleMute} aria-label="Toggle mute">
          {isMuted ? <UnmuteIcon /> : <MuteIcon />}
        </button>
      )}

      {shouldLoad && !hasError && !isPlaying && !isLoading && (
        <button className="center-play-btn" onClick={togglePlay} aria-label="Play">
          <PlayIcon />
        </button>
      )}

      <div className="player-meta">
        <div className="handle">@{video.creator}</div>
        <div className="title">{video.title}</div>
      </div>

      {isCenter && (
        <div className="side-actions">
          <div>
            <button className={`action-btn ${liked ? "liked" : ""}`} onClick={handleLike} aria-label="Like">
              <HeartIcon filled={liked} />
            </button>
            <div className="action-count">{likes.toLocaleString()}</div>
          </div>
          <div>
            <button className="action-btn" onClick={() => onOpenComments(video)} aria-label="Comments">
              <CommentIcon />
            </button>
            <div className="action-count">{video.comments.length}</div>
          </div>
          <div style={{ position: "relative" }}>
            <button className="action-btn" onClick={() => setShareOpen((v) => !v)} aria-label="Share">
              <ShareIcon />
            </button>
            <div className="action-count">{shares.toLocaleString()}</div>
            {shareOpen && (
              <div className="share-menu">
                {SHARE_PLATFORMS.map((p) => (
                  <button key={p} onClick={() => handleShare(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
