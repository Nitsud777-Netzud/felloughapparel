import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">CHRISTIAN STREETWEAR · A LITTLE HUMOR, NO APOLOGIES</div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Fellough Apparel home">
          FELLOUGH<span>®</span>
          <small>APPAREL</small>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/shop">SHOP</Link>
          <Link href="/about">OUR STANDARD</Link>
        </nav>
        <Link className="header-cta" href="/shop">THE DROP <span>↗</span></Link>
      </header>
    </>
  );
}