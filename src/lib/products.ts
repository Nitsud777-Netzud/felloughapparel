import type { Product, WhopPrice, WhopProduct, WhopVariant } from "@/lib/types";
import { getVariants, listWhopProducts } from "@/lib/whop";

function amountOf(price: WhopPrice | number | string | null | undefined): number | null {
  if (price == null) return null;
  const raw = typeof price === "object" ? price.amount : price;
  if (raw == null) return null;
  const amount = Number(raw);
  return Number.isFinite(amount) ? amount : null;
}

function productPrice(variants: WhopVariant[]): { price: number | null; currency: string } {
  const prices = variants
    .map((variant) => ({
      value: amountOf(variant.initial_price),
      currency: typeof variant.initial_price === "object" && variant.initial_price
        ? variant.initial_price.currency ?? variant.currency ?? "usd"
        : variant.currency ?? "usd",
    }))
    .filter((item): item is { value: number; currency: string } => item.value !== null);

  if (!prices.length) return { price: null, currency: "usd" };
  return { price: Math.min(...prices.map((item) => item.value)), currency: prices[0].currency };
}

function safeImages(product: WhopProduct): string[] {
  const candidates = [product.logo_url, ...(product.gallery_images ?? []).map((image) => image.url)];
  return [...new Set(candidates.filter((url): url is string =>
    typeof url === "string" && /^https:\/\//i.test(url)
  ))];
}

function verifiedOrigin(product: WhopProduct): boolean {
  // Only display a Made in USA badge when an explicit verification flag is maintained in Whop metadata.
  return product.metadata?.made_in_usa_verified === true;
}

export function normalizeProduct(product: WhopProduct): Product {
  const variants = getVariants(product);
  const pricing = productPrice(variants);
  const images = safeImages(product);
  return {
    id: product.id,
    title: product.title,
    description: product.description?.trim() || product.headline?.trim() || "",
    image: images[0] ?? null,
    images,
    price: pricing.price,
    currency: pricing.currency,
    planId: variants[0]?.id ?? null,
    variants,
    attributes: product.variant_attributes ?? {},
    madeInUsaVerified: verifiedOrigin(product),
    slug: product.route || product.id,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await listWhopProducts();
  return products.map(normalizeProduct);
}

export function formatPrice(amount: number | null, currency: string) {
  if (amount === null) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}