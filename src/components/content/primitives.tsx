import type { ReactNode } from "react";
import Link from "next/link";

/*
  Shared furniture for the content pages.

  Every type ramp here is copied from the existing sections rather than
  reinvented — the h2 scale, the 11px uppercase eyebrow, the 15px/1.6 body — so
  a visitor who lands on /mcp from search and then clicks through to the
  homepage does not feel the seam.
*/

/** Prose measure. Roughly 68 characters at the body size, which is where long
    lines stop being comfortable. */
const MEASURE = "max-w-[68ch]";

export function PageHero({
  eyebrow,
  title,
  standfirst,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  standfirst: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-4 pt-8 sm:px-6 sm:pb-8 sm:pt-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-smolder">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-[19ch] font-display text-[34px] font-bold leading-[1.04] tracking-[-1.2px] text-coal-ink text-balance sm:text-[46px] sm:tracking-[-1.7px] lg:text-[56px] lg:tracking-[-2.1px]">
        {title}
      </h1>
      <div
        className={`mt-6 text-[17px] leading-[1.6] tracking-[-0.16px] text-graphite ${MEASURE}`}
      >
        {standfirst}
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-10 sm:px-6 sm:py-14"
    >
      {title ? (
        <h2 className="mb-5 max-w-[24ch] font-display text-[26px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink text-balance sm:text-[32px] sm:tracking-[-0.96px]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

/** Body copy. Kept as a component so the measure and rhythm are set in one
    place rather than re-typed on every paragraph. */
export function P({ children }: { children: ReactNode }) {
  return (
    <p
      className={`mb-4 text-[15.5px] leading-[1.65] tracking-[-0.12px] text-slate-mid last:mb-0 ${MEASURE}`}
    >
      {children}
    </p>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p
      className={`mb-5 text-[17px] leading-[1.6] tracking-[-0.14px] text-graphite ${MEASURE}`}
    >
      {children}
    </p>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 font-display text-[17px] font-semibold leading-[1.3] tracking-[-0.3px] text-coal-ink">
      {children}
    </h3>
  );
}

/** Inline code / literal. Used for tool names, queries, and search terms. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-ash bg-parchment px-1.5 py-0.5 font-mono text-[0.86em] text-coal-ink">
      {children}
    </code>
  );
}

export function Cards({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

export function Card({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-[10px] border border-ash bg-white p-5"
      style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
    >
      <H3>{title}</H3>
      <p className="text-[14px] leading-[1.6] tracking-[-0.1px] text-slate-mid">
        {children}
      </p>
    </div>
  );
}

/** A quiet parchment panel for an aside — the honest caveat, the "what this
    isn't" note. Used sparingly; it loses its force if every section has one. */
export function Note({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-2 max-w-[72ch] rounded-[10px] border border-ash bg-parchment p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
        {label}
      </p>
      <div className="text-[14.5px] leading-[1.65] tracking-[-0.1px] text-graphite [&>p]:mb-3 [&>p]:last:mb-0">
        {children}
      </div>
    </div>
  );
}

export type ComparisonRow = {
  axis: string;
  them: string;
  us: string;
};

export function ComparisonTable({
  themLabel,
  rows,
  checked,
}: {
  themLabel: string;
  rows: ComparisonRow[];
  /** When the competitor facts were last verified. Stated because these
      products ship constantly and a stale comparison is a dishonest one. */
  checked: string;
}) {
  return (
    <div className="mt-2">
      <div className="overflow-x-auto rounded-[10px] border border-ash bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[26%] border-b border-ash px-5 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.11em] text-stone">
                &nbsp;
              </th>
              <th className="w-[37%] border-b border-ash px-5 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.11em] text-stone">
                {themLabel}
              </th>
              <th className="w-[37%] border-b border-l border-ash bg-parchment px-5 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.11em] text-coal-ink">
                Jarvis
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.axis}>
                <td className="border-b border-ash px-5 py-4 align-top text-[14px] font-medium leading-[1.5] tracking-[-0.1px] text-coal-ink">
                  {row.axis}
                </td>
                <td className="border-b border-ash px-5 py-4 align-top text-[14px] leading-[1.6] tracking-[-0.1px] text-slate-mid">
                  {row.them}
                </td>
                <td className="border-b border-l border-ash bg-parchment/60 px-5 py-4 align-top text-[14px] leading-[1.6] tracking-[-0.1px] text-graphite">
                  {row.us}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12.5px] leading-[1.5] text-stone">
        {themLabel} details last checked {checked}. These products ship quickly
        — check their site for anything that matters to your decision.
      </p>
    </div>
  );
}

/** Closing CTA. Points at the homepage waitlist rather than duplicating the
    form, so there is one place leads are captured and one funnel to measure. */
export function CtaBand({
  title = "Get Jarvis for your team",
  body = "We're in early access, onboarding design partners a few at a time. Leave your email and we'll reach out as spots open.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <div
        className="rounded-[16px] border border-ash bg-parchment px-6 py-10 text-center sm:px-12 sm:py-14"
        style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
      >
        <h2 className="mx-auto max-w-[20ch] font-display text-[26px] font-bold leading-[1.1] tracking-[-0.9px] text-coal-ink text-balance sm:text-[34px] sm:tracking-[-1.2px]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-[1.6] tracking-[-0.12px] text-graphite">
          {body}
        </p>
        <Link
          href="/#waitlist"
          className="cta-shine relative mt-8 inline-flex cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-6 py-3 text-[14px] font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
        >
          Get early access
        </Link>
      </div>
    </section>
  );
}

/** Contextual links out to sibling pages. Real navigation for a reader who
    arrived from search on one page and has no idea the others exist. */
export function ReadNext({
  links,
}: {
  links: { href: string; title: string; blurb: string }[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone">
        Read next
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-[10px] border border-ash bg-white p-5 transition-colors hover:border-fossil"
          >
            <p className="font-display text-[15px] font-semibold leading-[1.3] tracking-[-0.25px] text-coal-ink">
              {link.title}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-slate-mid">
              {link.blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
