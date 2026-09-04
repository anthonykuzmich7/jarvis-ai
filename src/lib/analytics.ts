/*
  The named events, in one place.

  Autocapture already records every click, form submit and route change, so
  nothing here is about *coverage* — it is about legibility. An autocaptured
  click reads as `click on button.cta-shine.relative...` in a funnel, which is
  unreadable six weeks later and breaks the moment the class list changes. The
  handful of moments below are the ones a funnel is actually built out of, so
  they get stable names and hand-picked properties that survive a redesign.

  Keep this list short. Anything that is merely interesting rather than
  funnel-shaped is better left to autocapture.
*/

import posthog from "posthog-js";

export type AnalyticsEvent =
  /** Form posted — the top of the signup funnel, fired before we know it worked. */
  | "waitlist_submitted"
  /** The lead was saved. The conversion. */
  | "waitlist_signup"
  /** The submit came back with an error, so a drop-off has a reason attached. */
  | "waitlist_error"
  /** "Watch how it works" — the film modal opened. */
  | "film_opened"
  /** A hero tab was chosen, which says which pitch the visitor wanted. */
  | "hero_tab_selected"
  /** The nav's "Get early access" button, on either breakpoint. */
  | "nav_cta_clicked";

/**
 * Records an event, or does nothing at all when PostHog never initialised.
 *
 * No key in the environment is the normal state locally and in any fork, and
 * it must not throw or spam the console there — a missing analytics key is not
 * a broken page.
 */
export function capture(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
): void {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/**
 * Ties every event in this browser — including the anonymous ones from before
 * the form was filled in — to the person who just signed up.
 *
 * `person_profiles` stays on its `identified_only` default, so this is the
 * only call that ever creates a profile. Visitors who never sign up remain
 * anonymous and cost nothing.
 */
export function identifyLead(
  email: string,
  properties?: Record<string, unknown>,
): void {
  if (!posthog.__loaded) return;
  posthog.identify(email, { email, ...properties });
}
