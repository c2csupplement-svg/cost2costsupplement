import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicy() {
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
              Privacy Policy
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
            Privacy
            <span className="text-primary"> Policy</span>
          </h1>
        </div>

        {/* Policy Content */}
        <article className="space-y-10 font-oxanium text-sm leading-8 text-text-secondary sm:text-[15px]">

          {/* Introduction */}
          <section>
            <p>
              Welcome to Cost2Cost supplement, We value your privacy and are
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              data when you visit our website{" "}
              <a
                href="https://www.cost2costsupplement.com/"
                className="text-primary transition-colors hover:text-primary-hover"
              >
                https://www.cost2costsupplement.com/
              </a>{" "}
              and use our services.
            </p>

            <p className="mt-5">
              By accessing or using the Cost2Cost Supplement website, you agree
              to the practices described in this policy. If you do not agree
              with this policy, please do not use our site.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              1. Information We Collect
            </h2>

            <p>
              We collect information that you voluntarily provide to us, as
              well as data collected automatically when you navigate our site.
            </p>

            <ul className="mt-5 space-y-4 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Personal Information:
                </strong>{" "}
                When you register for an account, place an order, or contact
                us, we may collect identifiable information such as your name,
                email address, phone number, shipping/billing address, and
                payment details.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Automatically Collected Information:
                </strong>{" "}
                When you visit our site, our servers automatically record
                information such as your IP address, browser type, operating
                system, referring URLs, and your browsing behavior on our site.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Cookies and Tracking Technologies:
                </strong>{" "}
                We use cookies, web beacons, and similar tracking technologies
                to enhance your browsing experience, analyze site traffic, and
                personalize content.
              </li>

            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              2. How We Use Your Information
            </h2>

            <p>
              Cost2Cost Supplement uses the collected data for various
              operational and business purposes, including:
            </p>

            <ul className="mt-5 space-y-3 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Processing and fulfilling your orders, returns, and exchanges.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Creating and managing your customer account.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Communicating with you regarding order updates, customer
                support, and administrative notices.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Sending promotional emails, newsletters, and marketing
                materials (you can opt out at any time).
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Analyzing website usage to improve our website layout, product
                offerings, and customer service.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />
                Preventing fraudulent transactions and ensuring the security of
                our platform.
              </li>

            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              3. How We Share Your Information
            </h2>

            <p>
              We do not sell, rent, or trade your personal information to third
              parties. We may share your information only in the following
              circumstances:
            </p>

            <ul className="mt-5 space-y-4 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Service Providers:
                </strong>{" "}
                We share data with trusted third-party vendors who assist us in
                operating our website, processing payments (e.g., Stripe,
                PayPal), and delivering packages (e.g., FedEx, UPS, DTDC).
                These partners are bound by confidentiality agreements.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Legal Obligations:
                </strong>{" "}
                We may disclose your information if required to do so by law,
                or in response to valid requests by public authorities (e.g., a
                court or government agency).
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Business Transfers:
                </strong>{" "}
                If Cost2Cost is involved in a merger, acquisition, or asset
                sale, your personal information may be transferred as a
                business asset.
              </li>

            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              4. Data Security
            </h2>

            <p>
              We implement a variety of industry-standard security measures to
              maintain the safety of your personal information. All sensitive
              payment data is transmitted via Secure Socket Layer (SSL)
              technology and encrypted into our payment gateway providers&apos;
              databases. While we strive to use commercially acceptable means
              to protect your data, no method of transmission over the internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              5. Your Data Rights and Choices
            </h2>

            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>

            <ul className="mt-5 space-y-4 pl-5">

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Access and Update:
                </strong>{" "}
                You can review and change your personal information by logging
                into your Cost2Cost account settings.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Opt-Out:
                </strong>{" "}
                You can unsubscribe from our marketing emails at any time by
                clicking the "unsubscribe" link at the bottom of the email.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Data Deletion:
                </strong>{" "}
                You may request that we delete your personal data from our
                systems by contacting us directly, subject to certain legal
                exceptions.
              </li>

              <li className="relative pl-3">
                <span className="absolute left-[-12px] top-[13px] h-1.5 w-1.5 rounded-full bg-primary" />

                <strong className="text-text-primary">
                  Cookie Management:
                </strong>{" "}
                You can set your browser to refuse all or some browser cookies,
                or to alert you when cookies are being sent.
              </li>

            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              6. Children&apos;s Privacy
            </h2>

            <p>
              Our website is not intended for children under the age of 13 (or
              the applicable legal age in your region). We do not knowingly
              collect personal information from minors. If we become aware that
              we have collected data from a minor without parental consent, we
              will take steps to delete that information.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              7. Third-Party Links
            </h2>

            <p>
              Our website may contain links to third-party websites that are
              not operated by us. If you click on a third-party link, you will
              be directed to that site. We strongly advise you to review the
              Privacy Policy of every site you visit, as we have no control
              over and assume no responsibility for the content or privacy
              practices of third-party sites.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              8. Changes to This Privacy Policy
            </h2>

            <p>
              We may update our Privacy Policy from time to time to reflect
              changes in our practices or for legal reasons. We will notify you
              of any changes by posting the new Privacy Policy on this page and
              updating the "Last Updated" date at the top. We encourage you to
              review this page periodically.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-5 font-bebas text-3xl uppercase tracking-wide text-text-primary sm:text-4xl">
              9. Contact Us
            </h2>

            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or how we handle your data, please contact us at:
            </p>

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
              <p>
                <strong className="text-text-primary">
                  Email:
                </strong>{" "}
                <a
                  href="mailto:info@cost2costsupplement.com"
                  className="text-primary transition-colors hover:text-primary-hover"
                >
                  info@cost2costsupplement.com
                </a>
              </p>
            </div>
          </section>

        </article>
      </section>

      <Footer />
    </main>
  );
}