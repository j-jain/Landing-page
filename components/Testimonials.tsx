"use client";

import { useState } from "react";

// Touch devices have no hover, so they toggle the photo/text by tapping the card.
// Desktop keeps pure hover (this returns true there, so the tap toggle is skipped).
const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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

function TCard({
  t,
  open,
  onToggle,
}: {
  t: Testimonial;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`testi-card${open ? " is-open" : ""}`}
      onClick={() => {
        // touch only — desktop reveals on hover and ignores taps
        if (!finePointer()) onToggle();
      }}
    >
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
  const [openKey, setOpenKey] = useState<number | null>(null);

  return (
    <section className="testi" id="testimonials">
      <div className="testi__kicker">TESTIMONIALS</div>
      <h2 className="testi__title">
        Don&rsquo;t take our word for it.
        <br />
        Hear it from our Partners.
      </h2>
      <div className="testi-grid">
        {TESTIMONIALS.slice(0, 5).map((t, i) => (
          <TCard
            key={i}
            t={t}
            open={openKey === i}
            onToggle={() => setOpenKey((cur) => (cur === i ? null : i))}
          />
        ))}
      </div>
    </section>
  );
}
