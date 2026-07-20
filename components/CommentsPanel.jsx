"use client";

import { useState } from "react";
import { postComment } from "../lib/api";

export default function CommentsPanel({ video, onClose }) {
  const [comments, setComments] = useState(video.comments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const comment = await postComment(video.id, "you", text.trim());
      setComments((prev) => [...prev, comment]);
      setText("");
      try {
        window.dispatchEvent(new CustomEvent("video:comment:added", { detail: { videoId: video.id, comment } }));
      } catch (e) {}
    } catch {
      // keep the draft text so the user can retry
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="comments-panel">
      <button className="close-panel" onClick={onClose} aria-label="Close comments">
        ×
      </button>
      <h3>Comments · {comments.length}</h3>
      <div className="comments-list">
        {comments.map((c) => (
          <div className="comment-item" key={c.id}>
            <div className="user">@{c.user}</div>
            <div className="text">{c.text}</div>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          maxLength={500}
        />
        <button type="submit" disabled={posting}>
          Post
        </button>
      </form>
    </div>
  );
}
