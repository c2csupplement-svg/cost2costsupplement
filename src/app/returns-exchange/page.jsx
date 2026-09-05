
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ReturnExchangePolicy() {
  return (
    <main className="min-h-screen bg-background text-text-primary">

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
              Return & Exchange Policy
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
            Return & Exchange
            <span className="text-primary"> Policy</span>
          </h1>
        </div>

        {/* Policy Content */}
        <article className="space-y-10 font-oxanium text-sm leading-8 text-text-secondary sm:text-[15px]">

          {/* Introduction */}
          <section>
            <p>
              At Cost2Cost Supplement, we are committed to providing you with
              premium, US-based supplements. If you are not entirely satisfied
              with your purchase, we’re here to help.
            </p>

            <p className="mt-5">
              Please read our policy carefully to understand your options for
              returns, exchanges, and refunds.
            </p>
          </section>

          {/* Return Window */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Return Window
            </h2>

            <p>
              You have 7 days to return an item from the date you received it.
              If 7 days have gone by since your delivery, unfortunately, we
              cannot offer you a refund or exchange.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Eligibility for Returns
            </h2>

            <p>
              Due to the nature of dietary supplements and health and safety
              regulations, we have strict guidelines for returned products:
            </p>

            <ul className="mt-5 space-y-4 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Unopened and Sealed:
                </strong>{" "}
                Your item must be unused, unopened, and in the exact same
                condition that you received it. The original safety seal must
                be intact.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Original Packaging:
                </strong>{" "}
                The item must be in its original packaging.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Proof of Purchase:
                </strong>{" "}
                Your item needs to have the receipt or proof of purchase
                (order number or confirmation email).
              </li>

            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Non-Returnable Items
            </h2>

            <p>
              For health and safety reasons, the following items cannot be
              returned or exchanged:
            </p>

            <ul className="mt-5 space-y-3 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Products that have been opened, unsealed, or used.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Items marked as "Final Sale" or "Clearance."
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Gift cards.
              </li>

            </ul>
          </section>

          {/* Defective / Damaged */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Defective, Damaged, or Incorrect Items
            </h2>

            <p>
              If you received a defective, damaged, or incorrect item (e.g.,
              wrong brand, wrong flavor), please contact us within 3 days of
              delivery.
            </p>

            <p className="mt-5">
              We will gladly replace the item or provide a full refund at no
              additional cost to you.
            </p>

            <p className="mt-5">
              Please email us at{" "}
              <a
                href="mailto:info@cost2costsupplement.com"
                className="font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                info@cost2costsupplement.com
              </a>{" "}
              with your order number and photos of the damaged or incorrect
              product so we can resolve the issue immediately.
            </p>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Exchanges
            </h2>

            <p>
              We only replace items if they are defective, damaged, or if you
              received the wrong product.
            </p>

            <p className="mt-5">
              If you accidentally ordered the wrong item and wish to exchange
              it for a different product, you must return the unopened,
              original item (following the return process below) and place a
              new order for the desired item.
            </p>
          </section>

          {/* How to Initiate */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              How to Initiate a Return
            </h2>

            <p>
              To start a return, please follow these steps:
            </p>

            <ol className="mt-5 space-y-5">

              {/* Step 1 */}
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

              {/* Step 2 */}
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
                  If your return is approved, we will provide you with a
                  Return Merchandise Authorization (RMA) number and
                  instructions on where to send your package.
                </div>
              </li>

              {/* Step 3 */}
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
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
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
              please contact our customer support team.
            </p>
          </section>

        </article>
      </section>

    </main>
  );
}