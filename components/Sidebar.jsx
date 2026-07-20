"use client";

import { PlayIcon } from "./icons";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <PlayIcon />
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">Home</button>
        <button className="nav-item">Explore</button>
        <button className="nav-item">Upload</button>
        <button className="nav-item">Library</button>
      </nav>

      <div className="sidebar-footer">
        <button className="sign-in">Sign In</button>
      </div>
    </aside>
  );
}
