"use client";

import { useState } from "react";

export function BuyButton({ productId, planId }: { productId: string; planId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buy() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, planId }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Checkout could not be started.");
      window.location.assign(result.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <div className="buy-action">
      <button className="button button-dark" type="button" onClick={buy} disabled={loading}>
        {loading ? "OPENING CHECKOUT…" : "BUY THROUGH WHOP ↗"}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}