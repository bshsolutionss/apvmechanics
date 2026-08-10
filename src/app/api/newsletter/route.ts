import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { BRAND_RED, EMAIL_FROM, renderEmailLayout } from "@/lib/email-template";
import { EMAIL, SITE_URL } from "@/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        await supabase
          .from("newsletter_subscribers")
          .upsert([{ email: cleanEmail, status: "subscribed" }], { onConflict: "email" });
      } catch (dbErr) {
        console.error("Failed to insert newsletter subscriber into Supabase:", dbErr);
      }
    }

    // Send Admin Notification Email & Customer Welcome Email via Resend API
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        // 1. Admin Email Notification
        const adminBodyHtml = `
          <h2 style="color:${BRAND_RED};margin-top:0;">New Newsletter Subscriber</h2>
          <p style="color:#444;line-height:1.6;">A new user has subscribed to the APV Mobile Mechanics newsletter:</p>
          <p style="font-size:16px;font-weight:bold;color:#111;"><a href="mailto:${cleanEmail}" style="color:${BRAND_RED};text-decoration:none;">${cleanEmail}</a></p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${SITE_URL}/admin" style="display:inline-block;padding:12px 24px;background-color:${BRAND_RED};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">View in Admin Panel</a>
          </div>
          <hr style="margin:25px 0 0 0;border:none;border-top:1px solid #eee;" />
          <p style="font-size:12px;color:#888;margin:15px 0 0 0;">Sent automatically from the APV Mobile Mechanics website.</p>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [EMAIL],
            subject: `New Newsletter Subscriber: ${cleanEmail}`,
            html: renderEmailLayout({ bodyHtml: adminBodyHtml }),
          }),
        }).catch(() => { });

        // 2. Customer Welcome / Thank You Email
        const customerBodyHtml = `
          <h3 style="color:#111111;margin-top:0;">Thank You for Subscribing!</h3>
          <p style="color:#444444;line-height:1.6;font-size:15px;">
            You have successfully subscribed to the <strong>APV Mobile Mechanics</strong> newsletter. We will keep you updated with expert car maintenance tips, service offers, and automotive advice — <strong>we'll get back to you soon</strong> whenever there's something worth sharing.
          </p>
          <div style="text-align:center;margin-top:24px;">
            <a href="${SITE_URL}/services" style="display:inline-block;padding:12px 24px;background-color:${BRAND_RED};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">Explore Our Services</a>
          </div>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [cleanEmail],
            subject: "Welcome to APV Mobile Mechanics Newsletter",
            html: renderEmailLayout({ bodyHtml: customerBodyHtml, unsubscribeEmail: cleanEmail }),
          }),
        }).catch(() => { });
      } catch (emailErr) {
        console.warn("Newsletter email delivery notice:", emailErr);
      }
    }

    const newSubscriber = {
      id: "news_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      status: "subscribed" as const,
    };

    return NextResponse.json({ success: true, subscriber: newSubscriber });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing newsletter subscription." },
      { status: 500 }
    );
  }
}
