import FAQPage from "@/components/faq/FAQPage";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function WhyCost2CostPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">


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
              Why Cost2Cost Supplements
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-12 border-b border-border pb-10">

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
            Why Cost2Cost
            <span className="text-primary"> Supplements</span>
          </h1>

          <p className="mt-6 max-w-4xl font-oxanium text-sm leading-8 text-text-secondary sm:text-base">
            In traditional supplement distribution, prices increase at every
            step, manufacturer margin, distributor margin, marketing spend,
            influencer commissions, and retail markup. By the time a product
            reaches the consumer, the price often reflects branding costs more
            than product quality.
          </p>

          <p className="mt-5 font-oxanium text-sm leading-8 text-text-secondary sm:text-base">
            C2C removes unnecessary layers and focuses on{" "}
            <strong className="font-bold text-text-primary">
              cost efficiency with accountability.
            </strong>
          </p>
        </div>

        {/* =================================================
            KEY REASONS
        ================================================= */}

        <div>

          <h2
            className="
              mb-8
              font-bebas
              text-4xl
              uppercase
              tracking-wide
              text-text-primary
              sm:text-5xl
            "
          >
            Key Reasons to Choose Cost2Cost
          </h2>

          <div className="space-y-5">

            {/* 1 */}
            <ReasonCard
              number="1"
              title="Cost Transparency"
            >
              <p>
                We aim to price products as close to their real value as
                possible. You are not paying for hype, inflated influencer
                fees, or artificial “premium positioning.”
              </p>
            </ReasonCard>

            {/* 2 */}
            <ReasonCard
              number="2"
              title="Marketplace Neutrality"
            >
              <p>
                Because we are not tied to one brand, we don’t push what
                benefits us most. Products are listed based on quality, not
                commission size.
              </p>
            </ReasonCard>

            {/* 3 */}
            <ReasonCard
              number="3"
              title="Clear Refund Logic"
            >
              <p>
                Refunds are issued only as C2C Wallet Credit, clearly stated
                upfront. This allows faster processing, no gateway delays, and
                ensures customers can reuse their value without loss.
              </p>
            </ReasonCard>

            {/* 4 */}
            <ReasonCard
              number="4"
              title="Strict Claim Control"
            >
              <p>
                We actively avoid listing products that promise unrealistic fat
                loss, muscle gain, or medical cures. Supplements should support
                effort, not replace it.
              </p>
            </ReasonCard>

            {/* 5 */}
            <ReasonCard
              number="5"
              title="Customer-Focused Resolution"
            >
              <p>
                If there is a genuine quality issue, damage, or health-related
                concern, we review cases fairly and resolve them quickly
                instead of hiding behind rigid rules.
              </p>
            </ReasonCard>

          </div>
        </div>
      </section>
      <FAQPage/>

    </main>
  );
}


/* =====================================================
   REASON CARD
===================================================== */

function ReasonCard({ number, title, children }) {
  return (
    <article
      className="
        group
        rounded-xl
        border
        border-border
        bg-card
        p-6
        shadow-[0_5px_20px_rgba(0,0,0,0.03)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-primary/40
        hover:shadow-[0_12px_30px_rgba(229,35,35,0.07)]
        sm:p-7
      "
    >
      <div className="flex gap-5">

        {/* Number */}
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-primary
            font-oxanium
            text-sm
            font-black
            text-white
            shadow-[0_5px_15px_rgba(229,35,35,0.18)]
          "
        >
          {number}
        </div>

        {/* Content */}
        <div className="min-w-0">

          <h3
            className="
              font-oxanium
              text-lg
              font-bold
              text-text-primary
              sm:text-xl
            "
          >
            {title}
          </h3>

          <div
            className="
              mt-3
              font-oxanium
              text-sm
              leading-7
              text-text-secondary
              sm:text-[15px]
            "
          >
            {children}
          </div>

        </div>
      </div>
    </article>
  );
}