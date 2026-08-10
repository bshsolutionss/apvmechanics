import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SITE_NAME, SITE_URL } from "@/constants";
import { BRAND_RED } from "@/lib/email-template";

// One-click unsubscribe target linked from the footer of every newsletter
// email. Required so marketing emails carry a working opt-out facility
// (Australian Spam Act 2003 compliance) and so the Admin Panel reflects
// accurate subscriber status.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();

  let success = false;

  if (email && supabase) {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ status: "unsubscribed" })
        .eq("email", email);
      success = !error;
    } catch (err) {
      console.error("Newsletter unsubscribe error:", err);
    }
  }

  const html = `
    <!doctype html>
    <html lang="en">
      <head><meta charset="utf-8" /><title>Unsubscribed — ${SITE_NAME}</title></head>
      <body style="font-family:Arial, Helvetica, sans-serif;background-color:#f4f5f7;margin:0;padding:40px 16px;">
        <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e9ecef;padding:36px 28px;text-align:center;">
          <h2 style="margin:0 0 10px 0;color:${success ? "#2e7d32" : BRAND_RED};">
            ${success ? "You've been unsubscribed" : "Unsubscribe request received"}
          </h2>
          <p style="color:#444;font-size:14px;line-height:1.6;">
            ${success
              ? `${email} will no longer receive newsletter emails from ${SITE_NAME}.`
              : `We couldn't confirm this automatically. Please email us and we'll remove you manually.`}
          </p>
          <a href="${SITE_URL}" style="display:inline-block;margin-top:18px;padding:12px 24px;background-color:${BRAND_RED};color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Back to ${SITE_NAME}</a>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
