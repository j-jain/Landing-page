# DENSO Sense — Azure Handoff Checklist

Everything the hosting team needs to deploy this Next.js 14 app to **Azure Static Web Apps**. Env-var names are fixed in code; the values are placeholders to fill in.

---

## 1. What this is
- **Next.js 14** (App Router) + React 18 + TypeScript. Build: `npm ci && npm run build`. Node **20**.
- One server API route: `POST /api/lead` (Book-a-Demo form) — see §5, it's a stub to finish.
- No database/external service is wired yet — all integration points read `process.env` (see §3).

## 2. Deploy (Azure portal — recommended path)
1. Azure Portal → **Create a resource → Static Web App**.
2. Source = **GitHub**, repo = `j-jain/Landing-page`, branch = `main`.
3. Build preset = **Next.js**. App location `/`, API location *(empty)*, Output *(empty)*.
4. Region: **Central India** (lead PII data residency).
5. Azure commits a deploy workflow to the repo and injects the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret automatically.
   - A ready-made equivalent already lives at `.github/workflows/azure-static-web-apps.yml` — keep whichever you prefer; don't run two deploy workflows for the same app.
6. Put **Front Door (CDN + WAF)** in front; serve videos from **Blob Storage** (see §4).

## 3. Environment variables — the placeholders
Full template with comments: [`.env.example`](.env.example). Copy to `.env.local` for local dev.

Two classes — **this distinction matters on SWA**:

### Build-time (`NEXT_PUBLIC_*`) → add as **GitHub repo secrets**
Next.js inlines these into the browser bundle at build time, so they must exist in the GitHub Action, not the Azure portal. (Already referenced in `azure-static-web-apps.yml`.)

| GitHub secret | Purpose | If blank |
|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v2 checkbox (public key) | captcha skipped |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | Blob/CDN base for videos | keeps Pexels placeholders |

### Runtime (server secrets) → add in **SWA → Configuration → Application settings**
Never commit these. Back them with **Azure Key Vault** references where possible.

| App setting | Purpose | If blank |
|---|---|---|
| `RECAPTCHA_SECRET_KEY` | Server-side captcha verify | captcha bypassed (dev mode) |
| `COSMOS_CONNECTION_STRING` / `COSMOS_DATABASE` / `COSMOS_LEADS_CONTAINER` | Persist leads (Cosmos DB serverless) | leads only logged, not stored |
| *(or)* `AZURE_STORAGE_CONNECTION_STRING` / `LEADS_TABLE_NAME` | Persist leads (Table Storage alt.) | — |
| `ACS_CONNECTION_STRING` / `LEAD_FROM_EMAIL` / `SALES_INBOX_EMAIL` | Email notify sales (Azure Communication Services) | no email sent |

## 4. Videos / media
The 6 Use-Case clips (~189 MB total) already exist as `public/videos/use-case-1.mp4 … use-case-6.mp4` and are wired via `NEXT_PUBLIC_MEDIA_BASE_URL` in `components/UseCases.tsx`:
- **Unset** → served from `/public/videos` (local, or bundled into the deploy if committed).
- **Set** → served from `<base>/videos/use-case-N.mp4`.

**For production: do NOT commit the videos.** Upload the 6 files to an **Azure Blob** container (Central India) behind **Front Door**, set `NEXT_PUBLIC_MEDIA_BASE_URL` to that base, and add `public/videos/` to `.gitignore`. SWA is not a video host and has an app-size cap (~250 MB Free / ~500 MB Standard — verify current limits).

**For QA, pick one** (see the matrix below in this doc / ask):
1. Local QA — nothing to do; `npm run dev`, clips serve from `public/videos`.
2. Deployed QA, fast — commit `public/videos/`, leave the env var unset (throwaway; strip before prod).
3. Deployed QA, prod-like *(recommended)* — Blob + `NEXT_PUBLIC_MEDIA_BASE_URL`, videos uncommitted.

## 5. Lead API — finish before go-live
`app/api/lead/route.ts` currently **validates + `console.log`s + returns OK**. To complete:
1. Persist the lead (Cosmos DB or Table Storage — §3).
2. Notify sales via Azure Communication Services (§3).
3. Secrets come from `process.env` (already the pattern). reCAPTCHA verification (`lib/recaptcha.ts`) is already wired and enforces once `RECAPTCHA_SECRET_KEY` is set.

## 6. Pre-flight checklist
- [ ] GitHub secrets added: `AZURE_STATIC_WEB_APPS_API_TOKEN`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `NEXT_PUBLIC_MEDIA_BASE_URL`
- [ ] SWA Application settings added: `RECAPTCHA_SECRET_KEY`, lead-store + ACS vars
- [ ] Videos uploaded to Blob; `NEXT_PUBLIC_MEDIA_BASE_URL` set + code pointed at it
- [ ] `/api/lead` wired to store + email
- [ ] Custom domain + Front Door + WAF
- [ ] Region = Central India confirmed
- [ ] `npm run build` green in CI (`.github/workflows/ci.yml`)

## 7. Dependency security status
- **Next.js** bumped `14.2.5` → **`14.2.35`** (latest 14.x). Build verified green. Clears the original advisory + everything patched within the 14.2.x line.
- **`swiper` removed** — it was an unused dependency carrying a *critical* prototype-pollution advisory. Zero code impact (the carousel was already replaced by `lib/useMarqueeScroll.ts`).
- **Remaining `npm audit`: 1 high (next) + 1 moderate (postcss, transitive).** These are only fully patched in **Next 15/16 — a major, breaking upgrade**, so they are intentionally NOT applied here.
  - Real exposure is low for this app: **no `next/image`** (Image-Optimizer items N/A), **no middleware / no i18n** (those bypass/cache items N/A). The residual RSC items are low-risk for a marketing site with one POST route.
  - **Follow-up:** plan a Next 15/16 upgrade with full regression testing before/shortly after go-live. Do not rush it into this handoff.
