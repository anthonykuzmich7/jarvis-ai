import { MissionControlJarvis } from "@/components/mission-control-jarvis";
import { OrbitSyncJarvis } from "@/components/orbit-sync-jarvis";

function Label({ letter, name, desc }: { letter: string; name: string; desc: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-ash bg-parchment px-8 py-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coal-ink font-mono text-sm font-bold text-white">
        {letter}
      </span>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-graphite">Option {letter}</p>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-ledger-white">
      <div className="sticky top-0 z-50 border-b border-ash bg-white/90 px-8 py-4 backdrop-blur">
        <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-graphite">
          Meet Jarvis — Layout Comparison · Scroll to compare
        </p>
      </div>

      {/* Option A */}
      <Label
        letter="A"
        name="Mission Control"
        desc="Split terminal log (dark) + context card (light) — developer-authentic, real-time feel"
      />
      <MissionControlJarvis />

      {/* Divider */}
      <div className="h-2 bg-ash/40" />

      {/* Option B */}
      <Label
        letter="B"
        name="The Orbit"
        desc="Tool icons orbit a central Jarvis node with depth — whimsical, unexpected, kinetic"
      />
      <OrbitSyncJarvis />
    </main>
  );
}
