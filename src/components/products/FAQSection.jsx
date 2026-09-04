"use client";

import { useState } from "react";
import {
  ChevronDown,
  MessageCircle,
} from "lucide-react";

export default function FAQSection({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);


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
        .filter(
          (faq) =>
            faq &&
            faq.question &&
            faq.answer
        )
    : [];

  if (!normalizedFaqs.length) {
    return null;
  }

  const toggleFaq = (index) => {
    setOpenFaq((current) =>
      current === index ? null : index
    );
  };

  return (
    <section className="mt-20 w-full max-w-5xl">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#E52323]" />

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E52323]">
            Got Questions?
          </p>
        </div>

        <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-[#111111] sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#737373]">
          Everything you need to know about this
          product.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
        {normalizedFaqs.map((faq, index) => {
          const isOpen = openFaq === index;

          return (
            <div
              key={faq.id}
              className="border-b border-[#E5E5E5] last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  toggleFaq(index)
                }
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition-colors duration-200 hover:bg-[#FAFAFA] sm:px-7 sm:py-6"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen
                        ? "bg-[#E52323] text-white"
                        : "bg-[#E52323]/10 text-[#E52323]"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-bold leading-6 text-[#111111] sm:text-base">
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#E52323] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pl-[72px] pr-5 sm:pb-7 sm:pl-[88px] sm:pr-7">
                    <p className="whitespace-pre-line text-sm leading-7 text-[#737373]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}