"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Sentinel token sent when no site key is configured (local/dev). The server
// helper (lib/recaptcha.ts) applies the matching bypass when no secret is set,
// so the lead form keeps working end-to-end with no keys present.
export const DEV_BYPASS_TOKEN = "__no_recaptcha_key__";

export type RecaptchaHandle = { reset: () => void };

type Props = {
  /** Fired with the token on solve, or null on expiry/error/reset. */
  onChange: (token: string | null) => void;
  theme?: "light" | "dark";
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          theme?: "light" | "dark";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (id?: number) => void;
      getResponse: (id?: number) => string;
    };
  }
}

/**
 * Google reCAPTCHA v2 ("I'm not a robot") widget, wrapped so it:
 *  - loads Google's api.js once via next/script (no extra npm dependency),
 *  - renders the checkbox explicitly into a container (StrictMode-safe), and
 *  - degrades gracefully: with no NEXT_PUBLIC_RECAPTCHA_SITE_KEY it shows a
 *    muted dev placeholder and auto-satisfies the form (DEV_BYPASS_TOKEN).
 * Drops a real Site Key into the env and it "lights up" with zero code change.
 */
const Recaptcha = forwardRef<RecaptchaHandle, Props>(function Recaptcha(
  { onChange, theme = "dark" },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const bypassed = !SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset() {
      if (bypassed) {
        onChange(DEV_BYPASS_TOKEN);
        return;
      }
      if (window.grecaptcha && widgetId.current !== null) {
        window.grecaptcha.reset(widgetId.current);
      }
      onChange(null);
    },
  }));

  // No site key: satisfy the form in dev so submission still works.
  useEffect(() => {
    if (bypassed) onChange(DEV_BYPASS_TOKEN);
    // onChange is stable in practice; we only want this on mount/bypass change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bypassed]);

  // Render the checkbox once api.js is ready. Guarded so React StrictMode's
  // double-invoked effect can't render the widget twice.
  useEffect(() => {
    if (bypassed || !scriptReady) return;
    const el = containerRef.current;
    if (!el || !window.grecaptcha) return;
    if (widgetId.current !== null || el.childElementCount > 0) return;

    window.grecaptcha.ready(() => {
      const node = containerRef.current;
      if (!node || widgetId.current !== null || node.childElementCount > 0) return;
      widgetId.current = window.grecaptcha!.render(node, {
        sitekey: SITE_KEY!,
        theme,
        callback: (token: string) => onChange(token),
        "expired-callback": () => onChange(null),
        "error-callback": () => onChange(null),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bypassed, scriptReady]);

  if (bypassed) {
    return (
      <div className="recaptcha recaptcha--disabled">
        reCAPTCHA disabled — no site key set (development)
      </div>
    );
  }

  return (
    <div className="recaptcha">
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="g-recaptcha-wrap" />
    </div>
  );
});

export default Recaptcha;
