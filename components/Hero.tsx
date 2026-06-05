"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Hero() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);
  const [captcha, setCaptcha] = useState<"idle" | "loading" | "checked">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function verifyCaptcha() {
    if (captcha !== "idle") return;
    setCaptcha("loading");
    setTimeout(() => {
      setCaptcha("checked");
      setErrors((e) => ({ ...e, captcha: "" }));
    }, 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "Please enter a valid email address.";
    if (captcha !== "checked")
      next.captcha = "Please confirm you are not a robot.";
    if (!agree)
      next.agree = "Please accept the Privacy Policy and Terms of Service.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  }

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="grad" />
        <img src="/assets/imgFrame1000003076.jpg" alt="" />
      </div>

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
                <div
                  className={`captcha${captcha === "loading" ? " is-loading" : ""}${
                    captcha === "checked" ? " is-checked" : ""
                  }`}
                  role="checkbox"
                  aria-checked={captcha === "checked"}
                  tabIndex={0}
                  onClick={verifyCaptcha}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      verifyCaptcha();
                    }
                  }}
                >
                  <span className="cap-box" aria-hidden="true" />
                  <span className="lbl">I&rsquo;m not a robot</span>
                  <span className="cap-brand" aria-hidden="true">
                    <span className="cap-brand__mark" />
                    <span className="cap-brand__name">reCAPTCHA</span>
                    <span className="cap-brand__links">Privacy · Terms</span>
                  </span>
                </div>
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
                    <a href="#">Privacy Policy</a> and{" "}
                    <a href="#">Terms of Service</a>.
                  </p>
                </label>
                <small className={`err${errors.agree ? " show" : ""}`}>
                  {errors.agree}
                </small>
              </div>
            </div>
            <button className="btn-demo" type="submit">
              Book a Demo
            </button>
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
