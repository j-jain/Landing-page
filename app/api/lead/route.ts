import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const runtime = "nodejs";
// Avoid static optimization — this is a dynamic endpoint.
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  recaptchaToken?: string;
};

export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const name = (data.name ?? "").toString().trim();
  const email = (data.email ?? "").toString().trim();
  const phone = (data.phone ?? "").toString().trim();

  if (!name) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 422 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid work email is required." }, { status: 422 });
  }

  // Verify the reCAPTCHA token (no-op bypass when RECAPTCHA_SECRET_KEY is unset).
  const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const captcha = await verifyRecaptcha(data.recaptchaToken, remoteIp);
  if (!captcha.ok) {
    return NextResponse.json({ ok: false, error: captcha.error }, { status: 422 });
  }

  // TODO (Azure production):
  //   1. Persist the lead — Azure Cosmos DB (serverless) or Table Storage, Central India region.
  //   2. Notify — Azure Communication Services (Email) to the sales inbox + applicant.
  //   Secrets (connection strings) come from Azure Key Vault / App settings (process.env).
  // For now we log server-side and confirm success so the UI flow is complete.
  console.log("[lead] Book-a-Demo request:", {
    name,
    email,
    phone: phone || null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
