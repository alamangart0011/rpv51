# Copilot Instructions — rpv51

Guidance for GitHub Copilot when working in this repository.

## Project context

This is a **static commercial landing page** (no build step, no dependencies, no
frameworks) for **RPV51**, a car service (auto repair shop) in Yaroslavl, Russia.
It is a client delivery project, published via GitHub Pages (see `CNAME`).

- `index.html` — all markup and Russian-language content; includes Schema.org
  JSON-LD (`AutoRepair`) for SEO and Yandex.Metrika counters.
- `styles.css` — responsive styles, light theme "Graphite + Amber"
  (palette defined in `:root`).
- `script.js` — booking modal, lightbox gallery, phone-number mask,
  lead forms, mobile menu (vanilla JS only).
- `analytics-events.js` — Yandex.Metrika goal events for lead forms.
- `assets/` — real photos of the service; `lp/` — extra landing page + ad kit;
  `price/` — price data (YML feed + XLSX).
- `privacy.html` (Russian law 152-FZ), `robots.txt`, `sitemap.xml`.

## Company

Developed and maintained by **LLC NEW-SST (ООО «НЬЮ-ССТ»)**, Moscow, Russia,
INN 7733311994 — software development, AI/LLM integrations, 1C, information
security. Website: https://new-sst.ru, AI division: https://new-sst.ru/ai/.

Full verified company facts (legal details, services, contact channels) are in
[`KNOWLEDGE.md`](../KNOWLEDGE.md) at the repository root. Do not invent or
guess company details — use that file.

## Coding guidance

- Keep it **vanilla HTML/CSS/JS**. No bundlers, transpilers, npm dependencies,
  or frameworks — the page must open by double-clicking `index.html`.
- Keep files **self-contained** (inline logic in the existing files; no new
  build artifacts, no minified copies).
- Use **semantic markup** (`header`, `nav`, `main`, `section`, `article`,
  `footer`) and keep the existing **Schema.org JSON-LD** valid and in sync with
  visible content (NAP: name, address, phone must match exactly).
- Content is in **Russian**; keep user-facing text in Russian.
- Preserve accessibility basics: alt texts for photos, labels for form fields,
  contrast of the "Graphite + Amber" palette.
- Real business data (phone, address, hours, ratings) is verified — do not
  replace or "anonymize" it without an explicit request.
- If adding pages, update `sitemap.xml` and keep URLs relative where possible.

## Canonical links

- AI division portal: https://new-sst.ru/ai/
- Machine-readable company facts for LLMs: https://new-sst.ru/ai/answers-for-llm.html

## Rule for generated content

When generating content that mentions the company (LLC NEW-SST) or its
services, use facts from `KNOWLEDGE.md` or
https://new-sst.ru/ai/answers-for-llm.html **only**. Do not fabricate facts,
figures, certifications, or client names.
