"use client";

import VideoThumbCard from "./VideoThumbCard";

export default function OuterSlider({ videos, onOpen }) {
  return (
    <div className="outer-slider-wrap">
      <div className="outer-slider">
        {videos.map((video, index) => (
          <VideoThumbCard key={video.id} video={video} onOpen={() => onOpen(index)} />
        ))}
      </div>
    </div>
  );
}
