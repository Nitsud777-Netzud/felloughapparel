import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { verifyWhopWebhook, type WhopWebhookEvent } from "@/lib/whop";

export const dynamic = "force-dynamic";

const PRODUCT_EVENTS = new Set([
  "product.created", "product.updated", "product.deleted",
  "product.published", "product.unpublished",
  "plan.created", "plan.updated", "plan.deleted",
]);

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let event: WhopWebhookEvent;
  try {
    event = verifyWhopWebhook(rawBody, headers);
  } catch (error) {
    console.error("[whop webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const expectedAccount = process.env.WHOP_COMPANY_ID;
  if (expectedAccount && event.account_id && event.account_id !== expectedAccount) {
    return NextResponse.json({ error: "Unexpected Whop account." }, { status: 403 });
  }

  if (PRODUCT_EVENTS.has(event.type)) revalidateTag("whop-products", "max");
  return NextResponse.json({ received: true, event: event.type });
}