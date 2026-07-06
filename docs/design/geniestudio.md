# Geniestudio — Style Reference
> playful pastel sky with floating doodles

**Theme:** light

Geniestudio speaks the visual language of a modern design canvas: an airy, pastel-blue workspace where playful illustrated characters drift across generous negative space. The system pairs one near-black CTA (#181d27) against a pale blue canvas (#ebf5ff) with a quartet of saturated illustration accents — cornflower blue, tangerine, violet, mustard — that inject warmth without competing with the UI. Typography is restrained and geometric: Aeonik weight 500 carries the headlines with tight -0.02em tracking, while Geist 500/600 handles everything from 10px captions to button labels. Surfaces are flat, borders are hairline, radii are generous (32px is the default), and shadows are barely-there blue-tinted washes rather than dark drops. The result is a tool that feels creative, approachable, and quietly confident — color is reserved for storytelling, not chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky Wash | `#ebf5ff` | `--color-sky-wash` | Page canvas — pale blue sets the airier alternative to pure white and gives the page a soft atmospheric base |
| Paper White | `#fafdff` | `--color-paper-white` | Card and elevated surface — a whisper cooler than pure white, keeps surfaces from feeling stark against the sky canvas |
| Cloud Veil | `#f6f7f8` | `--color-cloud-veil` | Subtle alternate surface and fill wash for muted UI elements that need separation without contrast |
| Pure White | `#ffffff` | `--color-pure-white` | Nested card surfaces, icon fills, and button text |
| Midnight Ink | `#0a0d12` | `--color-midnight-ink` | Primary text and heading color — near-black with a cool cast, achieves 19.5:1 against white |
| Pressed Charcoal | `#181d27` | `--color-pressed-charcoal` | Primary action buttons and dark UI blocks |
| Stone | `#535862` | `--color-stone` | Body text, hairline borders, and icon strokes |
| Fog | `#93979f` | `--color-fog` | Muted helper text, secondary borders, and disabled states |
| Cornflower | `#4fbeff` | `--color-cornflower` | Illustration accent and decorative icon stroke |
| Tangerine | `#f26110` | `--color-tangerine` | Illustration accent and decorative warm pop |
| Amethyst | `#9552e0` | `--color-amethyst` | Illustration accent and decorative stroke |
| Mustard | `#bb9915` | `--color-mustard` | Illustration accent and decorative warm-yellow stroke |
| Signal Blue | `#0099ff` | `--color-signal-blue` | Link text, active link borders, and decorative brand-blue fills |
| Deep Cobalt | `#0069e0` | `--color-deep-cobalt` | Hover/active state for Signal Blue, gradient stop |
| Morning Tint | `#cce7ff` | `--color-morning-tint` | Tinted card and chip background |
| Lilac Mist | `#f1e6ff` | `--color-lilac-mist` | Tinted card background for purple-coded sections |
| Sprout | `#d3f6e3` | `--color-sprout` | Highlight backgrounds and decorative bands |
| Buttery Gradient | `linear-gradient(rgb(255, 249, 224) 0%, rgb(255, 236, 163) 100%)` | `--color-buttery-gradient` | Soft warm wash for feature callouts |
| Lilac Gradient | `linear-gradient(rgb(244, 235, 255) 0%, rgb(228, 204, 255) 100%)` | `--color-lilac-gradient` | Soft purple wash for feature callouts |
| Sky Gradient | `linear-gradient(rgb(229, 246, 255) 0%, rgb(194, 233, 255) 100%)` | `--color-sky-gradient` | Soft blue wash for feature callouts |
| Sunset Gradient | `linear-gradient(rgb(255, 242, 235) 0%, rgb(255, 209, 184) 100%)` | `--color-sunset-gradient` | Warm orange wash for feature callouts |
| Brand Blue Gradient | `linear-gradient(rgb(71, 157, 255) 11.43%, rgb(0, 105, 224) 78.2%)` | `--color-brand-blue-gradient` | The signature brand gradient for hero accents and premium surfaces |

## Tokens — Typography

### Aeonik — Display and heading family
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 500
- **Sizes:** 20px, 24px, 32px, 48px, 72px, 148px
- **Line height:** 1.05–1.25
- **Letter spacing:** -0.0200em
- **OpenType features:** `"case"`
- **Role:** Display and heading family — a single weight (500) across all display sizes

### Geist — Body, UI, caption, and button family
- **Substitute:** Inter, Söhne, Geist Sans (open-source)
- **Weights:** 500, 600
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.14–1.50
- **Letter spacing:** -0.0100em
- **OpenType features:** `"case"`
- **Role:** Body, UI, caption, and button family

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.14 | -0.1px | `--text-caption` |
| body | 14px | 1.35 | -0.14px | `--text-body` |
| body-lg | 16px | 1.5 | -0.16px | `--text-body-lg` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 20px | 1.25 | -0.4px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.17 | -0.96px | `--text-heading-lg` |
| display | 72px | 1.11 | -1.44px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 32px |
| icons | 16px |
| pills | 9999px |
| images | 16px |
| buttons | 32px |
| cards-inner | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(4, 69, 144, 0.08) 0px 14px 20px 4px` | `--shadow-lg` |
| subtle | `rgba(10, 13, 18, 0.8) 0px 1px 2px 0px, rgb(10, 13, 18) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64–80px
- **Card padding:** 24–40px
- **Element gap:** 16–24px

## Components

### Primary Action Button (filled)
Pressed Charcoal (#181d27) background, white text, Geist 500 at 16px, 9999px pill radius, 12px vertical / 28px horizontal padding.

### Ghost Navigation Button
Same Pressed Charcoal fill but smaller — Geist 500 at 14px, white text, 9999px radius, 8px vertical / 16px horizontal padding.

### Testimonial Card
Paper White (#fafdff) surface, 1px Stone (#535862) hairline border, 32px border-radius, 40px padding. No drop shadow.

### Feature Callout Card (tinted)
Tinted surface (Morning Tint, Lilac Mist, Sprout, or Veil), 32px border-radius, 24–40px padding.

### Top Navigation Bar
Transparent over sky canvas, no background fill. Left: logomark + wordmark in Midnight Ink. Center: Geist 14px text links in Stone. Right: ghost dark button.

### Hero Headline Block
Centered, Aeonik 500 at 72–148px, Midnight Ink (#0a0d12), letter-spacing -1.44px, line-height 1.05–1.11. Geist 18px weight 500 subtext in Stone below.

## Do's and Don'ts

### Do
- Use Pressed Charcoal (#181d27) exclusively for the primary action
- Set every card, button, and large container to 32px border-radius
- Keep the page canvas at Sky Wash (#ebf5ff)
- Pair Aeonik 500 for all display text with Geist 500/600 for all UI text
- Use the four illustration accents (Cornflower, Tangerine, Amethyst, Mustard) only for decorative illustration and icon fills
- Apply -0.02em letter-spacing to all Aeonik text and -0.01em to all Geist text
- Separate cards from the canvas with a 1px Stone (#535862) border

### Don't
- Do not use Signal Blue or Deep Cobalt for primary action buttons
- Do not apply heavy dark drop-shadows
- Do not use the illustration accent colors for body text or functional UI states
- Do not use multiple font families
- Do not mix radii — the scale is 8px (inner), 16px (icons/images), 32px (default)
- Do not fill the page with saturated colors
- Do not use pure white (#ffffff) for the page canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sky Canvas | `#ebf5ff` | Page background |
| 1 | Paper Card | `#fafdff` | Default card and panel surface |
| 2 | Pure White Nest | `#ffffff` | Nested elements, icons inside cards |
| 3 | Tinted Chip | `#cce7ff` | Category-tinted cards |
| 4 | Veil | `#f6f7f8` | Muted fill for secondary blocks |

## CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sky-wash: #ebf5ff;
  --color-paper-white: #fafdff;
  --color-cloud-veil: #f6f7f8;
  --color-pure-white: #ffffff;
  --color-midnight-ink: #0a0d12;
  --color-pressed-charcoal: #181d27;
  --color-stone: #535862;
  --color-fog: #93979f;
  --color-cornflower: #4fbeff;
  --color-tangerine: #f26110;
  --color-amethyst: #9552e0;
  --color-mustard: #bb9915;
  --color-signal-blue: #0099ff;
  --color-deep-cobalt: #0069e0;
  --color-morning-tint: #cce7ff;
  --color-lilac-mist: #f1e6ff;
  --color-sprout: #d3f6e3;
  --gradient-buttery: linear-gradient(rgb(255, 249, 224) 0%, rgb(255, 236, 163) 100%);
  --gradient-lilac: linear-gradient(rgb(244, 235, 255) 0%, rgb(228, 204, 255) 100%);
  --gradient-sky: linear-gradient(rgb(229, 246, 255) 0%, rgb(194, 233, 255) 100%);
  --gradient-sunset: linear-gradient(rgb(255, 242, 235) 0%, rgb(255, 209, 184) 100%);
  --gradient-brand-blue: linear-gradient(rgb(71, 157, 255) 11.43%, rgb(0, 105, 224) 78.2%);

  /* Typography */
  --font-aeonik: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, sans-serif;

  /* Border Radius */
  --radius-cards: 32px;
  --radius-icons: 16px;
  --radius-pills: 9999px;
  --radius-buttons: 32px;
  --radius-cards-inner: 8px;

  /* Shadows */
  --shadow-lg: rgba(4, 69, 144, 0.08) 0px 14px 20px 4px;
  --shadow-subtle: rgba(10, 13, 18, 0.8) 0px 1px 2px 0px, rgb(10, 13, 18) 0px 0px 0px 1px;
}
```

## Tailwind v4

```css
@theme {
  --color-sky-wash: #ebf5ff;
  --color-paper-white: #fafdff;
  --color-cloud-veil: #f6f7f8;
  --color-midnight-ink: #0a0d12;
  --color-pressed-charcoal: #181d27;
  --color-stone: #535862;
  --color-fog: #93979f;
  --color-cornflower: #4fbeff;
  --color-tangerine: #f26110;
  --color-amethyst: #9552e0;
  --color-mustard: #bb9915;
  --color-signal-blue: #0099ff;
  --color-deep-cobalt: #0069e0;
  --color-morning-tint: #cce7ff;
  --color-lilac-mist: #f1e6ff;
  --color-sprout: #d3f6e3;
}
```

## Similar Brands

- **Figma** — Soft pastel canvas, generous whitespace, rounded cards, single dark primary action
- **Linear** — Hairline-border card treatment, tight letter-spacing, one decisive accent color
- **Pitch** — Playful character-driven illustrations mixed with clean SaaS UI
- **Notion** — Airy generous layout, minimal borders, soft surfaces, illustrations breathing across canvas
