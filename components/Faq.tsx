"use client";

import { useState } from "react";

type QA = { q: string; a: React.ReactNode };
type Category = { title: string; questions: QA[] };

const SYS_REQ = (
  <table className="faq-table">
    <thead>
      <tr>
        <th>Parameters</th>
        <th>Tablet Configuration</th>
        <th>PC/Laptop Configuration</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>OS</td>
        <td>Windows 10 (64-bit)</td>
        <td>Windows 10 (64-bit)</td>
      </tr>
      <tr>
        <td>CPU</td>
        <td>1.6 GHz, 2 Core</td>
        <td>2.9 GHz, 4 Core</td>
      </tr>
      <tr>
        <td>RAM</td>
        <td>4 GB</td>
        <td>8 GB</td>
      </tr>
      <tr>
        <td>Resolution</td>
        <td>1800×1200 (3:2), 1920×1280 (3:2)</td>
        <td>1366×768 (16:9), 1920×1080 (16:9)</td>
      </tr>
      <tr>
        <td>OS</td>
        <td>Windows 10 (64-bit)</td>
        <td>Windows 10 (64-bit)</td>
      </tr>
    </tbody>
  </table>
);

const CATEGORIES: Category[] = [
  {
    title: "Purchase & Licensing",
    questions: [
      {
        q: "How can I purchase DENSO sense?",
        a: <p>Through authorized DENSO distributors. To get distributor details, contact us with the subject line ‘Need distributor details for buying DENSO sense.’</p>,
      },
      {
        q: "What subscription plans are available?",
        a: <p>We offer flexible plans starting from ₹799, based on your usage and business needs. Please refer to the Pricing section or contact us at +91-9319089225 for details.</p>,
      },
      {
        q: "Is there a trial version or demo before purchase?",
        a: <p>Yes, we provide online demo sessions. For physical demos, visit your nearest authorized DENSO distributor. Contact us to book a demo: +91-9319089225.</p>,
      },
    ],
  },
  {
    title: "Installation & Setup",
    questions: [
      {
        q: "What are the system requirements for DENSO sense?",
        a: SYS_REQ,
      },
      {
        q: "How do I install the software and connect the hardware?",
        a: <p>Scan the QR code on the packaging to begin installation. Once installed, connect the hardware to the vehicle and the software will auto-detect it. For help, contact your distributor.</p>,
      },
      {
        q: "Do I need internet access to install or activate?",
        a: <p>Yes, internet is required for license activation and first-time hardware detection.</p>,
      },
    ],
  },
  {
    title: "Diagnostics & Features",
    questions: [
      {
        q: "Which vehicles and systems does DENSO sense cover?",
        a: (
          <p>
            Please refer to our Application Coverage section. You can{" "}
            <a
              href="https://sense.denso.co.in/BrandsECUsDetails"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>{" "}
            to view the application coverage.
          </p>
        ),
      },
      {
        q: "Can I perform AdBlue, DPF, and BS6 emission diagnostics?",
        a: <p>Yes. Functions like DPF regeneration, AdBlue reset, and other emission-related diagnostics are supported.</p>,
      },
      {
        q: "Does DENSO sense support remote diagnostics?",
        a: <p>Yes. Remote diagnostics is one of DENSO sense&rsquo;s unique features.</p>,
      },
      {
        q: "Can I save and share diagnostic reports?",
        a: <p>Yes. Reports can be saved, downloaded, and shared instantly via WhatsApp.</p>,
      },
      {
        q: "Does DENSO sense include CRM features?",
        a: <p>Yes. DENSO sense has a built-in mini-CRM that gives you smart insights into jobs, customer history, and business growth.</p>,
      },
    ],
  },
  {
    title: "Updates & Connectivity",
    questions: [
      {
        q: "How often is the software updated?",
        a: <p>DENSO sense is cloud-based and auto-updates regularly, ensuring you always have the latest diagnostics.</p>,
      },
      {
        q: "Are updates included in my subscription?",
        a: <p>Yes, all updates are included. No hidden costs.</p>,
      },
      {
        q: "What happens if my subscription expires?",
        a: <p>You can renew any plan as per your business needs. If you have unused D-credits, they can still be utilized for specific diagnostics.</p>,
      },
    ],
  },
  {
    title: "Training & Support",
    questions: [
      {
        q: "Do you provide training or onboarding?",
        a: <p>Yes. From onboarding to daily usage, we support you at every step.</p>,
      },
      {
        q: "Where can I find manuals or tutorials?",
        a: <p>Inside the application, under the Tool Help section. Manuals are available anytime.</p>,
      },
      {
        q: "How do I contact technical support?",
        a: (
          <p>
            Phone: +91-9319089225 | Email:{" "}
            <a href="mailto:ap_diin_sensesupport@ap.denso.com">
              ap_diin_sensesupport@ap.denso.com
            </a>
          </p>
        ),
      },
      {
        q: "Can local distributors provide on-site help?",
        a: (
          <p>
            Yes. Distributors are the backbone of our support system. Contact your
            nearest distributor for on-site help. To get details about distributors
            write us at:
            <br />
            Phone: +91-9319089225 | Email:{" "}
            <a href="mailto:ap_diin_sensesupport@ap.denso.com">
              ap_diin_sensesupport@ap.denso.com
            </a>
          </p>
        ),
      },
    ],
  },
];

export default function Faq() {
  // All categories start collapsed (desktop + mobile); user expands on click.
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [openQs, setOpenQs] = useState<Record<string, boolean>>({});

  return (
    <section className="faq">
      <div className="faq__container">
        <h2 className="faq__title">Frequently Asked Questions</h2>
        <div className="faq__list">
          {CATEGORIES.map((cat, ci) => {
            const catOpen = openCat === ci;
            return (
              <div key={ci} className={`faq-cat${catOpen ? " faq-cat--open" : ""}`}>
                <button
                  className="faq-cat__head"
                  type="button"
                  aria-expanded={catOpen}
                  onClick={() => setOpenCat(catOpen ? null : ci)}
                >
                  <h3>{cat.title}</h3>
                  <span className="ic">
                    <img src="/assets/imgSvg.svg" alt="" />
                  </span>
                </button>
                <div className="faq-qs">
                  <div className="faq-qs__inner">
                    {cat.questions.map((item, qi) => {
                      const key = `${ci}-${qi}`;
                      const qOpen = !!openQs[key];
                      return (
                        <div key={qi} className={`faq-q${qOpen ? " faq-q--open" : ""}`}>
                          <button
                            className="faq-q__row"
                            type="button"
                            aria-expanded={qOpen}
                            onClick={() =>
                              setOpenQs((s) => ({ ...s, [key]: !s[key] }))
                            }
                          >
                            <p>{item.q}</p>
                            <span className="chev">
                              <img src="/assets/imgSvg.svg" alt="" />
                            </span>
                          </button>
                          <div className="faq-q__answer">
                            <div>{item.a}</div>
                          </div>
                          <div className="faq-q__line" />
                        </div>
                      );
                    })}
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
