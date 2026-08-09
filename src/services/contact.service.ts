import type { ContactPayload } from "@/types/contact.types";

export class ContactService {
  static async submitEnquiry(payload: ContactPayload): Promise<{ success: boolean; data?: unknown }> {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send email enquiry.");
    }

    // Local backup storage save
    try {
      const existing = JSON.parse(window.localStorage.getItem("apv-enquiries") ?? "[]") as unknown[];
      window.localStorage.setItem(
        "apv-enquiries",
        JSON.stringify([...existing, { ...payload, createdAt: new Date().toISOString() }])
      );
    } catch {
      // Ignore localStorage errors in non-browser environment
    }

    return data;
  }
}
