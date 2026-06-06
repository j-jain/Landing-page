import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Avoid static optimization — this is a dynamic endpoint.
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  subject?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  message?: string;
  terms?: boolean;
};

export async function POST(req: Request) {
  let data: ContactPayload;
  try {
    data = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const clean = (s?: string) => (s ?? "").toString().trim();
  const fields = {
    firstName: clean(data.firstName),
    lastName: clean(data.lastName),
    email: clean(data.email),
    contact: clean(data.contact),
    subject: clean(data.subject),
    address: clean(data.address),
    city: clean(data.city),
    state: clean(data.state),
    country: clean(data.country),
    message: clean(data.message),
  };

  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return NextResponse.json(
        { ok: false, error: `Please fill in all required fields (${key}).` },
        { status: 422 }
      );
    }
  }
  if (!EMAIL_RE.test(fields.email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 422 });
  }
  if (!data.terms) {
    return NextResponse.json({ ok: false, error: "Please accept the terms to continue." }, { status: 422 });
  }

  // TODO (production): forward to the DENSO email-notification Azure Function
  //   (fa-densosense-email-notification-prod) or Azure Communication Services.
  //   Endpoint/secret come from env (process.env) / Azure Key Vault.
  // For now we log server-side and confirm success so the UI flow is complete.
  console.log("[contact] Connect-with-us submission:", {
    ...fields,
    message: fields.message.slice(0, 200),
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
