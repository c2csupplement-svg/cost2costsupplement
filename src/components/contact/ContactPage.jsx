"use client";

import { useState , useEffect} from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  RefreshCw,
  Send,
  Phone,
} from "lucide-react";

function generateMathProblem() {
  const operations = ["+", "-", "*"];

  const operation =
    operations[Math.floor(Math.random() * operations.length)];

  let first;
  let second;

  if (operation === "+") {
    first = Math.floor(Math.random() * 20) + 1;
    second = Math.floor(Math.random() * 20) + 1;
  } else if (operation === "-") {
    first = Math.floor(Math.random() * 20) + 10;
    second = Math.floor(Math.random() * 10) + 1;
  } else {
    first = Math.floor(Math.random() * 9) + 2;
    second = Math.floor(Math.random() * 9) + 2;
  }

  let answer;

  if (operation === "+") {
    answer = first + second;
  } else if (operation === "-") {
    answer = first - second;
  } else {
    answer = first * second;
  }

  return {
    question: `${first} ${
      operation === "*" ? "×" : operation
    } ${second} = ?`,
    answer,
  };
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    captcha: "",
  });

  const [mathProblem, setMathProblem] = useState({
  question: "",
  answer: null,
  });
  useEffect(() => {
  setMathProblem(generateMathProblem());
}, []);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const refreshMathProblem = () => {
    setMathProblem(generateMathProblem);

    setFormData((previous) => ({
      ...previous,
      captcha: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");

    if (Number(formData.captcha) !== mathProblem.answer) {
      setStatus("captcha-error");
      refreshMathProblem();
      return;
    }

    setIsSubmitting(true);

    // Replace this with your API request later.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setStatus("success");

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      captcha: "",
    });

    setMathProblem(generateMathProblem);
  };

  const inputClass = `
    w-full
    rounded-lg
    border
    border-border
    bg-white
    px-4
    py-3
    font-oxanium
    text-sm
    text-text-primary
    outline-none
    transition-all
    duration-200
    placeholder:text-text-muted
    focus:border-primary
    focus:ring-2
    focus:ring-primary/10
  `;

  return (
    <section className="min-h-screen bg-background text-text-primary">

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
              Contact
            </span>

          </div>
        </div>
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
        <div className="max-w-3xl">

          <p className="mb-3 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            C2C Support Center
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
            Let&apos;s
            <span className="text-primary"> Talk.</span>
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              font-oxanium
              text-sm
              leading-7
              text-text-secondary
              sm:text-base
            "
          >
            Have a question about an order, product or anything else?
            Our team is here to help. Send us a message and we&apos;ll get
            back to you as soon as possible.
          </p>

        </div>
      </div>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-7
              shadow-[0_8px_30px_rgba(0,0,0,0.04)]
              sm:p-9
            "
          >

            <p className="font-oxanium text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Get In Touch
            </p>

            <h2
              className="
                mt-3
                font-bebas
                text-4xl
                uppercase
                tracking-wide
                text-text-primary
                sm:text-5xl
              "
            >
              We&apos;re here to help.
            </h2>

            <p className="mt-4 font-oxanium text-sm leading-7 text-text-secondary">
              Whether you need help choosing a supplement, tracking an order,
              or have a general question, feel free to reach out.
            </p>

            <div className="mt-9 space-y-5">

              {/* Phone */}
              <div className="flex gap-4">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-oxanium text-xs uppercase tracking-[0.12em] text-text-muted">
                    Call Us
                  </p>

                  <p className="mt-1 font-oxanium text-sm font-semibold text-text-primary">
                    You can request a call back
                  </p>
                </div>

              </div>

              {/* Email */}
              <div className="flex gap-4">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-oxanium text-xs uppercase tracking-[0.12em] text-text-muted">
                    Email
                  </p>

                  <a
                    href="mailto:info@cost2costsupplement.com"
                    className="
                      mt-1
                      block
                      font-oxanium
                      text-sm
                      font-semibold
                      text-text-primary
                      transition
                      hover:text-primary
                    "
                  >
                    info@cost2costsupplement.com
                  </a>
                </div>

              </div>

              {/* Location */}
              <div className="flex gap-4">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-oxanium text-xs uppercase tracking-[0.12em] text-text-muted">
                    Location
                  </p>

                  <p className="mt-1 font-oxanium text-sm font-semibold text-text-primary">
                    India
                  </p>
                </div>

              </div>

            </div>

            {/* Support Card */}
            <div
              className="
                mt-10
                rounded-xl
                border
                border-border
                bg-surface
                p-5
              "
            >
              <div className="flex items-center gap-3">

                <CheckCircle2 className="h-5 w-5 text-primary" />

                <p className="font-oxanium text-sm font-semibold text-text-primary">
                  Customer Support
                </p>

              </div>

              <p className="mt-2 font-oxanium text-xs leading-6 text-text-secondary">
                We aim to respond to customer enquiries as quickly as
                possible.
              </p>
            </div>

          </div>

          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-7
              shadow-[0_8px_30px_rgba(0,0,0,0.04)]
              sm:p-9
            "
          >

            <div className="mb-8">

              <p className="font-oxanium text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Send A Message
              </p>

              <h2
                className="
                  mt-2
                  font-bebas
                  text-4xl
                  uppercase
                  tracking-wide
                  text-text-primary
                  sm:text-5xl
                "
              >
                Contact Us
              </h2>

            </div>

            {/* Success */}
            {status === "success" && (
              <div
                className="
                  mb-6
                  flex
                  items-start
                  gap-3
                  rounded-lg
                  border
                  border-green-500/30
                  bg-green-50
                  p-4
                "
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div>
                  <p className="font-oxanium text-sm font-semibold text-green-800">
                    Message sent successfully
                  </p>

                  <p className="mt-1 font-oxanium text-xs text-green-700">
                    Thank you for contacting us. We&apos;ll get back to you
                    shortly.
                  </p>
                </div>
              </div>
            )}

            {/* CAPTCHA Error */}
            {status === "captcha-error" && (
              <div
                className="
                  mb-6
                  rounded-lg
                  border
                  border-red-500/30
                  bg-red-50
                  p-4
                "
              >
                <p className="font-oxanium text-sm font-semibold text-red-700">
                  Incorrect answer
                </p>

                <p className="mt-1 font-oxanium text-xs text-red-600">
                  Please solve the new math problem and try again.
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField label="Name" required>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Email" required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={inputClass}
                  />
                </FormField>

              </div>

              {/* Phone + Subject */}
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField label="Phone">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Subject" required>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className={inputClass}
                  />
                </FormField>

              </div>

              {/* Message */}
              <FormField label="Message" required>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  rows={6}
                  className={`${inputClass} resize-none py-3`}
                />
              </FormField>

              {/* =================================================
                  MATH VERIFICATION
              ================================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  p-5
                "
              >

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="font-oxanium text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      Quick Verification
                    </p>

                    <p className="mt-1 font-oxanium text-xs text-text-secondary">
                      Solve the simple math problem below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={refreshMathProblem}
                    aria-label="Generate new math problem"
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-border
                      bg-card
                      text-text-muted
                      transition
                      hover:border-primary
                      hover:text-primary
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>

                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">

                  <div
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-border
                      bg-white
                      px-6
                      font-oxanium
                      text-lg
                      font-bold
                      tracking-wider
                      text-text-primary
                      sm:min-w-[150px]
                    "
                  >
                    {mathProblem.question}
                  </div>

                  <input
                    type="number"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    placeholder="Your answer"
                    required
                    className={`${inputClass} h-12`}
                  />

                </div>
              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-primary
                  px-6
                  font-oxanium
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  transition
                  hover:bg-primary-hover
                  hover:shadow-[0_8px_22px_rgba(229,35,35,0.20)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message

                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
}


/* =====================================================
   FORM FIELD
===================================================== */

function FormField({ label, required, children }) {
  return (
    <label className="block">

      <span
        className="
          mb-2
          block
          font-oxanium
          text-xs
          font-semibold
          uppercase
          tracking-[0.12em]
          text-text-secondary
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-primary">
            *
          </span>
        )}
      </span>

      {children}

    </label>
  );
}