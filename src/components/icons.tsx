/*
  Lucide-style line icons, inlined as SVG (no emoji, consistent 1.75 stroke).
  All inherit currentColor and size from the parent via `className`.
*/
type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function KeyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function BrainIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.9 2.9-2.5-2.5 2.9-2.9Z" />
    </svg>
  );
}

export function SlackIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect width="3" height="8" x="13" y="2" rx="1.5" />
      <path d="M19 8.5A1.5 1.5 0 1 0 20.5 10H19Z" />
      <rect width="3" height="8" x="8" y="14" rx="1.5" />
      <path d="M5 15.5A1.5 1.5 0 1 1 3.5 14H5Z" />
      <rect width="8" height="3" x="14" y="13" rx="1.5" />
      <path d="M15.5 19A1.5 1.5 0 1 0 14 20.5V19Z" />
      <rect width="8" height="3" x="2" y="8" rx="1.5" />
      <path d="M8.5 5A1.5 1.5 0 1 1 10 3.5V5Z" />
    </svg>
  );
}

export function PlugIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function LaptopIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </svg>
  );
}

export function ChecklistIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4 6 1.5 1.5L8 4.5" />
      <path d="M11 6h9" />
      <path d="m4 12 1.5 1.5L8 10.5" />
      <path d="M11 12h9" />
      <path d="m4 18 1.5 1.5L8 16.5" />
      <path d="M11 18h9" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  );
}

export function MessageCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
