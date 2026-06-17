# DENSO Sense — Handoff Reference

This describes **what the site is, where everything lives, and where you plug in your own
values/services.** It is not a deployment guide — host it however your team prefers. Everything
external is read from environment variables and **degrades gracefully when unset**, so the app
builds and runs with nothing configured.

---

## 1. What it is
- **Next.js 14** (App Router) + **React 18** + **TypeScript**. Runtime: **Node 20**.
- A single-page marketing site with **two server-side form endpoints** (`/api/lead`, `/api/contact`).
- Scripts: `npm run dev` (local), **`npm run build`** (production build — also lints + type-checks),
  `npm run start` (serve the build). Install with `npm ci`.

## 2. What's in this package
| Item | What it is |
|---|---|
| `denso-sense-source.zip` | The complete source code. Unzip → a `denso-sense/` folder. |
| `videos/` (6 × `.mp4`) | The Use-Case videos — kept **outside** the code (too large). See §5. |
| `HANDOFF.md` | This file (also inside the zip). |
| `START-HERE.txt` | One-screen overview of the package. |

## 3. Project structure — what each part is
```
denso-sense/
├─ app/
│  ├─ layout.tsx           Root layout (fonts, metadata)
│  ├─ page.tsx             The single page (composes all sections)
│  ├─ globals.css          All styling (ported design system)
│  └─ api/
│     ├─ lead/route.ts     POST endpoint — Book-a-Demo form   (see §6)
│     └─ contact/route.ts  POST endpoint — Connect-with-us form (see §6)
├─ components/             UI sections: Navbar, Hero, UseCases, RtbsCards,
│                          Testimonials, CtaBand, Faq, Footer, ContactForm, Recaptcha
├─ lib/
│  ├─ recaptcha.ts         Server-side reCAPTCHA verification (see §7)
│  └─ useMarqueeScroll.ts  Scroll/marquee behaviour hook
├─ public/
│  ├─ assets/              Images, posters, SVGs, testimonial photos — committed, served with the app
│  ├─ fonts/               Self-hosted fonts — committed
│  └─ videos/              Empty by design; the 6 videos are provided separately (§5)
├─ .env.example            Full annotated list of environment variables (the source of truth)
├─ staticwebapp.config.json  Security response headers + Node 20 runtime hint
├─ package.json            Dependencies + scripts (Node 20)
├─ next.config.mjs         Next.js config
└─ tsconfig.json           TypeScript config
```

## 4. Where you add things — environment variables
The complete annotated list is in **`.env.example`**. Two kinds:
- **Build-time (`NEXT_PUBLIC_*`)** — inlined into the browser bundle when `npm run build` runs, so
  they must be present **in the build environment**.
- **Runtime (server secrets)** — read by the server at request time; never exposed to the browser.

| Variable | Kind | Read in | Purpose | If unset |
|---|---|---|---|---|
| `NEXT_PUBLIC_MEDIA_BASE_URL` | build-time | `components/UseCases.tsx` | base URL for the 6 videos | falls back to local `/videos` (no video in prod) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | build-time | `components/Recaptcha.tsx` | reCAPTCHA v2 public key | captcha checkbox skipped |
| `RECAPTCHA_SECRET_KEY` | runtime | `lib/recaptcha.ts` | reCAPTCHA server verify | captcha bypassed |
| `COSMOS_*` **or** `AZURE_STORAGE_*` | runtime | `app/api/lead/route.ts` (TODO §6) | persist leads | leads logged only, not stored |
| `ACS_*` / `LEAD_FROM_EMAIL` / `SALES_INBOX_EMAIL` | runtime | lead + contact routes (TODO §6) | email notification | no email sent |

## 5. Videos (provided separately, in the `videos/` folder)
- 6 files (~182 MB total): `use-case-1.mp4` … `use-case-6.mp4`.
- They are **not** inside the code. `components/UseCases.tsx` builds each URL as
  `${NEXT_PUBLIC_MEDIA_BASE_URL}/use-case-N.mp4`.
- Host the 6 files wherever you serve media, **flat under one base** (so a file resolves to
  `<base>/use-case-1.mp4`), and set `NEXT_PUBLIC_MEDIA_BASE_URL` to that base.
- **Images, fonts, posters, testimonial photos** are committed in `public/` — nothing to host separately.

## 6. Forms — what's built, what's left to finish
Both endpoints validate input and currently **log the submission and return success** (so the UI
flow is complete). Each file has a `TODO` comment marking exactly where to add the rest:
- **`app/api/lead/route.ts`** (Book-a-Demo): validates → verifies reCAPTCHA (when a key is set) →
  logs. **To finish:** persist the lead + notify sales (via the `COSMOS_*`/`AZURE_STORAGE_*` and
  `ACS_*` env vars in §4).
- **`app/api/contact/route.ts`** (Connect-with-us): validates → logs. **To finish:** persist /
  forward to your email service.
- Both already read their secrets from `process.env`.

## 7. reCAPTCHA
- **Google reCAPTCHA v2** ("I'm not a robot") is **fully implemented** — `components/Recaptcha.tsx`
  (browser widget) + `lib/recaptcha.ts` (server verify), wired into `/api/lead`.
- Supply a **v2 key pair** through the two env vars in §4 to activate it. With no keys it bypasses
  gracefully and the form still works; it enforces automatically once both keys are present. No code change.

## 8. Other details to know
- **Node 20.** Build = `npm run build`.
- **Form submissions are PII** (name/email/phone, contact messages) — relevant to any data-residency decision.
- **`staticwebapp.config.json`** sets baseline security headers (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`) and the Node 20 runtime hint.
- **External links in the UI** (legal pages, social) point to the live `sense.denso.co.in` and DENSO
  social accounts — informational, no action needed.
- **Dependency status:** Next.js is on **14.2.35** (latest 14.x); the unused `swiper` dep (carried a
  critical advisory) was removed. Remaining `npm audit`: 1 high (next) + 1 moderate (postcss,
  transitive) — these only clear in **Next 15/16 (a breaking major upgrade)**, intentionally not
  applied here; exposure is low (no `next/image`, no middleware, no i18n, one POST route). Worth a
  planned Next 15/16 upgrade with regression testing.
