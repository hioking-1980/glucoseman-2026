# AI maintenance guide

This repository is the production source for the mobile-first support site for
Glucoseman in Yuru-Chara Grand Prix 2026. Read this file before changing code.

## Product intent

- Primary goal: encourage one vote per day for Glucoseman.
- Official identity: Hyogo / Himeji no Tane / Glucoseman / Entry No.111.
- Official ranking source: https://yurugp.jp/vote/2026
- Official vote page: https://yurugp.jp/characters/4524
- Target: 120,000 PT.
- Production Sites URL: https://glucoseman-2026.y-hioki207703.chatgpt.site/
- GitHub Pages mirror: https://hioking-1980.github.io/glucoseman-2026/
- GitHub repository: https://github.com/hioking-1980/glucoseman-2026

## Design requirements

- Treat the site as smartphone-first. Preserve the compact single-column layout.
- The visual source of truth is the supplied `イメージ.png` reference. Do not
  overwrite, optimize, stage, or replace that user-owned file unless explicitly
  requested.
- Keep the dark purple textured background, distressed white campaign title,
  yellow CTAs, and the designed text image `public/aim-12000-banner.png`.
- Use `public/glucoseman.png` for the full-body mascot. Do not crop off the feet.
- The mascot fills purple from the feet upward as points increase. The alpha-bound
  mapping in `app/page.tsx` deliberately makes sub-1% progress visible.
- Achievement percentage is shown with one decimal place, for example `0.5%`.
- Mobile browser chrome uses `#250760`; keep `app/layout.tsx`, `app/globals.css`,
  and `public/manifest.webmanifest` aligned if this color changes.
- The header intentionally has no hamburger icon or `メニュー` label.
- Preserve Japanese copy unless the user explicitly asks to change it.

## Source map

- `app/page.tsx`: page content, calculations, links, mascot fill behavior.
- `app/globals.css`: all responsive layout and visual styling.
- `app/layout.tsx`: metadata, OGP, viewport, theme color, PWA metadata.
- `app/share-button.tsx`: native share interaction and fallback behavior.
- `app/campaign-data.json`: latest verified official snapshot.
- `app/campaign-data.ts`: snapshot validation and Sites runtime fallback.
- `scripts/update-campaign-data.mjs`: official ranking scraper.
- `.github/workflows/sync-ranking.yml`: daily official-data update.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment.
- `public/og.png`: social preview image.

## Official data synchronization

- The primary Sites deployment reads and validates the official ranking at
  request time with `cache: "no-store"`. It must not depend solely on GitHub's
  scheduler, because GitHub documents that scheduled events may be delayed or
  dropped under load.
- GitHub Actions checks at 03:17, 03:37, 03:57, 04:17, 04:37, and 04:57 UTC /
  12:17, 12:37, 12:57, 13:17, 13:37, and 13:57 JST on weekdays. The off-minute
  schedule avoids the documented high-load period near the start of each hour.
- No scheduled sync runs on weekends; the latest verified Friday snapshot is
  retained. Manual `workflow_dispatch` remains available for exceptional checks.
- The scraper must verify all four identity markers before accepting data:
  `兵庫県`, `姫路の種`, `グルコースマン`, and `エントリーNo.111`.
- It extracts rank and PT only after the identity check. On parse/fetch failure,
  fail the workflow and keep the last valid snapshot; never write guessed values.
- When points change, the old `currentPoint` becomes `previousPoint`, which drives
  the `前回更新比` display. If points do not change, preserve `previousPoint`.
- If both points and rank are unchanged, do not rewrite the snapshot or redeploy.
- Sites first reads the latest GitHub snapshot, then reads the official page
  directly. It verifies all identity markers before overriding points and rank.
  If the official request or validation fails, it falls back to the latest
  GitHub snapshot, then to the bundled JSON.
- A changed snapshot explicitly dispatches the Pages deployment workflow because
  commits made by `GITHUB_TOKEN` do not trigger a normal push workflow.
- Do not manually edit official rank or points except as an emergency, verified
  recovery. Keep `targetPoint` at 120000 unless the user changes the campaign goal.

## Safe editing workflow

1. Inspect `git status` first. Preserve unrelated user changes.
2. Edit with focused patches; do not rewrite or replace the working architecture.
3. Run `npm run build` after every source change.
4. For GitHub Pages-specific changes, also verify the static build with:
   `GITHUB_ACTIONS=true NEXT_PUBLIC_BASE_PATH=/glucoseman-2026 NEXT_PUBLIC_SITE_URL=https://hioking-1980.github.io/glucoseman-2026 npx next build`
5. Commit only files belonging to the requested change. Never include `イメージ.png`
   merely because it is modified.
6. Push `main` to the `github` remote. The Pages workflow publishes it.
7. This project also contains `.openai/hosting.json`; when working in Codex Sites,
   follow the Sites build and hosting instructions and deploy the exact validated
   commit to the existing project. Never create a replacement project.

## Local commands

- Install: `npm ci`
- Develop: `npm run dev`
- Validate: `npm run build`
- Lint: `npm run lint`
- Run the official sync manually: `node scripts/update-campaign-data.mjs`

The manual sync requires network access and modifies `app/campaign-data.json`.
Review its diff before committing.

## Guardrails

- Do not invent official points, rank, URLs, or campaign rules.
- Do not remove the official-data validation to make a failed scrape pass.
- Do not add authentication, a database, analytics, or third-party services unless
  explicitly requested.
- Do not expose repository credentials, deployment tokens, or environment secrets.
- Keep external links accessible and preserve meaningful alt text and progressbar
  attributes.
- Avoid redesigning unrelated sections while making a targeted change.
