"use client";

import { useState, type ReactNode } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECTS = ["General Inquiry", "Support", "Feedback", "Others"];

const LINKS = {
  terms: "https://sense.denso.co.in/TermsOfServiceDiagnosticTool",
  privacy: "https://sense.denso.co.in/PrivacyPolicy",
  notice: "https://sense.denso.co.in/PrivacyNotice",
};

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  subject: string;
  address: string;
  city: string;
  state: string;
  country: string;
  message: string;
  terms: boolean;
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  subject: "",
  address: "",
  city: "",
  state: "",
  country: "",
  message: "",
  terms: false,
};

function Field({
  label,
  htmlFor,
  err,
  children,
}: {
  label: string;
  htmlFor: string;
  err?: string;
  children: ReactNode;
}) {
  return (
    <div className="cf__field">
      <label className="cf__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      <small className={`cf__err${err ? " show" : ""}`}>{err}</small>
    </div>
  );
}

export default function ContactForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!form.firstName.trim()) n.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) n.lastName = "Please enter your last name.";
    if (!EMAIL_RE.test(form.email.trim())) n.email = "Enter a valid email.";
    if (!form.contact.trim()) n.contact = "Enter your WhatsApp number.";
    if (!form.subject) n.subject = "Please select a subject.";
    if (!form.address.trim()) n.address = "Please enter your address.";
    if (!form.city.trim()) n.city = "Please enter your city.";
    if (!form.state.trim()) n.state = "Please enter your state.";
    if (!form.country.trim()) n.country = "Please enter your country.";
    if (!form.message.trim()) n.message = "Please enter a message.";
    if (!form.terms) n.terms = "Please accept the terms to continue.";
    setErrors(n);
    if (Object.keys(n).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      setErrors((x) => ({ ...x, submit: "Network error. Please try again." }));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="cf cf--done">
        <strong>Details Submitted</strong>
        <p>Thanks for reaching out — a DENSO representative will get back to you shortly.</p>
        <button type="button" className="cf__btn cf__btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={handleSubmit} noValidate>
      <div className="cf__heading">Contact Form</div>

      <div className="cf__row">
        <Field label="First Name*" htmlFor="cf-first" err={errors.firstName}>
          <input
            id="cf-first"
            className={`cf__inp${errors.firstName ? " invalid" : ""}`}
            placeholder="First Name"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
        </Field>
        <Field label="Last Name*" htmlFor="cf-last" err={errors.lastName}>
          <input
            id="cf-last"
            className={`cf__inp${errors.lastName ? " invalid" : ""}`}
            placeholder="Last Name"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
          />
        </Field>
      </div>

      <div className="cf__row">
        <Field label="Email*" htmlFor="cf-email" err={errors.email}>
          <input
            id="cf-email"
            type="email"
            className={`cf__inp${errors.email ? " invalid" : ""}`}
            placeholder="Enter Your Email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Contact No (WhatsApp)*" htmlFor="cf-contact" err={errors.contact}>
          <input
            id="cf-contact"
            type="tel"
            className={`cf__inp${errors.contact ? " invalid" : ""}`}
            placeholder="Enter Your WhatsApp Number"
            autoComplete="tel"
            value={form.contact}
            onChange={(e) => set("contact", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Subject*" htmlFor="cf-subject" err={errors.subject}>
        <select
          id="cf-subject"
          className={`cf__inp cf__select${errors.subject ? " invalid" : ""}`}
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
        >
          <option value="">-- Select a Subject --</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Address*" htmlFor="cf-address" err={errors.address}>
        <input
          id="cf-address"
          className={`cf__inp${errors.address ? " invalid" : ""}`}
          placeholder="Enter Address"
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </Field>

      <div className="cf__row cf__row--3">
        <Field label="City*" htmlFor="cf-city" err={errors.city}>
          <input
            id="cf-city"
            className={`cf__inp${errors.city ? " invalid" : ""}`}
            placeholder="Enter City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field label="State*" htmlFor="cf-state" err={errors.state}>
          <input
            id="cf-state"
            className={`cf__inp${errors.state ? " invalid" : ""}`}
            placeholder="Enter State"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
          />
        </Field>
        <Field label="Country*" htmlFor="cf-country" err={errors.country}>
          <input
            id="cf-country"
            className={`cf__inp${errors.country ? " invalid" : ""}`}
            placeholder="Enter Country"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Message*" htmlFor="cf-message" err={errors.message}>
        <textarea
          id="cf-message"
          className={`cf__inp cf__textarea${errors.message ? " invalid" : ""}`}
          placeholder="Enter Your Message"
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>

      <label className="cf__terms">
        <input
          type="checkbox"
          checked={form.terms}
          onChange={(e) => set("terms", e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href={LINKS.terms} target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
          ,{" "}
          <a href={LINKS.privacy} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href={LINKS.notice} target="_blank" rel="noopener noreferrer">
            Privacy Notice
          </a>
          .
        </span>
      </label>
      <small className={`cf__err${errors.terms ? " show" : ""}`}>{errors.terms}</small>

      <div className="cf__actions">
        <button className="cf__btn cf__btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting, please wait…" : "Submit"}
        </button>
        <button className="cf__btn cf__btn--ghost" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      {errors.submit && <small className="cf__err show cf__err--submit">{errors.submit}</small>}
    </form>
  );
}
