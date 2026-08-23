import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

/* Same artwork as the Open Graph card. Declared as its own route rather than
   left to fall through, so `twitter:image` is emitted explicitly — the
   `summary_large_image` card type renders blank if the tag is missing. */
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard();
}
