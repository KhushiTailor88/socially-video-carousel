import "./globals.css";
import { PlayIcon } from "../components/icons";
import ClientWrapper from "../components/ClientWrapper";
import Sidebar from "../components/Sidebar";

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
          <Sidebar />

          <main className="main-content">
            <ClientWrapper>{children}</ClientWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
