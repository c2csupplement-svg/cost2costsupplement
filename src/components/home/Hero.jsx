import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* =========================================================
          BACKGROUND ACCENTS
      ========================================================= */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[110px]" />

      <div className="mx-auto grid min-h-[620px] max-w-[1440px] items-center lg:grid-cols-2">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="relative z-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-16">

          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Zap className="h-3.5 w-3.5 fill-primary text-primary" />

            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
              Premium Sports Nutrition
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-[720px] text-5xl font-black uppercase leading-[0.88] tracking-[-0.04em] text-text-primary sm:text-6xl lg:text-7xl xl:text-[88px]">
            Fuel Your
            <br />
            <span className="text-primary">Best Self.</span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-[540px] text-base leading-7 text-text-secondary sm:text-lg">
            Discover premium supplements from trusted brands designed to
            support your training, recovery, health and everyday performance.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-3">

            <Link
              href="/shop"
              className="group inline-flex h-14 items-center gap-3 rounded-lg bg-primary px-7 text-sm font-black uppercase tracking-wide text-white shadow-[0_12px_30px_rgba(229,35,35,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_16px_35px_rgba(229,35,35,0.28)]"
            >
              Shop Now

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/shop"
              className="group inline-flex h-14 items-center gap-3 rounded-lg border-2 border-text-primary px-7 text-sm font-black uppercase tracking-wide text-text-primary transition-all duration-300 hover:bg-text-primary hover:text-white"
            >
              Explore Products  

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-12 flex max-w-[560px] flex-wrap gap-x-8 gap-y-5 border-t border-border pt-6">

            <div>
              <p className="text-2xl font-black tracking-tight text-text-primary">
                100+
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                Products
              </p>
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight text-text-primary">
                20+
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                Brands
              </p>
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight text-text-primary">
                100%
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                Genuine
              </p>
            </div>

            <div className="hidden items-center gap-2 border-l border-border pl-8 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-black uppercase text-text-primary">
                  Shop With
                </p>

                <p className="text-[10px] font-medium text-text-muted">
                  Confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT PRODUCT VISUAL
        ===================================================== */}

        <div className="relative hidden h-full min-h-[620px] overflow-hidden lg:block">

          {/* Large red glow */}
          <div className="absolute right-[-8%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-primary/10 blur-[90px]" />

          {/* Large red circle */}
          <div className="absolute right-[-80px] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-primary" />

          {/* White cut-out circle */}
          <div className="absolute right-[20px] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-white/20" />

          {/* Decorative rings */}
          <div className="absolute right-[75px] top-1/2 h-[430px] w-[430px] -translate-y-1/2 rounded-full border border-white/30" />

          <div className="absolute right-[125px] top-1/2 h-[330px] w-[330px] -translate-y-1/2 rounded-full border border-white/30" />

          {/* Product */}
          <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative flex h-[480px] w-[360px] items-center justify-center">

              {/* Product shadow */}
              <div className="absolute bottom-8 h-12 w-64 rounded-full bg-black/25 blur-2xl" />

              {/* Product container */}
              <div className="relative flex h-[400px] w-[245px] -rotate-6 items-center justify-center rounded-[34px] border border-black/10 bg-gradient-to-br from-[#252525] via-[#101010] to-[#000000] shadow-[0_30px_70px_rgba(0,0,0,0.35)]">

                {/* Product shine */}
                <div className="pointer-events-none absolute left-5 top-0 h-full w-12 rotate-[8deg] bg-white/5 blur-xl" />

                {/* Label */}
                <div className="absolute inset-x-7 top-20 border-y border-white/20 py-7 text-center">

                  <p className="text-xs font-black tracking-[0.4em] text-white/50">
                    C2C
                  </p>

                  <p className="mt-2 text-3xl font-black uppercase tracking-tight text-white">
                    Nutrition
                  </p>

                  <div className="mx-auto mt-5 h-1 w-12 bg-primary" />

                  <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
                    Premium Formula
                  </p>
                </div>

                {/* Bottom text */}
                <p className="absolute bottom-8 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                  Sports Nutrition
                </p>
              </div>
            </div>
          </div>

          {/* Offer badge */}
          <div className="absolute bottom-16 right-8 z-20 rotate-3 rounded-2xl bg-text-primary px-7 py-5 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] xl:right-12">

            <div className="flex items-center justify-center gap-2">
              <Zap className="h-3.5 w-3.5 fill-primary text-primary" />

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Special Offers
              </p>
            </div>

            <p className="mt-1 text-2xl font-black leading-none">
              UP TO 50% OFF
            </p>
          </div>

          {/* Small floating badge */}
          <div className="absolute left-12 top-20 z-20 hidden rounded-full border border-border bg-white px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] xl:block">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-primary">
              100% Genuine
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          MOBILE VISUAL
      ========================================================= */}

      <div className="relative mx-5 mb-10 flex h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-text-primary sm:mx-8 lg:hidden">

        <div className="absolute h-[280px] w-[280px] rounded-full bg-primary" />

        <div className="absolute h-[220px] w-[220px] rounded-full border border-white/30" />

        <div className="relative flex h-[205px] w-[130px] -rotate-6 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#333333] via-[#111111] to-black shadow-2xl">

          <div className="absolute inset-x-3 top-12 border-y border-white/20 py-4 text-center">

            <p className="text-[8px] font-bold tracking-[0.3em] text-white/50">
              C2C
            </p>

            <p className="mt-1 text-lg font-black uppercase text-white">
              Nutrition
            </p>

            <p className="mt-2 text-[6px] font-bold uppercase tracking-[0.2em] text-primary">
              Premium Formula
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 rounded-xl bg-white px-4 py-3 text-center shadow-xl">
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-primary">
            Special Offers
          </p>

          <p className="mt-1 text-lg font-black text-text-primary">
            UP TO 50% OFF
          </p>
        </div>
      </div>
    </section>
  );
}