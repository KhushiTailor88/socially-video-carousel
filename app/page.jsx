"use client";

import { useEffect, useState } from "react";
import OuterSlider from "../components/OuterSlider";
import InnerSliderModal from "../components/InnerSliderModal";
import { fetchVideos } from "../lib/api";
import GridCard from "../components/GridCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchVideos()
      .then((data) => {
        setVideos(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    function onLike(e) {
      // refresh videos to reflect updated likes
      fetchVideos().then((data) => setVideos(data)).catch(() => {});
    }
    function onComment(e) {
      fetchVideos().then((data) => setVideos(data)).catch(() => {});
    }
    window.addEventListener("video:like:changed", onLike);
    window.addEventListener("video:comment:added", onComment);
    return () => {
      window.removeEventListener("video:like:changed", onLike);
      window.removeEventListener("video:comment:added", onComment);
    };
  }, []);

  return (
    <div className="app">
      <div className="dashboard-shell">
        <header className="app-header">
          <div className="hero-shell">
            <div className="hero-copy">
              <p className="eyebrow">Community picks</p>
              <h1 className="app-title">Socially Approved</h1>
              <p className="app-subtitle">
                The clips people are actually talking about right now — tap any card to watch,
                like, comment, or share.
              </p>
              <div className="hero-badges">
                <span className="pill">Live carousel</span>
                <span className="pill">Swipe-ready</span>
                <span className="pill">Like & share</span>
              </div>
            </div>

            <div className="hero-panel">
              <p className="hero-panel-title">Today&apos;s vibe</p>
              <div className="hero-panel-metric">
                <span className="metric-number">{videos.length || 12}</span>
                <span className="metric-label">curated clips</span>
              </div>
              <div className="hero-panel-row">
                <div>
                  <strong>4.9/5</strong>
                  <span>community rating</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>fresh stories</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {status === "loading" && <p className="status-line">Loading videos…</p>}
        {status === "error" && <p className="status-line">Couldn&apos;t load videos. Please refresh.</p>}

        {status === "ready" && (
          <>
            <section className="slider-section">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Discover</p>
                  <h2>Trending now</h2>
                </div>
                <span className="section-pill">Tap to open</span>
              </div>
              <OuterSlider videos={videos} onOpen={setOpenIndex} />
            </section>

            <section className="featured-grid">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Top picks</p>
                  <h2>Top picks for you this week</h2>
                </div>
                <button
                  className="section-pill"
                  onClick={() => {
                    try {
                      const el = document.querySelector('.grid-wrap');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } catch (e) {
                      /* noop */
                    }
                  }}
                >
                  See all
                </button>
              </div>
              <div className="grid-wrap">
                {videos.slice(0, 8).map((v) => (
                  <GridCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {openIndex !== null && (
        <InnerSliderModal videos={videos} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}
