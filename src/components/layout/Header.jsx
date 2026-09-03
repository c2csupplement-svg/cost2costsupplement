"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
Search,
ShoppingCart,
Heart,
User,
Menu,
X,
ArrowUpRight,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useGetSearchProductsQuery } from "@/services/productsApi";

const navItems = [
{ label: "Home", href: "/" },
{ label: "Shop", href: "/shop" },
{ label: "Whyc2c", href: "/why-cost2cost" },
{ label: "Blog", href: "/blogs" },
{ label: "Contact Us", href: "/contact" },
];

export default function Header() {
const { cartCount, wishlistCount } = useShop();

const [menuOpen, setMenuOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
const [searchFocused, setSearchFocused] = useState(false);

const pathname = usePathname();
const router = useRouter();

// Debounce search input
useEffect(() => {
const timer = setTimeout(() => {
setDebouncedSearch(searchTerm.trim());
}, 400);

 
return () => clearTimeout(timer);
 

}, [searchTerm]);

// Search products
const {
data: searchData,
isFetching: isSearching,
} = useGetSearchProductsQuery(
{
searchQuery: debouncedSearch,
page: 1,
},
{
skip: !debouncedSearch,
}
);

// Maximum 4 products
const searchProducts = searchData?.products?.slice(0, 4) || [];

const showSearchDropdown =
searchFocused && searchTerm.trim().length > 0;

const handleSearch = (e) => {
e.preventDefault();

 
const query = searchTerm.trim();

if (!query) {
  router.push("/shop");
  setSearchFocused(false);
  return;
}

router.push(`/shop?search=${encodeURIComponent(query)}`);
setSearchFocused(false);
 

};

const handleProductClick = () => {
setSearchFocused(false);
setSearchTerm("");
};

const handleViewMore = () => {
const query = searchTerm.trim();

 
if (!query) return;

router.push(`/shop?search=${encodeURIComponent(query)}`);
setSearchFocused(false);
 

};

// "/" only matches exactly; other routes also match their sub-pages
const isActive = (href) =>
href === "/" ? pathname === "/" : pathname?.startsWith(href);

// Prevent page scrolling while menu is open
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
{/* =========================================================
HEADER
========================================================= */}

 
  <header className="font-oxanium sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
    <div className="relative mx-auto flex h-[76px] w-full max-w-[1440px] items-center sm:px-6 lg:px-8">

      {/* =====================================================
          LEFT — BURGER
      ===================================================== */}

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        className="
          group
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          text-text-primary
          transition-all
          duration-300
          hover:bg-primary
          hover:text-white
          lg:hidden
        "
      >
        <Menu className="font-oxanium h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
      </button>

      {/* =====================================================
          DESKTOP NAVIGATION
      ===================================================== */}

      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {navItems
          .filter((item) => item.label !== "Account")
          .map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  relative
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  transition-colors
                  duration-300
                  after:absolute
                  after:-bottom-1
                  after:left-0
                  after:h-[2px]
                  after:bg-primary
                  after:transition-all
                  after:duration-300
                  hover:text-primary
                  hover:after:w-full
                  ${
                    active
                      ? "text-primary after:w-full"
                      : "text-text-primary after:w-0"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* =====================================================
          CENTER — LOGO
      ===================================================== */}

      <Link
        href="/"
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <img
          src="/images/c2c-logo-black.png"
          alt="C2C Supplement"
          className="h-11 w-auto object-contain sm:h-13"
        />
      </Link>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4">

        {/* =====================================================
            DESKTOP SEARCH
        ===================================================== */}

        <div className="relative hidden lg:block">
          <form
            onSubmit={handleSearch}
            className="
              flex
              h-11
              w-[300px]
              items-center
              overflow-hidden
              rounded-lg
              border
              border-border
              bg-surface-muted
              transition
              focus-within:border-primary
            "
          >
            <Search className="ml-3 h-4 w-4 shrink-0 text-text-muted" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search products..."
              className="
                h-full
                min-w-0
                flex-1
                bg-transparent
                px-3
                text-sm
                text-text-primary
                outline-none
                placeholder:text-text-muted
              "
            />
          </form>

          {/* SEARCH DROPDOWN */}
          {showSearchDropdown && (
            <div
              className="
                absolute
                right-0
                top-full
                z-[60]
                mt-2
                w-[380px]
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-background
                shadow-[0_18px_50px_rgba(0,0,0,0.12)]
              "
            >
              {/* Loading */}
              {isSearching && (
                <div className="px-4 py-4">
                  <p className="text-sm text-text-muted">
                    Searching products...
                  </p>
                </div>
              )}

              {/* Products */}
              {!isSearching && searchProducts.length > 0 && (
                <div>
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                      Top Results
                    </p>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {searchProducts.map((product) => (
                      <div
                        key={product.id}
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-border
                          px-4
                          py-3
                          last:border-b-0
                        "
                      >
                        <Link
                           href={`/product/${product.slug}`}
                          onClick={handleProductClick}
                          className="
                            flex
                            min-w-0
                            flex-1
                            items-center
                            gap-3
                          "
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                            <img
                              src={
                                product.featuredimg ||
                                product.image ||
                                "/images/placeholder.png"
                              }
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <p className="line-clamp-2 text-sm font-bold text-text-primary">
                            {product.name}
                          </p>
                        </Link>

                        <Link
                           href={`/product/${product.slug}`}
                          onClick={handleProductClick}
                          className="
                            shrink-0
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-primary
                            transition-opacity
                            hover:opacity-70
                          "
                        >
                          View more
                        </Link>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleViewMore}
                    className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      border-t
                      border-border
                      px-4
                      py-3
                      text-xs
                      font-bold
                      uppercase
                      tracking-wide
                      text-text-primary
                      transition-colors
                      hover:text-primary
                    "
                  >
                    View all results

                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </button>
                </div>
              )}

              {/* No Results */}
              {!isSearching &&
                debouncedSearch &&
                searchProducts.length === 0 && (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm font-bold text-text-primary">
                      No products found
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Try searching with a different keyword.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Wishlist */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="
            relative
            flex
            h-11
            w-8
            items-center
            justify-center
            rounded-full
            text-text-primary
            transition-all
            duration-300
            hover:bg-primary
            hover:text-white
          "
        >
          <Heart className="h-5 w-5" />

          {wishlistCount > 0 && (
            <span
              className="
                absolute
                right-0
                top-0
                flex
                h-[17px]
                min-w-[17px]
                items-center
                justify-center
                rounded-full
                bg-primary
                px-1
                text-[9px]
                font-bold
                text-white
              "
            >
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}

        <Link
          href="/cart"
          aria-label="Cart"
          className="
            relative
            flex
            h-11
            w-8
            items-center
            justify-center
            rounded-full
            text-text-primary
            transition-all
            duration-300
            hover:bg-primary
            hover:text-white
          "
        >
          <ShoppingCart className="h-5 w-5" />

          {cartCount > 0 && (
            <span
              className="
                absolute
                right-0
                top-0
                flex
                h-[17px]
                min-w-[17px]
                items-center
                justify-center
                rounded-full
                bg-primary
                px-1
                text-[9px]
                font-bold
                text-white
              "
            >
              {cartCount}
            </span>
          )}
        </Link>

        {/* Account */}

        <Link
          href="/account"
          aria-label="Account"
          className="
            flex
            h-11
            w-8
            items-center
            justify-center
            rounded-full
            text-text-primary
            transition-all
            duration-300
            hover:bg-primary
            hover:text-white
          "
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </div>

    {/* =====================================================
        MOBILE SEARCH
    ===================================================== */}

    <div className="relative lg:hidden">
      <form
        onSubmit={handleSearch}
        className="
          flex
          h-11
          items-center
          overflow-hidden
          rounded-lg
          border
          border-border
          bg-surface-muted
          focus-within:border-primary
        "
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-text-muted" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search products..."
          className="
            h-full
            flex-1
            bg-transparent
            px-3
            text-sm
            text-text-primary
            outline-none
            placeholder:text-text-muted
          "
        />
      </form>

      {/* MOBILE SEARCH DROPDOWN */}

      {showSearchDropdown && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-[60]
            mt-2
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-background
            shadow-[0_18px_50px_rgba(0,0,0,0.12)]
          "
        >
          {/* Loading */}

          {isSearching && (
            <div className="px-4 py-4">
              <p className="text-sm text-text-muted">
                Searching products...
              </p>
            </div>
          )}

          {/* Products */}

          {!isSearching && searchProducts.length > 0 && (
            <div>
              <div className="border-b border-border px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                  Top Results
                </p>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {searchProducts.map((product) => (
                  <div
                    key={product.id}
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-border
                      px-4
                      py-3
                      last:border-b-0
                    "
                  >
                    <Link
                       href={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="
                        flex
                        min-w-0
                        flex-1
                        items-center
                        gap-3
                      "
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        <img
                          src={
                            product.featuredImage ||
                            product.image ||
                            "/images/placeholder.png"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p className="line-clamp-2 text-sm font-bold text-text-primary">
                        {product.name}
                      </p>
                    </Link>

                    <Link
                       href={`/product/${product.slug}`}
                      onClick={handleProductClick}
                      className="
                        shrink-0
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-primary
                      "
                    >
                      View more
                    </Link>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleViewMore}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border-t
                  border-border
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-text-primary
                  transition-colors
                  hover:text-primary
                "
              >
                View all results

                <ArrowUpRight className="h-4 w-4 text-primary" />
              </button>
            </div>
          )}

          {/* No Results */}

          {!isSearching &&
            debouncedSearch &&
            searchProducts.length === 0 && (
              <div className="px-4 py-5 text-center">
                <p className="text-sm font-bold text-text-primary">
                  No products found
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Try searching with a different keyword.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  </header>

  {/* =========================================================
      FULL SCREEN NAVIGATION
  ========================================================= */}

  {menuOpen && (
    <div className="fixed inset-0 z-[100]">

      {/* BACKDROP */}

      <button
        type="button"
        onClick={closeMenu}
        aria-label="Close menu"
        className="
          absolute
          inset-0
          bg-black/45
          backdrop-blur-xl
          animate-menu-fade
        "
      />

      {/* FULL SCREEN MENU */}

      <div
        className="
          absolute
          inset-0
          flex
          flex-col
          bg-white/90
          backdrop-blur-2xl
          animate-menu-scale
        "
      >
        {/* MENU HEADER */}

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
            className="
              group
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-text-primary
              text-white
              transition-all
              duration-300
              hover:bg-primary
              hover:rotate-90
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CENTER NAVIGATION */}

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
                className="
                  group
                  flex
                  w-full
                  max-w-[760px]
                  items-center
                  justify-center
                  gap-4
                  border-b
                  border-black/10
                  py-4
                  opacity-0
                  animate-menu-item
                  transition-all
                  duration-300
                  sm:py-5
                  lg:py-6
                "
              >
                <span
                  className="
                    text-center
                    text-4xl
                    font-black
                    uppercase
                    leading-none
                    tracking-[-0.04em]
                    text-text-primary
                    transition-all
                    duration-300
                    group-hover:text-primary
                    group-hover:translate-x-[-6px]
                    sm:text-5xl
                    lg:text-6xl
                  "
                >
                  {item.label}
                </span>

                <ArrowUpRight
                  className="
                    h-6
                    w-6
                    shrink-0
                    text-text-muted
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    group-hover:text-primary
                    group-hover:opacity-100
                    sm:h-7
                    sm:w-7
                  "
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* MENU FOOTER */}

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
