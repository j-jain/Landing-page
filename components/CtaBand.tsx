"use client";

import { useState } from "react";
import ContactForm from "@/components/ContactForm";

export default function CtaBand() {
  const [open, setOpen] = useState(false);

  return (
    <section className="cta">
      <div className="cta__inner">
        <div className="cta__title">
          Lead the Diagnostic Revolution.
          <br />
          Transform today. Innovate tomorrow.
        </div>
        <button
          className={`cta__btn${open ? " is-open" : ""}`}
          type="button"
          aria-expanded={open}
          aria-controls="cta-contact"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="cta__btn__label">CONNECT WITH US</span>
          <span className="cta__btn__icon" aria-hidden="true">
            <img className="cta__btn__icon-default" src="/assets/imgGroup.svg" alt="" />
            <img className="cta__btn__icon-hover" src="/assets/imgGroupCtaHover.svg" alt="" />
          </span>
        </button>

        {open && (
          <div className="cta__panel" id="cta-contact">
            <ContactForm onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    </section>
  );
}
