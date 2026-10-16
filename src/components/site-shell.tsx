import type { ReactNode } from "react";
import { NightFooter, NightNav } from "@/components/night/night-shell";

/*
  The chrome every content page shares: the homepage's Night nav and footer.
  The footer links every content page, so a page nothing else links to is
  still reachable from all of them.
*/

/** Shell for the content pages, in the Night style. The pages' own markup is
    still written in the old light palette (coal-ink, parchment, ash…);
    `.nt-page` in globals.css redefines those tokens as the Night palette. */
export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <div className="nt nt-page">
      <div className="nt-tiles" aria-hidden />
      <NightNav home={false} />
      <main className="relative flex flex-1 flex-col pt-6 sm:pt-10">
        <div aria-hidden className="nt-page-glow" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </main>
      <NightFooter home={false} />
    </div>
  );
}
