import { NightLanding } from "@/components/night/night-landing";
import { homeJsonLd, jsonLdString } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      {/* Organization + WebSite + SoftwareApplication + FAQPage, as one @graph.
          Rendered server-side in the page body: crawlers read JSON-LD anywhere
          in the document, and keeping it beside the page it describes means the
          noindexed /compare route does not inherit an FAQ schema for content it
          does not have. The FAQ entries come from the same `faqs` array the
          page renders, so the two cannot disagree. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd) }}
      />
      <NightLanding />
    </>
  );
}
