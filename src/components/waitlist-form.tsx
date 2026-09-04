"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { capture, identifyLead } from "@/lib/analytics";
import { joinWaitlist, type WaitlistState } from "@/app/actions";
import { ArrowRightIcon } from "@/components/icons";
import { ROLE_OPTIONS } from "@/lib/roles";
import { attributionFields } from "@/lib/attribution";

const initialState: WaitlistState = { status: "idle", message: "" };


function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function RoleSelect({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative sm:w-52">
      {/* Hidden input carries the value to the form action */}
      <input type="hidden" name={name} value={selected?.value ?? ""} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[52px] w-full cursor-pointer items-center justify-between rounded-[12px] border border-ash bg-white px-4 text-[14px] outline-none transition-[border-color,box-shadow] focus-visible:border-coal-ink focus-visible:ring-2 focus-visible:ring-coal-ink/10"
      >
        <span className={selected ? "text-coal-ink" : "text-stone"}>
          {selected?.label ?? "Who are you?"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-graphite transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1.5 w-full overflow-hidden rounded-[10px] border border-ash bg-white py-1"
          style={{
            boxShadow:
              "rgba(95,99,106,0.1) 0px 0px 0px 1px, rgba(43,43,48,0.12) 0px 4px 20px 0px",
          }}
        >
          {ROLE_OPTIONS.map((opt) => (
            <li key={opt.value} role="option" aria-selected={selected?.value === opt.value}>
              <button
                type="button"
                onClick={() => { setSelected(opt); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-ash ${
                  selected?.value === opt.value
                    ? "font-semibold text-coal-ink"
                    : "text-graphite"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-[52px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[48px] bg-coal-ink px-8 text-[14px] font-semibold text-white transition-colors hover:bg-coal-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Joining…" : "Join the waitlist"}
      {!pending && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  /* The action only echoes the email back, but the properties worth putting on
     the conversion — role, campaign, which page they were standing on — were
     all on the submission. Carry them across the round trip. */
  const submitted = useRef<Record<string, string>>({});

  useEffect(() => {
    if (state.status === "success") {
      /* Everything this browser did anonymously before the form was filled in
         gets stitched onto the person the moment we have an address for them. */
      if (state.email) identifyLead(state.email, submitted.current);
      capture("waitlist_signup", submitted.current);
    } else if (state.status === "error") {
      capture("waitlist_error", {
        ...submitted.current,
        message: state.message,
      });
    }
  }, [state]);

  const submit = (formData: FormData) => {
    const attribution = attributionFields();
    for (const [name, value] of Object.entries(attribution)) {
      formData.set(name, value);
    }

    submitted.current = {
      role: String(formData.get("role") ?? ""),
      ...attribution,
    };

    // Fired before the server answers, so the funnel has a denominator: how
    // many people pressed the button, not just how many rows reached the sheet.
    capture("waitlist_submitted", submitted.current);

    formAction(formData);
  };

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="py-2 text-center">
        {/* Live status indicator — Panxo reserves Mint Pulse for signal states, not fills */}
        <p className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite">
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="signal-pulse absolute inline-flex h-full w-full rounded-full bg-mint-pulse" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint-pulse" />
          </span>
          On the list
        </p>

        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-[1.55] tracking-[-0.16px] text-slate-mid text-pretty">
          {state.email ? (
            <>
              We&apos;ll email{" "}
              <span className="font-semibold text-coal-ink">{state.email}</span>{" "}
              as we open spots.
            </>
          ) : (
            "We'll email you as we open spots."
          )}
        </p>
      </div>
    );
  }

  return (
    <form action={submit} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Email */}
        <div className="flex-1">
          <label htmlFor="email" className="sr-only">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            aria-invalid={state.status === "error"}
            className="h-[52px] w-full cursor-text rounded-[12px] border border-ash bg-white px-4 text-[14px] text-coal-ink shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-stone focus-visible:border-coal-ink focus-visible:ring-2 focus-visible:ring-coal-ink/10"
          />
        </div>

        {/* Custom role dropdown */}
        <RoleSelect name="role" />

        <SubmitButton />
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-[13px] text-slate-mid">
        {state.status === "error" ? (
          <span className="text-destructive">{state.message}</span>
        ) : (
          "No spam. We'll only reach out about early access."
        )}
      </p>
    </form>
  );
}
