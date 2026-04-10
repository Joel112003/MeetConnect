import React from "react";

const paths = {
  video: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  plus: ["M12 5v14", "M5 12h14"],
  link: [
    "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
    "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  ],
  clock: ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M12 6v6l4 2"],
  logout: [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9",
  ],
  chevron: ["M6 9l6 6 6-6"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  user: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ],
  arrowLeft: ["M19 12H5", "M12 19l-7-7 7-7"],
  calendar: ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  alert: [
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    "M12 9v4",
    "M12 17h.01",
  ],
  refresh: [
    "M23 4v6h-6",
    "M1 20v-6h6",
    "M3.51 9a9 9 0 0 1 14.85-3.36L23 10",
    "M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  ],
  check: ["M20 6L9 17l-5-5"],
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"],
  mic: ["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"],
  micOff: ["M2 2l20 20", "M9 9v3a3 3 0 0 0 5.12 2.12", "M15 9.34V4a3 3 0 0 0-5.94-.6", "M17 16.95A7 7 0 0 1 5 12v-2", "M19 10v2", "M12 19v4", "M8 23h8"],
  camera: ["M23 7l-7 5 7 5V7z", "M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z"],
  cameraOff: ["M2 2l20 20", "M23 7l-7 5 7 5V7z", "M17.6 17.6A2 2 0 0 1 16 19H3a2 2 0 0 1-2-2V7a2 2 0 0 1 .6-1.4", "M9.5 5H16a2 2 0 0 1 2 2v3.5"],
  screen: ["M2 3h20v14H2z", "M8 21h8", "M12 17v4"],
  screenOff: ["M2 3h20v14H2z", "M8 21h8", "M12 17v4", "M3 4l18 12"],
  phoneOff: ["M23 1L1 23", "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.78 3.53.98a2 2 0 0 1 1.6 2.33L21.77 20a2 2 0 0 1-2.18 1.6 19.79 19.79 0 0 1-8.45-3.77A19.79 19.79 0 0 1 3.37 9.27 2 2 0 0 1 4.97 7.1l2.43-.34a2 2 0 0 1 2.33 1.6c.2 1.23.53 2.41.98 3.53a2 2 0 0 1-.45 2.11L8.99 15.27"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0 8", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
};

export function AppIcon({ name, size = 18, className = "" }) {
  const iconPaths = paths[name];
  if (!iconPaths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
