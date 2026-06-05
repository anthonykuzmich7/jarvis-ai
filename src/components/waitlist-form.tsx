"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type WaitlistState } from "@/app/actions";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

const initialState: WaitlistState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Joining…" : "Join the waitlist"}
      {!pending && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto flex max-w-md items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-5 py-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-foreground">You&apos;re on the list</p>
          <p className="text-sm text-muted-foreground">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-xl" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="email" className="sr-only">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            aria-invalid={state.status === "error"}
            className="h-12 w-full rounded-lg border border-input bg-card px-4 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <div className="sm:w-44">
          <label htmlFor="role" className="sr-only">
            Your role
          </label>
          <select
            id="role"
            name="role"
            defaultValue=""
            className="h-12 w-full cursor-pointer rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="" disabled>
              I&apos;m in…
            </option>
            <option value="people-hr">People / HR</option>
            <option value="engineering">Engineering</option>
            <option value="it-devops">IT / DevOps</option>
            <option value="leadership">Leadership</option>
            <option value="other">Something else</option>
          </select>
        </div>

        <SubmitButton />
      </div>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-sm text-muted-foreground"
      >
        {state.status === "error" ? (
          <span className="text-destructive">{state.message}</span>
        ) : (
          "No spam. We'll only reach out about early access."
        )}
      </p>
    </form>
  );
}
