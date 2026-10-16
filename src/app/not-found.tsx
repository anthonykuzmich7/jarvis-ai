import Link from "next/link";
import { ContentShell } from "@/components/site-shell";

/* The 404, in the same Night shell as every other page. */
export default function NotFound() {
  return (
    <ContentShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-32 text-center sm:px-6">
        <p className="nt-eyebrow">404</p>
        <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.0] tracking-[-0.04em] text-coal-ink sm:text-[56px]">
          This page isn&apos;t here.
        </h1>
        <p className="mt-5 text-[19px] leading-[1.55] text-slate-mid">It may have moved, or the link is wrong.</p>
        <Link href="/" className="nt-btn nt-btn-primary mt-9">
          Back to the homepage
        </Link>
      </section>
    </ContentShell>
  );
}
