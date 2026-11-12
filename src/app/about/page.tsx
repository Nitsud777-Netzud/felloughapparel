import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Standard" };

export default function AboutPage() {
  return (
    <section className="about-page section-pad">
      <div className="section-label">WHAT WE’RE ABOUT / NO FINE PRINT</div>
      <h1>CHRIST FIRST.<br /><i>NO WATERING IT DOWN.</i></h1>
      <div className="about-columns">
        <div><span className="section-label">01 / THE FAITH</span><h2>CONVICTION<br />OVER COMFORT.</h2></div>
        <div><p>Fellough is Christian streetwear with a sense of humor. We believe the Gospel is worth taking seriously, and that doesn’t mean every shirt, caption, or conversation has to sound like a press release.</p><p>We can laugh, make a point, and enjoy good design without treating our faith like something to hide. The goal isn’t to be edgy for its own sake. It’s to be clear about what we believe and have a little fun along the way.</p><p>“And whatsoever ye do in word or deed, do all in the name of the Lord Jesus.” — Colossians 3:17 (KJV)</p></div>
      </div>
      <div className="about-rule" />
      <div className="about-columns">
        <div><span className="section-label">02 / THE STANDARD</span><h2>MADE IN<br />AMERICA.</h2></div>
        <div><p>Our sourcing standard is that every Fellough product must be entirely manufactured in the United States. We won’t use vague labels to make an imported product sound domestic.</p><p>Before a product is represented as Made in USA, its manufacturing origin and supporting supplier documentation must be checked against the applicable Federal Trade Commission standard. We don’t invent sourcing claims, material origins, or factory stories.</p></div>
      </div>
      <div className="about-rule" />
      <div className="about-columns">
        <div><span className="section-label">03 / THE HUMOR</span><h2>DON’T TAKE<br />THE BRAND TOO<br /><i>SERIOUSLY.</i></h2></div>
        <div><p>Take Christ seriously. Take the work seriously. Don’t take yourself so seriously that you forget how to laugh.</p><p>Our humor is meant to come from a Christian perspective, never from mocking God, Jesus Christ, Scripture, or the faith itself.</p></div>
      </div>
    </section>
  );
}