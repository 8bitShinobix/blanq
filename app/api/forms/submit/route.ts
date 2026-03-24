import { NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { createResponse } from "@/db/queries/responses";
import { getFormById } from "@/db/queries/forms";

export async function POST(request: Request) {
  const body = await request.json();
  const { formId, data, recaptchaToken } = body as {
    formId?: string;
    data?: Record<string, unknown>;
    recaptchaToken?: string;
  };

  if (!formId) {
    return NextResponse.json({ error: "formId is required" }, { status: 400 });
  }

  // Verify form exists
  const form = await getFormById(formId);
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // Verify reCAPTCHA if token provided
  if (recaptchaToken) {
    const { success, score } = await verifyRecaptchaToken(recaptchaToken);
    if (!success || (score !== undefined && score < 0.5)) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 403 },
      );
    }
  }

  // Save response
  const response = await createResponse({
    formId,
    data: data ?? {},
    completed: true,
  });

  return NextResponse.json({ success: true, responseId: response.id });
}
