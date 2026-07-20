"use client";

export default function GridCard({ video }) {
  return (
    <div className="grid-card">
      <div className="grid-thumb">
        <img src={video.thumbnailUrl || video.thumbnail} alt={video.title} />
        <div className="duration">{video.durationSeconds ? `${Math.floor(video.durationSeconds / 60)}:${String(video.durationSeconds % 60).padStart(2, '0')}` : '03:20'}</div>
      </div>
      <div className="grid-meta">
        <div className="grid-title">{video.title}</div>
        <div className="grid-sub">@{video.creator || 'creator' } · {video.likes?.toLocaleString() || 0} likes</div>
      </div>
    </div>
  );
}
