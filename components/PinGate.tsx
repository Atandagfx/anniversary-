"use client";

import { FormEvent, useRef, useState } from "react";

export function PinGate() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      window.location.reload();
    } catch {
      setMessage("I could not open our story just yet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="pin-gate">
      <div className="pin-grain" aria-hidden="true" />
      <div className="pin-hearts" aria-hidden="true">
        <span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>
      </div>

      <section className="pin-card" aria-labelledby="pin-title">
        <div className="pin-seal" aria-hidden="true">A</div>
        <p className="eyebrow">A little secret, just for us</p>
        <h1 id="pin-title">Our story is waiting.</h1>
        <p className="pin-intro">Enter our private PIN to open one year of love, laughter and beautiful memories.</p>

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
