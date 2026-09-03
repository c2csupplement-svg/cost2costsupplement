    "use client";

    import { useMemo , useState } from "react";
    import { useParams, useRouter } from "next/navigation";
    import Link from "next/link";
    import Image from "next/image";
    import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronDown,
    Heart,
    Minus,
    Plus,
    RotateCcw,
    Search,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
    X,
    ZoomIn,
    } from "lucide-react";

    import Header from "@/components/layout/Header";
    import Footer from "@/components/layout/Footer";
    import ProductSlider from "@/components/home/ProductSlider";
    import { useShop } from "@/context/ShopContext";
    import { products } from "@/data/products";
    import FAQSection from "@/components/products/FAQSection";
    import ProductDescription from "@/components/products/ProductDescription";
    import ProductReviews from "@/components/products/ProductReviews";
    import ProductQuestions from "@/components/products/ProductQuestions";

    import { Swiper, SwiperSlide } from "swiper/react";
    import "swiper/css";
    function formatPrice(price) {
    return new Intl.NumberFormat("en-IN").format(price);
    }
    const relatedProducts =[{
        id: 1,
        slug: "father-of-insane-v2",
        brand: "Promolecules",
        name: "Father of Insane V2 Pre Workout",
        price: 854,
        originalPrice: 999,
        rating: 4.8,
        reviews: 126,
        images: [
          "https://www.cost2costsupplement.com/storage/products-images/promolecules/foi-v2/watermelon.webp",
        ],
      },
      {
        id: 2,
        slug: "creatine-monohydrate",
        brand: "C2C Nutrition",
        name: "Creatine Monohydrate 100% Pure",
        price: 1199,
        originalPrice: 1499,
        rating: 4.7,
        reviews: 89,
        images: [
          "https://www.cost2costsupplement.com/storage/products-images/mf-labs/mf-labs-image-1.webp",
        ],
      },
      {
        id: 3,
        slug: "whey-protein",
        brand: "C2C Nutrition",
        name: "Premium Whey Protein",
        price: 2199,
        originalPrice: 2599,
        rating: 4.9,
        reviews: 214,
        images: [
          "https://www.cost2costsupplement.com/storage/products-images/nutrex/whey-protine-chocolate-64srv/nuterx-research-whey-protine-chocolate-64-srv.webp",
        ],
      },]
    export default function ProductPage() {
    const params = useParams();
    const router = useRouter();

    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
    } = useShop();

    const slug = params?.slug;

    const product = useMemo(
        () => products.find((item) => item.slug === slug),
        [slug]
    );

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedFlavour, setSelectedFlavour] = useState(
        product?.defaultFlavour || product?.flavours?.[0] || ""
    );
    const [quantity, setQuantity] = useState(1);


    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Ref to the main Swiper instance so thumbnails, arrows, and the
    // zoom modal can all drive the same gallery
    const [mainSwiper, setMainSwiper] = useState(null);

    if (!product) {
        return (
        <>
            <Header />

            <main className="min-h-[70vh] bg-[#FAFAFA] px-5 py-24 text-white">
            <div className="mx-auto max-w-3xl text-center">
                <p className="font-oxanium font-bold text-xs font-bold uppercase tracking-[0.3em] text-[#E52323]">
                Product not found
                </p>

                <h1 className="font-oxanium mt-4 text-4xl font-bold text-black uppercase tracking-tight">
                We couldn't find this product
                </h1>

                <p className="font-oxanium mt-4 text-[#737373]">
                The product you're looking for may have been removed or the URL
                may be incorrect.
                </p>

                <Link
                href="/shop"
                className="font-oxanium font-bold mt-8 inline-flex items-center gap-2 rounded-lg bg-[#E52323] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#ff2b2b]"
                >
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
                </Link>
            </div>
            </main>

            <Footer />
        </>
        );
    }

    const wishlistActive = isInWishlist(product.id);

    const discountPercentage =
        product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )
        : product.discount;

    const handleAddToCart = () => {
        addToCart(
        {
            ...product,
            selectedFlavour,
        },
        quantity
        );
    };

    const handleBuyNow = () => {
        addToCart(
        {
            ...product,
            selectedFlavour,
        },
        quantity
        );

        router.push("/cart");
    };

    const increaseQuantity = () => {
        setQuantity((current) => current + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    // These drive the Swiper instance directly; onSlideChange keeps
    // selectedImage in sync, which the thumbnails and zoom modal read.
      const nextImage = () => {
        if (!mainSwiper) return;

        mainSwiper.slideNext();
      };

      const previousImage = () => {
        if (!mainSwiper) return;

        mainSwiper.slidePrev();
      };

      const goToImage = (index) => {
        if (!mainSwiper) return;

        mainSwiper.slideToLoop(index);
      };

    return (
        <>
        <Header />

        <main className="font-oxanium font-semibold min-h-screen bg-[#FAFAFA] text-[#111111]">
            {/* Breadcrumb */}
            <div className="border-b border-[#E5E5E5]">
            <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
                <Link
                    href="/"
                    className="transition hover:text-[#E52323]"
                >
                    Home
                </Link>

                <span>/</span>

                <Link
                    href="/shop"
                    className="transition hover:text-[#E52323]"
                >
                    Products
                </Link>

                <span>/</span>

                <Link
                    href={`/shop?category=${product.category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                    className="transition hover:text-[#E52323]"
                >
                    {product.category}
                </Link>

                <span>/</span>

                <span className="max-w-[500px] truncate text-[#525252]">
                    {product.shortName}
                </span>
                </div>
            </div>
            </div>

            {/* Product Hero */}
            <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start lg:gap-14 xl:gap-20">
                {/* ================= IMAGE AREA ================= */}
                <div className="min-w-0 lg:sticky lg:top-24">
                <div className="flex gap-3 sm:gap-4">
                    {/* Thumbnails - left column */}
                    {product.images.length > 1 && (
                    <div className="hidden w-16 shrink-0 flex-col gap-3 sm:flex lg:w-20">
                        {product.images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => goToImage(index)}
                            className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${
                            selectedImage === index
                                ? "border-[#E52323] ring-1 ring-[#E52323]"
                                : "border-[#E5E5E5] hover:border-[#A3A3A3]"
                            }`}
                        >
                            <Image
                            src={image}
                            alt={`${product.shortName} thumbnail ${index + 1}`}
                            fill
                            className="object-contain p-2"
                            sizes="80px"
                            />
                        </button>
                        ))}
                    </div>
                    )}

                    {/* ================= MAIN IMAGE ================= */}
                    <div
                    className="
                        relative
                        w-full
                        min-w-0
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E5E5E5]
                        bg-white

                        aspect-[1/1]

                        sm:aspect-square
                    "
                    >
                    {/* Discount */}
                    {discountPercentage > 0 && (
                        <div className="absolute left-3 top-3 z-20 rounded-full bg-[#E52323] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white sm:left-5 sm:top-5 sm:px-4 sm:py-2 sm:text-xs">
                        -{discountPercentage}%
                        </div>
                    )}

                    {/* Zoom */}
                    <button
                        type="button"
                        onClick={() => setIsZoomOpen(true)}
                        className="
                        absolute
                        right-3
                        top-3
                        z-20
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D4D4D4]
                        bg-[#0b0b0b]/90
                        text-white
                        backdrop-blur
                        transition
                        hover:border-[#E52323]
                        hover:text-[#E52323]

                        sm:right-5
                        sm:top-5
                        sm:h-11
                        sm:w-11
                        "
                        aria-label="Zoom product image"
                    >
                        <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* ================= SWIPER ================= */}
                    <Swiper
                        onSwiper={(swiper) => {
                        setMainSwiper(swiper);
                        }}
                        onSlideChange={(swiper) => {
                        setSelectedImage(swiper.realIndex);
                        }}
                        loop={product.images.length > 1}
                        speed={320}
                        slidesPerView={1}
                        className="absolute inset-0 h-full w-full"
                    >
                        {product.images.map((image, index) => (
                        <SwiperSlide
                            key={`${image}-${index}`}
                            className="h-full w-full"
                        >
                            <div className="relative h-full w-full">
                            <Image
                                src={image}
                                alt={`${product.name} - ${index + 1}`}
                                fill
                                priority={index === 0}
                                loading={index === 0 ? "eager" : "lazy"}
                                className="
                                object-contain
                                p-4
                                sm:p-10
                                lg:p-16
                                "
                                sizes="
                                (max-width: 640px) calc(100vw - 40px),
                                (max-width: 1024px) calc(100vw - 64px),
                                55vw
                                "
                            />
                            </div>
                        </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* ================= IMAGE NAVIGATION ================= */}
                    {product.images.length > 1 && (
                        <>
                        <button
                            type="button"
                            onClick={previousImage}
                            className="
                            absolute
                            left-2
                            top-1/2
                            z-30
                            flex
                            h-9
                            w-9
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#D4D4D4]
                            bg-white/90
                            text-black
                            shadow-md
                            transition
                            hover:border-[#E52323]
                            hover:bg-[#E52323]
                            hover:text-white

                            sm:left-4
                            sm:h-10
                            sm:w-10
                            "
                            aria-label="Previous image"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={nextImage}
                            className="
                            absolute
                            right-2
                            top-1/2
                            z-30
                            flex
                            h-9
                            w-9
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#D4D4D4]
                            bg-white/90
                            text-black
                            shadow-md
                            transition
                            hover:border-[#E52323]
                            hover:bg-[#E52323]
                            hover:text-white

                            sm:right-4
                            sm:h-10
                            sm:w-10
                            "
                            aria-label="Next image"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        </>
                    )}
                    </div>
                </div>

                {/* ================= MOBILE THUMBNAILS ================= */}
                {product.images.length > 1 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-1 sm:hidden">
                    {product.images.map((image, index) => (
                        <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => goToImage(index)}
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                            selectedImage === index
                            ? "border-[#E52323] ring-1 ring-[#E52323]"
                            : "border-[#E5E5E5]"
                        }`}
                        >
                        <Image
                            src={image}
                            alt={`${product.shortName} thumbnail ${index + 1}`}
                            fill
                            className="object-contain p-1.5"
                            sizes="56px"
                        />
                        </button>
                    ))}
                    </div>
                )}

                {/* Trust strip */}
                <div className="mt-5 grid grid-cols-3 divide-x divide-[#252525] rounded-xl border border-[#E5E5E5] bg-white">
                    <div className="flex flex-col items-center gap-2 px-2 py-4 text-center">
                    <ShieldCheck className="h-5 w-5 text-[#E52323]" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#525252]">
                        Genuine
                    </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 px-2 py-4 text-center">
                    <Truck className="h-5 w-5 text-[#E52323]" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#525252]">
                        Fast Delivery
                    </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 px-2 py-4 text-center">
                    <RotateCcw className="h-5 w-5 text-[#E52323]" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#525252]">
                        Easy Support
                    </span>
                    </div>
                </div>
                </div>

                {/* ================= PRODUCT INFO ================= */}
                <div>
                {/* Brand */}
                <Link
                    href={`/shop?brand=${product.brand.toLowerCase()}`}
                    className="text-xs font-bold uppercase tracking-[0.25em] text-[#E52323] transition hover:text-[#ff4545]"
                >
                    {product.brand}
                </Link>

                {/* Title */}
                <h1 className="mt-3 text-3xl font-bebas leading-[1.05] tracking-tight sm:text-4xl xl:text-[46px]">
                    {product.name}
                </h1>

                {/* Rating */}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                        key={index}
                        className={`h-4 w-4 ${
                            index < Math.round(product.rating)
                            ? "fill-[#F7B84B] text-[#F7B84B]"
                            : "text-[#A3A3A3]"
                        }`}
                        />
                    ))}
                    </div>

                    <span className="text-sm font-semibold text-[#F7B84B]">
                    {product.rating}
                    </span>

                    <span className="text-sm text-[#737373]">
                    ({product.reviewCount} reviews)
                    </span>
                </div>

                <div className="my-7 h-px bg-[#252525]" />

                {/* Price */}
                <div className="flex flex-wrap items-end gap-4">
                    <span className="text-4xl font-black tracking-tight sm:text-5xl">
                    ₹{formatPrice(product.price)}
                    </span>

                    {product.originalPrice > product.price && (
                    <span className="pb-1 text-xl text-[#737373] line-through">
                        ₹{formatPrice(product.originalPrice)}
                    </span>
                    )}

                    {discountPercentage > 0 && (
                    <span className="rounded-md bg-[#E52323]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#E52323]">
                        Save {discountPercentage}%
                    </span>
                    )}
                </div>

                <p className="mt-2 text-xs text-[#737373]">
                    Inclusive of all applicable taxes
                </p>

                {/* Short description */}
                <div className="mt-8 space-y-4 text-[15px] leading-7 text-[#525252]">
                    {product.description.slice(0, 2).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>

                {/* Flavour */}
                {product.flavours?.length > 0 && (
                    <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold uppercase tracking-wide">
                        Flavour
                        </p>

                        <span className="text-xs text-primary">
                        Selected:{" "}
                        <span className="text-black">
                            {selectedFlavour}
                        </span>
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {product.flavours.map((flavour) => {
                        const selected = selectedFlavour === flavour;

                        return (
                            <button
                            key={flavour}
                            type="button"
                            onClick={() => setSelectedFlavour(flavour)}
                            className={`rounded-lg border px-4 py-2.5 text-xs font-semibold transition ${
                                selected
                                ? "border-[#E52323] bg-[#E52323] text-white"
                                : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#777777] hover:text-[#E52323]"
                            }`}
                            >
                            {flavour}
                            </button>
                        );
                        })}
                    </div>
                    </div>
                )}

                {/* Availability */}
                <div className="mt-7 flex items-center gap-2 text-sm">
                    <span className="text-[#737373]">Availability:</span>

                    {product.inStock ? (
                    <>
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-semibold text-green-500">
                        In stock
                        </span>
                    </>
                    ) : (
                    <>
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="font-semibold text-red-500">
                        Out of stock
                        </span>
                    </>
                    )}
                </div>

                {/* Quantity + buttons */}
                {/* Main Container */}
        <div className="mt-6 flex flex-col gap-3">
            
            {/* Row 1: Quantity Selector + Wishlist, 2 columns side by side on every screen size */}
            <div className="grid grid-cols-2 gap-3">
            <div className="flex h-14 w-full items-center justify-between rounded-lg border border-[#D4D4D4] bg-white">
                <button
                type="button"
                onClick={decreaseQuantity}
                className="flex h-full w-11 items-center justify-center text-[#525252] transition hover:text-[#E52323]"
                aria-label="Decrease quantity"
                >
                <Minus className="h-4 w-4" />
                </button>

                <span className="text-sm font-bold">{quantity}</span>

                <button
                type="button"
                onClick={increaseQuantity}
                className="flex h-full w-11 items-center justify-center text-[#525252] transition hover:text-[#E52323]"
                aria-label="Increase quantity"
                >
                <Plus className="h-4 w-4" />
                </button>
            </div>

            <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-lg border text-sm font-bold transition ${
                wishlistActive
                    ? "border-[#E52323] bg-[#E52323]/10 text-[#E52323]"
                    : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323] hover:text-[#E52323]"
                }`}
            >
                <Heart className={`h-5 w-5 ${wishlistActive ? "fill-current" : ""}`} />
                <span className="hidden sm:inline">
                {wishlistActive ? "Remove Wishlist" : "Add to Wishlist"}
                </span>
            </button>
            </div>

            {/* Row 2: Action Buttons Container. Stacks on tiny screens, goes side-by-side on desktop */}
            <div className="flex flex-col gap-3 sm:flex-row w-full">
            <button
                type="button"
                disabled={!product.inStock}
                onClick={handleAddToCart}
            
                className="flex h-14 w-full sm:flex-1 items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
            </button>

            <button
                type="button"
                disabled={!product.inStock}
                onClick={handleBuyNow}
            
                className="flex h-14 w-full sm:flex-1 items-center justify-center rounded-lg border border-[#111111] bg-[#111111] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-transparent hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
            >
                Buy Now
            </button>
            </div>
            
        </div>

                {/* Product information */}
                <div className="mt-8 border-t border-[#E5E5E5] pt-6">
                    <div className="grid gap-3 text-sm">
                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-[#737373]">
                        SKU
                        </span>

                        <span className="text-[#525252]">
                        {product.sku}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-[#737373]">
                        Category
                        </span>

                        <Link
                        href={`/shop?category=${product.category
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        className="text-[#525252] transition hover:text-[#E52323]"
                        >
                        {product.category}
                        </Link>
                    </div>

                    <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-[#737373]">
                        Brand
                        </span>

                        <span className="text-[#525252]">
                        {product.brand}
                        </span>
                    </div>
                    </div>
                </div>

                {/* Payment reassurance */}
                <div className="mt-7 rounded-xl border border-[#E5E5E5] bg-white p-5">
                    <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E52323]" />

                    <div>
                        <p className="text-sm font-bold">
                        Shop with confidence
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#737373]">
                        100% genuine products, secure payments and reliable
                        delivery from Cost2Cost Supplement.
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            
            {/* ================= PRODUCT DETAILS ================= */}

            <section className="border-y border-[#E5E5E5] bg-[#F5F5F5]">
                <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
                    
                    <ProductDescription product={product} />

                    <ProductReviews product={product} />

                    <FAQSection faqs={product.faqs} />

                    <ProductQuestions product={product} />

                </div>
            </section>

            {/* ================= RELATED PRODUCTS ================= */}
        <ProductSlider {...{eyebrow:"Related Products",title:"Related Products",description:"products you may also like",products:relatedProducts}}/>

        </main>

        <Footer />

        {/* ================= IMAGE ZOOM ================= */}
        {isZoomOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5">
            <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4D4D4] bg-white text-white transition hover:border-[#E52323] hover:text-[#E52323]"
                aria-label="Close image viewer"
            >
                <X className="h-5 w-5" />
            </button>

            <button
                type="button"
                onClick={previousImage}
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4D4D4] bg-white text-black transition hover:border-[#E52323] hover:bg-[#E52323]"
                aria-label="Previous image"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative h-[80vh] w-[90vw] max-w-5xl">
                <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="90vw"
                />
            </div>

            <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4D4D4] bg-white text-black transition hover:border-[#E52323] hover:bg-[#E52323]"
                aria-label="Next image"
            >
                <ArrowRight className="h-5 w-5" />
            </button>
            </div>
        )}
        </>
    );
    }

    // function SectionHeading({ children }) {
    // return (
    //     <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
    //     {children}
    //     </h2>
    // );
    // }
    // function AccordionItem({
    // title,
    // isOpen,
    // onClick,
    // children,
    // }) {
    // return (
    //     <div className="border-b border-[#E5E5E5] last:border-b-0">
    //     <button
    //         type="button"
    //         onClick={onClick}
    //         className="
    //         flex
    //         w-full
    //         items-center
    //         justify-between
    //         gap-6
    //         px-5
    //         py-5
    //         text-left
    //         transition
    //         hover:bg-[#FAFAFA]
    //         sm:px-7
    //         "
    //     >
    //         <span className="text-sm font-black uppercase tracking-wide text-[#111111] sm:text-base">
    //         {title}
    //         </span>

    //         <ChevronDown
    //         className={`h-5 w-5 shrink-0 text-[#E52323] transition-transform duration-300 ${
    //             isOpen ? "rotate-180" : ""
    //         }`}
    //         />
    //     </button>

    //     <div
    //         className={`
    //         grid
    //         transition-all
    //         duration-300
    //         ease-in-out
    //         ${
    //             isOpen
    //             ? "grid-rows-[1fr] opacity-100"
    //             : "grid-rows-[0fr] opacity-0"
    //         }
    //         `}
    //     >
    //         <div className="overflow-hidden">
    //         <div className="px-5 pb-6 sm:px-7 sm:pb-7">
    //             {children}
    //         </div>
    //         </div>
    //     </div>
    //     </div>
    // );
    // }
    // function RelatedProducts({ currentProduct, products }) {
    // const related = products.filter(
    //     (item) => item.id !== currentProduct.id
    // );

    // return (
    //     <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
    //     <div className="flex items-end justify-between gap-5">
    //         <div>
    //         <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E52323]">
    //             You may also like
    //         </p>

    //         <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">
    //             Related Products
    //         </h2>
    //         </div>

    //         <Link
    //         href="/shop"
    //         className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#737373] transition hover:text-[#E52323] sm:flex"
    //         >
    //         View All
    //         <ArrowRight className="h-4 w-4" />
    //         </Link>
    //     </div>

    //     <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    //         {related.map((item) => (
    //         <Link
    //             key={item.id}
    //             href={`/product/${item.slug}`}
    //             className="group overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white transition hover:-translate-y-1 hover:border-[#A3A3A3]"
    //         >
    //             <div className="relative aspect-square bg-[#F7F7F7]">
    //             <Image
    //                 src={item.images[0]}
    //                 alt={item.name}
    //                 fill
    //                 className="object-contain p-8 transition duration-500 group-hover:scale-105"
    //                 sizes="300px"
    //             />
    //             </div>

    //             <div className="p-5">
    //             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E52323]">
    //                 {item.brand}
    //             </p>

    //             <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5">
    //                 {item.name}
    //             </h3>

    //             <div className="mt-4 flex items-center gap-3">
    //                 <span className="font-black">
    //                 ₹{formatPrice(item.price)}
    //                 </span>

    //                 {item.originalPrice > item.price && (
    //                 <span className="text-xs text-[#A3A3A3] line-through">
    //                     ₹{formatPrice(item.originalPrice)}
    //                 </span>
    //                 )}
    //             </div>
    //             </div>
    //         </Link>
    //         ))}
    //     </div>
    //     </section>
    // );
    // }