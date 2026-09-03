import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Disclaimer() {
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
              Disclaimer
            </span>
          </div>
        </div>
      </div>

      {/* Page */}
      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">

        {/* Header */}
        <div className="mb-10 border-b border-border pb-10">
          <p className="mb-3 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            C2C Supplement
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
            General
            <span className="text-primary"> Disclaimer</span>
          </h1>

          <p className="mt-6 max-w-3xl font-oxanium text-sm leading-7 text-text-secondary sm:text-base">
            Please read the following disclaimer carefully before using our
            website or purchasing our products.
          </p>
        </div>

        {/* Content */}
        <article className="space-y-10 font-oxanium text-sm leading-8 text-text-secondary sm:text-[15px]">

          {/* General Disclaimer */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              General Disclaimer
            </h2>

            <p>
              The information provided by Cost2Cost Supplement is for general
              informational and educational purposes only. All information on
              the site is provided in good faith, however, we make no
              representation or warranty of any kind, express or implied,
              regarding the accuracy, adequacy, validity, reliability,
              availability, or completeness of any information on the site.
            </p>

            <p className="mt-5">
              By using our website and purchasing our products, you acknowledge
              and agree to the following disclaimers:
            </p>
          </section>

          {/* Health and Medical Disclaimer */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Health and Medical Disclaimer
            </h2>

            <p>
              The content on the Cost2Cost website including text, graphics,
              images, blog posts, and product descriptions is not intended to
              be a substitute for professional medical advice, diagnosis, or
              treatment.
            </p>

            <ul className="mt-5 space-y-3 pl-5">
              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Always seek the advice of your physician
                </strong>{" "}
                or other qualified health provider with any questions you may
                have regarding a medical condition.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                Never disregard professional medical advice or delay in
                seeking it because of something you have read on this website.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                If you are pregnant, nursing, taking medication, or have a
                pre-existing medical condition, consult your healthcare
                professional before using any dietary supplements.
              </li>
            </ul>

            <p className="mt-6 font-semibold text-text-primary">
              The products sold on Cost2Cost are not intended to diagnose,
              treat, cure, or prevent any disease.
            </p>
          </section>

          {/* Individual Results */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Individual Results Disclaimer
            </h2>

            <p>
              Testimonials, product reviews, and blog articles found on
              Cost2Cost Supplement represent the individual experiences of
              specific consumers or writers. Because every person&apos;s
              physical biology, exercise routine, and diet are unique,
              individual results will vary.
            </p>

            <p className="mt-5">
              We do not guarantee that you will achieve the exact same results
              as described in our product listings, marketing materials, or
              customer reviews. Supplementation is most effective when combined
              with a proper diet and regular exercise program.
            </p>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Product Information and Accuracy
            </h2>

            <p>
              While we work to ensure that product information on our website
              is correct, manufacturers may occasionally alter their ingredient
              lists or packaging. Actual product packaging and materials may
              contain more and/or different information than that shown on our
              website.
            </p>

            <p className="mt-5">
              We recommend that you do not solely rely on the information
              presented on Cost2Cost Supplement and that you always read the
              physical labels, warnings, and directions provided with the
              product before using or consuming it.
            </p>
          </section>

          {/* Third Party Links */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Third-Party Links Disclaimer
            </h2>

            <p>
              Our website may contain links to external websites that are not
              provided or maintained by or in any way affiliated with Cost2Cost
              Supplement. Please note that we do not guarantee the accuracy,
              relevance, timeliness, or completeness of any information on
              these external websites.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-4 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              Limitation of Liability
            </h2>

            <p>
              Under no circumstance shall Cost2Cost Supplement, its directors,
              employees, or partners be liable to you for any loss or damage of
              any kind incurred as a result of the use of the site or reliance
              on any information provided on the site. Your use of the site and
              your reliance on any information on the site is solely at your
              own risk.
            </p>
          </section>

          {/* Contact */}
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
              Contact Us
            </h2>

            <p>
              If you have any questions regarding this disclaimer, please
              contact us:
            </p>

            <a
              href="mailto:info@cost2costsupplement.com"
              className="
                mt-3
                inline-block
                font-oxanium
                font-semibold
                text-primary
                transition-colors
                hover:text-primary-hover
              "
            >
              info@cost2costsupplement.com
            </a>
          </section>

        </article>
      </section>

      <Footer />
    </main>
  );
}