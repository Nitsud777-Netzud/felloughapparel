import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { isWhopConfigured } from "@/lib/whop";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isWhopConfigured()) {
    return NextResponse.json({ products: [], configured: false }, { status: 503 });
  }
  try {
    const products = await getProducts();
    return NextResponse.json({ products, configured: true, syncedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("[catalog] Whop product retrieval failed:", error);
    return NextResponse.json({ error: "The live product catalog is temporarily unavailable.", products: [] }, { status: 503 });
  }
}