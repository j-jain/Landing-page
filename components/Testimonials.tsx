"use client";

import { useRef } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

const QUOTE =
  "“Time is everything in our line of work. The software gives us fast access to fault codes and diagrams, even for less common models. That kind of availability saves time on both diagnosis and repairs.”";
const NAME = "Mr.Arvindar Singh Gill";
const ROLE = "Proprietor, Gurunanak Diesel Service";

// Sample hover clips (Pexels)
const VIDEOS = ["31985719", "29382657", "37747582", "37732837", "37551397", "8134381"];

function pexels(id: string) {
  // /download/ redirects to the real CDN file (constructed file URLs 403).
  return `https://www.pexels.com/download/video/${id}/`;
}

function TCard({ id, ariaHidden }: { id: string; ariaHidden: boolean }) {
  const vref = useRef<HTMLVideoElement | null>(null);
  const started = useRef(false);

  const enter = () => {
    const v = vref.current;
    if (!v) return;
    if (!started.current) {
      v.src = pexels(id);
      started.current = true;
    }
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };
  const leave = () => {
    vref.current?.pause();
  };

  return (
    <article
      className="tcard"
      onMouseEnter={enter}
      onMouseLeave={leave}
      aria-hidden={ariaHidden}
    >
      <img className="tcard__poster" src="/assets/testi-card.png" alt="" />
      <video ref={vref} className="tcard__video" muted loop playsInline preload="none" />
      <div className="tcard__overlay">
        <p className="tcard__quote">{QUOTE}</p>
        <p className="tcard__name">{NAME}</p>
        <p className="tcard__role">{ROLE}</p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueeScroll(marqueeRef, { direction: -1 });

  const render = (copy: number, hidden: boolean) =>
    VIDEOS.map((id, i) => <TCard key={`${copy}-${i}`} id={id} ariaHidden={hidden} />);

  return (
    <section className="testi">
      <div className="testi__kicker">TESTIMONIALS</div>
      <h2 className="testi__title">
        Don&rsquo;t take our word for it.
        <br />
        Hear it from our Partners.
      </h2>
      <div className="testi-marquee" ref={marqueeRef}>
        <div className="testi-marquee__track">
          {render(0, false)}
          {render(1, true)}
        </div>
      </div>
    </section>
  );
}
