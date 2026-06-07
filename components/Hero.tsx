"use client";

import { useRef, useState } from "react";
import Recaptcha, { type RecaptchaHandle } from "@/components/Recaptcha";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Hero() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaHandle>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (!captchaToken)
      next.captcha = "Please confirm you are not a robot.";
    if (!agree)
      next.agree = "Please accept the Privacy Policy and Terms of Service.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          recaptchaToken: captchaToken,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrors((x) => ({
          ...x,
          submit: body?.error || "Something went wrong. Please try again.",
        }));
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors((x) => ({
        ...x,
        submit: "Network error. Please try again.",
      }));
    } finally {
      setSubmitting(false);
      // reCAPTCHA tokens are single-use; clear it so a retry re-verifies.
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  }

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="grad" />
        <img src="/assets/imgFrame1000003076.jpg" alt="" />
      </div>

      <button className="hero__menutab" type="button" aria-label="Open menu">
        <span className="hero__menutab-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className="hero__left">
        <div className="hero__headgroup">
          <div className="hero__kicker">Stop guessing. Start earning.</div>
          <h1 className="hero__title">
            The Future of
            <br />
            Smarter Vehicle
            <br />
            Diagnosis
            <br />
            is Here
          </h1>
        </div>
        <div className="hero__list">
          <div className="hero__li">
            <img src="/assets/imgCharmTick.svg" alt="" />
            <span>Real-time fault detection across 10,000+ vehicle models</span>
          </div>
          <div className="hero__li">
            <img src="/assets/imgCharmTick.svg" alt="" />
            <span>AI-powered diagnostics that reduce repair time by up to 40%</span>
          </div>
          <div className="hero__li">
            <img src="/assets/imgCharmTick.svg" alt="" />
            <span>Get a free personalised demo — no commitment required</span>
          </div>
        </div>
      </div>

      <form className="hero__form" onSubmit={handleSubmit} noValidate>
        <div className="form__head">
          <div className="form__title">Book a Demo</div>
          <div className="form__sub">
            A DENSO expert will reach out within 24 hours to schedule your
            personalised walkthrough.
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="form__fields">
              <div className="field">
                <label htmlFor="f-name">Name*</label>
                <input
                  id="f-name"
                  className={`inp${errors.name ? " invalid" : ""}`}
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((x) => ({ ...x, name: "" }));
                  }}
                />
                <small className={`err${errors.name ? " show" : ""}`}>
                  {errors.name}
                </small>
              </div>

              <div className="field">
                <label htmlFor="f-email">Work Email*</label>
                <input
                  id="f-email"
                  className={`inp${errors.email ? " invalid" : ""}`}
                  type="email"
                  placeholder="Your work email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((x) => ({ ...x, email: "" }));
                  }}
                />
                <small className={`err${errors.email ? " show" : ""}`}>
                  {errors.email}
                </small>
              </div>

              <div className="field">
                <label htmlFor="f-phone">Phone No.</label>
                <input
                  id="f-phone"
                  className="inp"
                  type="tel"
                  placeholder="Where did you find us"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="errwrap">
                <Recaptcha
                  ref={recaptchaRef}
                  onChange={(t) => {
                    setCaptchaToken(t);
                    if (t && errors.captcha)
                      setErrors((x) => ({ ...x, captcha: "" }));
                  }}
                />
                <small className={`err${errors.captcha ? " show" : ""}`}>
                  {errors.captcha}
                </small>
              </div>

              <div className="errwrap">
                <label className="policy">
                  <input
                    type="checkbox"
                    className="policy__cb"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (errors.agree) setErrors((x) => ({ ...x, agree: "" }));
                    }}
                  />
                  <span className="chk" aria-hidden="true" />
                  <p>
                    By clicking the box, you agree to our{" "}
                    <a
                      href="https://sense.denso.co.in/PrivacyPolicy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://sense.denso.co.in/TermsOfServiceDiagnosticTool"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>
                    .
                  </p>
                </label>
                <small className={`err${errors.agree ? " show" : ""}`}>
                  {errors.agree}
                </small>
              </div>
            </div>
            <button className="btn-demo" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Book a Demo"}
            </button>
            {errors.submit && (
              <small className="err show" style={{ position: "static", marginTop: 4 }}>
                {errors.submit}
              </small>
            )}
          </>
        ) : (
          <div className="form__success">
            <strong>Thank you!</strong> A DENSO expert will reach out within 24
            hours to schedule your walkthrough.
          </div>
        )}
      </form>
    </section>
  );
}
