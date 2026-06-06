// Server-only: only import this from server code (e.g. the API route), never
// from a client component. RECAPTCHA_SECRET_KEY has no NEXT_PUBLIC_ prefix, so
// it is never inlined into the browser bundle — the secret stays server-side.
const SECRET = process.env.RECAPTCHA_SECRET_KEY;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type VerifyResult =
  | { ok: true; bypassed?: boolean }
  | { ok: false; error: string };

/**
 * Server-side reCAPTCHA v2 verification.
 *  - No RECAPTCHA_SECRET_KEY configured → bypass (local/dev), so the lead flow
 *    keeps working with no keys. Set the secret in production to enforce it.
 *  - Otherwise POSTs the token to Google's siteverify and requires success.
 */
export async function verifyRecaptcha(
  token: string | undefined | null,
  remoteIp?: string | null
): Promise<VerifyResult> {
  if (!SECRET) return { ok: true, bypassed: true };

  if (!token) {
    return { ok: false, error: "Captcha verification is required." };
  }

  const body = new URLSearchParams({ secret: SECRET, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    if (data.success === true) return { ok: true };
    return { ok: false, error: "Captcha verification failed. Please try again." };
  } catch {
    return { ok: false, error: "Could not verify captcha. Please try again." };
  }
}
