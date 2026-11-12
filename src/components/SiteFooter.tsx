import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="footer-wordmark" href="/">FELLOUGH.</Link>
          <p>Faith without the watered-down version.</p>
        </div>
        <div className="footer-links">
          <Link href="/shop">Shop</Link>
          <Link href="/about">Our standard</Link>
          <span>Checkout securely powered by Whop</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Fellough Apparel</span>
        <span>CHRIST FIRST. HUMOR INCLUDED.</span>
      </div>
    </footer>
  );
}