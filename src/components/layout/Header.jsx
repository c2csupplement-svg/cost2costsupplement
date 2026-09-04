"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Whyc2c", href: "/why-cost2cost" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const { cartCount, wishlistCount } = useShop();

  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="font-oxanium sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="relative mx-auto flex h-[76px] w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-primary transition-all duration-300 hover:bg-primary hover:text-white lg:hidden"
          >
            <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
          </button>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative text-sm font-bold uppercase tracking-wide transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full ${
                    active
                      ? "text-primary after:w-full"
                      : "text-text-primary after:w-0"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src="/images/c2c-logo-black.png"
              alt="C2C Supplement"
              className="h-11 w-auto object-contain sm:h-13"
            />
          </Link>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-11 w-8 items-center justify-center rounded-full text-text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              <Heart className="h-5 w-5" />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-11 w-8 items-center justify-center rounded-full text-text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="flex h-11 w-8 items-center justify-center rounded-full text-text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="absolute inset-0 bg-black/45 backdrop-blur-xl animate-menu-fade"
          />

          <div className="absolute inset-0 flex flex-col bg-white/90 backdrop-blur-2xl animate-menu-scale">
            <div className="flex h-[76px] shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-7 bg-primary" />

                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
                  Menu
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-text-primary text-white transition-all duration-300 hover:rotate-90 hover:bg-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="font-oxanium-medium flex flex-1 items-center justify-center overflow-y-auto px-5">
              <nav className="flex w-full max-w-[900px] flex-col items-center">
                {navItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                    className="group flex w-full max-w-[760px] items-center justify-center gap-4 border-b border-black/10 py-4 opacity-0 animate-menu-item transition-all duration-300 sm:py-5 lg:py-6"
                  >
                    <span className="text-center text-4xl font-black uppercase leading-none tracking-[-0.04em] text-text-primary transition-all duration-300 group-hover:translate-x-[-6px] group-hover:text-primary sm:text-5xl lg:text-6xl">
                      {item.label}
                    </span>

                    <ArrowUpRight className="h-6 w-6 shrink-0 text-text-muted opacity-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100 sm:h-7 sm:w-7" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center px-5 pb-7 pt-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">
                Cost2Cost Supplement
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Genuine sports nutrition & wellness
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}