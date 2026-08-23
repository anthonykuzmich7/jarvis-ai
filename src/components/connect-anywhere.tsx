"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  BrandMark,
  ColorBrandMark,
  type BrandName,
  type ColorBrandName,
} from "@/components/brand-marks";
import { PlugIcon } from "@/components/icons";
import { MARK, MARK_INK, MARK_PAPER } from "@/components/jarvis-mark";

/*
  "Connect once. Tag Jarvis anywhere." — the coverage section.

  What it replaces and why. The previous version put five app logos on a
  dashed ellipse orbiting a Jarvis node, with a Claude Code window below it
  answering an @jarvis question. Two problems. The window was the hero's
  device verbatim, so the page made its strongest argument twice and the
  second time it landed as filler. And the orbit is the stock integrations
  diagram: it says "these things are related to us" and nothing else. Neither
  direction of the actual claim — context coming in, answers going out — was
  visible in it.

  This is built as strata, read top to bottom, because that is the claim:

    two lanes of real fragments drifting past   your tools, still working
              ↓ context rains down             Jarvis reads it as it goes by
    ─────────── the seam, with the mark ─────  one layer, on your device
              → a pulse runs out to a surface
    Slack   Claude Code   Cursor   MCP         wherever you already are
              ↓
    the answer, re-formed in that surface      carrying the same sources

  The rail and the seam bleed the full width of the viewport on purpose. A
  layer that stops at a 1400px content column reads as a widget the product
  owns; one that runs off both edges reads as something the page is sitting
  on, which is the actual claim being made about Jarvis.

  Every piece of motion is doing one of those jobs. The rain is "always
  syncing"; the ring behind the mark charges as context lands, so absorbing
  has a visible consequence; the eyes track whichever fragment just fell,
  then settle on the surface being served, which is the cheapest way to make
  a layer read as attentive rather than passive; the pulse is the causal link
  between the seam and the place the answer shows up; the card physically
  travels between surfaces instead of cross-fading, because "the same Jarvis
  moved with you" is the sentence the section exists to say. Nothing here
  loops for decoration — the only continuous motion is the intake, and the
  intake is continuous in the product too.

  The card deliberately does not change chrome per surface. Four differently
  skinned fake windows would be four fake screenshots and would drown the
  point; the surface identity lives in the card's header row, and the reply
  keeps Jarvis's own voice everywhere, which is what actually happens. The
  answer crossfades on a delay matched to the pulse's arrival, so the old one
  is still there until the new place has been reached — an empty card between
  beats read as a bug in every earlier pass.

  Background is the hero's: ledger white under the same warm paper glow. The
  hero's copy tracks the pointer (see kinetic-headline.tsx); this one is
  parked over the seam, since the pointer is not the subject here.

  Sources, replies and ticket numbers reuse the fixtures the rest of the site
  runs on (Acme, Tom, David Park, PR #142, ENG-2481, the payments
  double-charge) so the fragments falling in and the answers coming out are
  visibly the same story.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Stage geometry ─────────────────────────────────────────────
   One coordinate space for the whole diagram, and it is the full
   viewport width: the rail, the falling context, the seam and the
   surfaces all measure from the stage's top-left, so a drop that
   spawns under a moving card lands on the seam at the same x it
   left from. */
const LANE_A = 4;
const LANE_B = 44;
const CARD_LANE_H = 34; // a rail card, near enough, for drop origins
const RAIL_H = 84;
const FALL_H = 88; // rail → seam: how far context falls
const SEAM_Y = RAIL_H + FALL_H; // 172
const CHIPS_Y = SEAM_Y + 76; // 248
const CHIP_H = 40;
const STEM_H = 18;
/* Everything below the chip row used to be constants: one 40px row of
   surfaces, a stem, a 136px card, total 442. That holds while the four
   surfaces fit on one line. They do not on a phone — the row wraps to two,
   and the card, still pinned to a hard-coded CARD_Y, landed on top of the
   second line. The chip row is measured now and the card and stage follow
   it, so wrapping to two lines (or to four) just makes the stage taller.

   The card's own height stays a constant, because it holds one fixed
   reply and its citations. Measured, the four replies need 133px of it
   down to a 328px card and 154px at 288px, where the longest wraps to a
   third line; the desktop 136 is three pixels clear of the first number
   and short of the second. So: the same 136 wherever it has always been,
   and two steps of headroom below that, each with about ten pixels of
   slack over the measurement so a font metric cannot clip a citation. */
const CARD_H = 136;
const CARD_H_MD = 144; // narrow, reply still two lines
const CARD_H_SM = 164; // ~320px phone, reply wraps to three
const CARD_W = 452;

const RAIL_GAP = 16;
const RAIL_SPEED = 30; // px per second — slow enough to read a fragment
const MARK_D = 68;

/* ─── The context flowing in ─────────────────────────────────────
   Fragments, not logos. A logo says "we integrate with Slack"; a line
   of somebody's actual Wednesday says what Jarvis is picking up. Every
   one of these is cited by one of the four answers below. */
type Fragment = { mark: BrandName; source: string; line: string };

const FRAGMENTS: Fragment[] = [
  { mark: "slack", source: "#eng", line: "the fix is in review, not shipped" },
  {
    mark: "meetings",
    source: "Eng sync · Aug 19",
    line: "decided: rotating keys for token refresh",
  },
  { mark: "github", source: "PR #142", line: "Tom Reilly opened · auth" },
  { mark: "gmail", source: "Acme renewal", line: "legal redlines still open" },
  { mark: "linear", source: "ENG-2481", line: "payments double-charge" },
  {
    mark: "slack",
    source: "#sales-acme",
    line: "Dana flagged pushback on price",
  },
  { mark: "meetings", source: "1:1 David Park", line: "launch moved to Sep 4" },
  { mark: "github", source: "PR #212", line: "schema conflict, needs review" },
  { mark: "linear", source: "ENG-2502", line: "SSO rollout, Okta first" },
  { mark: "gmail", source: "Vendor security review", line: "SOC 2 attached" },
];

/* Rendered twice so the loop still has cards to show on a wide display.
   Only one copy is on screen below about 2000px of stage width. */
const RAIL_ITEMS = [...FRAGMENTS, ...FRAGMENTS];

/* ─── The surfaces it comes out in ───────────────────────────────
   Slack because Jarvis lives there as a real user; Claude Code and
   Cursor because it exposes context over MCP; "Any MCP client" last
   because that is the honest shape of the claim, and inventing a fifth
   logo would have been the dishonest way to make the row look wider. */
type Surface = {
  id: string;
  label: string;
  mark: BrandName | "mcp";
  /** Where you are inside that surface, shown in the card's header. */
  context: string;
  reply: string;
  cites: { mark: BrandName; label: string }[];
};

const SURFACES: Surface[] = [
  {
    id: "slack",
    label: "Slack",
    mark: "slack",
    context: "#eng",
    reply:
      "Tom's fix is in review, not shipped. It double-charged 3 customers.",
    cites: [
      { mark: "github", label: "PR #142" },
      { mark: "meetings", label: "Eng sync · Aug 19" },
    ],
  },
  {
    id: "claude-code",
    label: "Claude Code",
    mark: "claude",
    context: "~/acme-api",
    reply: "Auth moved to rotating keys on Jul 2. Mark and Dasha own it.",
    cites: [
      { mark: "meetings", label: "Backend sync · Jul 2" },
      { mark: "github", label: "PR #142" },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    mark: "cursor",
    context: "billing/charge.ts",
    reply: "This path double-charged 3 customers. The fix is open in PR #142.",
    cites: [
      { mark: "linear", label: "ENG-2481" },
      { mark: "slack", label: "#eng" },
    ],
  },
  {
    id: "mcp",
    label: "Any MCP client",
    mark: "mcp",
    context: "jarvis · search_context",
    reply: "12 messages across 4 sources, scoped to what you can already see.",
    cites: [
      { mark: "slack", label: "#eng" },
      { mark: "meetings", label: "1:1 David Park" },
    ],
  },
];

const BEAT_MS = 5400;
/* The answer lands when the pulse gets there, not when the timer fires. */
const ARRIVAL_S = 0.42;

/* ─── Pools ──────────────────────────────────────────────────────
   Falling context and the splash it makes are drawn by the same rAF
   that drives the rail, into a fixed set of nodes. Nothing here
   touches React state per frame, and nothing animates a property
   other than transform and opacity. */
/* Falling context carries its own source mark rather than being an
   anonymous tick, because "Jarvis connects to everything you use" is
   only legible if you can see what is arriving. Pooling is therefore
   per brand: each node renders one fixed glyph and a spawn looks for a
   free slot of the right brand. */
const DROP_MARKS: BrandName[] = [
  "slack",
  "slack",
  "slack",
  "meetings",
  "meetings",
  "meetings",
  "github",
  "github",
  "github",
  "gmail",
  "gmail",
  "gmail",
  "linear",
  "linear",
  "linear",
];
const DROP_HEAD = 13; // glyph size
const DROP_TAIL = 26; // trail above the glyph
const RIPPLES = 12;
const DROP_MS = 900;
const RIPPLE_MS = 620;

type Pooled = { on: boolean; x: number; y: number; t0: number };

/* Pause-bar geometry on a 48-unit disc, so the mark's eyes here are the
   same construction as jarvis-mark.tsx and the macOS app. */
const BAR_W = MARK.barW * 48;
const BAR_H = MARK.barH * 48;
const BAR_CORNER = MARK.corner * 48;
const BAR_L_X = 24 - MARK.outer * 48;
const BAR_R_X = 24 + MARK.inner * 48;
const BAR_CY = 24;
const EYE_MAX_SHIFT = 7;

/* Surfaces are places, not citations, so their marks carry brand colour
   where the brand has one that survives both pill grounds. Cursor and the
   generic MCP plug stay on `currentColor` and invert with the pill — see
   the note on ColorBrandMark in brand-marks.tsx. */
const COLOR_SURFACES = new Set<string>(["slack", "claude"]);

function SurfaceGlyph({
  mark,
  className,
}: {
  mark: BrandName | "mcp";
  className?: string;
}) {
  if (mark === "mcp") return <PlugIcon className={className} />;
  if (COLOR_SURFACES.has(mark)) {
    return (
      <ColorBrandMark name={mark as ColorBrandName} className={className} />
    );
  }
  return <BrandMark name={mark} size={14} className={className} />;
}

export function ConnectAnywhere() {
  const reduce = useReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const shown = inView || !!reduce;
  const live = inView && !reduce;

  /* ── Measurement ──────────────────────────────────────────────
     Widths come from the DOM rather than a table of guesses, so the
     rail keeps its rhythm when a label changes length. */
  const stageRef = React.useRef<HTMLDivElement>(null);
  const railRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const railLayout = React.useRef<{ offsets: number[]; total: number }>({
    offsets: [],
    total: 1,
  });
  const railX = React.useRef<number[]>([]);
  const stageW = React.useRef(1200);

  const chipsRowRef = React.useRef<HTMLDivElement>(null);
  const [chipCenters, setChipCenters] = React.useState<number[]>([]);
  const [chipsHeight, setChipsHeight] = React.useState(CHIP_H);
  const [stageWidth, setStageWidth] = React.useState(1200);

  const measure = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    stageW.current = stageRect.width;
    setStageWidth(stageRect.width);

    let x = 0;
    const offsets: number[] = [];
    RAIL_ITEMS.forEach((_, i) => {
      offsets.push(x);
      x += (railRefs.current[i]?.offsetWidth ?? 260) + RAIL_GAP;
    });
    railLayout.current = { offsets, total: Math.max(x, 1) };

    /* Park every fragment at its offset now. The frame loop takes over
       from here when it runs, but under reduced motion it never does,
       and without this the whole rail would stack at x=0. */
    RAIL_ITEMS.forEach((_, i) => {
      const el = railRefs.current[i];
      if (!el) return;
      railX.current[i] = offsets[i] + el.offsetWidth / 2;
      el.style.transform = `translate3d(${offsets[i].toFixed(2)}px, 0, 0)`;
    });

    setChipCenters(
      chipRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.left - stageRect.left + r.width / 2;
      }),
    );

    /* How tall the surfaces actually came out. One line on a desktop,
       two on a phone. Everything below hangs off this. */
    setChipsHeight(chipsRowRef.current?.offsetHeight ?? CHIP_H);
  }, []);

  React.useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [measure]);

  /* ── Beat ─────────────────────────────────────────────────────
     Which surface is currently being served. */
  const [beat, setBeat] = React.useState(0);
  const surfaceIndex = beat % SURFACES.length;
  const surface = SURFACES[surfaceIndex];

  React.useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setBeat((b) => b + 1), BEAT_MS);
    return () => clearInterval(id);
  }, [live]);

  /* ── Frame loop ───────────────────────────────────────────────
     The rail, the falling context, the splashes, the charge ring and
     the eyes. */
  const dropRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const rippleRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const drops = React.useRef<Pooled[]>(
    DROP_MARKS.map(() => ({ on: false, x: 0, y: 0, t0: 0 })),
  );
  const ripples = React.useRef<Pooled[]>(
    Array.from({ length: RIPPLES }, () => ({ on: false, x: 0, y: 0, t0: 0 })),
  );
  const nextDrop = React.useRef(400);
  const charge = React.useRef(0);

  const leftEye = React.useRef<SVGRectElement>(null);
  const rightEye = React.useRef<SVGRectElement>(null);
  const focusX = React.useRef<number | null>(null);
  const eyeShift = React.useRef(0);
  const blinkStart = React.useRef<number | null>(null);
  const nextBlink = React.useRef(2100);

  /* The mark watches the surface it is answering into between drops. */
  React.useEffect(() => {
    focusX.current = chipCenters[surfaceIndex] ?? null;
  }, [chipCenters, surfaceIndex]);

  useAnimationFrame((t) => {
    if (!live) return;

    const { offsets, total } = railLayout.current;
    const width = stageW.current;
    const shift = ((t * RAIL_SPEED) / 1000) % total;

    /* Rail — one modulo, no state, transform only. Two lanes, so it
       reads as a stream rather than a toolbar. */
    RAIL_ITEMS.forEach((_, i) => {
      const el = railRefs.current[i];
      if (!el) return;
      const x = ((((offsets[i] ?? 0) - shift) % total) + total) % total;
      railX.current[i] = x + el.offsetWidth / 2;
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    });

    /* Spawn a drop under whichever fragment is currently on screen.
       Random rather than round-robin so the rain never falls into a
       visible pattern. */
    if (t > nextDrop.current) {
      nextDrop.current = t + 150 + Math.random() * 220;
      const visible: number[] = [];
      RAIL_ITEMS.forEach((_, i) => {
        const cx = railX.current[i];
        if (cx > 60 && cx < width - 60) visible.push(i);
      });
      const pick = visible[Math.floor(Math.random() * visible.length)];
      if (pick != null) {
        const wanted = RAIL_ITEMS[pick].mark;
        const slot = drops.current.find(
          (d, n) => !d.on && DROP_MARKS[n] === wanted,
        );
        if (slot) {
          slot.on = true;
          slot.x = railX.current[pick];
          slot.y = (pick % 2 === 0 ? LANE_A : LANE_B) + CARD_LANE_H;
          slot.t0 = t;
          focusX.current = slot.x;
        }
      }
    }

    /* Falling context. Accelerates into the seam, then hands off to a
       splash so the arrival has a consequence instead of just stopping. */
    drops.current.forEach((d, i) => {
      const el = dropRefs.current[i];
      if (!el) return;
      if (!d.on) {
        el.style.opacity = "0";
        return;
      }
      const p = (t - d.t0) / DROP_MS;
      if (p >= 1) {
        d.on = false;
        el.style.opacity = "0";
        const slot = ripples.current.find((r) => !r.on);
        if (slot) {
          slot.on = true;
          slot.x = d.x;
          slot.t0 = t;
        }
        charge.current = Math.min(1, charge.current + 0.45);
        return;
      }
      /* Quadratic, so context accelerates into the layer instead of
         drifting down at a constant speed like falling snow. */
      const y = d.y + (SEAM_Y - d.y) * (p * p);
      const scale = 1 - 0.4 * p;
      el.style.transform =
        `translate3d(${(d.x - DROP_HEAD / 2).toFixed(2)}px, ${(y - DROP_HEAD - DROP_TAIL).toFixed(2)}px, 0)` +
        ` scale(${scale.toFixed(3)})`;
      el.style.opacity = (
        p < 0.12 ? p / 0.12 : p > 0.86 ? (1 - p) / 0.14 : 1
      ).toFixed(3);
    });

    /* Splash on the seam. */
    ripples.current.forEach((r, i) => {
      const el = rippleRefs.current[i];
      if (!el) return;
      if (!r.on) {
        el.style.opacity = "0";
        return;
      }
      const p = (t - r.t0) / RIPPLE_MS;
      if (p >= 1) {
        r.on = false;
        el.style.opacity = "0";
        return;
      }
      const s = 0.25 + p * 1.7;
      el.style.transform = `translate3d(${r.x.toFixed(2)}px, ${SEAM_Y}px, 0) scaleX(${s.toFixed(3)})`;
      el.style.opacity = (0.9 * (1 - p)).toFixed(3);
    });

    /* The mark charges as context lands, and settles back between drops.
       Frame-rate dependent decay is fine for a glow. */
    charge.current *= 0.955;
    if (ringRef.current) {
      ringRef.current.style.opacity = (charge.current * 0.55).toFixed(3);
      ringRef.current.style.transform = `scale(${(1 + charge.current * 0.16).toFixed(3)})`;
    }

    /* Eyes. Lerped, so they sweep rather than snap between the fragment
       that just fell and the surface being answered into. */
    const markX = width / 2;
    const target = focusX.current;
    const want =
      target == null
        ? 0
        : Math.max(-1, Math.min(1, (target - markX) / (width / 2))) *
          EYE_MAX_SHIFT;
    eyeShift.current += (want - eyeShift.current) * 0.045;

    if (t > nextBlink.current && blinkStart.current === null) {
      blinkStart.current = t;
      nextBlink.current = t + 3200 + Math.random() * 3600;
    }
    let openness = 1;
    if (blinkStart.current !== null) {
      const bt = t - blinkStart.current;
      if (bt < 90) openness = 1 - bt / 90;
      else if (bt < 220) openness = (bt - 90) / 130;
      else blinkStart.current = null;
    }
    const barH = Math.max(0.01, BAR_H * openness);
    const barY = BAR_CY - barH / 2;
    const s = eyeShift.current;

    if (leftEye.current) {
      leftEye.current.setAttribute("x", (BAR_L_X + s).toFixed(3));
      leftEye.current.setAttribute("y", barY.toFixed(2));
      leftEye.current.setAttribute("height", barH.toFixed(2));
    }
    if (rightEye.current) {
      rightEye.current.setAttribute("x", (BAR_R_X + s).toFixed(3));
      rightEye.current.setAttribute("y", barY.toFixed(2));
      rightEye.current.setAttribute("height", barH.toFixed(2));
    }
  });

  /* ── Derived positions ────────────────────────────────────────── */
  const markX = stageWidth / 2;
  const chipX = chipCenters[surfaceIndex] ?? markX;
  const cardW = Math.min(CARD_W, stageWidth - 32);
  const cardX = Math.max(
    16,
    Math.min(chipX - cardW / 2, Math.max(16, stageWidth - cardW - 16)),
  );
  const cardH = cardW < 300 ? CARD_H_SM : cardW < 420 ? CARD_H_MD : CARD_H;
  const cardY = CHIPS_Y + chipsHeight + STEM_H;
  const stageH = cardY + cardH;

  return (
    <section
      id="product"
      /* No ground of its own: the wrapper in page.tsx carries the paper
         and the shared PaperGlow, so the light can cross the boundary
         into the hero instead of being clipped at it. `overflow-hidden`
         stays — the intake rail is thousands of pixels wide.

         Sized by its content rather than pinned to `min-h-[100dvh]`.
         The hero above is a full viewport holding about 370px of
         content, so it already ends with a couple of hundred pixels of
         slack under it; reserving another full screen here and centring
         in it added ~170px more before the headline, and the two
         sections read as further apart than anything on the page
         warranted. Padding does the spacing now, weighted to the bottom
         where the next section's hard blue edge needs the room. */
      className="relative scroll-mt-16 overflow-hidden"
    >
      <div ref={sectionRef} className="relative w-full pb-20 pt-8 sm:pb-28">
        {/* Heading. Centred, because the diagram under it is symmetric
            about the mark and a left-anchored head fought it. */}
        <motion.div
          className="mx-auto max-w-2xl px-6 text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.15] tracking-[-0.64px] text-coal-ink sm:text-4xl">
            Connect once. Tag Jarvis anywhere.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-pretty text-[17px] leading-[1.55] tracking-[-0.17px] text-slate-mid">
            Sign in once. Jarvis keeps up with Slack, Gmail, meetings and code,
            then answers where you already are.
          </p>
        </motion.div>

        {/* Stage — full bleed. */}
        <motion.div
          ref={stageRef}
          className="relative mt-10 w-full sm:mt-12"
          style={{ height: stageH }}
          initial={reduce ? false : { opacity: 0 }}
          animate={shown ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          {/* ── Intake rail ─────────────────────────────────────
              Fades at both edges so fragments arrive and leave rather
              than popping in at a hard boundary. */}
          <div
            className="absolute inset-x-0 top-0 overflow-hidden"
            style={{
              height: RAIL_H,
              maskImage:
                "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
            }}
          >
            {RAIL_ITEMS.map((f, i) => (
              <div
                key={`${f.source}-${f.line}-${i}`}
                ref={(el) => {
                  railRefs.current[i] = el;
                }}
                /* Compacter on a phone. A 390px stage shows one fragment
                   per lane whatever we do, but at desktop metrics the
                   longest of them came to 387px and pressed against both
                   edges of the mask, so the rail read as one card wedged
                   across the screen rather than as something drifting
                   through it. */
                className="absolute left-0 flex items-center gap-1.5 whitespace-nowrap rounded-[9px] border border-ash bg-card px-2.5 py-[6px] sm:gap-2 sm:px-3 sm:py-[7px]"
                style={{
                  top: i % 2 === 0 ? LANE_A : LANE_B,
                  willChange: "transform",
                  boxShadow: "rgba(95,99,106,0.07) 0px 0px 0px 1px",
                }}
              >
                <BrandMark name={f.mark} size={12} className="text-stone" />
                <span className="font-mono text-[9.5px] leading-none tracking-[-0.1px] text-stone sm:text-[10.5px]">
                  {f.source}
                </span>
                <span className="text-[11.5px] leading-none tracking-[-0.12px] text-graphite sm:text-[12.5px]">
                  {f.line}
                </span>
              </div>
            ))}
          </div>

          {/* ── Falling context ───────────────────────────────────
              Each one is a source mark with a violet trail, shrinking as
              the layer pulls it in. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {DROP_MARKS.map((m, i) => (
              <div
                key={i}
                ref={(el) => {
                  dropRefs.current[i] = el;
                }}
                className="absolute left-0 top-0 flex flex-col items-center opacity-0"
                style={{
                  width: DROP_HEAD,
                  transformOrigin: "50% 100%",
                  willChange: "transform, opacity",
                }}
              >
                <span
                  className="w-px"
                  style={{
                    height: DROP_TAIL,
                    background:
                      "linear-gradient(180deg, rgba(119,126,255,0) 0%, rgba(119,126,255,0.7) 100%)",
                  }}
                />
                <BrandMark
                  name={m}
                  size={DROP_HEAD}
                  className="text-signal-violet"
                />
              </div>
            ))}
          </div>

          {/* ── The seam ────────────────────────────────────────
              One line across the whole viewport: Jarvis is a layer, not
              another app in the row. The soft band above and below is
              what stops it reading as a stray rule. */}
          <div
            aria-hidden
            className="absolute inset-x-0"
            style={{
              top: SEAM_Y - 28,
              height: 56,
              background:
                "linear-gradient(180deg, rgba(119,126,255,0) 0%, rgba(119,126,255,0.075) 50%, rgba(119,126,255,0) 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 h-px"
            style={{
              top: SEAM_Y,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(28,26,23,0.2) 14%, rgba(28,26,23,0.2) 86%, transparent 100%)",
            }}
          />

          {/* Splashes where context lands */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: RIPPLES }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  rippleRefs.current[i] = el;
                }}
                className="absolute left-[-70px] top-0 h-px w-[140px] opacity-0"
                style={{
                  willChange: "transform, opacity",
                  background:
                    "linear-gradient(90deg, transparent, #777eff, transparent)",
                }}
              />
            ))}
          </div>

          {/* Pulse: seam → the surface being answered into. Remounted per
              beat, which is what makes it read as one departure rather
              than a looping decoration. */}
          {live && chipCenters.length > 0 ? (
            <React.Fragment key={beat}>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 h-px w-[72px] rounded-full"
                style={{
                  top: SEAM_Y,
                  background:
                    "linear-gradient(90deg, transparent, #777eff, transparent)",
                }}
                initial={{ x: markX - 36, opacity: 0 }}
                animate={{ x: chipX - 36, opacity: [0, 1, 1, 0] }}
                transition={{
                  x: { duration: 0.5, ease: EASE },
                  opacity: { duration: 0.62, times: [0, 0.15, 0.7, 1] },
                }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 w-px origin-top"
                style={{
                  top: SEAM_Y,
                  height: CHIPS_Y - SEAM_Y,
                  x: chipX,
                  background:
                    "linear-gradient(180deg, rgba(119,126,255,0.7), rgba(119,126,255,0))",
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                  ease: EASE,
                  opacity: { duration: 0.62, times: [0, 0.3, 1] },
                }}
              />
            </React.Fragment>
          ) : null}

          {/* ── The mark, sitting on the seam ──────────────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ top: SEAM_Y, zIndex: 20 }}
          >
            <motion.div
              className="relative"
              style={{ width: MARK_D, height: MARK_D }}
              initial={reduce ? false : { scale: 0.86, opacity: 0 }}
              animate={shown ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            >
              {/* Charge: brightens as context lands, settles between drops */}
              <div
                ref={ringRef}
                aria-hidden
                className="absolute inset-0 rounded-full opacity-0"
                style={{
                  willChange: "transform, opacity",
                  boxShadow: "0 0 0 9px rgba(119,126,255,0.28)",
                }}
              />
              <div
                className="relative flex h-full w-full items-center justify-center rounded-full"
                style={{
                  backgroundColor: MARK_INK,
                  boxShadow:
                    "0 0 0 6px rgba(119,126,255,0.10), 0 12px 34px rgba(10,10,11,0.22)",
                }}
              >
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="h-full w-full"
                  aria-hidden
                >
                  <rect
                    ref={leftEye}
                    x={BAR_L_X}
                    y={BAR_CY - BAR_H / 2}
                    width={BAR_W}
                    height={BAR_H}
                    rx={BAR_CORNER}
                    fill={MARK_PAPER}
                  />
                  <rect
                    ref={rightEye}
                    x={BAR_R_X}
                    y={BAR_CY - BAR_H / 2}
                    width={BAR_W}
                    height={BAR_H}
                    rx={BAR_CORNER}
                    fill={MARK_PAPER}
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          <p
            className="absolute inset-x-0 text-center text-[12.5px] leading-none tracking-[-0.1px] text-stone"
            style={{ top: SEAM_Y + 46 }}
          >
            Synced locally. Nothing leaves your device.
          </p>

          {/* ── Surfaces ────────────────────────────────────────
              A row, not a grid of feature cards: these are places, and
              places sit side by side. */}
          <div
            ref={chipsRowRef}
            /* Capped so the four wrap 2+2 rather than 3+1. Three of them
               do fit on a 390px line, which leaves "Any MCP client" alone
               on a second row reading as an overflow accident rather than
               as the tail of the list. The cap breaks after the second
               chip instead, and the pair that lands on the first row is
               the two surfaces that carry a colour mark. */
            className="absolute inset-x-0 mx-auto flex max-w-[304px] flex-wrap items-center justify-center gap-2.5 px-5 sm:max-w-none sm:gap-3 sm:px-6"
            style={{ top: CHIPS_Y }}
          >
            {SURFACES.map((s, i) => {
              const on = i === surfaceIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  aria-pressed={on}
                  onClick={() => setBeat(i)}
                  className={
                    "flex cursor-pointer items-center gap-2 rounded-full border px-3.5 text-[12.5px] font-medium leading-none tracking-[-0.13px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal-ink sm:px-5 sm:text-[13.5px] " +
                    (on
                      ? "border-transparent bg-coal-ink text-white"
                      : "border-ash bg-card text-stone hover:text-graphite")
                  }
                  style={{
                    height: CHIP_H,
                    transitionDelay: "300ms",
                    boxShadow: on
                      ? "0 6px 20px rgba(10,10,11,0.16)"
                      : "rgba(95,99,106,0.07) 0px 0px 0px 1px",
                  }}
                >
                  <SurfaceGlyph
                    mark={s.mark}
                    className={
                      "h-[14px] w-[14px] shrink-0 transition-colors duration-300 " +
                      (on ? "text-white" : "text-fossil")
                    }
                  />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Stem: the answer hangs off the surface it landed in. */}
          <motion.div
            aria-hidden
            className="absolute left-0 w-px bg-ash"
            style={{ top: CHIPS_Y + chipsHeight, height: STEM_H }}
            initial={false}
            animate={{ x: chipX }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          />

          {/* ── The answer, re-formed in that surface ───────────── */}
          <motion.div
            className="absolute left-0 overflow-hidden rounded-[10px] border border-ash bg-card"
            style={{
              top: cardY,
              width: cardW,
              height: cardH,
              boxShadow:
                "rgba(95,99,106,0.10) 0px 0px 0px 1px, rgba(43,43,48,0.10) 0px 2px 10px 0px",
            }}
            initial={false}
            animate={{ x: cardX }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          >
            {/* Crossfaded rather than swapped: both copies are mounted
                through the handover, so the card is never empty. */}
            <AnimatePresence initial={false}>
              <motion.div
                key={surface.id}
                className="absolute inset-0 flex flex-col px-4 py-3.5"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.34, ease: EASE, delay: ARRIVAL_S }}
              >
                {/* Which surface you are in */}
                <div className="flex items-center gap-2 border-b border-ash pb-2.5">
                  <SurfaceGlyph
                    mark={surface.mark}
                    className="h-[13px] w-[13px] shrink-0 text-graphite"
                  />
                  <span className="text-[12.5px] font-medium leading-none tracking-[-0.1px] text-graphite">
                    {surface.label}
                  </span>
                  <span className="font-mono text-[11px] leading-none text-stone">
                    {surface.context}
                  </span>
                </div>

                {/* What Jarvis said there */}
                <div className="mt-3 flex flex-1 items-start gap-2.5">
                  <span
                    className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: MARK_INK }}
                    aria-hidden
                  >
                    <svg viewBox="0 0 48 48" className="h-full w-full">
                      <rect
                        x={BAR_L_X}
                        y={BAR_CY - BAR_H / 2}
                        width={BAR_W}
                        height={BAR_H}
                        rx={BAR_CORNER}
                        fill={MARK_PAPER}
                      />
                      <rect
                        x={BAR_R_X}
                        y={BAR_CY - BAR_H / 2}
                        width={BAR_W}
                        height={BAR_H}
                        rx={BAR_CORNER}
                        fill={MARK_PAPER}
                      />
                    </svg>
                  </span>
                  <p className="text-[14.5px] leading-[1.45] tracking-[-0.12px] text-coal-ink">
                    {surface.reply}
                  </p>
                </div>

                {/* The same fragments that fell in, cited on the way out */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {surface.cites.map((c) => (
                    <span
                      key={c.label}
                      className="flex items-center gap-1.5 rounded-[6px] bg-secondary px-2 py-1 text-[11px] leading-none tracking-[-0.1px] text-graphite"
                    >
                      <BrandMark
                        name={c.mark}
                        size={11}
                        className="text-stone"
                      />
                      {c.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
