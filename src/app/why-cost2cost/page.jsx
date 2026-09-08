"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  MessageCircle,
  ArrowUpRight,
  Plus,
} from "lucide-react";

export default function WhyCost2CostPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Are your supplements authentic?",
      answer:
        "Yes. We focus on listing genuine products and work to ensure products are sourced through reliable channels.",
    },
    {
      id: 2,
      question: "How can I know which supplement is right for me?",
      answer:
        "Product descriptions provide information about ingredients, usage, and intended purpose. If you have specific concerns, consult a qualified healthcare professional.",
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and the shipping method selected during checkout.",
    },
    {
      id: 4,
      question: "Can I cancel my order?",
      answer:
        "Orders can generally be cancelled before they are processed for shipment. Please contact support as soon as possible if you need to cancel an order.",
    },
    {
      id: 5,
      question: "What happens if my product arrives damaged?",
      answer:
        "If your product arrives damaged, contact our support team with the required order and product details so the case can be reviewed.",
    },
    {
      id: 6,
      question: "How should I use supplements?",
      answer:
        "Always follow the usage instructions provided on the product packaging. Do not exceed the recommended serving unless advised by a qualified professional.",
    },
  ];

  const normalizedFaqs = Array.isArray(faqs)
    ? faqs
        .map((faq) => {
          if (!faq || typeof faq !== "object") {
            return null;
          }

          const question =
            faq.question ??
            faq.faqQuestion ??
            faq.faq_question ??
            faq.questions ??
            faq.title ??
            "";

          const answer =
            faq.answer ??
            faq.faqAnswer ??
            faq.faq_answer ??
            faq.answers ??
            faq.description ??
            "";

          return {
            id:
              faq.id ??
              faq._id ??
              `${question}-${answer}`,
            question:
              typeof question === "string"
                ? question.trim()
                : String(question ?? ""),
            answer:
              typeof answer === "string"
                ? answer.trim()
                : String(answer ?? ""),
          };
        })
        .filter((faq) => faq && faq.question && faq.answer)
    : [];

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen w-full bg-background text-text-primary">
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 font-oxanium text-xs uppercase tracking-[0.14em]">
            <Link
              href="/"
              className="text-primary transition hover:text-primary-hover"
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

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12 lg:py-10">
          <div className="mb-12 w-full border-b border-border pb-10">
            <p className="mb-3 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Cost2Cost Supplement
            </p>

            <h1 className="font-bebas text-4xl uppercase leading-none tracking-wide text-text-primary sm:text-6xl lg:text-7xl">
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

          <div className="w-full">
            <h2 className="mb-8 font-bebas text-4xl uppercase tracking-wide text-text-primary sm:text-5xl">
              Key Reasons to Choose Cost2Cost
            </h2>

            <div className="w-full space-y-5">
              <ReasonCard number="1" title="Cost Transparency">
                <p>
                  We aim to price products as close to their real value as
                  possible. You are not paying for hype, inflated influencer
                  fees, or artificial “premium positioning.”
                </p>
              </ReasonCard>

              <ReasonCard number="2" title="Marketplace Neutrality">
                <p>
                  Because we are not tied to one brand, we don’t push what
                  benefits us most. Products are listed based on quality, not
                  commission size.
                </p>
              </ReasonCard>

              <ReasonCard number="3" title="Clear Refund Logic">
                <p>
                  Refunds are issued only as C2C Wallet Credit, clearly stated
                  upfront. This allows faster processing, no gateway delays, and
                  ensures customers can reuse their value without loss.
                </p>
              </ReasonCard>

              <ReasonCard number="4" title="Strict Claim Control">
                <p>
                  We actively avoid listing products that promise unrealistic
                  fat loss, muscle gain, or medical cures. Supplements should
                  support effort, not replace it.
                </p>
              </ReasonCard>

              <ReasonCard number="5" title="Customer-Focused Resolution">
                <p>
                  If there is a genuine quality issue, damage, or health-related
                  concern, we review cases fairly and resolve them quickly
                  instead of hiding behind rigid rules.
                </p>
              </ReasonCard>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full min-h-screen bg-background text-text-primary">
        {/* FAQ Header */}
        <div className="w-full border-b border-border">
          <div className="mx-auto w-full max-w-[1200px] px-5 pt-5 pb-10 sm:px-8 sm:pt-10 sm:pb-16 lg:px-10 xl:px-12 lg:pb-20">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-10 bg-primary" />

                <p className="font-oxanium text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  Support Center
                </p>
              </div>

              <h1 className="mt-6 font-bebas text-6xl uppercase leading-[0.9] tracking-wide text-text-primary sm:text-7xl lg:text-8xl">
                Questions.
                <br />
                <span className="text-primary">Answered.</span>
              </h1>

              <p className="mt-6 max-w-xl font-oxanium text-sm leading-7 text-text-secondary sm:text-base">
                Everything you need to know about our products, orders,
                delivery and supplements — all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:px-10 xl:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="border-l-2 border-primary pl-5">
                <p className="font-bebas text-4xl tracking-wide text-text-primary">
                  FAQ
                </p>

                <p className="mt-2 font-oxanium text-sm leading-6 text-text-secondary">
                  {normalizedFaqs.length} common questions answered for you.
                </p>
              </div>

              <div className="mt-8 hidden lg:block">
                <p className="font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                  Quick navigation
                </p>

                <div className="mt-4 border-t border-border">
                  {[
                    "Products & Authenticity",
                    "Orders & Delivery",
                    "Supplement Usage",
                  ].map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className="group flex w-full items-center justify-between border-b border-border py-4 text-left font-oxanium text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                      <span>
                        0{index + 1}. {item}
                      </span>

                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="mt-10 border border-border bg-card p-5">
                <MessageCircle className="h-6 w-6 text-primary" />

                <p className="mt-5 font-bebas text-2xl uppercase tracking-wide">
                  Still need help?
                </p>

                <p className="mt-2 font-oxanium text-xs leading-6 text-text-secondary">
                  Can't find what you're looking for? Our team is here to help.
                </p>

                <Link
                  href="/contact"
                  className="group mt-5 inline-flex items-center gap-2 font-oxanium text-xs font-bold uppercase tracking-wide text-primary"
                >
                  Contact Support

                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </aside>

            {/* FAQ Questions */}
            <div className="min-w-0">
              <div className="border-b border-border pb-6">
                <p className="font-oxanium text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Find your answer
                </p>

                <h2 className="mt-3 font-bebas text-4xl uppercase tracking-wide sm:text-5xl">
                  Common Questions
                </h2>
              </div>

              <div className="mt-2">
                {normalizedFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.id}
                      className={`border-b border-border transition-colors duration-300 ${
                        isOpen ? "bg-card" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6 sm:py-7"
                      >
                        <span
                          className={`mt-1 w-8 shrink-0 font-oxanium text-xs font-bold transition-colors ${
                            isOpen ? "text-primary" : "text-text-muted"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`flex-1 pr-2 font-oxanium text-sm font-semibold leading-6 transition-colors sm:text-base ${
                            isOpen
                              ? "text-primary"
                              : "text-text-primary group-hover:text-primary"
                          }`}
                        >
                          {faq.question}
                        </span>

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 border-primary bg-primary text-white"
                              : "border-border text-text-secondary group-hover:border-primary group-hover:text-primary"
                          }`}
                        >
                          <Plus className="h-5 w-5" />
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-8 pl-12 pr-2 sm:pl-[68px] sm:pr-12">
                            <div className="border-l-2 border-primary pl-5">
                              <p className="max-w-3xl font-oxanium text-sm leading-7 text-text-secondary sm:text-[15px]">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="mt-14 border-t border-border pt-10">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-bebas text-3xl uppercase tracking-wide">
                      Didn't find your answer?
                    </p>

                    <p className="mt-2 font-oxanium text-sm text-text-secondary">
                      Our support team will be happy to help you.
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    className="group inline-flex h-12 items-center justify-center gap-3 bg-primary px-6 font-oxanium text-xs font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
                  >
                    Contact Us

                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Breadcrumb({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-oxanium text-xs uppercase tracking-[0.14em]">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="text-primary transition-colors hover:text-primary-hover"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-muted">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
          )}
        </div>
      ))}
    </div>
  );
}

function ReasonCard({ number, title, children }) {
  return (
    <article className="group w-full rounded-xl border border-border bg-card p-6 shadow-[0_5px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(229,35,35,0.07)] sm:p-7">
      <div className="flex w-full items-start gap-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-oxanium text-sm font-black text-white shadow-[0_5px_15px_rgba(229,35,35,0.18)]">
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-oxanium text-lg font-bold text-text-primary sm:text-xl">
            {title}
          </h3>

          <div className="mt-3 font-oxanium text-sm leading-7 text-text-secondary sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}