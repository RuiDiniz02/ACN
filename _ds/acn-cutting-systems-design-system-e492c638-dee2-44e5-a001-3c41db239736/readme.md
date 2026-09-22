# ACN Cutting Systems — Editorial Brand System

An **editorial brand system** — not a UI/app kit — for **ACN Cutting Systems**, a Portuguese manufacturer of CNC
cutting systems and industrial automation for metal processing, part of the **Motofil Group**. It formalizes
the company's existing visual identity (logo, Pantone colors, Changa typeface) and extends it with the print
and editorial foundations needed to produce **Brand Guidelines, Corporate Catalogues, Product Catalogues,
Technical Datasheets, and PowerPoint templates** consistently. There are deliberately no buttons, forms, or
app UI controls here — the building blocks are page-level and print-oriented: typography hierarchy, an
editorial grid, product blocks, technical tables, callouts, section covers, and diagram/iconography direction.

**This is not a redesign.** Every color, typeface, and logo rule comes directly from the company's own
2026 graphic standards manual — this system formalizes and extends that language for digital/document use.

## Sources

- `Manual de Normas Gráficas_ACN_2026.pdf` (uploaded, copied to `uploads/ACN_Manual.pdf`) — the official brand
  manual: logo construction, protection area, color codes (Pantone 2935 C / Black / Cool Gray 3C), the Changa
  typeface family, correct/incorrect logo usage, and a sample corporate brochure spread.
- Logo SVGs (`uploads/ACN Cutting Systems_LOGO_*.svg`) — five official lockup variants.
- Changa TTF family (`uploads/Changa-*.ttf`) — 7 weights, Extra Light through Extra Bold, plus a variable font.
- Product renders and factory photography (`uploads/1.png`–`uploads/8.png`, `uploads/MFL 1630.jpg`) — CNC gantry
  cutting machines (plasma/oxy-fuel and fiber laser) and the ACN/Motofil manufacturing floor in Ílhavo, Portugal.

No Figma file, codebase, or existing UI kit was provided — this system's colors, type, and logo rules are
sourced directly from the brand manual; the component set, spacing/radius/shadow system, and UI kit are
original work built to fit that manual's aesthetic (flat, right-angled, industrial).

## Company & product context

ACN Cutting Systems designs and manufactures gantry-type CNC cutting machines — plasma, oxy-fuel, and fiber
laser — for metal fabrication shops. Visible product lines include the **FELINE** series (compact gantry
plasma systems) and larger multi-torch gantry systems for structural steel plate processing. The company sits
inside the Motofil Group, which also includes fiber laser systems (seen in the Motofil-branded enclosed laser
cutter photographed for this system). Machines carry a consistent blue/dark-grey/black color scheme with
yellow/black hazard striping — standard industrial safety coding, not a designed brand texture.

Address: R. Tomé Barros Queirós, 135, Z. Ind. das Ervosas, APT.50, 3830-252 Ílhavo, Portugal · T. +351 234 320 900

## Content fundamentals

- **Tone**: plain, technical, confident — engineering-first. Sentences state facts (working area, speed,
  accuracy) rather than sell with adjectives. Where the manual samples softer copy ("Hello! We're ACN"), it's
  a brief, warm one-liner used only in welcome/about moments — the rest of the voice stays factual.
- **Casing**: sentence case for body copy and headings; UPPERCASE with wide letter-spacing for eyebrows,
  labels, and the "Cutting Systems" wordmark lockup under the logo.
- **Person**: mostly third person / product-as-subject ("FELINE 2040 combines a welded-steel gantry frame...").
  Occasional direct address ("Who we are / What we do") in nav/about contexts only.
- **Numbers & units**: always metric, always with units inline (2000 × 4000 mm, ± 0.1 mm, 18 m/min) — specs are
  a first-class content type, not an afterthought.
- **No emoji.** No exclamation-heavy marketing language. No filler adjectives ("revolutionary", "game-changing").
- **Example lines** (from the manual's own catalogue spread): "CUTTING SOLUTIONS", "Hello! We're ACN",
  "Welcome to ACN", "Who we are / What we do / Contacts".

## Visual foundations

- **Color**: one brand color — Pantone 2935 C / `#0055b8` — used deliberately, not decoratively. Black and a
  cool gray (`#c8c8c8`) are the only other brand-mandated colors. This system extends blue into a 10-step ramp
  and adds a graphite/steel neutral ramp for text and surfaces, all derived in-family (see Colors tab).
  Backgrounds are almost always white or near-white; blue and near-black are used for section dividers and
  cover slides, never as a busy background. **The logo must never sit on a blue background** (explicit manual
  rule) — always place it on white, black, or grey.
- **Type**: a single typeface, Changa (Google-Fonts-style geometric sans, narrower/condensed proportions),
  across 7 weights. No secondary typeface — hierarchy comes from weight and size, not font mixing. Display use
  leans ExtraBold/Bold at tight tracking; body copy sits at Regular/Medium; labels and eyebrows are SemiBold,
  uppercase, wide-tracked.
- **Backgrounds**: flat color or full-bleed product/factory photography with a dark scrim for text legibility
  (see title slide). No gradients, no textures, no illustration style — the manual explicitly forbids adding
  textures/effects to the logo, and that flatness extends to the rest of the system.
  Photography is straightforward studio product renders (white background) or on-site factory documentary shots
  — cool-toned, unretouched, no heavy grain or warm filtering.
  There is currently no dedicated hero/pattern background asset beyond product photography — see Caveats.
- **Animation**: none specified by the brand; this system defaults to fast, linear-in-feel utility motion
  (120–280ms, standard easing, no bounce/elastic) matching a precision-machinery tone, used only for
  hover/press feedback and modal transitions.
- **Hover / press states**: hover darkens (primary blue → `--acn-blue-700`); press darkens further
  (`--acn-blue-900`). No lightening, no glow, no scale/bounce on press — flat color shift only.
- **Borders & radius**: the brand mark, machines, and signage are all hard right angles. Radius is 0 by
  default; a very small radius (2–4px) is reserved for small UI affordances (inputs, buttons, chips), and a
  full pill radius is used only for the Switch toggle where roundness communicates the on/off affordance.
- **Shadow**: flat and minimal — a thin `shadow-sm` for barely-there separation, `shadow-md`/`lg` reserved for
  modals/overlays. No soft ambient glows.
- **Transparency & blur**: used only for the modal scrim (`rgba` black, no backdrop-blur) — kept purposefully
  utilitarian rather than glassy.
- **Corner radii / cards**: cards are flat white surfaces with a 1px hairline border, no shadow, no radius —
  the visual opposite of a soft "SaaS card." This mirrors the flat panel construction of the machines themselves.
- **Industrial signal accents**: the equipment itself carries yellow/black hazard striping and red/amber/green
  status lighting — available as `--signal-*` tokens for safety/status callouts in technical documents, used
  sparingly and never as a decorative brand color.

## Iconography

No icon system, icon font, or icon SVG set was included in the uploaded materials. The equipment's own UI
panels use simple pictograms (ear protection, eye protection, caution triangle) as safety signage rather than
a UI icon language, and these are not vector assets we have rights to extract. **This system intentionally
ships no icon set.** Component examples (chevrons in IconButton, checkmark in Checkbox) use minimal inline
SVG strokes at 2px weight, matching the flat/no-fill line quality of the machine pictograms — treat these as
placeholders, not a defined icon language. If ACN has or wants a real icon set, Lucide (stroke-based, 2px,
square-ish terminals) is the closest free match to this flat industrial mark-making — recommend confirming
before adopting broadly. No emoji, no unicode-symbol icons are used anywhere in this system.

## Fonts

Changa is a real Google Font — no substitution was necessary. The 7 uploaded static weights (ExtraLight through
ExtraBold) were copied into `assets/fonts/` and wired up in `tokens/fonts.css`. The variable font file was not
used (static weights give more predictable rendering across the printed/exported deliverables this system
targets); it remains in `uploads/` if needed later.

## Index

```
styles.css                     → global stylesheet entry (imports only)
tokens/
  fonts.css                    → @font-face for all 7 Changa weights
  colors.css                   → brand + neutral + semantic color tokens
  typography.css               → type scale, family, weight, tracking tokens
  spacing.css                  → spacing, radius, border, shadow, motion tokens
  print.css                    → editorial grid, print page sizes/bleed, deck geometry, white-space rhythm
assets/
  logos/                       → 6 logo lockups (primary two-tone, all-blue, all-white, grey, blue+white)
  fonts/                       → Changa TTFs (7 static weights)
  imagery/                     → product renders + factory photography
guidelines/
  colors/, type/, spacing/     → foundation specimen cards (Design System tab)
  layout/                      → editorial grid, white-space rules, print & presentation specifications
  brand/                       → logo variants, protection area, incorrect usage, photography direction,
                                  iconography direction, diagram/callout style, signal accents
  slides/                      → 5 sample presentation slide layouts (title, section, product spec, comparison, quote)
components/
  editorial/                   → SectionCover, ProductBlock, TechnicalTable, Callout, StatBlock
layouts/
  spreads/                     → full print-page recreations: technical datasheet, chapter cover, catalogue index
uploads/                       → original source files as provided (manual, logos, fonts, product photos)
SKILL.md                       → Claude-Code-compatible skill wrapper for this design system
```

## Components (editorial building blocks)

Five page-level primitives, all print/editorial — not app UI:

- **SectionCover** — full-bleed chapter/section divider (brand-blue, dark, or light ground; optional dimmed photo)
- **ProductBlock** — the repeating catalogue unit: image, eyebrow, name, descriptor, spec teaser (grid or row layout)
- **TechnicalTable** — hairline-row spec/dimension table for datasheets
- **Callout** — rule-set-off pull-quote/note/warning block (never a filled or rounded box)
- **StatBlock** — row of big-number infographic stats with hairline dividers

### Intentional additions
None beyond these five — this system deliberately excludes buttons, inputs, and other app-UI controls per the
brand's editorial/print use case.

## Caveats & next steps

- **Colors and type are exact** (Pantone codes and font family taken directly from the manual). The neutral
  ramp, spacing/radius/shadow scale, motion tokens, and all components are **original work** built to match the
  manual's flat/industrial aesthetic — not sourced from an existing digital design system, because none was
  provided. Please flag anything that doesn't feel on-brand.
- **No icon set** was provided or invented (see Iconography) — this is the biggest open gap. If ACN has brand
  icons, or wants one commissioned/licensed, send them over and this system can wire them in properly.
- The PDF manual's own sample catalogue/brochure spread (pages 7–11, "Aplicações") uses placeholder Latin
  filler text, so it wasn't a usable source for real product copy beyond the cover lines quoted above.
- **Please review and iterate with me** — tell me what's off (a color that reads wrong, a component that
  doesn't match how ACN actually presents machines, copy tone that's too stiff or too soft) and I'll refine it.

## Print specifications (summary)

A4 (210×297mm) for the Portuguese/EU market, US Letter (216×279mm) where needed; 3mm bleed, 12mm safe margin,
300dpi minimum, CMYK with Pantone 2935 C held as a spot color where the print process allows it. Presentation
decks are 1920×1080 (16:9) with a 96px safe margin. Full detail in the "Layout" group of the Design System tab.
