import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ContactLead, NewsletterLead } from "@/types/lead.types";

// Store empty defaults for real lead accumulation
let contactLeadsStore: ContactLead[] = [];
let newsletterLeadsStore: NewsletterLead[] = [];

export async function GET() {
  let enquiries = [...contactLeadsStore];
  let newsletter = [...newsletterLeadsStore];

  if (supabase) {
    try {
      const { data: dbEnquiries, error: enqErr } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!enqErr && dbEnquiries && dbEnquiries.length > 0) {
        enquiries = dbEnquiries.map((row) => ({
          id: row.id || "db_" + row.created_at,
          name: row.name || "Customer",
          email: row.email,
          phone: row.phone || "N/A",
          suburb: row.suburb || undefined,
          service: row.service || "General Care",
          message: row.message || "",
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          status: row.status || "new",
        }));
      }

      const { data: dbNews, error: newsErr } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!newsErr && dbNews && dbNews.length > 0) {
        newsletter = dbNews.map((row) => ({
          id: row.id || "db_news_" + row.created_at,
          email: row.email,
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          status: row.status || "subscribed",
        }));
      }
    } catch (dbErr) {
      console.warn("Supabase lead fetch notice (using fallback):", dbErr);
    }
  }

  return NextResponse.json({
    success: true,
    enquiries,
    newsletter,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, lead } = body;

    if (type === "enquiry") {
      const newLead: ContactLead = {
        id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "N/A",
        suburb: lead.suburb,
        service: lead.service || "General Care",
        message: lead.message,
        createdAt: new Date().toISOString(),
        status: "new",
      };

      contactLeadsStore = [newLead, ...contactLeadsStore];

      if (supabase) {
        try {
          await supabase.from("enquiries").insert([
            {
              name: lead.name,
              email: lead.email,
              phone: lead.phone || "N/A",
              suburb: lead.suburb || "N/A",
              service: lead.service || "General Care",
              message: lead.message,
              status: "new",
            },
          ]);
        } catch {}
      }

      return NextResponse.json({ success: true, lead: newLead });
    }

    if (type === "newsletter") {
      const newSubscriber: NewsletterLead = {
        id: "news_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        email: lead.email,
        createdAt: new Date().toISOString(),
        status: "subscribed",
      };

      newsletterLeadsStore = [newSubscriber, ...newsletterLeadsStore];

      if (supabase) {
        try {
          await supabase.from("newsletter_subscribers").insert([{ email: lead.email, status: "subscribed" }]);
        } catch {}
      }

      return NextResponse.json({ success: true, lead: newSubscriber });
    }

    return NextResponse.json({ error: "Invalid lead type specified." }, { status: 400 });
  } catch (error) {
    console.error("Admin leads POST error:", error);
    return NextResponse.json({ error: "Failed to store lead." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Lead ID and status are required." }, { status: 400 });
    }

    let updated = false;
    contactLeadsStore = contactLeadsStore.map((item) => {
      if (item.id === id) {
        updated = true;
        return { ...item, status };
      }
      return item;
    });

    if (!updated) {
      newsletterLeadsStore = newsletterLeadsStore.map((item) => {
        if (item.id === id) {
          updated = true;
          return { ...item, status };
        }
        return item;
      });
    }

    if (supabase) {
      try {
        await supabase.from("enquiries").update({ status }).eq("id", id);
        await supabase.from("newsletter_subscribers").update({ status }).eq("id", id);
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leads PATCH error:", error);
    return NextResponse.json({ error: "Failed to update lead status." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required for deletion." }, { status: 400 });
    }

    contactLeadsStore = contactLeadsStore.filter((item) => item.id !== id);
    newsletterLeadsStore = newsletterLeadsStore.filter((item) => item.id !== id);

    if (supabase) {
      try {
        await supabase.from("enquiries").delete().eq("id", id);
        await supabase.from("newsletter_subscribers").delete().eq("id", id);
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leads DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete lead." }, { status: 500 });
  }
}
