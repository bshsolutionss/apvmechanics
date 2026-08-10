"use client";

import { FormEvent, useState } from "react";
import type { ContactPayload } from "@/types/contact.types";

export function useContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload: ContactPayload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      suburb: (form.get("suburb") as string) || "",
      service: form.get("service") as string,
      message: form.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email enquiry.");
      }

      // Local backup save
      const existing = JSON.parse(window.localStorage.getItem("automart-enquiries") ?? "[]") as unknown[];
      window.localStorage.setItem(
        "automart-enquiries",
        JSON.stringify([...existing, { ...payload, createdAt: new Date().toISOString() }])
      );

      setSent(true);
      formElement.reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while sending message.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    sent,
    setSent,
    loading,
    error,
    submitForm,
  };
}
