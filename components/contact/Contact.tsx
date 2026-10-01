"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const validate = (name: string, email: string, message: string): FormErrors => {
  const errs: FormErrors = {};
  if (!name.trim()) errs.name = "Name required";
  else if (name.trim().length < 2) errs.name = "Name too short";
  if (!email.trim()) errs.email = "Email required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email";
  if (!message.trim()) errs.message = "Message required";
  else if (message.trim().length < 10) errs.message = "Message too short";
  return errs;
};

const inputClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-dim transition-colors focus:border-accent/60 focus:outline-none";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot) {
      setFormState("error");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const validationErrors = validate(name, email, message);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setFormState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (response.ok) {
        setFormState("success");
        form.reset();
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="rounded-lg border border-border p-6 text-center">
        <p className="font-mono text-sm text-accent">message delivered</p>
        <p className="mt-1 text-sm text-text-secondary">
          Thanks, I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-4 text-xs text-text-dim hover:text-text-secondary"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div data-bug-inspect="input.name">
          <label htmlFor="contact-name" className="mb-1.5 block font-mono text-[11px] text-text-dim">
            name
          </label>
          <input type="text" id="contact-name" name="name" autoComplete="name" maxLength={100} className={inputClass} placeholder="Your name" />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div data-bug-inspect="input.email">
          <label htmlFor="contact-email" className="mb-1.5 block font-mono text-[11px] text-text-dim">
            email
          </label>
          <input type="email" id="contact-email" name="email" autoComplete="email" maxLength={200} className={inputClass} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
      </div>

      <div data-bug-inspect="textarea.message">
        <label htmlFor="contact-message" className="mb-1.5 block font-mono text-[11px] text-text-dim">
          message
        </label>
        <textarea id="contact-message" name="message" rows={4} maxLength={5000} className={`${inputClass} resize-y`} placeholder="What would you like to discuss?" />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] text-text-dim">usually replies within 48h</p>
        <button
          type="submit"
          disabled={formState === "submitting"}
          className="rounded-full bg-text-primary px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
          data-bug-inspect="button.transmit"
        >
          {formState === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>

      {formState === "error" && (
        <p className="text-xs text-red-400">
          Could not send the message. Please try again later or email me directly.
        </p>
      )}
    </form>
  );
}
