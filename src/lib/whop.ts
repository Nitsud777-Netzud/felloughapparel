import { unwrapWebhook } from "@whop/sdk/helpers";
import type { WhopProduct, WhopVariant } from "@/lib/types";

const API_BASE = process.env.WHOP_SANDBOX === "true"
  ? "https://sandbox-api.whop.com/api/v1"
  : "https://api.whop.com/api/v1";

function credentials() {
  const token = process.env.WHOP_COMPANY_API_KEY;
  const accountId = process.env.WHOP_COMPANY_ID;
  if (!token || !accountId) {
    throw new Error("Whop is not configured. Add WHOP_COMPANY_API_KEY and WHOP_COMPANY_ID.");
  }
  return { token, accountId };
}

export function isWhopConfigured() {
  return Boolean(process.env.WHOP_COMPANY_API_KEY && process.env.WHOP_COMPANY_ID);
}

async function whopRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = credentials();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Api-Version-Date": "2026-11-10-1",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Whop API request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json() as Promise<T>;
}

type ProductListResponse = {
  data?: WhopProduct[];
  page_info?: { end_cursor?: string | null; has_next_page?: boolean };
};

export async function listWhopProducts(): Promise<WhopProduct[]> {
  const { accountId } = credentials();
  const all: WhopProduct[] = [];
  let cursor: string | null = null;
  let page = 0;

  do {
    const params = new URLSearchParams({
      account_id: accountId,
      visibilities: "visible",
      access_pass_types: "regular",
      first: "100",
    });
    if (cursor) params.set("after", cursor);

    const result = await whopRequest<ProductListResponse>(`/products?${params.toString()}`);
    all.push(...(result.data ?? []));
    cursor = result.page_info?.has_next_page ? (result.page_info.end_cursor ?? null) : null;
    page += 1;
  } while (cursor && page < 10);

  return all.filter((product) => product.visibility === "visible" && Boolean(product.id && product.title));
}

export async function createWhopCheckout(planId: string) {
  const { accountId } = credentials();
  return whopRequest<{ purchase_url?: string | null; id?: string }>(
    "/checkout_configurations",
    {
      method: "POST",
      headers: { "Idempotency-Key": `fellough-${planId}-${crypto.randomUUID()}` },
      body: JSON.stringify({
        account_id: accountId,
        variant_id: planId,
        mode: "payment",
        redirect_url: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/complete`
          : undefined,
      }),
    },
  );
}

export type WhopWebhookEvent = {
  id: string;
  type: string;
  account_id?: string | null;
  data?: { id?: string; account?: { id?: string } };
};

export function verifyWhopWebhook(rawBody: string, headers: Record<string, string>) {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) throw new Error("WHOP_WEBHOOK_SECRET is not configured.");
  return unwrapWebhook<WhopWebhookEvent>(rawBody, { headers, key: secret });
}

export function getVariants(product: WhopProduct): WhopVariant[] {
  const variants = product.variants?.filter((variant) => variant.visibility === "visible") ?? [];
  if (variants.length) return variants;
  return product.default_variant?.visibility === "visible" ? [product.default_variant] : [];
}