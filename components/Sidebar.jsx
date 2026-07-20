"use client";

import { PlayIcon, HomeIcon, ExploreIcon, UploadIcon, LibraryIcon } from "./icons";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <PlayIcon />
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <HomeIcon style={{ width: 22, height: 22 }} />
          <span>Home</span>
        </button>
        <button className="nav-item">
          <ExploreIcon style={{ width: 22, height: 22 }} />
          <span>Explore</span>
        </button>
        <button className="nav-item">
          <UploadIcon style={{ width: 22, height: 22 }} />
          <span>Upload</span>
        </button>
        <button className="nav-item">
          <LibraryIcon style={{ width: 22, height: 22 }} />
          <span>Library</span>
        </button>
      </nav>
    </aside>
  );
}
