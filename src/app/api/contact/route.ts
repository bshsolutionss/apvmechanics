import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { BRAND_RED, EMAIL_FROM, renderEmailLayout } from "@/lib/email-template";
import { EMAIL, SITE_URL } from "@/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, suburb, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Resend API key is missing in environment variables." },
        { status: 500 }
      );
    }

    // ── Admin Lead Notification Email ──
    const adminBodyHtml = `
      <h2 style="color:${BRAND_RED};border-bottom:2px solid ${BRAND_RED};padding-bottom:10px;margin:0 0 18px 0;">New Website Quote Enquiry</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:8px 0;font-weight:bold;width:140px;">Customer Name:</td>
          <td style="padding:8px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:bold;">Email Address:</td>
          <td style="padding:8px 0;"><a href="mailto:${email}" style="color:${BRAND_RED};text-decoration:none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:bold;">Phone Number:</td>
          <td style="padding:8px 0;"><a href="tel:${phone}" style="color:${BRAND_RED};text-decoration:none;">${phone || "N/A"}</a></td>
        </tr>
        ${suburb ? `<tr>
          <td style="padding:8px 0;font-weight:bold;">Suburb:</td>
          <td style="padding:8px 0;">${suburb}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:8px 0;font-weight:bold;">Requested Service:</td>
          <td style="padding:8px 0;">${service || "General Care"}</td>
        </tr>
      </table>

      <div style="padding:15px;background-color:#f8f9fa;border-left:4px solid ${BRAND_RED};border-radius:4px;">
        <p style="margin:0 0 8px 0;font-weight:bold;color:#333;">Customer Message:</p>
        <p style="margin:0;white-space:pre-wrap;color:#555;line-height:1.5;">${message}</p>
      </div>

      <div style="text-align:center;margin-top:24px;">
        <a href="${SITE_URL}/admin" style="display:inline-block;padding:12px 24px;background-color:${BRAND_RED};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">View in Admin Panel</a>
      </div>

      <hr style="margin:25px 0 0 0;border:none;border-top:1px solid #eee;" />
      <p style="font-size:12px;color:#888;margin:15px 0 0 0;">Sent automatically from the APV Mobile Mechanics website contact form.</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [EMAIL],
        replyTo: email,
        subject: `New Enquiry from ${name} - ${service || "Car Repair"}`,
        html: renderEmailLayout({ bodyHtml: adminBodyHtml }),
      }),
    });

    const responseData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API delivery failure:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Failed to send email." },
        { status: resendResponse.status }
      );
    }

    // ── Customer Thank You / Confirmation Email ──
    try {
      const customerBodyHtml = `
        <h3 style="color:#111111;margin-top:0;">Hi ${name},</h3>
        <p style="color:#444444;line-height:1.6;font-size:15px;">
          Thank you for reaching out to <strong>APV Mobile Mechanics</strong>! We have received your enquiry regarding <strong>${service || "Mobile Mechanic Service"}</strong>.
        </p>

        <div style="padding:16px;background-color:#f8f9fa;border-left:4px solid ${BRAND_RED};border-radius:6px;margin:20px 0;">
          <p style="margin:0 0 6px 0;font-weight:bold;color:#111;">Your Request Summary:</p>
          <p style="margin:0 0 4px 0;font-size:14px;color:#555;"><strong>Service:</strong> ${service || "General Care"}</p>
          <p style="margin:0 0 4px 0;font-size:14px;color:#555;"><strong>Phone:</strong> ${phone || "N/A"}</p>
          ${suburb ? `<p style="margin:0 0 4px 0;font-size:14px;color:#555;"><strong>Suburb:</strong> ${suburb}</p>` : ""}
          <p style="margin:0;font-size:14px;color:#555;"><strong>Message:</strong> ${message}</p>
        </div>

        <p style="color:#444444;line-height:1.6;font-size:15px;">
          <strong>We will get back to you soon</strong> — our team reviews every enquiry and typically responds within one business day.
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
          to: [email],
          subject: `Thank You for Contacting APV Mobile Mechanics — We'll Be in Touch Soon`,
          html: renderEmailLayout({ bodyHtml: customerBodyHtml }),
        }),
      }).catch(() => { });
    } catch (custErr) {
      console.warn("Customer confirmation email notice:", custErr);
    }

    // ── Save Lead to Supabase (single source of truth for the Admin Panel) ──
    try {
      if (supabase) {
        await supabase.from("enquiries").insert([
          {
            name,
            email,
            phone: phone || "N/A",
            suburb: suburb || "N/A",
            service: service || "General Care",
            message,
            status: "new",
          },
        ]);
      }
    } catch (saveErr) {
      console.error("Failed to save enquiry lead:", saveErr);
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Contact API Route Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while sending your message." },
      { status: 500 }
    );
  }
}
