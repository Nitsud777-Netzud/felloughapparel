import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { isWhopConfigured } from "@/lib/whop";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = { title: "Shop" };
export const revalidate = 300;

export default async function ShopPage() {
  if (!isWhopConfigured()) {
    return <section className="shop-page section-pad"><div className="section-label">THE FELLOUGH CATALOG</div><h1>THE<br /><i>SHOP.</i></h1><div className="catalog-state"><span className="state-mark">01</span><div><h3>WHOP CONNECTION REQUIRED.</h3><p>Add your Whop API key and business ID to the Vercel environment variables to load your real catalog. No placeholder products are used.</p></div></div></section>;
  }

  try {
    const products = await getProducts();
    return (
      <section className="shop-page section-pad">
        <div className="section-label">THE FELLOUGH CATALOG / {String(products.length).padStart(2, "0")} LIVE</div>
        <div className="shop-title-row"><h1>THE<br /><i>SHOP.</i></h1><p>Real products. Real details.<br />Straight from the Whop dashboard.</p></div>
        {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="catalog-state"><span className="state-mark">00</span><div><h3>NOTHING ON THE RACK. YET.</h3><p>There are no published products in the connected Whop catalog. Publish a real product in Whop and it will appear here automatically.</p></div></div>}
      </section>
    );
  } catch {
    return <section className="shop-page section-pad"><div className="section-label">THE FELLOUGH CATALOG</div><h1>THE<br /><i>SHOP.</i></h1><div className="catalog-state"><span className="state-mark">!</span><div><h3>CATALOG UNAVAILABLE.</h3><p>We couldn't verify the live Whop catalog. Try again later. No invented listings will be displayed.</p></div></div></section>;
  }
}