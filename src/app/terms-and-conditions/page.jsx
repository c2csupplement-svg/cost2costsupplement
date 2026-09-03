import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Header />

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 font-oxanium text-xs uppercase tracking-[0.14em]">
            <Link
              href="/"
              className="text-primary transition-colors hover:text-primary-hover"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />

            <span className="text-text-muted">
              Terms and Conditions
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-10 border-b border-border pb-10">

          <p className="mb-3 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Cost2Cost Supplement
          </p>

          <h1
            className="
              font-bebas
              text-5xl
              uppercase
              leading-none
              tracking-wide
              text-text-primary
              sm:text-6xl
              lg:text-7xl
            "
          >
            Terms and
            <span className="text-primary"> Conditions</span>
          </h1>

          <p className="mt-5 font-oxanium text-sm text-text-muted">
            Last Updated: 27-04-2026
          </p>
        </div>

        {/* =================================================
            TERMS CONTENT
        ================================================= */}

        <article className="space-y-10 font-oxanium text-sm leading-8 text-text-secondary sm:text-[15px]">

          {/* Introduction */}
          <section>
            <p>
              Welcome to Cost2Cost Supplement. These Terms and Conditions
              govern your use of the website www.cost2costsupplement.com and
              your purchases from our online platform.
            </p>

            <p className="mt-5">
              By accessing our website or purchasing our products, you agree to
              be bound by these terms. If you do not agree with any part of
              these terms, please do not use our services.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              1. Health and Medical Disclaimer
            </h2>

            <p>
              The products and information provided on this website are for
              general informational purposes only.
            </p>

            <div className="mt-6 space-y-5">

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Not Medical Advice:
                </h3>

                <p>
                  None of the content, product descriptions, or advice provided
                  by our staff or website is intended to diagnose, treat, cure,
                  or prevent any disease or medical condition.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Consult a Professional:
                </h3>

                <p>
                  Always consult with a qualified healthcare provider or sports
                  nutritionist before starting any new diet, exercise program,
                  or dietary supplement, especially if you have existing health
                  conditions, are pregnant, or are taking medication.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Results Vary:
                </h3>

                <p>
                  Individual results from using sports nutrition products will
                  vary based on diet, training regimen, genetics, and overall
                  health.
                </p>
              </div>

            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              2. Authenticity and Product Guarantees
            </h2>

            <p>
              We operate under a strict anti-counterfeit policy i.e., FSSAI,
              FDA & manufactured under GMP verified facilities to protect your
              health.
            </p>

            <p className="mt-5">
              All products sold by Cost2Cost Supplement are sourced directly
              from authorized brand importers and manufacturers.
            </p>

            <p className="mt-5">
              Our importers and manufacturers guarantee the authenticity of
              every tub and bottle.
            </p>

            <p className="mt-5">
              Customers are encouraged to verify the official importer
              scratch-codes/batch number present on their products.
            </p>

            <p className="mt-5">
              Product representations on the website (including images and
              nutritional panels) are updated regularly. However,
              manufacturers occasionally change their packaging or formulas.
              The physical label on the product you receive dictates the exact
              nutritional facts and usage instructions.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              3. User Eligibility and Accounts
            </h2>

            <p>
              You must be at least 21 years old to create an account or make a
              purchase on this website.
            </p>

            <p className="mt-5">
              You and Cost2Cost Supplement are responsible for maintaining the
              confidentiality of your account login information and for all
              activities that occur under your account.
            </p>

            <p className="mt-5">
              We reserve the right to terminate accounts, refuse service, or
              cancel orders if we suspect fraudulent activity or a violation of
              these terms.
            </p>

            <p className="mt-5">
              Every user have right to ask for deletion of his/her account.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              4. Pricing, Payments, and Billing
            </h2>

            <div className="space-y-5">

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Currency:
                </h3>

                <p>
                  All prices listed on the website are in Indian Rupees (INR)
                  and are excluded of applicable taxes (GST) unless stated
                  otherwise.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Price Changes:
                </h3>

                <p>
                  Prices and availability of products are subject to change
                  without notice. We make every effort to ensure accurate
                  pricing, but typographical errors may occur. In the event a
                  product is listed at an incorrect price, we reserve the right
                  to cancel any orders placed for that product.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Payment Processing:
                </h3>

                <p>
                  We use secure, authorized third-party payment gateways. We do
                  not store your raw credit card or banking information on our
                  servers.
                </p>
              </div>

            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              5. Shipping and Delivery
            </h2>

            <p>
              We ship to valid addresses across India. Delivery timelines
              provided at checkout are estimates. External factors (such as
              weather conditions or courier delays) may impact delivery times.
            </p>

            <p className="mt-5">
              Risk of loss and title for items purchased pass to you upon our
              delivery of the items to the shipping carrier.
            </p>

            <p className="mt-5">
              Inspect your package upon delivery. If the external shipping box
              is severely damaged or tampered with, refuse the delivery and
              contact our support team immediately.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              6. Returns, Refunds, and Cancellations
            </h2>

            <p>
              Because dietary supplements are consumable goods, we operate
              under strict hygiene and safety protocols.
            </p>

            <div className="mt-6 space-y-5">

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Sealed Products Only:
                </h3>

                <p>
                  We only accept returns or exchanges for products that are
                  completely unopened, with all original manufacturer seals
                  (both internal and external) fully intact.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Timeframe:
                </h3>

                <p>
                  You must initiate a return request within “Support:-
                  91-9178789063” 72 hours of receiving your order.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Opened Products:
                </h3>

                <p>
                  We do not accept returns or issue refunds for opened or
                  partially used products under any circumstances, including
                  dissatisfaction with taste, mixability, or perceived lack of
                  results.
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Order Cancellations:
                </h3>

                <p>
                  You may cancel an order before it has been dispatched from
                  our warehouse. Once the order is in transit, it cannot be
                  canceled.
                </p>
              </div>

            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              7. Intellectual Property
            </h2>

            <p>
              All content on this website, including text, graphics, logos,
              product descriptions, original photography taken at our
              operating offices in India and Global official distributor
              website, is the property of Cost2Cost Supplement and is protected
              by Indian copyright laws. You may not copy, reproduce, or
              distribute our content without written permission.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              8. Limitation of Liability
            </h2>

            <p>
              To the maximum extent permitted by Indian law, Cost2Cost
              Supplement, its owners, and employees shall not be liable for any
              direct, indirect, incidental, or consequential damages resulting
              from your use of the website or the products purchased. This
              includes, but is not limited to, damages for personal injury or
              health complications resulting from the misuse of supplements.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              9. Governing Law and Jurisdiction
            </h2>

            <p>
              These Terms and Conditions are governed by the laws of India. Any
              disputes arising from the use of this website or the purchase of
              products shall be subject to the exclusive jurisdiction of the
              courts located in Delhi, India.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              10. Contact Information
            </h2>

            <p>
              If you have questions about these Terms, need help with an order,
              or want to verify a product in person, please contact us:
            </p>

            {/* Contact Card */}
            <div
              className="
                mt-6
                rounded-xl
                border
                border-border
                bg-card
                p-6
                shadow-[0_6px_25px_rgba(0,0,0,0.04)]
                sm:p-8
              "
            >
              <p className="font-oxanium font-bold text-text-primary">
                Cost2Cost Supplement
              </p>

              <p className="mt-4">
                Email:{" "}
                <a
                  href="mailto:info@cost2costsupplement.com"
                  className="text-primary transition-colors hover:text-primary-hover"
                >
                  info@cost2costsupplement.com
                </a>
              </p>

              <p className="mt-3">
                Operating Hours: 9:00 AM to 7:00 PM (IST) Monday to Saturday
              </p>
            </div>
          </section>

        </article>
      </section>

      <Footer />
    </main>
  );
}