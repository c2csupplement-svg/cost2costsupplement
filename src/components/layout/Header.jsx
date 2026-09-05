"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ArrowUpRight,
  SearchIcon,
  Loader2,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getProductSearchApi } from "@/apiService/api";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Whyc2c", href: "/why-cost2cost" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
  { label: "User", href: "/account" },
];

function normalizeProducts(response) {
  const data = response?.data ?? response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data?.results)) {
    return data.data.results;
  }

  return [];
}

function getProductImage(product) {
  const image =
    product?.featuredImage ||
    product?.featuredimg ||
    product?.thumbnail ||
    product?.image ||
    product?.imageUrl ||
    product?.images?.[0];

  if (!image) {
    return PLACEHOLDER_IMAGE;
  }

  if (typeof image === "string") {
    const value = image.trim();

    if (!value) {
      return PLACEHOLDER_IMAGE;
    }

    const markdownMatch = value.match(
      /\((https?:\/\/[^)]+)\)/
    );

    return markdownMatch?.[1] || value;
  }

  if (typeof image === "object") {
    return (
      image?.url ||
      image?.src ||
      image?.image ||
      image?.imageUrl ||
      PLACEHOLDER_IMAGE
    );
  }

  return PLACEHOLDER_IMAGE;
}

function getProductPrice(product) {
  const price =
    product?.salePrice ??
    product?.discountedPrice ??
    product?.price ??
    product?.priceRange?.min ??
    0;

  const number = Number(price);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN").format(
    number
  );
}

function getProductSlug(product) {
  const slug =
    product?.slug ||
    product?.productSlug ||
    product?.seo?.slug ||
    "";

  return String(slug).trim();
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { cartCount, wishlistCount } = useShop();

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [
    debouncedSearchQuery,
    setDebouncedSearchQuery,
  ] = useState("");

  const [searchResults, setSearchResults] =
    useState([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname?.startsWith(href);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(
        searchQuery.trim()
      );
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const query =
      debouncedSearchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let active = true;

    const searchProducts = async () => {
      try {
        setSearchLoading(true);
        setSearchOpen(true);

        const response =
          await getProductSearchApi(query);

        if (!active) {
          return;
        }

        const products =
          normalizeProducts(response);

        const uniqueProducts =
          products.filter(
            (product, index, array) => {
              const productId =
                product?.id ??
                product?.productId ??
                product?._id ??
                product?.slug;

              return (
                array.findIndex((item) => {
                  const itemId =
                    item?.id ??
                    item?.productId ??
                    item?._id ??
                    item?.slug;

                  return (
                    String(itemId) ===
                    String(productId)
                  );
                }) === index
              );
            }
          );

        setSearchResults(
          uniqueProducts.slice(0, 8)
        );
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "Product search error:",
          error?.response?.data ||
            error?.message ||
            error
        );

        setSearchResults([]);
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    };

    searchProducts();

    return () => {
      active = false;
    };
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDesktop =
        desktopSearchRef.current?.contains(
          event.target
        );

      const clickedInsideMobile =
        mobileSearchRef.current?.contains(
          event.target
        );

      if (
        !clickedInsideDesktop &&
        !clickedInsideMobile
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setSearchOpen(true);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchQuery(value);
    setSearchOpen(Boolean(value.trim()));
  };

  const handleProductClick = (product) => {
    const slug = getProductSlug(product);

    if (!slug) {
      console.error(
        "Product slug is missing:",
        product
      );
      return;
    }

    setSearchOpen(false);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSearchResults([]);

    router.push(
      `/product/${encodeURIComponent(slug)}`
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    if (searchResults.length > 0) {
      handleProductClick(searchResults[0]);
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(
        query
      )}`
    );

    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 font-oxanium backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-[76px] items-center">
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
              <div
                ref={desktopSearchRef}
                className="relative hidden sm:block"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative"
                >
                  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    placeholder="Search products..."
                    className="h-10 w-[220px] rounded-full border border-border bg-white pl-10 pr-4 text-xs font-semibold text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:w-[280px] focus:border-primary"
                  />
                </form>

                {searchOpen && (
                  <SearchDropdown
                    results={searchResults}
                    loading={searchLoading}
                    query={searchQuery}
                    onProductClick={handleProductClick}
                  />
                )}
              </div>

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
                className="hidden h-11 w-8 items-center justify-center rounded-full text-text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:flex"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div
            ref={mobileSearchRef}
            className="relative pb-3 sm:hidden"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative"
            >
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search products..."
                className="h-11 w-full rounded-full border border-border bg-white pl-10 pr-4 text-xs font-semibold text-text-primary outline-none transition-colors focus:border-primary"
              />
            </form>

            {searchOpen && (
              <SearchDropdown
                results={searchResults}
                loading={searchLoading}
                query={searchQuery}
                onProductClick={handleProductClick}
                mobile
              />
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="absolute inset-0 animate-menu-fade bg-black/45 backdrop-blur-xl"
          />

          <div className="absolute inset-0 flex flex-col animate-menu-scale bg-white/90 backdrop-blur-2xl">
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
                    <span className="text-center text-4xl font-black uppercase leading-none tracking-[-0.04em] text-text-primary transition-all duration-300 group-hover:-translate-x-[6px] group-hover:text-primary sm:text-5xl lg:text-6xl">
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

function SearchDropdown({
  results,
  loading,
  query,
  onProductClick,
  mobile = false,
}) {
  return (
    <div
      className={`absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.15)] ${
        mobile ? "max-h-[70vh]" : "w-[360px]"
      }`}
    >
      {loading && (
        <div className="flex items-center justify-center gap-2 px-5 py-6 text-xs font-semibold text-[#737373]">
          <Loader2 className="h-4 w-4 animate-spin text-[#E52323]" />
          Searching products...
        </div>
      )}

      {!loading &&
        query.trim() &&
        results.length === 0 && (
          <div className="px-5 py-7 text-center">
            <SearchIcon className="mx-auto h-5 w-5 text-[#B5B5B5]" />

            <p className="mt-2 text-sm font-bold text-[#111111]">
              No products found
            </p>

            <p className="mt-1 text-[11px] text-[#737373]">
              Try another product name
            </p>
          </div>
        )}

      {!loading && results.length > 0 && (
        <div className="max-h-[440px] overflow-y-auto p-2">
          <div className="px-3 py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#737373]">
              Search Results
            </p>
          </div>

          {results.slice(0, 8).map((product, index) => {
            const slug = getProductSlug(product);
            const image = getProductImage(product);
            const price = getProductPrice(product);

            const productKey =
              product?.id ??
              product?.productId ??
              product?._id ??
              slug ??
              index;

            return (
              <button
                key={productKey}
                type="button"
                onClick={() =>
                  onProductClick(product)
                }
                disabled={!slug}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors duration-200 hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
                  <img
                    src={image}
                    alt={
                      product?.name ||
                      "Product"
                    }
                    className="h-full w-full object-contain p-1.5"
                    onError={(event) => {
                      if (
                        event.currentTarget.src.includes(
                          PLACEHOLDER_IMAGE
                        )
                      ) {
                        return;
                      }

                      event.currentTarget.src =
                        PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black uppercase text-[#111111]">
                    {product?.name ||
                      product?.title ||
                      "Product"}
                  </p>

                  {product?.brand?.name && (
                    <p className="mt-0.5 truncate text-[10px] text-[#737373]">
                      {product.brand.name}
                    </p>
                  )}

                  <p className="mt-1 text-xs font-black text-[#E52323]">
                    ₹{price}
                  </p>
                </div>

                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#A3A3A3]" />
              </button>
            );
          })}
        </div>
      )}

      {!loading && results.length > 0 && (
        <Link
          href={`/products?search=${encodeURIComponent(
            query.trim()
          )}`}
          onClick={() => {
            setTimeout(() => {
              window.dispatchEvent(
                new Event(
                  "close-product-search"
                )
              );
            }, 0);
          }}
          className="flex h-11 items-center justify-center border-t border-[#E5E5E5] text-[10px] font-black uppercase tracking-wide text-[#E52323] transition-colors hover:bg-[#F7F7F7]"
        >
          View All Search Results
        </Link>
      )}
    </div>
  );
}