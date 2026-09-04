import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Lato } from "next/font/google";
import { PostHogAnalytics } from "@/components/posthog-provider";
import { AttributionCapture } from "@/components/attribution-capture";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_DESCRIPTION,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Slack's UI typeface — used only inside the Slack product-demo mockup.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  /* Required for relative canonicals and OG image paths to resolve to absolute
     URLs. Without it Next throws at build time for any relative metadata URL. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    /* Child routes get "<page> — Jarvis" without repeating the brand by hand. */
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  /* The apex and the old *.vercel.app deployment URL both serve this same HTML.
     The canonical is what tells Google those are one page, not three. */
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    /* Was `summary`, a small square thumbnail, because no image was set at all.
       `summary_large_image` plus the generated opengraph-image gives the full
       1200x630 card. */
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      /* Lets Google use full-size thumbnails in Images and Discover, and stops
         it truncating our snippet to a length it guesses at. Both default to
         conservative values otherwise. */
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ledger-white">
        {/* Read here, in a server component, because the variable is a plain
            secret rather than a NEXT_PUBLIC_ one — see the provider. */}
        <PostHogAnalytics apiKey={process.env.POSTHOG_KEY}>
          {children}
          <AttributionCapture />
        </PostHogAnalytics>
      </body>
    </html>
  );
}
