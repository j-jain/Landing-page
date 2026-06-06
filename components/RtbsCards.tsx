"use client";

import { useEffect, useRef, useState } from "react";

type Card = {
  label?: string;
  labelUnderline?: boolean;
  icon: string;
  heading: React.ReactNode;
  image: string;
  body: string;
};

const CARDS: Card[] = [
  {
    icon: "/assets/imgGroup30.svg",
    heading: (
      <>
        Reduce repeat
        <br />
        repairs and maximize
        <br />
        uptime.
      </>
    ),
    image: "/assets/imgMdkQEq1.png",
    body:
      "When every minute of downtime costs money, precision matters. DENSO sense helps you fix it right, the first time, reducing repeat visits and unnecessary repairs. With real-time, OEM-level insights, technicians can make confident decisions faster. That means more uptime, smoother fleet operations, and better trust with your customers. Your workshop becomes not just a service point, but a partner in keeping India's trucks on the move.",
  },
  {
    label: "Flexible Affordability",
    labelUnderline: true,
    icon: "/assets/imgGroup9.svg",
    heading: (
      <>
        Subscription options
        <br />
        designed for every
        <br />
        workshop size and
        <br />
        budget.
      </>
    ),
    image: "/assets/image2.png",
    body:
      "Every garage is different, so we built flexible plans for all. From apprentices to established workshops, you can start small or scale big without worry. No fees on updates — your tool evolves as vehicles evolve, at no extra cost.",
  },
  {
    label: "Always Connected",
    icon: "/assets/imgGroup10.svg",
    heading: (
      <>
        Cloud-based
        <br />
        diagnostics ensure
        <br />
        you&rsquo;re equipped for
        <br />
        today and prepared
        <br />
        for tomorrow.
      </>
    ),
    image: "/assets/image3.png",
    body:
      "Diagnostics isn't just about solving today's issue — it's about future-proofing your business. With cloud-powered updates, DENSO sense evolves continuously, keeping you aligned with new technologies. Your insights are always connected, always current, wherever your fleet or workshop operates. From remote diagnostics to instant data access, support is just a click away. Built on DENSO's global expertise, it ensures you are never outpaced by change. Stay confident today, stay ready for tomorrow.",
  },
];

export default function RtbsCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  // Which card's body is revealed (tap toggle for touch; desktop uses :hover).
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 1024px)");
    // On mobile/tablet (or reduced-motion) skip the pin: the section becomes a
    // native horizontal swipe carousel (handled in CSS).
    const isStatic = () => reduce.matches || small.matches;
    let overflow = 0;
    let frame = 0;

    const measure = () => {
      if (isStatic()) {
        section.style.height = "auto";
        track.style.transform = "none";
        return;
      }
      // distance the track must travel horizontally
      overflow = Math.max(0, track.scrollWidth - pin.clientWidth);
      // total vertical scroll budget = one viewport of panning
      section.style.height = `${pin.clientHeight + overflow}px`;
      update();
    };

    const update = () => {
      if (isStatic() || overflow === 0) {
        track.style.transform = "none";
        return;
      }
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / overflow));
      track.style.transform = `translate3d(${-progress * overflow}px,0,0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    small.addEventListener("change", measure);
    reduce.addEventListener("change", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      small.removeEventListener("change", measure);
      reduce.removeEventListener("change", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="rtbs" ref={sectionRef}>
      <div className="rtbs__pin" ref={pinRef}>
        <div className="rtbs__track" ref={trackRef}>
          {CARDS.map((card, i) => {
            const open = openIdx === i;
            const toggle = () => setOpenIdx(open ? null : i);
            return (
              <div className="rtbs-card" key={i}>
                {card.label && (
                  <div className={`rtbs-card__label${card.labelUnderline ? " u" : ""}`}>
                    {card.label}
                  </div>
                )}
                <div className="rtbs-card__body">
                  <div className="rtbs-card__text">
                    <div className="rtbs-card__icon">
                      <img src={card.icon} alt="" />
                    </div>
                    <div className="rtbs-card__textinner">
                      <div className="rtbs-card__heading">{card.heading}</div>
                    </div>
                  </div>
                  <div
                    className={`rtbs-card__img${open ? " is-open" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    aria-label="Show details"
                    onClick={toggle}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle();
                      }
                    }}
                  >
                    <img src={card.image} alt="" />
                    <div className="rtbs-card__reveal">
                      <p>{card.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
