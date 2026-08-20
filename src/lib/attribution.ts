/*
  First-touch attribution.

  UTM params only exist on the URL of the page someone lands on. If a visitor
  arrives from Instagram at /?utm_source=instagram, reads /compare, then comes
  back to sign up, the params are long gone from the URL — and the lead would
  be recorded as direct traffic.

  So we snapshot where they came from on their first page of the visit and keep
  it for the rest of the session. First touch wins: a later internal navigation
  never overwrites the original source.

  sessionStorage, not localStorage — the snapshot dies with the tab. It is
  scoped to the visit in which someone signs up, rather than following them
  across days, which keeps this well clear of needing a consent banner.
*/

const KEY = "jarvis:first-touch";

export type Attribution = {
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

const EMPTY: Attribution = {
  referrer: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
};

/** Reads what the *current* URL and referrer say about where this visitor came from. */
function readCurrent(): Attribution {
  const params = new URLSearchParams(window.location.search);

  // Same-origin referrers are internal navigation, not where they came from.
  let referrer = "";
  if (document.referrer) {
    try {
      const url = new URL(document.referrer);
      if (url.hostname !== window.location.hostname) referrer = document.referrer;
    } catch {
      // Malformed referrer: treat as direct traffic.
    }
  }

  return {
    referrer,
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
  };
}

function hasSignal(a: Attribution): boolean {
  return Boolean(a.referrer || a.utm_source || a.utm_medium || a.utm_campaign);
}

/**
 * Stores where this visit originated, once per session.
 * Safe to call on every page load — subsequent calls are no-ops.
 */
export function captureFirstTouch(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;

    const current = readCurrent();
    // Direct traffic carries no signal; leave the slot open so a later page
    // with a real source (e.g. a tagged link opened into the same tab) wins.
    if (!hasSignal(current)) return;

    sessionStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Storage blocked (private mode, cookie settings). Fall back to live URL.
  }
}

/** The fields the waitlist form submits, preferring first touch over the live URL. */
export function attributionFields(): Record<string, string> {
  let source = readCurrent();

  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) source = { ...EMPTY, ...(JSON.parse(stored) as Attribution) };
  } catch {
    // Unreadable or corrupt snapshot: the live URL is still a fair answer.
  }

  return {
    page: window.location.pathname,
    referrer: source.referrer,
    utm_source: source.utm_source,
    utm_medium: source.utm_medium,
    utm_campaign: source.utm_campaign,
  };
}
