import "./globals.css";
import { PlayIcon } from "../components/icons";

export const metadata = {
  title: "Socially Approved",
  description: "A video carousel of the clips people are actually talking about.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-root">
          <aside className="sidebar">
            <div className="sidebar-top">
              <div className="logo"> <PlayIcon /> </div>
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

          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
