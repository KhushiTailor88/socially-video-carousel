import { getVideoById } from '../../../lib/videos-data';

export async function generateStaticParams() {
  // Keep this small — not strictly necessary for the demo, but helps pre-rendering.
  const videos = getVideoById ? [] : [];
  return [];
}

export default function VideoPage({ params }) {
  const { id } = params;
  const video = getVideoById(id);
  if (!video) {
    return (
      <div style={{ padding: 40, color: '#222' }}>
        <h1>Video not found</h1>
        <p>The video you requested could not be found.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 900, width: '100%' }}>
        <h1 style={{ marginBottom: 8 }}>{video.title}</h1>
        <div style={{ marginBottom: 16, color: '#666' }}>By @{video.creator}</div>
        <video
          controls
          style={{ width: '100%', borderRadius: 8, background: '#000' }}
          src={video.videoUrl}
        />
        <p style={{ marginTop: 12 }}>{video.description}</p>
      </div>
    </div>
  );
}
