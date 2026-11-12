import Link from "next/link";

export default function CheckoutCompletePage() {
  return (
    <section className="checkout-complete section-pad">
      <div className="section-label">FELLOUGH APPAREL / CHECKOUT</div>
      <h1>THANK YOU.<br /><i>GOD BLESS.</i></h1>
      <p>Whop has handled your checkout. For payment confirmation, shipping, and order details, use the confirmation from Whop.</p>
      <Link className="button button-dark" href="/shop">BACK TO THE SHOP ↗</Link>
    </section>
  );
}