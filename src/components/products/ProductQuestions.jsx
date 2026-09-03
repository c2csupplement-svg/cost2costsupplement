"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ProductQuestions({ product }) {
  const [isQuestionFormOpen, setIsQuestionFormOpen] =
    useState(false);

  const [questions, setQuestions] = useState([]);

  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmitQuestion = (event) => {
    event.preventDefault();

    if (!question.trim()) return;

    const newQuestion = {
      id: Date.now(),
      name: name.trim() || "Anonymous Customer",
      question: question.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setQuestions((prev) => [newQuestion, ...prev]);

    setName("");
    setQuestion("");
    setIsQuestionFormOpen(false);
  };

  return (
    <div className="mt-20 max-w-5xl">
      <SectionHeading>
        Questions & Answers
      </SectionHeading>

      <div className="mt-7 rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8">
        <p className="text-lg font-bold">
          Have a question about this product?
        </p>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#737373]">
          Ask a question and get helpful answers about{" "}
          {product.shortName}.
        </p>

        <button
          type="button"
          onClick={() => setIsQuestionFormOpen(true)}
          className="mt-6 rounded-lg bg-[#E52323] px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b]"
        >
          Ask a Question
        </button>
      </div>

      {/* QUESTIONS */}
      {questions.length > 0 && (
        <div className="mt-6 space-y-4">
          {questions.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7"
            >
              <p className="text-sm font-bold text-[#111111]">
                Q. {item.question}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[#A3A3A3]">
                <span>{item.name}</span>

                <span>{item.date}</span>
              </div>

              <div className="mt-5 border-l-2 border-[#E52323] pl-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#E52323]">
                  Awaiting Answer
                </p>

                <p className="mt-1 text-sm text-[#737373]">
                  This question will be answered soon.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* QUESTION MODAL */}
      {isQuestionFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setIsQuestionFormOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#525252] transition hover:border-[#E52323] hover:text-[#E52323]"
              aria-label="Close question form"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E52323]">
              Ask the community
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              Ask a Question
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#737373]">
              Ask anything you want to know about{" "}
              {product.shortName}.
            </p>

            <form
              onSubmit={handleSubmitQuestion}
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="questionName"
                  className="text-sm font-bold"
                >
                  Your Name
                </label>

                <input
                  id="questionName"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="mt-3 h-12 w-full rounded-lg border border-[#D4D4D4] px-4 text-sm outline-none transition focus:border-[#E52323]"
                />
              </div>

              <div>
                <label
                  htmlFor="productQuestion"
                  className="text-sm font-bold"
                >
                  Your Question *
                </label>

                <textarea
                  id="productQuestion"
                  required
                  rows={5}
                  value={question}
                  onChange={(event) =>
                    setQuestion(event.target.value)
                  }
                  placeholder="What would you like to know?"
                  className="mt-3 w-full resize-none rounded-lg border border-[#D4D4D4] px-4 py-3 text-sm outline-none transition focus:border-[#E52323]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setIsQuestionFormOpen(false)
                  }
                  className="h-12 rounded-lg border border-[#D4D4D4] px-6 text-xs font-black uppercase tracking-wide transition hover:border-[#111111]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-12 rounded-lg bg-[#E52323] px-6 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b]"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
      {children}
    </h2>
  );
}