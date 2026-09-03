import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function AboutPage() {
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
              className="
                text-primary
                transition-colors
                hover:text-primary-hover
              "
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />

            <span className="text-text-muted">
              About Us
            </span>

          </div>
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="max-w-4xl">

          <p className="mb-4 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Cost2Cost Supplement
          </p>

          <h1
            className="
              font-bebas
              text-5xl
              uppercase
              leading-[0.95]
              tracking-wide
              text-text-primary
              sm:text-6xl
              lg:text-8xl
            "
          >
            Authentic Sports Nutrition.
            <br />

            <span className="text-primary">
              Trusted Global Brands.
            </span>

            <br />

            Delivered.
          </h1>

          <p
            className="
              mt-7
              max-w-3xl
              font-oxanium
              text-sm
              leading-7
              text-text-secondary
              sm:text-base
            "
          >
            At{" "}
            <strong className="text-text-primary">
              Cost2Cost Supplement
            </strong>
            , we operate as a{" "}
            <strong className="text-text-primary">
              specialized online retailer and importer of sports nutrition and
              dietary supplements in India
            </strong>
            , similar to leading e-commerce marketplaces.
          </p>

          <p
            className="
              mt-5
              max-w-3xl
              font-oxanium
              text-sm
              leading-7
              text-text-secondary
              sm:text-base
            "
          >
            We do{" "}
            <strong className="text-text-primary">
              not manufacture, formulate, or alter any products
            </strong>
            . Our role is to connect customers with{" "}
            <strong className="text-text-primary">
              original, third-party branded supplements
            </strong>{" "}
            sourced through verified and authorized distribution channels.
          </p>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">

          <div className="space-y-12">

            {/* =================================================
                WHO WE ARE
            ================================================= */}

            <ContentSection title="Who We Are">

              <p>
                We are a curated online platform focused on making genuine
                sports nutrition products easily accessible in India.
              </p>

              <BulletList
                items={[
                  <>
                    Sourcing products from{" "}
                    <strong className="text-text-primary">
                      authorized distributors and official import channels
                    </strong>
                  </>,

                  <>
                    Offering a curated selection of globally recognized
                    supplement brands
                  </>,

                  <>
                    Ensuring products are delivered in{" "}
                    <strong className="text-text-primary">
                      original, factory-sealed condition
                    </strong>
                  </>,

                  <>
                    Providing customers with a{" "}
                    <strong className="text-text-primary">
                      safe and convenient shopping experience
                    </strong>
                  </>,
                ]}
              />

            </ContentSection>

            {/* =================================================
                WHAT WE SELL
            ================================================= */}

            <ContentSection title="What We Sell">

              <p>
                All products available on our platform are:
              </p>

              <BulletList
                items={[
                  "Manufactured by independent, third-party brands",
                  "Not owned, created, or formulated by Cost2Cost Supplement",
                  "Selected based on brand reputation, authenticity, and quality standards",
                ]}
              />

              <p className="mt-6">
                We function purely as a{" "}
                <strong className="text-text-primary">
                  retailer and distributor platform
                </strong>
                , not a product manufacturer.
              </p>

            </ContentSection>

            {/* =================================================
                AUTHENTICITY
            ================================================= */}

            <ContentSection title="Authenticity & Sourcing Standards">

              <p>
                We follow strict sourcing and verification practices to help
                ensure product authenticity:
              </p>

              <BulletList
                items={[
                  <>
                    Products are purchased only from{" "}
                    <strong className="text-text-primary">
                      authorized distributors and verified importers
                    </strong>
                  </>,

                  "Items are shipped in original manufacturer packaging",

                  "Brand-provided batch codes, seals, and authentication features remain intact",

                  "No repackaging, relabeling, or modification is performed",
                ]}
              />

              <p className="mt-6">
                Customers are encouraged to verify product authenticity using
                official brand verification systems whenever available.
              </p>

            </ContentSection>

            {/* =================================================
                MISSION
            ================================================= */}

            <ContentSection title="Our Mission">

              <p>
                Our mission is to simplify and improve the way people in India
                access sports nutrition by offering:
              </p>

              <BulletList
                items={[
                  "A trusted platform for genuine global supplement brands",
                  "Transparent and reliable product sourcing",
                  "A convenient online shopping experience",
                ]}
              />

              <p className="mt-6">
                We aim to reduce uncertainty in online supplement purchasing by
                focusing on authenticity and verified supply chains.
              </p>

            </ContentSection>

            {/* =================================================
                IMPORTANT CLARIFICATION
            ================================================= */}

            <section
              className="
                rounded-xl
                border
                border-primary/30
                bg-primary/[0.035]
                p-6
                sm:p-8
              "
            >
              <h2
                className="
                  font-bebas
                  text-3xl
                  uppercase
                  tracking-wide
                  text-text-primary
                  sm:text-4xl
                "
              >
                Important Clarification
              </h2>

              <p className="mt-4">
                To maintain complete transparency:
              </p>

              <BulletList
                items={[
                  <>
                    Cost2Cost Supplement does{" "}
                    <strong className="text-text-primary">
                      not manufacture or design supplements
                    </strong>
                  </>,

                  <>
                    We do{" "}
                    <strong className="text-text-primary">
                      not modify product formulations or ingredients
                    </strong>
                  </>,

                  <>
                    We do{" "}
                    <strong className="text-text-primary">
                      not make medical or performance guarantees for any product
                    </strong>
                  </>,
                ]}
              />

              <p className="mt-6">
                All product information, claims, and usage guidelines belong
                solely to the respective manufacturers and brands.
              </p>
            </section>

            {/* =================================================
                COMMITMENT
            ================================================= */}

            <ContentSection title="Our Commitment">

              <p>
                We are committed to building trust through:
              </p>

              <BulletList
                items={[
                  "Authentic sourcing",
                  "Reliable delivery",
                  "Transparent retail practices",
                  "Customer-first service",
                ]}
              />

            </ContentSection>

            {/* =================================================
                CLOSING
            ================================================= */}

            <section className="border-t border-border pt-12">

              <h2
                className="
                  font-bebas
                  text-3xl
                  uppercase
                  tracking-wide
                  text-text-primary
                  sm:text-4xl
                "
              >
                Closing Statement
              </h2>

              <p
                className="
                  mt-5
                  font-oxanium
                  text-sm
                  leading-8
                  text-text-secondary
                  sm:text-base
                "
              >
                Cost2Cost Supplement exists to bring trusted global sports
                nutrition brands to your doorstep through a safe, verified,
                and convenient online platform — helping you focus on your
                fitness journey with confidence in what you consume.
              </p>

            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


/* =====================================================
   REUSABLE CONTENT SECTION
===================================================== */

function ContentSection({ title, children }) {
  return (
    <section>

      <h2
        className="
          font-bebas
          text-3xl
          uppercase
          tracking-wide
          text-text-primary
          sm:text-4xl
        "
      >
        {title}
      </h2>

      <div
        className="
          mt-4
          font-oxanium
          text-sm
          leading-8
          text-text-secondary
          sm:text-[15px]
        "
      >
        {children}
      </div>

    </section>
  );
}


/* =====================================================
   REUSABLE BULLET LIST
===================================================== */

function BulletList({ items }) {
  return (
    <ul className="mt-5 space-y-3 pl-5">

      {items.map((item, index) => (
        <li
          key={index}
          className="
            relative
            pl-3
            font-oxanium
            text-text-secondary
          "
        >
          <span
            className="
              absolute
              left-[-12px]
              top-[13px]
              h-1.5
              w-1.5
              rounded-full
              bg-primary
            "
          />

          {item}
        </li>
      ))}

    </ul>
  );
}