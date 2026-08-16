/*
  The three steps shown above the waitlist form.
  Shared by the desktop section (app/page.tsx) and the mobile one.
*/

const STEPS = [
  "Write your email.",
  "Write who you are.",
  "Join the waitlist.",
];

/** `compact` stacks the steps and tightens type for the mobile layout. */
export function WaitlistSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol
      className={
        compact
          ? "mx-auto mt-4 flex w-fit flex-col gap-2.5 text-left"
          : "mx-auto mt-6 flex w-fit flex-col gap-3 text-left sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-x-8"
      }
    >
      {STEPS.map((step, index) => (
        <li
          key={step}
          className={
            "flex items-center gap-2.5 tracking-[-0.16px] text-graphite " +
            (compact ? "text-[14px] leading-[1.5]" : "text-[16px] leading-[1.5]")
          }
        >
          <span
            aria-hidden
            className={
              "flex shrink-0 items-center justify-center rounded-full bg-coal-ink font-semibold text-white " +
              (compact ? "h-5 w-5 text-[11px]" : "h-6 w-6 text-[12px]")
            }
          >
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
