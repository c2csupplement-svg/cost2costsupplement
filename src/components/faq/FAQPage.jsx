"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import Breadcrumb from "../layout/Breadcrumb";

const faqs = [
  {
    question: "Are the supplements on Cost2CostSupplement genuine?",
    answer:
      "Yes,They are 100 percent genuine. We buy our stock directly from the brands like Earthmaa and ProMolecules or their authorized distributors. This means we do not deal with middlemen. Every single item is shipped in packaging that cannot be tampered with. It also has a batch number and expiration date on it. You can easily check these details. We never sell products.",
  },
  {
    question:
      "Why should I choose Eartham or Promoleclues over other supplement stores?",
    answer:
      "Earthmaa and ProMolecules are different from other brands. They focus a lot on making sure their products are pure and that your body can actually use the ingredients. They do not use formulas or cheap fillers. The labels, on their products tell you exactly what is inside. This means you know what you are putting in your body.",
  },
  {
    question: "How do I keep track of my order?",
    answer:
      "When your package leaves our warehouse we will send you an email and a text message. These messages will have your shipping details in them. You will also get a link to track your package with DTDC. This way you can see where your package is and when it will arrive.",
  },
  {
    question: "How fast is delivery? Is it ever free?",
    answer:
      "We work with DTDC to deliver our products quickly. It usually takes about 2 to 5 business days to get your package.. Yes if you buy enough products to meet our minimum order amount we will pay for the shipping. You do not have to do anything. The discount will be applied automatically when you check out.",
  },
  {
    question: "When is the best time to drink my pre-workout?",
    answer:
      "To get the results mix your pre-workout with 200-250ml of cold water. Do this 20 to 30 minutes before you go to the gym. If you are using it for the time try using just half a scoop. This will help you see how your body reacts to the energy boost.",
  },
  {
    question:
      "Is it normal that my skin feels tingly and itchy after I take my pre-workout?",
    answer:
      "Yes! It’s completely normal and safe. The tingle, called paresthesia, is caused by Beta Alanine in the formula, which is a premium ingredient to increase muscular endurance. The itch will completely disappear a few minutes into your workout.",
  },
  {
    question: "What is the best time of day to take my fat burner?",
    answer:
      "The best time to take your fat burner is in the morning when you wake up on an empty stomach so it kickstarts your metabolism for the day. About 30 minutes before your workout is also a great time to take it. You want to avoid taking your fat burner too late in the day though, because it has caffeine in it and will keep you up all night.",
  },
  {
    question:
      "I think my pre-workout went bad because it has clumps in it",
    answer:
      "It has not gone bad! The high quality pre-workout powders contain ingredients like citrulline and glycerol which easily absorb moisture in the air. Clumps in powders does not affect the safety or the effectiveness of the formula. All you need to do is break the clumps apart with a spoon, or give your tub a hard shake.",
  },
  {
    question: "What is the best time of the day to take my fat burner?",
    answer:
      "The best time to take your fat burner is in the morning when you wake up on an empty stomach so it kickstarts your metabolism for the day. About 30 minutes before your workout is also a great time to take it. You want to avoid taking your fat burner too late in the day though, because it has caffeine in it and will keep you up all night.",
  },
  {
    question: "Can I just take fat burner without dieting or exercising?",
    answer:
      "Fat burners are designed to help you lose weight in conjunction with efforts to eat healthier and exercise regularly. Fat burners kick metabolism up a notch to help you burn more calories and fat. Without dieting and exercising regularly, you probably won’t see results from fat burner.",
  },
  {
    question: "Is it safe to take a fat burner every day for months?",
    answer:
      "Fat burners aren’t really designed to be taken for long periods of time. It’s best to take fat burners in 4 to 8 week cycles, and then take a week or two off before starting the cycle again.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <section className="min-h-screen bg-background text-text-primary">
      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "FAQ" },
          ]}
        />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
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
              <span className="text-primary">
                Answered.
              </span>
            </h1>

            <p className="mt-6 max-w-xl font-oxanium text-sm leading-7 text-text-secondary sm:text-base">
              Everything you need to know about our products,
              orders, delivery and supplements — all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FAQ CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
          
          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border-l-2 border-primary pl-5">
              <p className="font-bebas text-4xl tracking-wide text-text-primary">
                FAQ
              </p>

              <p className="mt-2 font-oxanium text-sm leading-6 text-text-secondary">
                {faqs.length} common questions answered for you.
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

            {/* Support Card */}
            <div className="mt-10 border border-border bg-card p-5">
              <MessageCircle className="h-6 w-6 text-primary" />

              <p className="mt-5 font-bebas text-2xl uppercase tracking-wide">
                Still need help?
              </p>

              <p className="mt-2 font-oxanium text-xs leading-6 text-text-secondary">
                Can't find what you're looking for? Our team is
                here to help.
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

          {/* =================================================
              FAQ LIST
          ================================================= */}

          <div>
            <div className="border-b border-border pb-6">
              <p className="font-oxanium text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Find your answer
              </p>

              <h2 className="mt-3 font-bebas text-4xl uppercase tracking-wide sm:text-5xl">
                Common Questions
              </h2>
            </div>

            <div className="mt-2">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.question}
                    className={`border-b border-border transition-colors duration-300 ${
                      isOpen ? "bg-card" : ""
                    }`}
                  >
                    {/* QUESTION */}
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      className="
                        group
                        flex
                        w-full
                        items-start
                        gap-5
                        py-6
                        text-left
                        sm:gap-8
                        sm:py-7
                      "
                    >
                      {/* Number */}
                      <span
                        className={`
                          mt-1
                          w-8
                          shrink-0
                          font-oxanium
                          text-xs
                          font-bold
                          transition-colors
                          ${
                            isOpen
                              ? "text-primary"
                              : "text-text-muted"
                          }
                        `}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Question */}
                      <span
                        className={`
                          flex-1
                          pr-2
                          font-oxanium
                          text-sm
                          font-semibold
                          leading-6
                          transition-colors
                          sm:text-base
                          ${
                            isOpen
                              ? "text-primary"
                              : "text-text-primary group-hover:text-primary"
                          }
                        `}
                      >
                        {faq.question}
                      </span>

                      {/* Plus */}
                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          border
                          transition-all
                          duration-300
                          ${
                            isOpen
                              ? "rotate-45 border-primary bg-primary text-white"
                              : "border-border text-text-secondary group-hover:border-primary group-hover:text-primary"
                          }
                        `}
                      >
                        <Plus className="h-5 w-5" />
                      </span>
                    </button>

                    {/* ANSWER */}
                    <div
                      className={`
                        grid
                        transition-all
                        duration-500
                        ease-in-out
                        ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-8 pl-[52px] pr-2 sm:pl-[72px] sm:pr-16">
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

            {/* Bottom Help CTA */}
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
  );
}