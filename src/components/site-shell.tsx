import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { JarvisMark } from "@/components/jarvis-mark";
import { ShieldIcon } from "@/components/icons";
import { contentPages } from "@/lib/content/pages";

/*
  The chrome every page shares: brand mark, nav, footer.

  All three used to live inline in `app/page.tsx`, which was fine while there
  was one page. Now that the content pages exist they need the same shell, and
  more importantly they need to be linked from it — a page nothing links to is
  a page Google discovers late and values little, however good the sitemap is.
*/

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="jarvis — home"
      className={"flex items-center gap-2.5 " + (className ?? "")}
    >
      <JarvisMark className="h-[32px] w-[32px] shrink-0" />
      <span className="wordmark text-xl text-foreground leading-none">
        jarvis
        <span className="cursor-blink select-none" aria-hidden="true">
          _
        </span>
      </span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ash bg-ledger-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 text-foreground">
              <JarvisMark className="h-[22px] w-[22px]" />
              <span className="wordmark text-sm">jarvis</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-slate-mid">
              Your work context, held in one place and handed to whoever asks —
              you, your team, or your AI tools.
            </p>
          </div>

          {/* Every content page, linked from every page. This is the internal
              linking surface: the homepage carries what little authority the
              domain has, and these links are how it reaches the rest. */}
          <nav aria-label="More from Jarvis" className="sm:min-w-[420px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone">
              Explore
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {contentPages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className="text-[14px] text-graphite transition-colors hover:text-coal-ink"
                  >
                    {page.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ash pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            Early access — we&apos;re onboarding design partners.
          </span>
          <a
            href="mailto:hello@jarviscontext.com"
            className="text-graphite transition-colors hover:text-coal-ink"
          >
            hello@jarviscontext.com
          </a>
        </div>
      </div>
    </footer>
  );
}

/** Shell for the content pages. The homepage keeps its own tree, because its
    sections and full-bleed hero do not fit this container. */
export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav brand={<Wordmark />} offSite />
      <main className="flex flex-1 flex-col bg-ledger-white pt-[72px] sm:pt-[84px]">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
