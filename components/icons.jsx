"use client";

export const PlayIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

export const UnmuteIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 10v4h4l5 5V5L7 10H3z" />
    <path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" strokeWidth="1.6" fill="none" />
  </svg> 
);

export const MuteIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 10v4h4l5 5V5L7 10H3z" />
    <path
      d="M15.5 8.5a5 5 0 010 7M18 6a9 9 0 010 12"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export const HeartIcon = (props) => (
  <svg viewBox="0 0 24 24" fill={props.filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 21s-7.5-4.7-10-9.3C.5 8.1 2.4 5 5.9 5c2 0 3.4 1 4.7 2.6C11.9 6 13.3 5 15.3 5c3.5 0 5.4 3.1 3.9 6.7C19.5 16.3 12 21 12 21z" />
  </svg>
);

export const CommentIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M21 12a8 8 0 01-8 8H6l-3 3V12a8 8 0 018-8h2a8 8 0 018 8z" strokeLinejoin="round" />
  </svg>
);

export const ShareIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <circle cx="18" cy="5" r="2.4" />
    <circle cx="6" cy="12" r="2.4" />
    <circle cx="18" cy="19" r="2.4" />
    <path d="M8.2 10.8l7.6-4.2M8.2 13.2l7.6 4.2" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

export const ChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
