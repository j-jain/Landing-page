"use client";

import { useRef } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

type Testimonial = {
  name: string;
  role: string;
  photo: string;
  quote: string;
};

// Real testimonials from sense.denso.co.in. Each photo doubles as the avatar
// (top-left circle) and the hover image that fills the card — matching the live
// site, where userImage and backgroundImage are the same asset.
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Pankaj Mittal",
    role: "Owner, Raman Enterprises",
    photo: "/assets/testi/pankaj-mittal.png",
    quote:
      "“With DENSO sense, we feel more confident during diagnostics. It’s not just about speed—it’s about knowing we’re getting it right. That certainty makes a difference, especially when explaining issues to customers.”",
  },
  {
    name: "Mr. Santosh Kawale Patil",
    role: "Owner, Santosh Diesels",
    photo: "/assets/testi/santosh-patil.png",
    quote:
      "“We handle a mix of trucks and industrial equipment. The tool’s wide coverage means we don’t need separate systems for each brand or model. That alone has helped us reduce repair delays.”",
  },
  {
    name: "Mr. Arvindar Singh Gill",
    role: "Proprietor, Gurunanak Diesel Service",
    photo: "/assets/testi/arvindar-gill.png",
    quote:
      "“Time is everything in our line of work. The software gives us fast access to fault codes and diagrams, even for less common models. That kind of availability saves time on both diagnosis and repairs.”",
  },
  {
    name: "Mr. Nikhil Jaiswani",
    role: "Business Partner, Euro Diesel",
    photo: "/assets/testi/nikhil-jaiswani.png",
    quote:
      "“We’ve noticed fewer returns since we started using the tool. Being able to identify the issue precisely from the start helps get it fixed properly the first time. It’s added consistency to our process.”",
  },
  {
    name: "Mr. Mahesh Nayak",
    role: "Director, Nayak Diesels and Electricals",
    photo: "/assets/testi/mahesh-nayak.png",
    quote:
      "“I was surprised by how easy it was to use. Everything from the layout to the guidance makes sense. It feels like it’s made for people who are actually doing the work on the floor.”",
  },
  {
    name: "Mr. Satish Yadav",
    role: "Partner, JMD Diesels",
    photo: "/assets/testi/satish-yadav.png",
    quote:
      "“We’ve been part of the DENSO sense journey from the early days. The tool keeps getting smarter, and it’s helped us grow with it. In commercial vehicle repair, where things evolve quickly, having that kind of support has made a real difference.”",
  },
];

function TCard({ t, ariaHidden }: { t: Testimonial; ariaHidden: boolean }) {
  return (
    <article className="testi-card" aria-hidden={ariaHidden}>
      <div className="testi-card__inner">
        <div className="testi-card__media">
          <img className="testi-card__hover-img" src={t.photo} alt="" />
        </div>
        <div className="testi-card__content">
          <div className="testi-card__avatar">
            <img src={t.photo} alt={t.name} />
          </div>
          <div className="testi-card__quote">
            <p>{t.quote}</p>
          </div>
          <div className="testi-card__footer">
            <p className="testi-card__name">{t.name}</p>
            <p className="testi-card__role">{t.role}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueeScroll(marqueeRef, { direction: -1 });

  const render = (copy: number, hidden: boolean) =>
    TESTIMONIALS.map((t, i) => (
      <TCard key={`${copy}-${i}`} t={t} ariaHidden={hidden} />
    ));

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
