import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { createWhopCheckout, isWhopConfigured } from "@/lib/whop";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isWhopConfigured()) return NextResponse.json({ error: "Checkout is not configured yet." }, { status: 503 });

  try {
    const contentType = request.headers.get("content-type") || "";
    let productId = "";
    let planId = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      productId = typeof body.productId === "string" ? body.productId : "";
      planId = typeof body.planId === "string" ? body.planId : "";
    } else {
      const form = await request.formData();
      productId = String(form.get("productId") || "");
      planId = String(form.get("planId") || "");
    }

    if (!productId || !planId) return NextResponse.json({ error: "A valid product and option are required." }, { status: 400 });

    // Validate the product and plan against Whop's current catalog. Never trust client-supplied prices.
    const products = await getProducts();
    const product = products.find((item) => item.id === productId);
    if (!product || !product.variants.some((variant) => variant.id === planId)) {
      return NextResponse.json({ error: "This product option is no longer available." }, { status: 404 });
    }

    const checkout = await createWhopCheckout(planId);
    if (!checkout.purchase_url || !checkout.purchase_url.startsWith("https://")) {
      return NextResponse.json({ error: "Whop did not return a valid checkout URL." }, { status: 502 });
    }

    if (!contentType.includes("application/json")) return NextResponse.redirect(checkout.purchase_url, 303);
    return NextResponse.json({ url: checkout.purchase_url });
  } catch (error) {
    console.error("[checkout] Could not create Whop checkout:", error);
    return NextResponse.json({ error: "Checkout couldn't be started. Please try again." }, { status: 502 });
  }
}