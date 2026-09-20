import type { ReactNode } from "react";

/*
  Furniture for the two legal documents, /privacy and /terms.

  These pages have a reader the marketing pages do not: a Google OAuth
  verification reviewer, checking the policy line by line against the scopes the
  app requests. That reader needs to find one clause fast, which is why the
  layout is a document with a standing contents rail rather than a scroll of
  prose, and why the sections are numbered. The numbers are for citation, not
  decoration.

  The type ramp is the content pages' ramp one step down: a policy has three
  times as many headings as an article, and the /mcp h2 at 32px turns a document
  into a stack of billboards.
*/

const MEASURE = "max-w-[70ch]";

export type LegalEntry = { id: string; title: string };

/** The document shell. The rail is plain anchors: a scroll-spy would buy an
    active state at the cost of an observer running down a page nobody reads
    twice. */
export function LegalDocument({
  contents,
  children,
}: {
  contents: LegalEntry[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6 sm:pb-24">
      <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone">
            Contents
          </p>
          <ol className="mt-4 space-y-2.5 border-l border-ash pl-4">
            {contents.map((entry, i) => (
              <li key={entry.id} className="flex gap-2">
                <span className="mt-[1px] font-mono text-[11px] leading-[1.5] text-fossil">
                  {i + 1}
                </span>
                <a
                  href={`#${entry.id}`}
                  className="text-[13.5px] leading-[1.45] text-graphite transition-colors hover:text-coal-ink"
                >
                  {entry.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}

/** One numbered clause group. `index` is passed rather than derived so the
    heading and the rail cannot drift apart. */
export function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-ash pt-8 first:border-t-0 first:pt-0 [&+&]:mt-10"
    >
      <h2 className="mb-4 flex gap-3 font-display text-[21px] font-bold leading-[1.2] tracking-[-0.5px] text-coal-ink sm:text-[23px]">
        <span className="mt-[3px] font-mono text-[13px] font-normal leading-[1.3] text-fossil">
          {index}
        </span>
        <span className="text-balance">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return (
    <p
      className={`mb-4 text-[15px] leading-[1.68] tracking-[-0.1px] text-slate-mid last:mb-0 ${MEASURE}`}
    >
      {children}
    </p>
  );
}

export function LegalH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2 mt-7 font-display text-[15.5px] font-semibold leading-[1.35] tracking-[-0.2px] text-coal-ink first:mt-0">
      {children}
    </h3>
  );
}

/** Bulleted clause list. Hairlines are deliberately absent: a rule under every
    item is what turns a short list into a spec sheet. */
export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul
      className={`mb-4 space-y-2.5 text-[15px] leading-[1.68] tracking-[-0.1px] text-slate-mid last:mb-0 ${MEASURE}`}
    >
      {children}
    </ul>
  );
}

export function LegalItem({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.68em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-fossil">
      {children}
    </li>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[4px] bg-parchment px-[5px] py-[2px] font-mono text-[12.5px] text-graphite">
      {children}
    </code>
  );
}

export function Mailto({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="text-graphite underline decoration-fossil underline-offset-[3px] transition-colors hover:text-coal-ink hover:decoration-graphite"
    >
      {address}
    </a>
  );
}

export function Outbound({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-graphite underline decoration-fossil underline-offset-[3px] transition-colors hover:text-coal-ink hover:decoration-graphite"
    >
      {children}
    </a>
  );
}

/*
  The plain-language block that opens the policy.

  A reviewer reads the clauses. A person deciding whether to connect their
  mailbox reads this and stops. Putting it above the numbered document is the
  whole point: the honest summary should not be something you earn by reading
  nine sections.
*/
export function PlainSummary({
  points,
}: {
  points: { claim: string; detail: string }[];
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-6 sm:pb-16">
      <div className="rounded-[10px] border border-ash bg-parchment px-6 py-7 sm:px-8 sm:py-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
          The short version
        </p>
        <dl className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point.claim}>
              <dt className="font-display text-[15px] font-semibold leading-[1.35] tracking-[-0.2px] text-coal-ink">
                {point.claim}
              </dt>
              <dd className="mt-1 text-[14px] leading-[1.6] tracking-[-0.08px] text-graphite">
                {point.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/*
  One cell per OAuth scope: the string Google shows on the consent screen, what
  it reads, what the app does with it, where the result sits.

  This exists because the single question both readers have is "what does it do
  with my mail", and a paragraph answering it is a paragraph they have to trust.
  A grid keyed on the literal scope string is checkable.
*/
export function ScopeGrid({
  scopes,
}: {
  scopes: {
    scope: string;
    reads: string;
    purpose: string;
    lands: ReactNode;
  }[];
}) {
  return (
    /* Wider than the prose measure on purpose, and to a fixed width rather
       than the full column: a data block that breaks the measure reads as a
       deliberate step out of the text, while one that runs to an arbitrary
       edge reads as a layout accident. */
    <div className="mb-5 grid max-w-[46rem] gap-3 sm:grid-cols-2">
      {scopes.map((s) => (
        <div
          key={s.scope}
          className="rounded-[10px] border border-ash bg-white p-5"
        >
          <p className="font-mono text-[12px] leading-[1.4] text-coal-ink">
            {s.scope}
          </p>
          <dl className="mt-4 space-y-3">
            {[
              { k: "Reads", v: s.reads },
              { k: "Used for", v: s.purpose },
              { k: "Stored", v: s.lands },
            ].map((row) => (
              <div key={row.k}>
                <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-stone">
                  {row.k}
                </dt>
                <dd className="mt-[3px] text-[14px] leading-[1.55] tracking-[-0.08px] text-graphite">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/** Actions the reader can take, each one a verb. Three items, so a divider
    between them is a rhythm rather than a table. */
export function ActionList({
  actions,
}: {
  actions: { action: string; detail: ReactNode }[];
}) {
  return (
    <div className={`mb-4 divide-y divide-ash border-y border-ash ${MEASURE}`}>
      {actions.map((a) => (
        <div key={a.action} className="py-4 first:pt-0 last:pb-0">
          <p className="font-display text-[15px] font-semibold leading-[1.35] tracking-[-0.2px] text-coal-ink">
            {a.action}
          </p>
          <p className="mt-1 text-[14.5px] leading-[1.6] tracking-[-0.08px] text-slate-mid">
            {a.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

/** The clause a verification reviewer looks for by name. Given its own
    treatment because it is a quotation from Google's policy, not our prose. */
export function LimitedUseCallout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 max-w-[70ch] rounded-[10px] border border-coal-ink/12 bg-white p-5 sm:p-6">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
        Limited Use
      </p>
      <div className="text-[14.5px] leading-[1.65] tracking-[-0.1px] text-graphite [&>p]:mb-3 [&>p]:last:mb-0">
        {children}
      </div>
    </div>
  );
}

export function LegalFooterNote({
  effective,
  children,
}: {
  effective: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-12 border-t border-ash pt-6">
      <p className="text-[13px] leading-[1.6] text-stone">
        Effective {effective}. {children}
      </p>
    </div>
  );
}
