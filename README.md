# DENSO Sense — Marketing Site

A pixel-faithful recreation of the DENSO Sense landing page (Figma "Desktop - 4"), built with **Next.js**.

## Tech stack
- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- Global CSS (ported design system: variables, gradients, fonts) — `app/globals.css`
- Self-hosted fonts (`public/fonts`) and assets (`public/assets`) — no external font/CDN runtime dependencies
- Custom scroll behaviours (no heavy carousel lib at runtime): `lib/useMarqueeScroll.ts`

## Sections
Navbar · Hero + Book-a-Demo form · Use Cases (auto/manual marquee + video) · RTBS scroll-pinned pan · Testimonials (hover-video marquee) · CTA · FAQ · Footer. Fully responsive (desktop pixel-perfect; mobile reflow incl. RTBS swipe carousel).

## Getting started
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Project structure
```
app/         # layout.tsx, page.tsx, globals.css
components/   # Navbar, Hero, UseCases, RtbsCards, Testimonials, CtaBand, Faq, Footer
lib/          # useMarqueeScroll hook
public/       # fonts, assets (images, svgs, posters)
```

## reCAPTCHA (Book-a-Demo form)
The lead form uses **Google reCAPTCHA v2** ("I'm not a robot"). The integration is
fully built — it just needs keys:

1. Create a **v2 "I'm not a robot"** key pair at <https://www.google.com/recaptcha/admin>
   (add your production domain and `localhost`).
2. Copy `.env.example` → `.env.local` (gitignored) and fill in:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...   # public, sent to the browser
   RECAPTCHA_SECRET_KEY=...             # server-only, verifies tokens
   ```
3. Restart `npm run dev`.

**No keys set?** The form still works — the checkbox is skipped (a muted dev
placeholder shows) and the server skips verification. It enforces automatically
once both keys are present. Module: `components/Recaptcha.tsx` (client widget) +
`lib/recaptcha.ts` (server verification, called from `app/api/lead/route.ts`).

## Deploying to Azure
Intended to deploy to **Microsoft Azure** (all production runtime services on Azure):
- **Azure Static Web Apps** (recommended) or **Azure App Service (Linux, Node 20)** — connect this GitHub repo; build command `npm run build`.
- **Azure Front Door** (CDN + WAF) in front; **Azure Blob Storage** for video/media; **Azure Functions** for the lead-capture API; **Application Insights** for monitoring.
- Primary region: **Central India** (data residency for lead PII).

Connecting the repo in the Azure portal auto-generates the GitHub Actions deploy workflow.

## Local development (important)
Run the project **directly from `C:\dev\denso-next`** — open *that* folder in your editor/terminal:

```bash
cd C:\dev\denso-next
npm install
npm run dev
```

Do **not** run it through the OneDrive path (`…\OneDrive\Desktop\Figma\Denso\denso-next`, which is a
junction to this folder). Reasons:
- **OneDrive syncing** of a Next.js project makes the dev server reload-loop and can corrupt the
  `.next` build (missing-chunk 500s). Keeping the code outside the synced tree avoids that.
- The Next.js **file-watcher doesn't reliably follow the junction**, so editing via the OneDrive
  path won't hot-reload. Working in `C:\dev\denso-next` directly gives proper HMR.
