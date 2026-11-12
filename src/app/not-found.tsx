import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found section-pad">
      <div className="section-label">404 / WRONG TURN</div>
      <h1>NOT HERE.<br /><i>NOT TODAY.</i></h1>
      <p>That page or product couldn't be found in the live catalog.</p>
      <Link className="button button-dark" href="/shop">BACK TO THE SHOP ↗</Link>
    </section>
  );
}