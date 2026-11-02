import Image from "next/image";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="thankyou-page">
      <div className="thankyou-decoration thankyou-decoration-one" />
      <div className="thankyou-decoration thankyou-decoration-two" />

      <header className="thankyou-header">
        <Link href="/" className="thankyou-logo">
          <Image
            src="/images/logo1.png"
            alt="Tara Living"
            width={180}
            height={90}
            priority
            className="thankyou-logo-image"
          />
        </Link>
      </header>

      <section className="thankyou-content">
        <div className="thankyou-success">
          <div className="thankyou-success-circle">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <path d="M14 27 L22 35 L39 17" />
            </svg>
          </div>
        </div>

        <span className="thankyou-eyebrow">
          THANK YOU FOR CHOOSING TARA LIVING
        </span>

        <h1 className="thankyou-heading">
          Thank you for
          <br />
          <span>getting in touch.</span>
        </h1>

        <div className="thankyou-divider">
          <span />
          <span>✦</span>
          <span />
        </div>

        <p className="thankyou-description">
          Your inquiry has been successfully received.
          We truly appreciate your interest in Tara Living.
          Our team will connect with you shortly to understand
          your vision and help create a space that feels like home.
        </p>

        <div className="thankyou-confirmation">
          <span className="thankyou-confirmation-check">✓</span>
          <span>Your inquiry has been submitted successfully</span>
        </div>

        <div className="thankyou-actions">
          <Link href="/" className="thankyou-button">
            <span>Back to Home</span>
            <span className="thankyou-button-arrow">→</span>
          </Link>

          <Link href="/projects" className="thankyou-project-link">
            Explore Our Projects <span>↗</span>
          </Link>
        </div>
      </section>

      <footer className="thankyou-footer">
        Thoughtfully designed. Beautifully lived.
      </footer>
    </main>
  );
}