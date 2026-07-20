"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";

// Inline brand SVGs copied from main branch — no CDN dependency
const SlackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipRule="evenodd" fillRule="evenodd">
      <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0" />
      <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d" />
      <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e" />
      <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a" />
    </g>
  </svg>
);

const GoogleMeetIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 622 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#meetClip)">
      <path d="M351.419 255.568L411.978 324.79L493.418 376.827L507.584 256.005L493.418 137.908L410.418 183.621L351.419 255.568Z" fill="#00832D" />
      <path d="M0.00283051 365.583V468.541C0.00283051 492.049 19.0851 511.136 42.5983 511.136H145.556L166.876 433.344L145.556 365.583L74.9198 344.263L0.00283051 365.583Z" fill="#0066DA" />
      <path d="M145.556 0L0.00283051 145.554L74.9247 166.822L145.556 145.554L166.488 78.7145L145.556 0Z" fill="#E94235" />
      <path d="M0.00526047 365.629H145.556V145.551H0.00526047V365.629Z" fill="#2684FC" />
      <path d="M586.398 61.6293L493.416 137.91V376.827L586.782 453.404C600.758 464.352 621.204 454.374 621.204 436.607V78.0861C621.204 60.1224 600.271 50.193 586.396 61.6317" fill="#00AC47" />
      <path d="M351.419 255.568V365.583H145.556V511.136H450.825C474.338 511.136 493.418 492.049 493.418 468.541V376.827L351.419 255.568Z" fill="#00AC47" />
      <path d="M450.825 0H145.556V145.554H351.419V255.568L493.42 137.905V42.5979C493.42 19.0847 474.338 0 450.825 0" fill="#FFBA00" />
    </g>
    <defs>
      <clipPath id="meetClip"><rect width="621.2" height="512" fill="white" /></clipPath>
    </defs>
  </svg>
);

const ZoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256" {...props}>
    <defs>
      <linearGradient id="zoomA" x1="23.666%" x2="76.334%" y1="95.6118%" y2="4.3882%">
        <stop offset=".00006%" stopColor="#0845BF" />
        <stop offset="50%" stopColor="#0B5CFF" />
        <stop offset="100%" stopColor="#4F90EE" />
      </linearGradient>
    </defs>
    <path fill="url(#zoomA)" d="M256 128c0 13.568-1.024 27.136-3.328 40.192-6.912 43.264-41.216 77.568-84.48 84.48C155.136 254.976 141.568 256 128 256c-13.568 0-27.136-1.024-40.192-3.328-43.264-6.912-77.568-41.216-84.48-84.48C1.024 155.136 0 141.568 0 128c0-13.568 1.024-27.136 3.328-40.192 6.912-43.264 41.216-77.568 84.48-84.48C100.864 1.024 114.432 0 128 0c13.568 0 27.136 1.024 40.192 3.328 43.264 6.912 77.568 41.216 84.48 84.48C254.976 100.864 256 114.432 256 128Z" />
    <path fill="#FFF" d="M204.032 207.872H75.008c-8.448 0-16.64-4.608-20.48-12.032-4.608-8.704-2.816-19.2 4.096-26.112l89.856-89.856H83.968c-17.664 0-32-14.336-32-32h118.784c8.448 0 16.64 4.608 20.48 12.032 4.608 8.704 2.816 19.2-4.096 26.112l-89.6 90.112h74.496c17.664 0 32 14.08 32 31.744Z" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#181717" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const ConfluenceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="confA" x1="27.4" y1="25.5" x2="14.9" y2="18.3" gradientUnits="userSpaceOnUse">
        <stop offset=".18" stopColor="#0052CC" /><stop offset="1" stopColor="#2684FF" />
      </linearGradient>
      <linearGradient id="confB" x1="4.6" y1="6.5" x2="17.1" y2="13.7" gradientUnits="userSpaceOnUse">
        <stop offset=".18" stopColor="#0052CC" /><stop offset="1" stopColor="#2684FF" />
      </linearGradient>
    </defs>
    <path fill="url(#confA)" d="M4.7 23.6c-.3.5-.6 1-.9 1.4-.2.4-.1.9.3 1.2l5.9 3.6c.4.3 1 .1 1.2-.3.2-.4.5-.9.8-1.4 2.4-3.9 4.8-3.4 9.2-1.3l5.8 2.8c.4.2 1 0 1.2-.4l2.8-6.4c.2-.4 0-1-.4-1.2-1.2-.6-3.7-1.7-5.9-2.8-7.9-3.8-14.6-3.6-19 4z" />
    <path fill="url(#confB)" d="M27.3 8.4c.3-.5.6-1 .9-1.4.2-.4.1-.9-.3-1.2L22 2.2c-.4-.3-1-.2-1.2.3-.2.4-.5.9-.8 1.4-2.4 3.9-4.8 3.4-9.2 1.3L5 2.3c-.4-.2-1 0-1.2.4L1 9.2c-.2.4 0 1 .4 1.2 1.2.6 3.7 1.7 5.9 2.8 8 3.8 14.7 3.5 19-4z" />
  </svg>
);

const AwsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 182" {...props}>
    <path fill="#252f3e" d="m86 66 2 9c0 3 1 5 3 8v2l-1 3-7 4-2 1-3-1-4-5-3-6c-8 9-18 14-29 14-9 0-16-3-20-8-5-4-8-11-8-19s3-15 9-20c6-6 14-8 25-8a79 79 0 0 1 22 3v-7c0-8-2-13-5-16-3-4-8-5-16-5l-11 1a80 80 0 0 0-14 5h-2c-1 0-2-1-2-3v-5l1-3c0-1 1-2 3-2l12-5 16-2c12 0 20 3 26 8 5 6 8 14 8 25v32zM46 82l10-2c4-1 7-4 10-7l3-6 1-9v-4a84 84 0 0 0-19-2c-6 0-11 1-15 4-3 2-4 6-4 11s1 8 3 11c3 2 6 4 11 4zm80 10-4-1-2-3-23-78-1-4 2-2h10l4 1 2 4 17 66 15-66 2-4 4-1h8l4 1 2 4 16 67 17-67 2-4 4-1h9c2 0 3 1 3 2v2l-1 2-24 78-2 4-4 1h-9l-4-1-1-4-16-65-15 64-2 4-4 1h-9zm129 3a66 66 0 0 1-27-6l-3-3-1-2v-5c0-2 1-3 2-3h2l3 1a54 54 0 0 0 23 5c6 0 11-2 14-4 4-2 5-5 5-9l-2-7-10-5-15-5c-7-2-13-6-16-10a24 24 0 0 1 5-34l10-5a44 44 0 0 1 20-2 110 110 0 0 1 12 3l4 2 3 2 1 4v4c0 3-1 4-2 4l-4-2c-6-2-12-3-19-3-6 0-11 0-14 2s-4 5-4 9c0 3 1 5 3 7s5 4 11 6l14 4c7 3 12 6 15 10s5 9 5 14l-3 12-7 8c-3 3-7 5-11 6l-14 2z" />
    <path d="M274 144A220 220 0 0 1 4 124c-4-3-1-6 2-4a300 300 0 0 0 263 16c5-2 10 4 5 8z" fill="#f90" />
    <path d="M287 128c-4-5-28-3-38-1-4 0-4-3-1-5 19-13 50-9 53-5 4 5-1 36-18 51-3 2-6 1-5-2 5-10 13-33 9-38z" fill="#f90" />
  </svg>
);

const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022" />
    <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00" />
    <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF" />
    <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900" />
  </svg>
);

const GitLabIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m31.46 12.78-.04-.12-4.35-11.35A1.14 1.14 0 0 0 25.94.6c-.24 0-.47.1-.66.24-.19.15-.33.36-.39.6l-2.94 9h-11.9l-2.94-9A1.14 1.14 0 0 0 6.07.58a1.15 1.15 0 0 0-1.14.72L.58 12.68l-.05.11a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48 6.67-5h.02a8.09 8.09 0 0 0 2.7-9.36Z" fill="#E24329" />
    <path d="m31.46 12.78-.04-.12a14.75 14.75 0 0 0-5.86 2.64l-9.55 7.24 6.09 4.6 6.67-5h.02a8.09 8.09 0 0 0 2.67-9.36Z" fill="#FC6D26" />
    <path d="m9.9 27.14 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48-6.1-4.6-6.07 4.6Z" fill="#FCA326" />
    <path d="M6.44 15.3a14.71 14.71 0 0 0-5.86-2.63l-.05.12a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 6.1-4.6-9.56-7.24Z" fill="#FC6D26" />
  </svg>
);

const NotionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="5" fill="#000" />
    <path d="M8 16.5V7.5l8 9V7.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const JiraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.6 2 4 9.6l3 3L11.6 8l4.6 4.6 3-3z" fill="#2684FF" />
    <path d="M11.6 22 19.2 14.4l-3-3L11.6 16 7 11.4l-3 3z" fill="#0052CC" />
  </svg>
);

const LinearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="50" fill="#5E6AD2" />
    <path d="M17.45 62.04 37.96 82.55A37.5 37.5 0 0 1 17.45 62.04ZM15 52.78l32.22 32.22a37.74 37.74 0 0 1-7.48-2.08L17.08 60.26A37.74 37.74 0 0 1 15 52.78ZM16.33 43.06l40.61 40.61a37.56 37.56 0 0 1-5.42 1.37L17.7 48.48a37.56 37.56 0 0 1 1.37-5.42H16.33ZM20.5 34.97 65.03 79.5a37.61 37.61 0 0 1-4.04 2.26L18.24 39.01a37.61 37.61 0 0 1 2.26-4.04ZM26.45 28.33l45.22 45.22A37.5 37.5 0 0 1 68.5 76L24 31.5a37.5 37.5 0 0 1 2.45-3.17ZM33.91 23.28l42.81 42.81A37.52 37.52 0 0 1 74 69.54L30.46 26A37.52 37.52 0 0 1 33.91 23.28ZM42.8 19.8l37.4 37.4A37.5 37.5 0 0 1 77.9 61L39 22.1a37.5 37.5 0 0 1 3.8-2.3ZM52.78 18l29.22 29.22a37.74 37.74 0 0 1-2.08 7.48L47.3 20.08A37.74 37.74 0 0 1 52.78 18ZM62.04 17.45A37.5 37.5 0 0 1 82.55 37.96L37.96 82.55A37.5 37.5 0 0 1 17.45 62.04L62.04 17.45Z" fill="white" />
  </svg>
);

// Tools Jarvis connects to — scattered around the viewport
const TOOLS: Array<{
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  top: string;
  left: string;
  size: number;
  delay: number;
}> = [
  { name: "Slack",       Icon: SlackIcon,      top: "18%", left: "8%",  size: 54, delay: 0    },
  { name: "Microsoft",   Icon: MicrosoftIcon,  top: "12%", left: "17%", size: 54, delay: 0.5  },
  { name: "Zoom",        Icon: ZoomIcon,       top: "10%", left: "79%", size: 54, delay: 1.0  },
  { name: "Google Meet", Icon: GoogleMeetIcon, top: "19%", left: "87%", size: 54, delay: 0.3  },
  { name: "AWS",         Icon: AwsIcon,        top: "47%", left: "9%",  size: 54, delay: 0.8  },
  { name: "Linear",      Icon: LinearIcon,     top: "47%", left: "89%", size: 54, delay: 1.1  },
  { name: "GitHub",      Icon: GitHubIcon,     top: "69%", left: "8%",  size: 54, delay: 0.2  },
  { name: "Notion",      Icon: NotionIcon,     top: "77%", left: "29%", size: 54, delay: 1.2  },
  { name: "GitLab",      Icon: GitLabIcon,     top: "85%", left: "27%", size: 54, delay: 0.6  },
  { name: "Confluence",  Icon: ConfluenceIcon, top: "79%", left: "68%", size: 54, delay: 0.9  },
  { name: "Jira",        Icon: JiraIcon,       top: "77%", left: "87%", size: 54, delay: 0.4  },
];

function ToolIcon({
  name, Icon, top, left, size, delay,
}: (typeof TOOLS)[number]) {
  const iconSize = Math.round(size * 0.58);
  return (
    <div
      aria-label={name}
      className="absolute hidden sm:flex items-center justify-center rounded-[22%] bg-white"
      style={{
        top, left,
        width: size, height: size,
        boxShadow: "0 2px 12px rgba(10,13,18,0.08), 0 1px 3px rgba(10,13,18,0.06)",
        animation: `float 3.6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon width={iconSize} height={iconSize} />
    </div>
  );
}

export function ScrubHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startLoop = () => {
      const tick = () => {
        const v = videoRef.current;
        if (v && v.duration && !v.seeking) {
          const target = targetTimeRef.current;
          if (Math.abs(target - v.currentTime) > 0.001) {
            try { v.currentTime = target; } catch (_) {}
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleLoaded = () => { setReady(true); startLoop(); };

    if (video.readyState >= 1) handleLoaded();
    else video.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const setTargetFromX = (clientX: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const ratio = Math.min(Math.max(clientX / window.innerWidth, 0), 1);

    // Piecewise mapping: skips idle center at t=0–1.5 s so far-left cursor
    // shows the left animation rather than the idle/center pose.
    // Center of screen → center pose (~t=6.5 s), extremes → animation peaks.
    const LEFT_START = 1.5;
    const CENTER_TIME = 6.5;
    const end = video.duration - 1 / 48;

    targetTimeRef.current = ratio <= 0.5
      ? LEFT_START + (ratio / 0.5) * (CENTER_TIME - LEFT_START)
      : CENTER_TIME + ((ratio - 0.5) / 0.5) * (end - CENTER_TIME);
  };

  return (
    <section
      onMouseMove={(e) => setTargetFromX(e.clientX)}
      onTouchMove={(e) => e.touches.length && setTargetFromX(e.touches[0].clientX)}
      style={{ cursor: "ew-resize", backgroundColor: "#FAFDFC" }}
      className="relative min-h-[100dvh] w-screen overflow-hidden"
    >
      {/* Video — robot scrub */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] ease-in-out"
        style={{ opacity: ready ? 1 : 0, transform: "translateY(6%)" }}
      >
        <source src="/robot-scrub-keyframes.mp4" type="video/mp4" />
      </video>

      {/* Floating tool icons */}
      {TOOLS.map((t) => <ToolIcon key={t.name} {...t} />)}

      {/* Hero copy — sits in the upper third, clear of the robot */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center pb-[44vh] px-6">
        <h1 className="font-display text-balance text-center text-[44px] font-semibold leading-[1.12] tracking-[-0.88px] text-coal-ink sm:text-[56px] sm:tracking-[-1.12px]">
          Slack threads. Meeting notes. Code reviews.<br />Jarvis turns all of it into three things you should do today.
        </h1>
        <p className="mt-5 max-w-[600px] text-center text-[17px] leading-[1.5] tracking-[-0.17px] text-muted-foreground text-pretty">
          Reads everything you&apos;re already cleared to see, syncs it locally, and hands your AI — and you — the context to act on it now.
        </p>
        <a
          href="#waitlist"
          className="pointer-events-auto mt-8 rounded-full bg-coal-ink px-7 py-3.5 text-sm font-medium leading-none text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-px"
          style={{ cursor: "pointer" }}
        >
          Get early access
        </a>
        <p className="mt-4 max-w-[420px] text-center text-[13px] leading-[1.5] text-slate-mid">
          Synced locally, scoped to what you can already see — nothing new to approve, nothing sent anywhere else.
        </p>
      </div>
      {!ready && (
        <div
          aria-label="Loading"
          className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-graphite"
        >
          Loading
        </div>
      )}
    </section>
  );
}
