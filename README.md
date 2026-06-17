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

## Deployment
Runs on **Microsoft Azure**. Build command `npm run build` (Node 20); serve with `npm run start`.
All external services are wired through environment variables — see [`HANDOFF.md`](HANDOFF.md) and
[`.env.example`](.env.example) for the full list and where each value is read. Everything degrades
gracefully when unset.
