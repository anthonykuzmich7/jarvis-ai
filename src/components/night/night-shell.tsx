import Link from "next/link";
import { NightMark } from "@/components/night/night-mark";
import { FilmButton, GetStartedLink } from "@/components/night/night-actions";
import { contentPages } from "@/lib/content/pages";
import { CONTACT_EMAIL } from "@/lib/site";

/*
  The chrome every Night page shares: the nav and the footer. On the homepage
  the section links are in-page anchors; anywhere else they point back at the
  homepage's sections.
*/

export function Brand({ size, text }: { size: number; text: number }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <NightMark size={size} />
      <span style={{ fontSize: text, fontWeight: 700, letterSpacing: "-0.035em", color: "#F4F4F5" }}>Jarvis</span>
    </span>
  );
}

const section = (home: boolean, id: string) => (home ? `#${id}` : `/#${id}`);

export function NightNav({ home }: { home: boolean }) {
  return (
    <nav aria-label="Main" className="nt-wrap nt-nav">
      <Link href="/" aria-label="Jarvis — home">
        <Brand size={30} text={21} />
      </Link>
      <div className="nt-nav-links">
        <a href={section(home, "product")}>Product</a>
        <a href={section(home, "faq")}>FAQ</a>
      </div>
      {home ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GetStartedLink label="Sign in" placement="nav_sign_in" className="nt-nav-small nt-signin" />
          <GetStartedLink placement="nav" className="nt-nav-small nt-btn-primary" />
        </div>
      ) : (
        // Already on the download page: "Get started" would only reload it.
        <FilmButton placement="download_nav" className="nt-nav-small nt-signin" />
      )}
    </nav>
  );
}

type FooterLink = { label: string; href: string; external?: boolean };

/* Every content page is linked from here, grouped: the comparisons under
   Compare, everything else under Resources. These links are how /mcp, the
   comparisons and the rest are reached at all. */
const compare = contentPages.filter((p) => p.path.startsWith("/vs/"));
const resources = contentPages.filter((p) => !p.path.startsWith("/vs/"));

function footerColumns(home: boolean): { title: string; links: FooterLink[] }[] {
  return [
    {
      title: "Product",
      links: [
        { label: "Overview", href: section(home, "product") },
        { label: "Meetings", href: section(home, "meetings") },
        { label: "FAQ", href: section(home, "faq") },
        { label: "Download", href: "/download" },
      ],
    },
    { title: "Resources", links: resources.map((p) => ({ label: p.nav, href: p.path })) },
    { title: "Compare", links: compare.map((p) => ({ label: p.nav.replace(/^Jarvis vs /, "vs "), href: p.path })) },
    {
      title: "Company",
      links: [
        { label: "Contact", href: `mailto:${CONTACT_EMAIL}`, external: true },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];
}

export function NightFooter({ home }: { home: boolean }) {
  return (
    <footer className="nt-foot">
      <div className="nt-wrap nt-foot-grid">
        <div className="nt-foot-brand">
          <Link href="/" aria-label="Jarvis — home">
            <Brand size={28} text={19} />
          </Link>
        </div>
        {footerColumns(home).map((col) => (
          <nav key={col.title} aria-label={col.title} className="nt-foot-col">
            <h2>{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.external || l.href.includes("#") ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="nt-wrap nt-foot-base">
        <span>© {new Date().getFullYear()} Jarvis</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
    </footer>
  );
}
