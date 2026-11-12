import Link from "next/link";
import { getProducts } from "@/lib/products";
import { isWhopConfigured } from "@/lib/whop";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export const revalidate = 300;

export default async function HomePage() {
  let products: Product[] = [];
  let catalogError = false;
  if (isWhopConfigured()) {
    try {
      products = (await getProducts()).slice(0, 4);
    } catch {
      catalogError = true;
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-kicker"><span className="dot" /> CHRISTIAN STREETWEAR / EST. IN FAITH</div>
        <div className="hero-content">
          <p className="hero-pretitle">NOT HERE TO BE EVERYBODY’S CUP OF TEA.</p>
          <h1>FAITH.<br /><em>NO FILTER.</em></h1>
          <div className="hero-bottom">
            <p>For the ones who know the truth<br />doesn’t need a soft launch.</p>
            <Link className="button button-light" href="/shop">SHOP THE DROP <span>↗</span></Link>
          </div>
        </div>
        <div className="hero-side-note">COLOSSIANS 3:17<br />WHATEVER YOU DO — DO IT IN HIS NAME.</div>
        <div className="hero-sticker" aria-label="Christ first, humor included"><span>CHRIST</span><b>FIRST</b><small>HUMOR INCLUDED</small></div>
      </section>

      <section className="ticker" aria-label="Brand statement">
        <div>NOT LUKEWARM <span>✳</span> NOT BORING <span>✳</span> NOT HERE TO BLEND IN <span>✳</span> NOT LUKEWARM <span>✳</span> NOT BORING <span>✳</span></div>
      </section>

      <section className="intro-section section-pad">
        <div className="section-label">01 / THE POINT</div>
        <div className="intro-copy">
          <h2>TAKE THE FAITH<br />SERIOUSLY.<br /><i>NOT YOURSELF.</i></h2>
          <div className="intro-aside">
            <p>We’re here for good laughs, good design, and a faith that doesn’t fold when the room gets uncomfortable.</p>
            <p>Christian first. Funny on purpose. Never watered down.</p>
            <Link className="text-link" href="/about">WHAT WE STAND FOR ↗</Link>
          </div>
        </div>
      </section>

      <section className="featured-section section-pad">
        <div className="section-heading">
          <div><div className="section-label">02 / THE GOODS</div><h2>THE CURRENT DROP<span>®</span></h2></div>
          <Link className="text-link" href="/shop">VIEW ALL PRODUCTS ↗</Link>
        </div>
        {!isWhopConfigured() ? (
          <div className="catalog-state"><span className="state-mark">01</span><div><h3>THE SHOP IS GETTING SET UP.</h3><p>Our product catalog connects directly to Whop. Once the store connection is configured, only real, published products will appear here.</p></div></div>
        ) : catalogError ? (
          <div className="catalog-state"><span className="state-mark">!</span><div><h3>THE CATALOG COULDN'T LOAD.</h3><p>We couldn’t verify the live Whop catalog. No sample products will be shown. Please check back shortly.</p></div></div>
        ) : products.length ? (
          <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="catalog-state"><span className="state-mark">00</span><div><h3>NO LIVE PRODUCTS. YET.</h3><p>When a real product is published in the Whop dashboard, it will show up here automatically. No fake drops. Ever.</p></div></div>
        )}
      </section>

      <section className="made-section">
        <div className="made-stamp">USA<br /><span>✳</span><br />MADE</div>
        <div className="made-copy">
          <div className="section-label">03 / OUR STANDARD</div>
          <h2>MADE HERE.<br /><i>MEANS MADE HERE.</i></h2>
          <p>Our standard is simple: every piece must be entirely manufactured in America before it earns a place in the Fellough lineup. No fuzzy wording. No pretend patriotism. The details have to back it up.</p>
          <Link className="text-link" href="/about">READ OUR STANDARD ↗</Link>
        </div>
      </section>

      <section className="closing-cta section-pad">
        <div className="section-label">STAY ROOTED.</div>
        <h2>DON’T BE<br /><i>ASHAMED.</i></h2>
        <Link className="button button-dark" href="/shop">FIND YOUR PIECE <span>↗</span></Link>
        <p>ROMANS 1:16</p>
      </section>
    </>
  );
}