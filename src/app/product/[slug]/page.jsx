"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import ProductSlider from "@/components/home/ProductSlider";

import { getProductBySlug } from "@/redux/features/product/productApi";
import { getProduct } from "@/redux/features/product/productAction";
import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";
import { addToCart } from "@/redux/features/cart/cartActions";
import {  toggleItem } from "@/redux/features/wish/wishAction";

import FAQSection from "@/components/products/FAQSection";
import ProductDescription from "@/components/products/ProductDescription";
import ProductReviews from "@/components/products/ProductReviews";
import ProductQuestions from "@/components/products/ProductQuestions";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

function formatPrice(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN").format(number);
}

function createSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getImageUrl(image) {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    const value = image.trim();
    return value || null;
  }

  if (typeof image === "object") {
    const value =
      image?.url ||
      image?.src ||
      image?.image ||
      image?.imageUrl ||
      image?.path ||
      image?.featuredimg ||
      image?.featuredImage;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getProductImages(product, variant) {
  const source = [
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.featuredimg,
    product?.featuredImage,
    product?.thumbnail,
    product?.image,
    product?.imageUrl,
    variant?.image,
    variant?.imageUrl,
  ];

  const images = source
    .map(getImageUrl)
    .filter(Boolean);

  const uniqueImages = [...new Set(images)];

  return uniqueImages.length
    ? uniqueImages
    : [PLACEHOLDER_IMAGE];
}

function normalizeProductResponse(response) {
  if (!response) {
    return null;
  }

  if (response?.product) {
    return response.product;
  }

  if (response?.data?.product) {
    return response.data.product;
  }

  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    return response.data;
  }

  return response;
}

function normalizeProductList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.products)) {
    return value.products;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.data?.products)) {
    return value.data.products;
  }

  return [];
}

function normalizeBrands(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.brands)) {
    return value.brands;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.data?.brands)) {
    return value.data.brands;
  }

  return [];
}

function getWishlistItems(wishState) {
  const source =
    wishState?.wishItems?.wishlist ??
    wishState?.wishItems?.items ??
    wishState?.wishItems?.products ??
    wishState?.wishlist ??
    [];

  return Array.isArray(source) ? source : [];
}

function getWishlistProductId(item) {
  return (
    item?.productId ??
    item?.product?.id ??
    item?.product?._id ??
    item?.id ??
    item?._id
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  const productState = useSelector(
    (state) => state.products
  );

  const productAdState = useSelector(
    (state) => state.productAd
  );

  const wishState = useSelector(
    (state) => state.wish
  );

  const [apiProduct, setApiProduct] = useState(null);
  const [isProductLoading, setIsProductLoading] =
    useState(true);
  const [isProductError, setIsProductError] =
    useState(false);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedFlavour, setSelectedFlavour] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [isZoomOpen, setIsZoomOpen] =
    useState(false);

  const [mainSwiper, setMainSwiper] =
    useState(null);

  const [isAddingToCart, setIsAddingToCart] =
    useState(false);

  const brands = useMemo(() => {
    return normalizeBrands(
      productAdState?.brands
    );
  }, [productAdState?.brands]);

  const brandsById = useMemo(() => {
    const map = {};

    brands.forEach((brand) => {
      const id =
        brand?.id ??
        brand?.brandId ??
        brand?._id;

      if (id !== undefined && id !== null) {
        map[String(id)] =
          brand?.name ??
          brand?.title ??
          brand?.brandName ??
          "";
      }
    });

    return map;
  }, [brands]);

  const productList = useMemo(() => {
    return normalizeProductList(
      productState?.productList ??
        productState?.products ??
        productState?.data
    );
  }, [
    productState?.productList,
    productState?.products,
    productState?.data,
  ]);

  const productSummary = useMemo(() => {
    if (!slug) {
      return null;
    }

    return (
      productList.find(
        (item) => item?.slug === slug
      ) || null
    );
  }, [productList, slug]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let active = true;

    const loadProduct = async () => {
      try {
        setIsProductLoading(true);
        setIsProductError(false);

        const response =
          await getProductBySlug(slug);

        if (!active) {
          return;
        }

        const data =
          normalizeProductResponse(response);

        setApiProduct(data);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "Product detail error:",
          error
        );

        setApiProduct(null);
        setIsProductError(true);
      } finally {
        if (active) {
          setIsProductLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (
      !productState?.loaded &&
      !productState?.loading
    ) {
      dispatch(getProduct(1, 20));
    }
  }, [
    dispatch,
    productState?.loaded,
    productState?.loading,
  ]);

  useEffect(() => {
    if (
      !productAdState?.loaded &&
      !productAdState?.loading
    ) {
      dispatch(getAllProductAds());
    }
  }, [
    dispatch,
    productAdState?.loaded,
    productAdState?.loading,
  ]);

  // useEffect(() => {
  //   if (!wishState?.wishItems && !wishState?.loading) {
  //     dispatch(getWishItem());
  //   }
  // }, [
  //   dispatch,
  //   wishState?.wishItems,
  //   wishState?.loading,
  // ]);

  const variants = useMemo(() => {
    return Array.isArray(apiProduct?.variants)
      ? apiProduct.variants
      : [];
  }, [apiProduct]);

  const flavours = useMemo(() => {
    return [
      ...new Set(
        variants
          .map(
            (variant) =>
              variant?.flavour ??
              variant?.flavor
          )
          .filter(Boolean)
      ),
    ];
  }, [variants]);

  const sizes = useMemo(() => {
    return [
      ...new Set(
        variants
          .filter((variant) => {
            const flavour =
              variant?.flavour ??
              variant?.flavor;

            return (
              !selectedFlavour ||
              flavour === selectedFlavour
            );
          })
          .map((variant) => variant?.size)
          .filter(Boolean)
      ),
    ];
  }, [
    variants,
    selectedFlavour,
  ]);

  useEffect(() => {
    if (
      flavours.length > 0 &&
      !flavours.includes(selectedFlavour)
    ) {
      setSelectedFlavour(flavours[0]);
    }

    if (flavours.length === 0) {
      setSelectedFlavour("");
    }
  }, [
    flavours,
    selectedFlavour,
  ]);

  useEffect(() => {
    if (
      sizes.length > 0 &&
      !sizes.includes(selectedSize)
    ) {
      setSelectedSize(sizes[0]);
    }

    if (sizes.length === 0) {
      setSelectedSize("");
    }
  }, [
    sizes,
    selectedSize,
  ]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    return (
      variants.find((variant) => {
        const flavour =
          variant?.flavour ??
          variant?.flavor;

        const flavourMatches =
          !selectedFlavour ||
          flavour === selectedFlavour;

        const sizeMatches =
          !selectedSize ||
          variant?.size === selectedSize;

        return (
          flavourMatches &&
          sizeMatches
        );
      }) || variants[0]
    );
  }, [
    variants,
    selectedFlavour,
    selectedSize,
  ]);

  const product = useMemo(() => {
    if (!apiProduct) {
      return null;
    }

    const variantPrice =
      selectedVariant?.price;

    const discountedPrice =
      selectedVariant?.discountedPrice;

    const topLevelPrice =
      apiProduct?.price ??
      apiProduct?.salePrice ??
      apiProduct?.discountedPrice ??
      0;

    const priceValue =
      discountedPrice !== undefined &&
      discountedPrice !== null
        ? discountedPrice
        : variantPrice !== undefined &&
          variantPrice !== null
        ? variantPrice
        : topLevelPrice;

    const originalValue =
      discountedPrice !== undefined &&
      discountedPrice !== null &&
      variantPrice !== undefined &&
      variantPrice !== null &&
      Number(variantPrice) >
        Number(discountedPrice)
        ? variantPrice
        : apiProduct?.originalPrice ??
          apiProduct?.mrp ??
          null;

    const stockQuantity =
      selectedVariant?.stockQuantity ??
      selectedVariant?.stock ??
      apiProduct?.stockQuantity ??
      apiProduct?.stock ??
      0;

    const reviewCount =
      apiProduct?._count?.reviews ??
      apiProduct?.reviewCount ??
      (Array.isArray(apiProduct?.reviews)
        ? apiProduct.reviews.length
        : 0);

    const rating =
      apiProduct?.rating ??
      apiProduct?.averageRating ??
      apiProduct?.average_rating ??
      0;

    const images =
      getProductImages(
        apiProduct,
        selectedVariant
      );

    const brandName =
      apiProduct?.brand?.name ||
      brandsById[
        String(apiProduct?.brandId)
      ] ||
      apiProduct?.brandName ||
      "Cost2Cost";

    const categoryName =
      apiProduct?.category?.name ||
      apiProduct?.categoryName ||
      (typeof apiProduct?.category ===
      "string"
        ? apiProduct.category
        : "Uncategorized");

    return {
      ...apiProduct,
      brand: brandName,
      category: categoryName,
      images,
      price:
        Number(priceValue) || 0,
      originalPrice:
        originalValue !== null &&
        originalValue !== undefined
          ? Number(originalValue) || 0
          : 0,
      rating:
        Number(rating) || 0,
      reviewCount,
      flavours,
      inStock:
        Number(stockQuantity) > 0,
      stockQuantity:
        Number(stockQuantity) || 0,
      selectedVariant,
    };
  }, [
    apiProduct,
    selectedVariant,
    flavours,
    brandsById,
  ]);

  const wishlistItems = useMemo(
    () => getWishlistItems(wishState),
    [wishState]
  );

  const wishlistActive = useMemo(() => {
    if (!product?.id) {
      return false;
    }

    return wishlistItems.some((item) => {
      const wishlistProductId =
        getWishlistProductId(item);

      return (
        String(wishlistProductId) ===
        String(product.id)
      );
    });
  }, [
    wishlistItems,
    product?.id,
  ]);

  const relatedProducts = useMemo(() => {
    const sources = [
      apiProduct?.relatedProducts,
      apiProduct?.related_products,
      apiProduct?.related,
      productState?.relatedProducts,
    ];

    for (const source of sources) {
      const normalized =
        normalizeProductList(source);

      if (normalized.length) {
        return normalized;
      }
    }

    return [];
  }, [
    apiProduct,
    productState?.relatedProducts,
  ]);

  useEffect(() => {
    setSelectedImage(0);
  }, [
    apiProduct?.id,
    selectedVariant?.id,
  ]);

  useEffect(() => {
    setQuantity(1);
  }, [
    selectedVariant?.id,
  ]);

  useEffect(() => {
    if (!isZoomOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomOpen]);

  const discount = useMemo(() => {
    if (
      product?.originalPrice > 0 &&
      product?.price <
        product.originalPrice
    ) {
      return Math.round(
        ((product.originalPrice -
          product.price) /
          product.originalPrice) *
          100
      );
    }

    return (
      Number(product?.discount) || 0
    );
  }, [
    product?.price,
    product?.originalPrice,
    product?.discount,
  ]);

const handleAddToCart = async () => {
  if (!product || !product.inStock) {
    return;
  }

  if (!product.id || !selectedVariant?.id) {
    console.error("Product ID or Variant ID is missing");
    return;
  }

  try {
    setIsAddingToCart(true);
    

    await dispatch(
      addToCart({
        product: product.id,
        variantId: selectedVariant.id,
        quantity: quantity || 1,
      })
    );
  } catch (error) {
    console.error("Add to cart:", error);
  } finally {
    setIsAddingToCart(false);
  }
};

const handleBuyNow = async () => {
  if (!product || !product.inStock) {
    return;
  }

  if (!product.id || !selectedVariant?.id) {
    console.error("Product ID or Variant ID is missing");
    return;
  }

  try {
    setIsAddingToCart(true);

    await dispatch(
      addToCart({
        product: product.id,
        variantId: selectedVariant.id,
        quantity: quantity || 1,
      })
    );

    router.push("/cart");
  } catch (error) {
    console.error("Buy now:", error);
  } finally {
    setIsAddingToCart(false);
  }
};


  const handleWishlist = async () => {
    if (!product?.id) {
      return;
    }

    try {
      await dispatch(
        toggleItem(
          product.id,
          selectedVariant?.id ?? null,
          selectedFlavour || null,
          selectedSize || null
        )
      );
    } catch (error) {
      console.error(
        "Toggle wishlist:",
        error
      );
    }
  };

  const increaseQuantity = () => {
    const stock =
      Number(
        selectedVariant?.stockQuantity ??
          selectedVariant?.stock ??
          product?.stockQuantity ??
          0
      ) || 0;

    setQuantity((current) => {
      if (stock > 0) {
        return Math.min(
          current + 1,
          stock
        );
      }

      return current + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const nextImage = () => {
    if (!mainSwiper) {
      return;
    }

    mainSwiper.slideNext();
  };

  const previousImage = () => {
    if (!mainSwiper) {
      return;
    }

    mainSwiper.slidePrev();
  };

  const goToImage = (index) => {
    if (!mainSwiper) {
      return;
    }

    if (product?.images?.length > 1) {
      mainSwiper.slideToLoop(index);
    } else {
      mainSwiper.slideTo(index);
    }
  };

  const selectedZoomImage =
    product?.images?.[selectedImage] ||
    product?.images?.[0] ||
    PLACEHOLDER_IMAGE;

  if (isProductLoading) {
    return (
      <>

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E5E5E5] border-t-[#E52323]" />
            <p className="mt-4 font-oxanium text-sm font-semibold text-[#525252]">
              Loading product...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (isProductError || !product) {
    return (
      <>

        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA] px-5 py-20">
          <div className="w-full max-w-xl text-center">
            <p className="font-oxanium text-xs font-bold uppercase tracking-[0.3em] text-[#E52323]">
              Product not found
            </p>

            <h1 className="mt-4 font-oxanium text-3xl font-black uppercase tracking-tight text-[#111111] sm:text-5xl">
              We couldn't find this product
            </h1>

            <p className="mt-4 font-oxanium text-sm leading-6 text-[#737373]">
              The product may have been removed
              or the URL may be incorrect.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 font-oxanium text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#c91d1d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </main>

      </>
    );
  }

  const categorySlug = createSlug(
    product.category
  );

  return (
    <>
      <main className="min-h-screen bg-[#FAFAFA] font-oxanium font-semibold text-[#111111]">
        <div className="border-b border-[#E5E5E5] bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373]">
              <Link
                href="/"
                className="transition hover:text-[#E52323]"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                href="/products"
                className="transition hover:text-[#E52323]"
              >
                Products
              </Link>

              <span>/</span>

              <Link
                href={`/product-categories/${categorySlug}`}
                className="transition hover:text-[#E52323]"
              >
                {product.category}
              </Link>

              <span>/</span>

              <span className="max-w-[280px] truncate text-[#525252] sm:max-w-[500px]">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        <section>
          <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 scrollbar-hide">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 scrollbar-hide">
              <div className="min-w-0 scrollbar-hide">
                <div className="grid gap-4 md:grid-cols-[90px_minmax(0,1fr)] scrollbar-hide">
                  <div className="order-2 flex gap-3 overflow-x-auto pb-1 md:order-1 md:max-h-[600px] md:flex-col md:overflow-y-auto md:overflow-x-hidden scrollbar-hide">
                    {product.images.map(
                      (image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() =>
                            goToImage(index)
                          }
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white transition sm:h-24 sm:w-24 ${
                            selectedImage ===
                            index
                              ? "border-[#E52323] ring-2 ring-[#E52323]/20"
                              : "border-[#E5E5E5] hover:border-[#111111]"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            sizes="96px"
                            className="object-contain p-2 "
                            onError={(
                              event
                            ) => {
                              if (
                                !event.currentTarget.src.includes(
                                  PLACEHOLDER_IMAGE
                                )
                              ) {
                                event.currentTarget.src =
                                  PLACEHOLDER_IMAGE;
                              }
                            }}
                          />
                        </button>
                      )
                    )}
                  </div>

                  <div className="order-1 min-w-0 md:order-2">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
                      {discount > 0 && (
                        <div className="absolute left-0 top-0 z-20 rounded-br-xl bg-[#E52323] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white">
                          -{discount}%
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setIsZoomOpen(true)
                        }
                        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-sm backdrop-blur transition hover:border-[#E52323] hover:text-[#E52323]"
                        aria-label="Zoom product image"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </button>

                      <Swiper
                        loop={
                          product.images.length >
                          1
                        }
                        onSwiper={setMainSwiper}
                        onSlideChange={(
                          swiper
                        ) =>
                          setSelectedImage(
                            swiper.realIndex
                          )
                        }
                        className="h-full w-full"
                      >
                        {product.images.map(
                          (image, index) => (
                            <SwiperSlide
                              key={`${image}-${index}`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setIsZoomOpen(
                                    true
                                  )
                                }
                                className="relative h-full w-full"
                              >
                                <Image
                                  src={image}
                                  alt={
                                    product.name
                                  }
                                  fill
                                  priority={
                                    index === 0
                                  }
                                  sizes="(max-width: 740px) 100vw, 55vw"
                                  className="object-contain p-5 sm:p-8 lg:p-12"
                                  onError={(
                                    event
                                  ) => {
                                    if (
                                      !event.currentTarget.src.includes(
                                        PLACEHOLDER_IMAGE
                                      )
                                    ) {
                                      event.currentTarget.src =
                                        PLACEHOLDER_IMAGE;
                                    }
                                  }}
                                />
                              </button>
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>

                      {product.images.length >
                        1 && (
                        <>
                          <button
                            type="button"
                            onClick={
                              previousImage
                            }
                            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E5] bg-white/90 shadow-sm transition hover:border-[#E52323] hover:text-[#E52323]"
                            aria-label="Previous image"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={
                              nextImage
                            }
                            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E5E5] bg-white/90 shadow-sm transition hover:border-[#E52323] hover:text-[#E52323]"
                            aria-label="Next image"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#111111] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    {product.brand}
                  </span>

                  {product.status && (
                    <span className="rounded-full bg-[#E52323]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E52323]">
                      {product.status}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 font-semibold text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                {product.title &&
                  product.title !==
                    product.name && (
                    <p className="mt-2 text-sm leading-6 text-[#737373]">
                      {product.title}
                    </p>
                  )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index <
                            Math.round(
                              product.rating
                            )
                              ? "fill-[#F7B84B] text-[#F7B84B]"
                              : "text-[#D4D4D4]"
                          }`}
                        />
                      )
                    )}
                  </div>

                  <span className="text-sm font-bold">
                    {product.rating.toFixed(1)}
                  </span>

                  <span className="text-xs text-[#737373]">
                    ({product.reviewCount}{" "}
                    reviews)
                  </span>
                </div>

                <div className="mt-7 border-y border-[#E5E5E5] py-6">
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-3xl font-black tracking-tight sm:text-4xl">
                      ₹
                      {formatPrice(
                        product.price
                      )}
                    </span>

                    {product.originalPrice >
                      product.price && (
                      <span className="mb-1 text-base text-[#737373] line-through">
                        ₹
                        {formatPrice(
                          product.originalPrice
                        )}
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="mb-1 rounded-md bg-[#E52323]/10 px-2 py-1 text-xs font-black text-[#E52323]">
                        Save {discount}%
                      </span>
                    )}
                  </div>
                </div>

                {flavours.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-black uppercase tracking-wide">
                        Flavour
                      </p>

                      <span className="text-xs text-[#737373]">
                        {selectedFlavour ||
                          "Select flavour"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {flavours.map(
                        (flavour) => (
                          <button
                            key={flavour}
                            type="button"
                            onClick={() => {
                              setSelectedFlavour(
                                flavour
                              );
                              setSelectedSize(
                                ""
                              );
                            }}
                            className={`rounded-lg border px-4 py-2.5 text-xs font-bold transition ${
                              selectedFlavour ===
                              flavour
                                ? "border-[#E52323] bg-[#E52323] text-white"
                                : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323]"
                            }`}
                          >
                            {flavour}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-black uppercase tracking-wide">
                        Size
                      </p>

                      <span className="text-xs text-[#737373]">
                        {selectedSize ||
                          "Select size"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sizes.map(
                        (size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              setSelectedSize(
                                size
                              )
                            }
                            className={`rounded-lg border px-4 py-2.5 text-xs font-bold transition ${
                              selectedSize ===
                              size
                                ? "border-[#E52323] bg-[#E52323] text-white"
                                : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323]"
                            }`}
                          >
                            {size}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-7">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex h-14 w-full items-center justify-between rounded-lg border border-[#D4D4D4] bg-white sm:w-36">
                      <button
                        type="button"
                        onClick={
                          decreaseQuantity
                        }
                        disabled={
                          quantity <= 1
                        }
                        className="flex h-full w-12 items-center justify-center text-[#525252] transition hover:text-[#E52323] disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="text-sm font-black">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={
                          increaseQuantity
                        }
                        disabled={
                          product.stockQuantity >
                            0 &&
                          quantity >=
                            product.stockQuantity
                        }
                        className="flex h-full w-12 items-center justify-center text-[#525252] transition hover:text-[#E52323] disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleWishlist
                      }
                      className={`flex h-14 w-full items-center justify-center gap-2 rounded-lg border text-sm font-bold transition sm:flex-1 ${
                        wishlistActive
                          ? "border-[#E52323] bg-[#E52323]/10 text-[#E52323]"
                          : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323] hover:text-[#E52323]"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          wishlistActive
                            ? "fill-current"
                            : ""
                        }`}
                      />

                      <span>
                        {wishlistActive
                          ? "Remove Wishlist"
                          : "Add to Wishlist"}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={
                        !product.inStock ||
                        isAddingToCart
                      }
                      onClick={
                        handleAddToCart
                      }
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#c91d1d] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
                    >
                      <ShoppingCart className="h-5 w-5" />

                      {isAddingToCart
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        !product.inStock ||
                        isAddingToCart
                      }
                      onClick={
                        handleBuyNow
                      }
                      className="flex h-14 w-full items-center justify-center rounded-lg border border-[#111111] bg-[#111111] px-6 text-sm font-black uppercase tracking-wide text-white transition hover:bg-transparent hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-1"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#E5E5E5] pt-6 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-4">
                    <Truck className="h-5 w-5 shrink-0 text-[#E52323]" />

                    <div>
                      <p className="text-xs font-black uppercase">
                        Fast Delivery
                      </p>

                      <p className="mt-1 text-[10px] text-[#737373]">
                        Reliable shipping
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-4">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#E52323]" />

                    <div>
                      <p className="text-xs font-black uppercase">
                        Secure
                      </p>

                      <p className="mt-1 text-[10px] text-[#737373]">
                        Safe checkout
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-4">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#E52323]" />

                    <div>
                      <p className="text-xs font-black uppercase">
                        Genuine
                      </p>

                      <p className="mt-1 text-[10px] text-[#737373]">
                        Authentic products
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 border-t border-[#E5E5E5] pt-6">
                  <div className="grid gap-3 text-sm">
                    <div className="flex gap-3">
                      <span className="w-24 shrink-0 text-[#737373]">
                        SKU
                      </span>

                      <span className="text-[#525252]">
                        {product.sku ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="w-24 shrink-0 text-[#737373]">
                        Category
                      </span>

                      <Link
                        href={`/product-categories/${categorySlug}`}
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

                    {selectedVariant?.id && (
                      <div className="flex gap-3">
                        <span className="w-24 shrink-0 text-[#737373]">
                          Variant
                        </span>

                        <span className="text-[#525252]">
                          {selectedVariant.id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-[#E5E5E5] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E52323]" />

                    <div>
                      <p className="text-sm font-bold">
                        Shop with confidence
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#737373]">
                        100% genuine products,
                        secure payments and
                        reliable delivery from
                        Cost2Cost Supplement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#E5E5E5] bg-[#F5F5F5]">
          <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
            <ProductDescription
              product={product}
            />

            <ProductReviews
              product={product}
            />

            <FAQSection
              faqs={
                Array.isArray(
                  product.faqs
                )
                  ? product.faqs
                  : []
              }
            />

            <ProductQuestions
              product={product}
            />
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <ProductSlider
            eyebrow="Related Products"
            title="Related Products"
            description="Products you may also like"
            products={relatedProducts}
          />
        )}
      </main>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6"
          onClick={() =>
            setIsZoomOpen(false)
          }
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsZoomOpen(false);
            }}
            className="absolute right-4 top-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111111] transition hover:bg-[#E52323] hover:text-white sm:right-6 sm:top-6"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>

          {product.images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="absolute left-3 top-1/2 z-[110] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#111111] transition hover:bg-[#E52323] hover:text-white sm:left-6"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div
            className="relative h-[82vh] w-[92vw] max-w-6xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={selectedZoomImage}
              alt={product.name}
              fill
              sizes="92vw"
              className="object-contain"
              priority
              onError={(event) => {
                if (
                  !event.currentTarget.src.includes(
                    PLACEHOLDER_IMAGE
                  )
                ) {
                  event.currentTarget.src =
                    PLACEHOLDER_IMAGE;
                }
              }}
            />
          </div>

          {product.images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 z-[110] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#111111] transition hover:bg-[#E52323] hover:text-white sm:right-6"
              aria-label="Next image"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </>
  );
}