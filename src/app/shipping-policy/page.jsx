import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <Header />

      {/* Breadcrumb */}
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
              Shipping Policy
            </span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">

        {/* Page Header */}
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
            Shipping
            <span className="text-primary"> Policy</span>
          </h1>
        </div>

        {/* Policy Content */}
        <article className="space-y-10 font-oxanium text-sm leading-8 text-text-secondary sm:text-[15px]">

          {/* Introduction */}
          <section>
            <p>
              Thank you for choosing Cost2Cost Supplement. We are committed to
              delivering premium, authentic US-based supplement brands
              straight to your door as quickly and securely as possible.
            </p>

            <p className="mt-5">
              The following terms and conditions constitute our Shipping Policy.
            </p>
          </section>

          {/* Order Processing Time */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Order Processing Time
            </h2>

            <ul className="space-y-3 pl-5">
              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                All orders are processed within 1 to 3 business days.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Orders are not shipped or delivered on weekends or holidays.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                If we are experiencing a high volume of orders, shipments may
                be delayed by a few days. Please allow additional days in
                transit for delivery. If there will be a significant delay in
                the shipment of your order, we will contact you via email or
                telephone.
              </li>
            </ul>
          </section>

          {/* Shipping Rates */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Shipping Rates & Delivery Estimates
            </h2>

            <p>
              We pride ourselves on fast fulfillment so you can get your
              supplements without the wait.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Standard Shipping Time:
                </h3>

                <p>2 to 5 business days</p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Shipping Costs:
                </h3>

                <p>
                  Shipping charges for your order will be calculated and
                  displayed at checkout. (Free standard shipping on all orders
                  over Evaluate local currency rate)
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-oxanium font-bold text-text-primary">
                  Note:
                </h3>

                <p>
                  Delivery delays can occasionally occur due to weather
                  conditions, carrier issues, or peak holiday seasons.
                </p>
              </div>
            </div>
          </section>

          {/* Shipment Confirmation */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Shipment Confirmation & Order Tracking
            </h2>

            <p>
              You will receive a Shipment Confirmation email once your order
              has shipped containing your tracking number(s). The tracking
              number will be active within 24 hours. You can use this number to
              monitor your package&apos;s progress until it arrives.
            </p>
          </section>

          {/* US-Based Brands */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              US-Based Brands & Quality Assurance
            </h2>

            <p>
              We source directly from top US-based supplement brands. All
              products are stored in temperature-controlled environments to
              ensure maximum efficacy and freshness before they are packed and
              shipped to you.
            </p>
          </section>

          {/* Damages */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Damages & Lost Packages
            </h2>

            <p>
              Cost2Cost Supplement is not liable for any products damaged or
              lost during shipping. However, we want you to have a great
              experience.
            </p>

            <p className="mt-5">
              If you received your order damaged, please contact the shipment
              carrier or our support team directly to file a claim.
            </p>

            <p className="mt-5">
              Please save all packaging materials and damaged goods before
              filing a claim.
            </p>

            <p className="mt-5">
              For assistance, please contact us at{" "}
              <a
                href="mailto:info@cost2costsupplement.com"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                info@cost2costsupplement.com
              </a>
              .
            </p>
          </section>

          {/* Incorrect Address */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Incorrect Shipping Addresses
            </h2>

            <p>
              Customers are responsible for ensuring that the shipping address
              entered at checkout is accurate. Cost2Cost Supplement cannot be
              held responsible for packages shipped to an incorrect address
              provided by the buyer.
            </p>

            <p className="mt-5">
              If a package is returned to us due to an incorrect address, the
              customer will be responsible for any additional shipping fees to
              resend the order.
            </p>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              International Shipping
            </h2>

            <p>
              We offer international shipping. Please note that standard
              shipping times (2-5 days) apply only to domestic orders.
            </p>

            <p className="mt-5">
              International shipments may take between 7-21 business days.
            </p>

            <p className="mt-5">
              Your order may be subject to import duties and taxes (including
              VAT), which are incurred once a shipment reaches your destination
              country. Cost2Cost Supplement is not responsible for these
              charges if they are applied.
            </p>
          </section>

          {/* Questions */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Questions About Your Shipment?
            </h2>

            <p>
              If you have any questions or concerns regarding your order&apos;s
              shipping status, please do not hesitate to contact our customer
              support team:{" "}
              <a
                href="mailto:info@cost2costsupplement.com"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                info@cost2costsupplement.com
              </a>
            </p>
          </section>

          {/* How to Initiate a Return */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              How to Initiate a Return
            </h2>

            <p>
              To start a return, please follow these steps:
            </p>

            <ol className="mt-5 space-y-5">

              <li className="flex gap-4">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    font-oxanium
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  1
                </span>

                <div>
                  <strong className="text-text-primary">
                    Contact Us:
                  </strong>{" "}
                  Email our support team at{" "}
                  <a
                    href="mailto:info@cost2costsupplement.com"
                    className="font-semibold text-primary transition-colors hover:text-primary-hover"
                  >
                    info@cost2costsupplement.com
                  </a>{" "}
                  with your Order Number and the reason for the return.
                </div>
              </li>

              <li className="flex gap-4">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    font-oxanium
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  2
                </span>

                <div>
                  <strong className="text-text-primary">
                    Approval:
                  </strong>{" "}
                  If your return is approved, we will provide you with a Return
                  Merchandise Authorization (RMA) number and instructions on
                  where to send your package.
                </div>
              </li>

              <li className="flex gap-4">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    font-oxanium
                    text-xs
                    font-bold
                    text-white
                  "
                >
                  3
                </span>

                <div>
                  <strong className="text-text-primary">
                    Pack and Ship:
                  </strong>{" "}
                  Securely pack the unopened items. Please clearly write the
                  RMA number on the outside of the package.
                </div>
              </li>

            </ol>

            {/* Important Note */}
            <div
              className="
                mt-7
                rounded-xl
                border
                border-border
                bg-card
                p-6
                shadow-[0_5px_20px_rgba(0,0,0,0.03)]
              "
            >
              <p>
                <strong className="text-text-primary">
                  Important Note:
                </strong>{" "}
                You are responsible for paying your own shipping costs for
                returning your item (unless the return is due to our error).
                Shipping costs are non-refundable. We highly recommend using a
                trackable shipping service or purchasing shipping insurance, as
                we cannot guarantee that we will receive your returned item.
              </p>
            </div>
          </section>

          {/* Refunds */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Refunds
            </h2>

            <ul className="space-y-4 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Once we receive your returned item, our team will inspect it to
                ensure it meets our return criteria (unopened and sealed).
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                We will immediately notify you of the status of your refund
                after inspecting the item.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                If your return is approved, we will initiate a refund to your
                credit card (or original method of payment).
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                You will receive the credit within 5 to 10 business days,
                depending on your card issuer&apos;s policies.
              </li>

            </ul>

            <p className="mt-6">
              <strong className="text-text-primary">
                Please note:
              </strong>{" "}
              Original shipping fees are non-refundable and will be deducted
              from your total refund amount.
            </p>
          </section>

          {/* Need Help */}
          <section
            className="
              rounded-xl
              border
              border-border
              bg-card
              p-6
              shadow-[0_6px_25px_rgba(0,0,0,0.04)]
              sm:p-8
            "
          >
            <h2 className="mb-3 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Need Help?
            </h2>

            <p>
              If you have any questions about how to return your item to us,
              please contact our customer support team:
            </p>

            <p className="mt-4">
              <strong className="text-text-primary">
                Email:
              </strong>{" "}
              <a
                href="mailto:info@cost2costsupplement.com"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                info@cost2costsupplement.com
              </a>
            </p>
          </section>

        </article>
      </section>

      <Footer />
    </main>
  );
}