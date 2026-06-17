"use client";

import { useState } from "react";

type Card = { icon: string; heading: string; image: string; body: string };

const CARDS: Card[] = [
  {
    icon: "/assets/imgGroup30.svg",
    heading: "Reduce repeat repairs and maximize uptime.",
    image: "/assets/imgMdkQEq1.png",
    body:
      "When every minute of downtime costs money, precision matters. DENSO sense helps you fix it right, the first time, reducing repeat visits and unnecessary repairs. With real-time, OEM-level insights, technicians can make confident decisions faster. That means more uptime, smoother fleet operations, and better trust with your customers. Your workshop becomes not just a service point, but a partner in keeping India's trucks on the move.",
  },
  {
    icon: "/assets/imgGroup9.svg",
    heading: "Subscription options designed for every workshop size and budget.",
    image: "/assets/image2.png",
    body:
      "Every garage is different, so we built flexible plans for all. From apprentices to established workshops, you can start small or scale big without worry. No fees on updates — your tool evolves as vehicles evolve, at no extra cost.",
  },
  {
    icon: "/assets/imgGroup10.svg",
    heading:
      "Cloud-based diagnostics ensure you’re equipped for today and prepared for tomorrow.",
    image: "/assets/image3.png",
    body:
      "Diagnostics isn't just about solving today's issue — it's about future-proofing your business. With cloud-powered updates, DENSO sense evolves continuously, keeping you aligned with new technologies. Your insights are always connected, always current, wherever your fleet or workshop operates. From remote diagnostics to instant data access, support is just a click away. Built on DENSO's global expertise, it ensures you are never outpaced by change. Stay confident today, stay ready for tomorrow.",
  },
];

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function RtbsCards() {
  const [idx, setIdx] = useState(0);
  // Body copy reveals over the image: hover on desktop (CSS), tap toggles on touch.
  const [open, setOpen] = useState(false);
  const n = CARDS.length;
  const go = (dir: 1 | -1) => {
    setOpen(false);
    setIdx((i) => (i + dir + n) % n);
  };
  const card = CARDS[idx];

  return (
    <section className="rtbs" id="features">
      <div className="rtbs__slide">
        <div
          className={`rtbs__media${open ? " is-open" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Show details"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
        >
          <img src={card.image} alt="" />
          <div className="rtbs__reveal">
            <p>{card.body}</p>
          </div>
        </div>

        <div className="rtbs__bar">
          <button
            className="rtbs__nav rtbs__nav--prev"
            type="button"
            aria-label="Previous"
            onClick={() => go(-1)}
          >
            <ChevronLeft />
          </button>
          <span className="rtbs__icon">
            <img src={card.icon} alt="" />
          </span>
          <span className="rtbs__heading">{card.heading}</span>
          <button
            className="rtbs__nav rtbs__nav--next"
            type="button"
            aria-label="Next"
            onClick={() => go(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
