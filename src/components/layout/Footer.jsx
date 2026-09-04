import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Mail,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Protein", href: "/shop?category=protein" },
  { label: "Creatine", href: "/shop?category=creatine" },
  { label: "Pre-Workout", href: "/shop?category=pre-workout" },
  { label: "Vitamins", href: "/shop?category=vitamins" },
  { label: "Mass Gainers", href: "/shop?category=mass-gainers" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/order-tracking" },
  { label: "FAQs", href: "/faq" },
  { label: "Why Cost2Cost Supplements", href: "/why-cost2cost" },
];

const supportLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Exchanges", href: "/returns-exchange" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E5E5] bg-white text-[#111111]">

      {/* Newsletter */}
      <div className="border-b border-[#E5E5E5]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-14">

          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E52323]">
              Stay in the loop
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#111111] sm:text-3xl">
              Get stronger. Stay informed.
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777777]">
              Get product drops, exclusive offers and useful nutrition tips
              delivered straight to your inbox.
            </p>
          </div>

          <form className="flex w-full max-w-lg">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-12 min-w-0 flex-1 rounded-l-lg border border-r-0 border-[#D8D8D8] bg-[#F7F7F7] px-4 text-sm text-[#111111] outline-none placeholder:text-[#999999] focus:border-[#E52323]"
            />

            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-2 rounded-r-lg bg-[#E52323] px-5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#FF2B2B]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

          {/* Main Footer */}
          <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">

              {/* =====================================================
                  BRAND
              ===================================================== */}
              <div className="col-span-2 lg:col-span-1">
                <Link href="/" className="shrink-0">
                  <img
                    src="/images/c2c-logo-black.png"
                    alt="C2C Supplement"
                    className="h-12 w-auto object-contain sm:h-14"
                  />
                </Link>

                <p className="mt-5 max-w-sm text-sm leading-6 text-[#777777]">
                  Your destination for genuine sports nutrition, supplements and
                  wellness products. Fuel your goals with products you can trust.
                </p>

                {/* Contact */}
                <div className="mt-7 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-[#777777]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E52323]" />
                    <span>India</span>
                  </div>

                  <a
                    href="mailto:info@cost2costsupplement.com"
                    className="flex items-center gap-3 text-sm text-[#777777] transition-colors hover:text-[#111111]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#E52323]" />
                    <span>info@cost2costsupplement.com</span>
                  </a>
                </div>

                {/* Social */}
                <div className="mt-7 flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/cost2costsupplement"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D8D8] text-[#777777] transition-all hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
                  >
                    <FaFacebookF className="h-4 w-4" />
                  </a>

                  <a
                    href="https://www.instagram.com/cost2cost.supplement"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D8D8] text-[#777777] transition-all hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </a>

                  <a
                    href="https://www.youtube.com/@cost2costsupplement"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D8D8] text-[#777777] transition-all hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
                  >
                    <FaYoutube className="h-4 w-4" />
                  </a>

                  <a
                    href="https://x.com/c2csupplement"
                    aria-label="Twitter"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D8D8] text-[#777777] transition-all hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
                  >
                    <FaTwitter className="h-4 w-4" />
                  </a>
                </div>
              </div>

    {/* =====================================================
        SHOP
    ===================================================== */}
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">
        Shop
      </h3>

      <ul className="mt-5 space-y-3">
        {shopLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#777777] transition-colors hover:text-[#E52323]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* =====================================================
        COMPANY
    ===================================================== */}
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">
        Company
      </h3>

      <ul className="mt-5 space-y-3">
        {companyLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#777777] transition-colors hover:text-[#E52323]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>

    {/* =====================================================
        SUPPORT
    ===================================================== */}
    <div className="col-span-2 lg:col-span-1">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">
        Support
      </h3>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:block sm:space-y-3">
        {supportLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#777777] transition-colors hover:text-[#E52323]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>

  </div>
</div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E5E5]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          <p className="text-xs text-[#888888]">
            © {new Date().getFullYear()} Cost2Cost Supplement. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888]">
            <span>Secure Payments</span>
            <span className="h-1 w-1 rounded-full bg-[#E52323]" />
            <span>100% Genuine Products</span>
            <span className="h-1 w-1 rounded-full bg-[#E52323]" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}