"use client";

import { useState } from "react";

export function RentEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || "rental.lead@apvmechanics.com.au",
          phone: formData.phone.trim(),
          service: "Car Rental Enquiry",
          message: formData.message.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Failed to send enquiry. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rent-car__success" style={{ padding: "24px", background: "#e8f5e9", borderRadius: "12px", border: "1px solid #c8e6c9", color: "#2e7d32", textAlign: "center" }}>
        <strong style={{ display: "block", fontSize: "18px", marginBottom: "6px" }}>Enquiry Sent Successfully!</strong>
        <p style={{ margin: 0, fontSize: "14px", color: "#388e3c" }}>Thank you! Our team will review your vehicle rental request and email/call you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          style={{ marginTop: "16px", padding: "8px 16px", background: "#ed1c24", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Send An Enquiry</h3>

      {errorMessage && (
        <div style={{ padding: "10px", background: "#ffe6e6", border: "1px solid #ffc9c9", color: "#ed1c24", borderRadius: "6px", fontSize: "13px", marginBottom: "14px" }}>
          {errorMessage}
        </div>
      )}

      <div className="rent-car__field">
        <label htmlFor="rent-name">Name</label>
        <input
          id="rent-name"
          type="text"
          placeholder="Your full name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="rent-car__field">
        <label htmlFor="rent-email">Email Address</label>
        <input
          id="rent-email"
          type="email"
          placeholder="Your email address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="rent-car__field">
        <label htmlFor="rent-phone">Phone</label>
        <input
          id="rent-phone"
          type="tel"
          placeholder="Your phone number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="rent-car__field">
        <label htmlFor="rent-message">Message</label>
        <textarea
          id="rent-message"
          rows={4}
          placeholder="Tell us what vehicle you need and for how long..."
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button type="submit" className="rent-car__submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
