import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/product/${encodeURIComponent(product.id)}`} className="product-image-wrap">
        {product.image ? (
          // Whop-hosted product image, intentionally not replaced with stock imagery.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="product-image" src={product.image} alt={product.title} loading="lazy" />
        ) : (
          <div className="image-unavailable"><span>IMAGE NOT PROVIDED</span></div>
        )}
        {product.madeInUsaVerified && <span className="origin-tag">MADE IN USA</span>}
      </Link>
      <div className="product-card-meta">
        <Link href={`/product/${encodeURIComponent(product.id)}`} className="product-title">{product.title}</Link>
        <span className="product-price">{formatPrice(product.price, product.currency)}</span>
      </div>
      <div className="product-card-foot">
        <span>{product.variants.length ? `${product.variants.length} OPTION${product.variants.length === 1 ? "" : "S"}` : "DETAILS"}</span>
        <Link href={`/product/${encodeURIComponent(product.id)}`} aria-label={`View ${product.title}`}>VIEW ↗</Link>
      </div>
    </article>
  );
}