import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "APV Mobile Mechanics <onboarding@resend.dev>",
            to: ["apvmobilemechanics@gmail.com"],
            subject: `New Newsletter Subscriber: ${cleanEmail}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #ed1c24; margin-top: 0;">New Newsletter Subscriber</h2>
                <p>A new user has subscribed to the APV Mobile Mechanics newsletter:</p>
                <p style="font-size: 16px; font-weight: bold; color: #111;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888;">Sent automatically from the APV Mobile Mechanics website.</p>
              </div>
            `,
          }),
        }).catch(() => { });

        // 2. Customer Welcome / Thank You Email
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "APV Mobile Mechanics <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: "Welcome to APV Mobile Mechanics Newsletter",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #ed1c24; margin: 0 0 6px 0;">APV Mobile Mechanics</h2>
                  <p style="color: #666666; font-size: 14px; margin: 0;">Hobart Mobile Mechanic Services</p>
                </div>
                
                <h3 style="color: #111111; margin-top: 0;">Thank You for Subscribing!</h3>
                <p style="color: #444444; line-height: 1.6; font-size: 15px;">
                  You have successfully subscribed to the <strong>APV Mobile Mechanics</strong> newsletter. We will keep you updated with expert car maintenance tips, service offers, and automotive advice.
                </p>

                <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #eeeeee; font-size: 13px; color: #888888; text-align: center;">
                  <p style="margin: 0 0 4px 0;">Need a mobile mechanic in Hobart? Call us anytime at <strong>0424 411 375</strong>.</p>
                  <p style="margin: 0;">APV Mobile Mechanics — Coming to your home, office or roadside in Hobart.</p>
                </div>
              </div>
            `,
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
