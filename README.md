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

## Deploying to Azure
Intended to deploy to **Microsoft Azure** (all production runtime services on Azure):
- **Azure Static Web Apps** (recommended) or **Azure App Service (Linux, Node 20)** — connect this GitHub repo; build command `npm run build`.
- **Azure Front Door** (CDN + WAF) in front; **Azure Blob Storage** for video/media; **Azure Functions** for the lead-capture API; **Application Insights** for monitoring.
- Primary region: **Central India** (data residency for lead PII).

Connecting the repo in the Azure portal auto-generates the GitHub Actions deploy workflow.

## Local note
Keep the working copy **outside OneDrive-synced folders** — OneDrive's file syncing makes the Next.js dev server reload-loop and can corrupt the `.next` build. This copy lives at `C:\dev\denso-next`.
