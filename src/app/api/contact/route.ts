import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #d90429; border-bottom: 2px solid #d90429; padding-bottom: 10px; margin-top: 0;">New Website Quote Enquiry</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email Address:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #d90429; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
            <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #d90429; text-decoration: none;">${phone || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Requested Service:</td>
            <td style="padding: 8px 0;">${service || "General Care"}</td>
          </tr>
        </table>
        
        <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d90429; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Customer Message:</p>
          <p style="margin: 0; white-space: pre-wrap; color: #555; line-height: 1.5;">${message}</p>
        </div>
        
        <hr style="margin: 25px 0 15px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888; margin: 0;">Sent automatically from the APV Mobile Mechanics website contact form.</p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "APV Mobile Mechanics <onboarding@resend.dev>",
        to: ["apvmobilemechanics@gmail.com"],
        replyTo: email,
        subject: `New Enquiry from ${name} - ${service || "Car Repair"}`,
        html: htmlContent,
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

    // Save to Admin Leads store & Supabase
    try {
      if (supabase) {
        try {
          await supabase.from("enquiries").insert([
            {
              name,
              email,
              phone: phone || "N/A",
              service: service || "General Care",
              message,
              status: "new",
            },
          ]);
        } catch {}
      }

      await fetch(new URL("/api/admin/leads", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          lead: { name, email, phone, service, message },
        }),
      }).catch(() => {});
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
