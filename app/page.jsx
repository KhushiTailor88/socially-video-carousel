"use client";

import { useEffect, useState } from "react";
import OuterSlider from "../components/OuterSlider";
import InnerSliderModal from "../components/InnerSliderModal";
import { fetchVideos } from "../lib/api";

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

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Community picks</p>
        <h1 className="app-title">Socially Approved</h1>
        <p className="app-subtitle">
          The clips people are actually talking about right now — tap any card to watch,
          like, comment, or share.
        </p>
      </header>

      {status === "loading" && <p className="status-line">Loading videos…</p>}
      {status === "error" && <p className="status-line">Couldn&apos;t load videos. Please refresh.</p>}

      {status === "ready" && <OuterSlider videos={videos} onOpen={setOpenIndex} />}

      {openIndex !== null && (
        <InnerSliderModal videos={videos} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}
