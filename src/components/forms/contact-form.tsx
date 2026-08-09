"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { ContactService } from "@/services/contact.service";
import type { ContactPayload } from "@/types/contact.types";
import { TermsConditionsNote } from "@/components/common/terms-conditions-note";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const honeypot = form.get("website") as string;
    if (honeypot) {
      // Bot detected: fake success silently
      setSent(true);
      setLoading(false);
      return;
    }

    const payload: ContactPayload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      service: form.get("service") as string,
      message: form.get("message") as string,
    };

    try {
      await ContactService.submitEnquiry(payload);
      setSent(true);
      formElement.reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while sending message.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="form-success">
        <CheckCircle2 />
        <h3>Thank You!</h3>
        <p>Your enquiry has been sent to <strong>apvmobilemechanics@gmail.com</strong>. We will get back to you as soon as possible.</p>
        <button className="primary-action" type="button" onClick={() => setSent(false)}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form className={`apv-contact-form automart-form ${compact ? "automart-form--compact" : ""}`} onSubmit={submit}>
      <h2>Get A Free Quote</h2>
      {/* Anti-spam honeypot input */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none", position: "absolute", left: "-9999px" }} aria-hidden="true" />
      {error && (
        <div style={{ color: "#d90429", padding: "10px 14px", borderRadius: "6px", backgroundColor: "#ffe6e6", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <div className="form-two">
        <label>Your Name<input required name="name" placeholder="Your Name" disabled={loading}/></label>
        <label>Email Address<input required name="email" type="email" placeholder="Email Address" disabled={loading}/></label>
      </div>
      <div className="form-two">
        <label>Phone Number<input required name="phone" type="tel" placeholder="Phone Number" disabled={loading}/></label>
        <label>Service
          <select required name="service" defaultValue="" disabled={loading}>
            <option value="" disabled>Select Service</option>
            <option>Mobile Call-Out ($70)</option>
            <option>Initial Inspection ($70)</option>
            <option>Mobile Car Repair</option>
            <option>Engine Diagnosis</option>
            <option>Brake Repair</option>
            <option>Battery Replacement</option>
            <option>Oil Change</option>
            <option>Emergency Roadside Assistance</option>
          </select>
        </label>
      </div>
      <label>Your Message<textarea required name="message" rows={compact ? 3 : 5} placeholder="Write Your Message" disabled={loading}/></label>
      <button className="primary-action" type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}>
        {loading ? "Sending Message..." : "Send Message"}
      </button>
      <TermsConditionsNote className="form-terms-note" />
    </form>
  );
}

export const LocalContactForm = ContactForm;
