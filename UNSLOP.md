# Unslop pass

Done with the unslop skill (unslop by Damir Sokolovsky, @heydamir, CC BY 4.0) on November 25, 2026, right after the first build.

## Audit

Light slop. Built against the skill from the start; the first screenshots showed one real sign and two bugs.

- Every day bar in full-strength green, so the incident days didn't stand out (every element highlighted): `src/components/Components.astro`
- The day tooltip showed as a black blob under the systems list, because its `display: grid` beat the `hidden` attribute: `Components.astro`
- Header buttons pushed past a 360px screen: `src/layouts/Base.astro`
- The incident page title was a visually hidden h1 next to a smaller visible h2: `src/pages/incidents/[id].astro`
- Checked and clean: no gradients, glows, blobs, pills above the headline, emoji, uppercase tracked labels, italics, heavy weights, trailing periods on labels or buttons, hype words or looping motion (no pulsing dot, even on the active incident)

## Direction

- Product: the public status page for Parcelwise, a shipping label and tracking API, read by developers when something looks wrong
- Character: calm, factual, quick to scan
- World: an operations wall at night; instrument readouts, shift logs, the timestamp column
- Moments: the 90-day bars, the only rich color on the page, where incident days carry the color and quiet days recede
- Signature: every timestamp in mono, converted to the reader's time zone

## Changes

- Spacing: 4px scale; component rows 16px top and bottom; sections 48px apart
- Color: a graphite ramp with no tint, so the four status colors are the only hues; operational days at 45% strength so degraded, outage and maintenance days lead; toned semantic text colors with a dark set
- Type: Onest for text, JetBrains Mono for times, durations and uptime; weights 400 to 600; sentence case
- Layout: a single reading column like an operations log; incidents as cards with a colored edge and a dotted timeline; the incident page leads with its own title
- Motion: none beyond hover color and a small press scale

screenshot-2: Systems with 90-day uptime bars
screenshot-3: An incident page with its update timeline
