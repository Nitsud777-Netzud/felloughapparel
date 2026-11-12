import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, formatPrice } from "@/lib/products";
import { isWhopConfigured } from "@/lib/whop";
import { BuyButton } from "@/components/BuyButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isWhopConfigured()) return { title: "Product" };
  try {
    const product = (await getProducts()).find((item) => item.id === decodeURIComponent(id));
    return product ? { title: product.title, description: product.description || "Fellough Apparel product." } : { title: "Product" };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  if (!isWhopConfigured()) notFound();

  let products;
  try {
    products = await getProducts();
  } catch {
    return <section className="section-pad product-error"><h1>PRODUCT UNAVAILABLE.</h1><p>We couldn’t verify this product with Whop right now. Please try again later.</p></section>;
  }

  const product = products.find((item) => item.id === decodeURIComponent(id));
  if (!product) notFound();

  return (
    <section className="product-detail section-pad">
      <div className="product-detail-image">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.title} />
        ) : <div className="image-unavailable"><span>IMAGE NOT PROVIDED</span></div>}
      </div>
      <div className="product-detail-info">
        <div className="section-label">FELLOUGH APPAREL / PRODUCT</div>
        <h1>{product.title}</h1>
        <div className="detail-price">{formatPrice(product.price, product.currency)}</div>
        {product.madeInUsaVerified && <span className="origin-tag inline-tag">MADE IN USA · VERIFIED</span>}
        {product.description && <p className="detail-description">{product.description}</p>}
        {Object.entries(product.attributes).map(([name, values]) => (
          <div className="variant-row" key={name}><span>{name.toUpperCase()}</span><div>{values.map((value) => <span className="variant-chip" key={value}>{value}</span>)}</div></div>
        ))}
        {product.variants.length > 1 ? (
          <div className="variant-select-wrap">
            <label htmlFor="product-variant">SELECT AN OPTION</label>
            <form action="/api/checkout" method="post">
              <input type="hidden" name="productId" value={product.id} />
              <select id="product-variant" name="planId" defaultValue={product.planId ?? ""}>
                {product.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.title || variant.id}</option>)}
              </select>
              <button className="button button-dark" type="submit" formAction="/api/checkout">BUY THROUGH WHOP ↗</button>
            </form>
          </div>
        ) : product.planId ? (
          <BuyButton productId={product.id} planId={product.planId} />
        ) : (
          <p className="availability-note">Checkout details aren’t available for this product yet.</p>
        )}
        <p className="checkout-note">Secure checkout is handled by Whop. Product details and availability come from the live Whop catalog.</p>
      </div>
    </section>
  );
}