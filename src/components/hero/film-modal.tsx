"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/*
  The film, in a modal.

  It plays `public/jarvis-film.mp4`, not the live-DOM component, and that
  is a deliberate reversal of the call `demo-section.tsx` documents.

  That call ("prefer the component, it is vector text and costs no download")
  is an argument about THE PAGE: there the film is always rendered, every
  visitor pays the 3.4 MB whether they look or not, and the type is being
  scaled down to page width where compression shows. None of that is true
  here. Nothing is fetched until someone clicks, the file plays at close to
  its native 1920x1080 so the compression is invisible, and it is the only
  cut of the film that has audio. The component has no sound and could not
  get any without rebuilding the music bed and every timed SFX, which is
  precisely the re-render marketing/how-jarvis-works/README.md forbids.

  The video element only exists while the modal is open, so a visitor who
  never clicks never touches the network, and closing the modal unmounts it
  and stops the audio.

  A dark card on a blurred ground, in the Night style the site uses: near-black
  with a hairline edge and the orange glow, so the film sits on the page's own
  colours instead of a white sheet.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

export function FilmModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  /* Start it, and never leave it silently paused.

     Opening the modal is a user gesture, so playing with sound is normally
     allowed. Normally. Safari's "Auto-Play: Never" setting and some
     enterprise policies refuse sound-autoplay regardless of the gesture, and
     a bare `autoPlay` attribute would then leave a paused first frame with no
     explanation. Muted playback is always permitted, so fall back to that and
     let the `controls` UI show the muted state for the viewer to undo. */
  React.useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      void v.play().catch(() => {});
    });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll under the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-[14px]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.62)" }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="How Jarvis works"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.42, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="overflow-hidden rounded-[20px] p-3"
            style={{
              /* Height-first, so the 16:9 frame is whole at any window shape.
                 The 96px covers the header row plus the card's own padding. */
              width: "min(90vw - 32px, calc((86vh - 96px) * 16 / 9), 1240px)",
              background: "linear-gradient(180deg, #161618, #0F0F11)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 120px -30px rgba(255,96,32,0.45), 0 24px 72px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex items-center justify-between px-2 pb-3 pt-1">
              <span className="text-[15px] font-semibold tracking-[-0.15px] text-[#F4F4F5]">
                How Jarvis works
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#A1A1AA] transition-colors hover:bg-white/10 hover:text-[#F4F4F5]"
              >
                <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </div>

            {/* Playback is driven by the effect above, not by `autoPlay`, so
                the muted fallback is deterministic rather than a race between
                two play attempts. `controls` because someone who came to
                watch a film should be able to scrub it and mute it. */}
            <video
              ref={videoRef}
              src="/jarvis-film.mp4"
              poster="/jarvis-film.jpg"
              controls
              playsInline
              preload="auto"
              className="block w-full rounded-[12px]"
              /* #0A0A0B is Theme.bg — the film's own ground, to the byte — so
                 the frame is already the right colour before anything has
                 decoded and there is no white flash before the first frame. */
              style={{ aspectRatio: "16 / 9", backgroundColor: "#0A0A0B" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
