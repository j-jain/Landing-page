"use client";

import { useEffect, useState } from "react";

type NavLink = { label: string; target: string; external?: boolean };

// In-page section anchors (ids added on each section). "Book a Demo" jumps to the
// hero where the form lives.
const SECTION_LINKS: NavLink[] = [
  { label: "Home", target: "home" },
  { label: "Real Use Cases", target: "use-cases" },
  { label: "Why DENSO sense", target: "features" },
  { label: "Testimonials", target: "testimonials" },
  { label: "FAQ", target: "faq" },
  { label: "Book a Demo", target: "home" },
];

const LEGAL_LINKS: NavLink[] = [
  {
    label: "Terms of Use",
    target: "https://sense.denso.co.in/TermsOfServiceDiagnosticTool/",
    external: true,
  },
  {
    label: "Privacy Policy",
    target: "https://sense.denso.co.in/PrivacyPolicy",
    external: true,
  },
  {
    label: "Privacy Notice",
    target: "https://sense.denso.co.in/PrivacyNotice",
    external: true,
  },
];

export default function SiteMenu() {
  const [open, setOpen] = useState(false);

  // Esc to close + lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    // close first so body scroll is unlocked, then smooth-scroll to the section
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <button
        className={`menu-tab${open ? " is-open" : ""}`}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="menu-tab__bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className={`drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="drawer__backdrop" onClick={() => setOpen(false)} />
        <nav className="drawer__panel" aria-label="Main menu">
          <button
            className="drawer__close"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="drawer__logo">
            <img src="/assets/imgRectangle.png" alt="DENSO" />
          </div>
          <ul className="drawer__links">
            {SECTION_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={`#${l.target}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(l.target);
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="drawer__links drawer__links--legal">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
