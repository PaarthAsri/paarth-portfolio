"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [honeypot, setHoneypot] = useState("");

  const validate = (name: string, email: string, message: string): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "[ERROR] NAME REQUIRED";
    else if (name.trim().length < 2) errs.name = "[ERROR] NAME TOO SHORT";
    if (!email.trim()) errs.email = "[ERROR] EMAIL REQUIRED";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "[ERROR] INVALID EMAIL FORMAT";
    if (!message.trim()) errs.message = "[ERROR] MESSAGE REQUIRED";
    else if (message.trim().length < 10) errs.message = "[ERROR] MESSAGE TOO SHORT";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Honeypot check
    if (honeypot) {
      setFormState("error");
      return;
    }

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

  return (
    <Section id="contact">
      <SectionHeader number="06" title="Secure Transmission" subtitle="Establish a secure communication channel" />

      <div className="max-w-2xl mx-auto">
        <p className="text-text-secondary text-center mb-8">
          Have a security opportunity, technical discussion, or project in mind?
        </p>

        {formState === "success" ? (
          <div className="border border-cyber-green/30 rounded-lg bg-cyber-green/5 p-8 text-center">
            <p className="text-cyber-green font-mono text-lg mb-2">[ TRANSMISSION SUCCESSFUL ]</p>
            <p className="text-text-secondary text-sm mb-4">Message delivered successfully. SESSION CLOSED.</p>
            <button
              onClick={() => setFormState("idle")}
              className="interactive-tag px-4 py-2 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded"
            >
              SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot - hidden from real users */}
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

            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-mono text-text-dim mb-2">
                [01] NAME
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                className="w-full px-4 py-3 bg-panel/60 border border-border-dim rounded text-text-primary font-mono text-sm focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/30 transition-all"
                placeholder="Enter your name..."
              />
              {errors.name && <p className="text-cyber-red text-xs font-mono mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-mono text-text-dim mb-2">
                [02] EMAIL
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                autoComplete="email"
                maxLength={200}
                className="w-full px-4 py-3 bg-panel/60 border border-border-dim rounded text-text-primary font-mono text-sm focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/30 transition-all"
                placeholder="Enter your email..."
              />
              {errors.email && <p className="text-cyber-red text-xs font-mono mt-1">{errors.email}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono text-text-dim mb-2">
                [03] MESSAGE
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={5000}
                className="w-full px-4 py-3 bg-panel/60 border border-border-dim rounded text-text-primary font-mono text-sm focus:border-cyber-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyber-cyan/30 transition-all resize-y"
                placeholder="Tell me what you'd like to discuss..."
              />
              {errors.message && <p className="text-cyber-red text-xs font-mono mt-1">{errors.message}</p>}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="interactive-tag inline-flex items-center gap-2 px-6 py-3 text-sm font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "submitting" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyber-amber animate-pulse" />
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <span>&gt;</span>
                    TRANSMIT MESSAGE
                  </>
                )}
              </button>
            </div>

            {formState === "error" && (
              <div className="border border-cyber-red/30 rounded-lg bg-cyber-red/5 p-4 text-center">
                <p className="text-cyber-red font-mono text-sm">[ TRANSMISSION FAILED ]</p>
                <p className="text-text-secondary text-xs mt-1">Unable to deliver the message right now. Please try again later.</p>
              </div>
            )}
          </form>
        )}
      </div>
    </Section>
  );
}
