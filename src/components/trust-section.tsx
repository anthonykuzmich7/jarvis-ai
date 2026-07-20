import { ShieldIcon, LaptopIcon, CheckIcon } from "@/components/icons";

const PILLARS = [
  {
    Icon: ShieldIcon,
    title: "Permission-scoped access",
    body: "Jarvis only sees what you already have access to. No new permissions, no expanded reach.",
  },
  {
    Icon: LaptopIcon,
    title: "Local sync",
    body: "Your context stays synced locally, on your device. Nothing leaves without you knowing.",
  },
  {
    Icon: CheckIcon,
    title: "Human-approved next steps",
    body: "Jarvis proposes what to do next. You decide what happens — nothing executes without your review.",
  },
] as const;

export function TrustSection() {
  return (
    <section id="trust" className="scroll-mt-24 bg-ledger-white">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {PILLARS.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ash bg-white text-graphite"
                style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-[15px] font-semibold leading-[1.3] tracking-[-0.2px] text-coal-ink">
                {title}
              </h3>
              <p className="text-[13.5px] leading-[1.6] text-slate-mid">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
