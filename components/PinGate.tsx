"use client";

import { FormEvent, useRef, useState } from "react";
import type { AnniversaryContent } from "../data/relationship";
import { AnniversarySite } from "./AnniversarySite";

export function PinGate({ content }: { content: AnniversaryContent }) {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pin || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Something went wrong. Please try again.");
        setPin("");
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }

      setPin("");
      setIsUnlocked(true);
    } catch {
      setMessage("I could not open our story just yet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isUnlocked) {
    return <AnniversarySite content={content} />;
  }

  return (
    <main className="pin-gate">
      <div className="pin-grain" aria-hidden="true" />
      <div className="pin-hearts" aria-hidden="true">
        <span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>
      </div>

      <section className="pin-card" aria-labelledby="pin-title">
        <div className="pin-seal" aria-hidden="true">A+A</div>
        <p className="eyebrow">Atanda &amp; Ajoke · a little secret</p>
        <h1 id="pin-title">Our story is waiting.</h1>
        <p className="pin-intro">Enter our private PIN to open one year of love, laughter and beautiful memories—one page at a time.</p>

        <form className="pin-form" onSubmit={handleSubmit}>
          <label htmlFor="anniversary-pin">Anniversary PIN</label>
          <input
            ref={inputRef}
            id="anniversary-pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={12}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            aria-describedby="pin-message"
            autoFocus
          />
          <button type="submit" disabled={!pin || isSubmitting}>
            {isSubmitting ? "Opening…" : "Open Our Story"}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p id="pin-message" className="pin-message" role="status" aria-live="polite">
          {message || "One PIN. One beautiful year. Only us."}
        </p>
        <span className="pin-signature">with all my love ♡</span>
      </section>
    </main>
  );
}
