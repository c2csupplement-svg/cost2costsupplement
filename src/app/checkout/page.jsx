"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Building2, Check, ChevronDown, Crosshair, CreditCard, Home, Lock,
  MapPin, Minus, Pencil, Plus, ShieldCheck, ShoppingBag, Sparkles, Tag, Truck, X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { createRazorpayOrderApi, buyNowApi, verifyPaymentApi, couponApi, removeCouponApi, appplyCouponApi } from "@/apiService/api";

import { fetchCartItems, updateItemQuantity, deleteCartItem, fetchCartItemsCheckOut, } from "@/redux/features/cart/cartActions";

import { getAddress, createAddress, updateAddress, } from "@/redux/features/address/addressAction";

const emptyAddress = {
  addressType: "Home",
  fullName: "",
  mobile: "",
  alternateMobile: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

function getImageUrl(image) {
  if (!image) return null;

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
      image?.featuredImage ||
      image?.featuredimg;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getItemPrice(item) {
  const product = item?.product ?? {};

  const variant =
    item?.variant ??
    item?.productVariant ??
    item?.selectedVariant ??
    null;

  return Number(
    item?.price ??
    item?.unitPrice ??
    variant?.price ??
    product?.price ??
    0
  );
}

function calculateCouponDiscount(coupon, subtotal) {
  const total = Number(subtotal || 0);

  if (!coupon || total <= 0) {
    return 0;
  }

  const discountType = String(
    coupon?.discountType || ""
  ).toUpperCase();

  const discountValue = Number(
    coupon?.discountValue ??
    coupon?.discount ??
    coupon?.discountAmount ??
    0
  );

  let discount = 0;

  if (
    discountType === "PERCENTAGE" ||
    discountType === "PERCENT"
  ) {
    discount = (total * discountValue) / 100;

    const maxDiscount = Number(
      coupon?.maxDiscount ??
      coupon?.maximumDiscount ??
      coupon?.maxDiscountAmount ??
      0
    );

    if (maxDiscount > 0) {
      discount = Math.min(discount, maxDiscount);
    }
  } else {
    discount = discountValue;
  }

  return Math.min(Math.max(0, discount), total);
}

function getCouponDescription(coupon) {
  const type = String(
    coupon?.discountType || ""
  ).toUpperCase();

  const value = Number(
    coupon?.discountValue ??
    coupon?.discount ??
    coupon?.discountAmount ??
    0
  );

  if (
    type === "PERCENTAGE" ||
    type === "PERCENT"
  ) {
    return `${value}% OFF`;
  }

  if (value > 0) {
    return `₹${value} OFF`;
  }

  return "Special offer";
}

function getArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.products)) {
    return value.products;
  }

  return [];
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBuyNowRoute = searchParams.get("buyNow") === "true";

  const debounceRef = useRef(null);
  const mountedRef = useRef(true);

  const [isBuyNow, setIsBuyNow] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState(null);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [showAllAddresses, setShowAllAddresses] =
    useState(false);

  const [form, setForm] = useState(emptyAddress);

  const [formErrors, setFormErrors] = useState({});

  const [savingAddress, setSavingAddress] =
    useState(false);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [pincodeLookupLoading, setPincodeLookupLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [paymentMode, setPaymentMode] =
    useState("PREPAID");

  const [mobileSummaryOpen, setMobileSummaryOpen] =
    useState(true);

  const [coupons, setCoupons] = useState([]);

  const [couponInput, setCouponInput] = useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [appliedCouponDiscount, setAppliedCouponDiscount] =
    useState(0);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponError, setCouponError] = useState("");

  const [showCouponModal, setShowCouponModal] =
    useState(false);

  const cartState = useSelector(
    (state) => state.product
  );

  const addressState = useSelector(
    (state) => state.address
  );

  const cartStateProducts = cartState?.products;

  const cartData = cartStateProducts?.cart;

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartStateProducts?.cart?.items ??
    [];

  const normalCart = Array.isArray(rawItems)
    ? rawItems
    : [];

  const cart = isBuyNow
    ? buyNowItem
      ? [buyNowItem]
      : []
    : normalCart;

  const addressData =
    addressState?.addressData;

  const rawAddresses =
    addressData?.addresses ??
    addressData?.data?.addresses ??
    addressData?.data ??
    addressData;

  const addresses = Array.isArray(rawAddresses)
    ? rawAddresses
    : [];

  useEffect(() => {
    mountedRef.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(getAddress());

    if (isBuyNowRoute) {
      const saved = sessionStorage.getItem("buyNowCheckout");

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          if (parsed?.productId && parsed?.quantity) {
            setIsBuyNow(true);

            setBuyNowItem({
              id: `buy-now-${parsed.productId}-${parsed.variantId ?? "default"}`,
              productId: parsed.productId,
              variantId: parsed.variantId ?? null,
              quantity: Number(parsed.quantity) || 1,
              name: parsed.name ?? parsed.title ?? "Product",
              price: Number(parsed.price ?? parsed.unitPrice ?? 0),
              image: parsed.image ?? null,
              variant: parsed.variant ?? null,
              product: parsed.product ?? {},
            });
          } else {
            // URL says buy-now but data is malformed — bail to cart
            sessionStorage.removeItem("buyNowCheckout");
            setIsBuyNow(false);
            router.replace("/checkout");
          }
        } catch (error) {
          console.error("Buy Now session error:", error);
          sessionStorage.removeItem("buyNowCheckout");
          setIsBuyNow(false);
          router.replace("/checkout");
        }
      } else {
        setIsBuyNow(false);
        router.replace("/checkout");
      }
    } else {
      sessionStorage.removeItem("buyNowCheckout");
      setIsBuyNow(false);
      setBuyNowItem(null);
      dispatch(fetchCartItems());
    }

    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [dispatch, router, isBuyNowRoute]);

  useEffect(() => {
    if (isBuyNow) {
      return;
    }

    dispatch(fetchCartItems());
  }, [dispatch, isBuyNow]);

  useEffect(() => {
    if (!isBuyNow || !buyNowItem) {
      return;
    }

    try {
      const saved =
        sessionStorage.getItem(
          "buyNowCheckout"
        );

      const parsed = saved
        ? JSON.parse(saved)
        : {};

      sessionStorage.setItem(
        "buyNowCheckout",
        JSON.stringify({
          ...parsed,
          productId:
            buyNowItem.productId,
          variantId:
            buyNowItem.variantId,
          quantity:
            Number(
              buyNowItem.quantity || 1
            ),
          name:
            buyNowItem.name,
          price:
            buyNowItem.price,
          image:
            buyNowItem.image,
          variant:
            buyNowItem.variant,
          product:
            buyNowItem.product,
          couponCode:
            appliedCoupon?.code ||
            parsed?.couponCode ||
            "",
          couponId:
            appliedCoupon?.id ??
            parsed?.couponId ??
            null,
          couponDiscount:
            Number(
              appliedCouponDiscount ||
              parsed?.couponDiscount ||
              0
            ),
        })
      );
    } catch (error) {
      console.error(
        "Buy Now session synchronization error:",
        error
      );
    }
  }, [
    isBuyNow,
    buyNowItem,
    appliedCoupon,
    appliedCouponDiscount,
  ]);

  useEffect(() => {
    if (isBuyNow) {
      return;
    }

    const code =
      cartData?.couponCode ||
      cartData?.coupon?.code ||
      "";

    const discount =
      Number(
        cartData?.discountAmount ?? 0
      ) || 0;

    if (code) {
      setCouponInput(
        String(code).toUpperCase()
      );

      setAppliedCoupon({
        ...(cartData?.coupon || {}),
        code,
        discountAmount: discount,
      });

      setAppliedCouponDiscount(
        discount
      );
    } else {
      setAppliedCoupon(null);
      setAppliedCouponDiscount(0);
      setCouponInput("");
    }
  }, [
    isBuyNow,
    cartData?.couponCode,
    cartData?.coupon,
    cartData?.discountAmount,
  ]);

  useEffect(() => {
    let active = true;

    const loadCoupons = async () => {
      try {
        const response = await couponApi();

        const data =
          response?.data ?? response;

        if (
          active &&
          data?.success &&
          Array.isArray(data?.coupons)
        ) {
          setCoupons(data.coupons);
        } else if (active) {
          setCoupons([]);
        }
      } catch (error) {
        console.error(
          "Coupon API error:",
          error
        );

        if (active) {
          setCoupons([]);
        }
      }
    };

    loadCoupons();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!showCouponModal) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowCouponModal(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [showCouponModal]);

  useEffect(() => {
    let script = null;

    if (typeof window === "undefined") {
      return;
    }

    if (window.Razorpay) {
      return;
    }

    const existing =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existing) {
      return;
    }

    script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
};

    script.onerror = () => {
      console.error(
        "Razorpay Checkout script failed to load"
      );
    };

    document.body.appendChild(script);

    return () => { };
  }, []);

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      const defaultAddress =
        addresses.find(
          (address) =>
            address?.isDefault
        ) || addresses[0];

      if (defaultAddress?.id) {
        setSelectedAddressId(
          defaultAddress.id
        );
      }
    }
  }, [
    addresses,
    selectedAddressId,
  ]);

  const formatPrice = (price) =>
    `₹${Number(
      price || 0
    ).toLocaleString("en-IN")}`;

  const calculatedCartTotal =
    cart.reduce(
      (total, item) => {
        const price =
          getItemPrice(item);

        const quantity =
          Number(
            item?.quantity || 0
          );

        return (
          total +
          price * quantity
        );
      },
      0
    );

  const apiTotalAmount = isBuyNow
    ? null
    : Number(
      cartData?.totalAmount ?? NaN
    );

  const apiFinalAmount = isBuyNow
    ? null
    : Number(
      cartData?.finalAmount ?? NaN
    );

  const apiCouponDiscount = isBuyNow
    ? 0
    : Number(
      cartData?.discountAmount ?? 0
    );

  const cartSubtotal =
    Number.isFinite(
      apiTotalAmount
    ) &&
      apiTotalAmount >= 0
      ? apiTotalAmount
      : calculatedCartTotal;

  const finalCouponDiscount =
    isBuyNow
      ? appliedCouponDiscount
      : apiCouponDiscount > 0
        ? apiCouponDiscount
        : appliedCouponDiscount;

  const discountedTotal =
    isBuyNow
      ? Math.max(
        0,
        cartSubtotal -
        finalCouponDiscount
      )
      : Number.isFinite(
        apiFinalAmount
      ) &&
        apiFinalAmount >= 0
        ? apiFinalAmount
        : Math.max(
          0,
          cartSubtotal -
          finalCouponDiscount
        );

  const codCharge =
    paymentMode === "COD"
      ? 49
      : 0;

  const payableAmount =
    discountedTotal + codCharge;

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(
          item?.quantity || 0
        ),
      0
    );

  const selectedAddress =
    addresses.find(
      (address) =>
        Number(address?.id) ===
        Number(selectedAddressId)
    ) ?? null;

  const validateAddress = () => {
    const errors = {};

    if (!form.fullName?.trim()) {
      errors.fullName =
        "Name is required.";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        String(
          form.mobile || ""
        ).trim()
      )
    ) {
      errors.mobile =
        "Enter a valid 10-digit mobile number.";
    }

    if (!form.addressLine1?.trim()) {
      errors.addressLine1 =
        "Address is required.";
    }

    if (!form.city?.trim()) {
      errors.city =
        "City is required.";
    }

    if (!form.state?.trim()) {
      errors.state =
        "State is required.";
    }

    if (
      !/^\d{6}$/.test(
        String(
          form.pincode || ""
        ).trim()
      )
    ) {
      errors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleAddAddress = () => {
    setEditingAddressId(null);
    setForm({
      ...emptyAddress,
    });
    setFormErrors({});
    setShowAddressForm(true);
  };

  const handleEditAddress = (
    address
  ) => {
    setEditingAddressId(
      address?.id
    );

    setForm({
      ...emptyAddress,
      ...address,
      addressType:
        address?.addressType ||
        "Home",
    });

    setFormErrors({});
    setShowAddressForm(true);
  };

  const handleSaveAddress =
    async (event) => {
      event.preventDefault();

      if (!validateAddress()) {
        return;
      }

      const wasEditing =
        Boolean(editingAddressId);

      try {
        setSavingAddress(true);

        let response;

        if (wasEditing) {
          response =
            await dispatch(
              updateAddress({
                id:
                  editingAddressId,
                ...form,
              })
            );
        } else {
          response =
            await dispatch(
              createAddress({
                ...form,
              })
            );
        }

        if (response?.error) {
          throw new Error(
            response.error?.message ||
            "Unable to save address."
          );
        }

        await dispatch(
          getAddress()
        );

        setShowAddressForm(false);
        setEditingAddressId(null);

        toast.success(
          wasEditing
            ? "Address updated successfully."
            : "Address added successfully."
        );
      } catch (error) {
        console.error(
          "Address save error:",
          error
        );

        toast.error(
          error?.message ||
          "Unable to save address."
        );
      } finally {
        setSavingAddress(false);
      }
    };

  const lookupPincode = async (
    pincode
  ) => {
    if (
      !/^\d{6}$/.test(
        String(pincode || "")
      )
    ) {
      return;
    }

    try {
      setPincodeLookupLoading(true);

      const response =
        await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );

      const result =
        response?.data?.[0];

      if (
        result?.Status ===
        "Success" &&
        result?.PostOffice?.length
      ) {
        const office =
          result.PostOffice[0];

        setForm((previous) => ({
          ...previous,
          city:
            previous.city ||
            office?.District ||
            "",
          state:
            previous.state ||
            office?.State ||
            "",
          country:
            previous.country ||
            "India",
        }));
      }
    } catch (error) {
      console.error(
        "Pincode lookup error:",
        error
      );
    } finally {
      setPincodeLookupLoading(
        false
      );
    }
  };

  const handlePincodeChange = (
    event
  ) => {
    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setForm((previous) => ({
      ...previous,
      pincode: value,
    }));

    setFormErrors((previous) => ({
      ...previous,
      pincode: "",
    }));

    if (value.length === 6) {
      lookupPincode(value);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Location is not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const response =
            await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

          const address =
            response?.data?.address;

          setForm((previous) => ({
            ...previous,
            addressLine1:
              previous.addressLine1 ||
              address?.road ||
              address?.neighbourhood ||
              "",
            city:
              previous.city ||
              address?.city ||
              address?.town ||
              address?.village ||
              "",
            state:
              previous.state ||
              address?.state ||
              "",
            pincode:
              previous.pincode ||
              address?.postcode ||
              "",
            country: "India",
          }));

          toast.success(
            "Location detected."
          );
        } catch (error) {
          console.error(
            "Location error:",
            error
          );

          toast.error(
            "Unable to detect your location."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);

        toast.error(
          "Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleQuantityChange =
    async (
      item,
      nextQuantity
    ) => {
      const quantity =
        Number(nextQuantity);

      if (
        !Number.isFinite(
          quantity
        ) ||
        quantity < 1
      ) {
        return;
      }

      if (isBuyNow) {
        setBuyNowItem(
          (previous) =>
            previous
              ? {
                ...previous,
                quantity,
              }
              : previous
        );

        return;
      }

      const itemId =
        item?.id ??
        item?.cartItemId ??
        item?._id;

      if (!itemId) {
        return;
      }

      if (debounceRef.current) {
        clearTimeout(
          debounceRef.current
        );
      }

      debounceRef.current =
        setTimeout(
          async () => {
            try {
              await dispatch(
                updateItemQuantity(
                  itemId,
                  quantity
                )
              );

              await dispatch(
                fetchCartItems()
              );
            } catch (error) {
              console.error(
                "Quantity update error:",
                error
              );

              toast.error(
                "Unable to update quantity."
              );
            }
          },
          250
        );
    };

  const handleRemoveItem =
    async (item) => {
      if (isBuyNow) {
        return;
      }

      const itemId =
        item?.id ??
        item?.cartItemId ??
        item?._id;

      if (!itemId) {
        return;
      }

      try {
        await dispatch(
          deleteCartItem(itemId)
        );

        await dispatch(
          fetchCartItems()
        );

        toast.success(
          "Item removed."
        );
      } catch (error) {
        console.error(
          "Delete cart item error:",
          error
        );

        toast.error(
          "Unable to remove item."
        );
      }
    };

  const handleApplyCoupon =
    async (coupon) => {
      const code = String(
        coupon?.code ||
        coupon?.couponCode ||
        ""
      )
        .trim()
        .toUpperCase();

      if (!code) {
        setCouponError(
          "Invalid coupon code."
        );
        return;
      }

      const minimumCartValue =
        Number(
          coupon?.minCartValue ??
          coupon?.minimumCartValue ??
          coupon?.minOrderValue ??
          0
        );

      if (
        minimumCartValue >
        cartSubtotal
      ) {
        const message =
          `Minimum order value is ${formatPrice(
            minimumCartValue
          )}.`;

        setCouponError(message);
        toast.error(message);
        return;
      }

      try {
        setCouponLoading(true);
        setCouponError("");

        if (!isBuyNow) {
          const response =
            await appplyCouponApi(code);

          const data = response?.data;

          if (data?.success === false) {
            throw new Error(
              data?.message ||
              "Unable to apply coupon."
            );
          }

          const serverCouponCode = data?.couponCode

          const serverDiscount = Number(data?.discountAmount);

          setAppliedCoupon({
            ...coupon,
            ...(data?.coupon || {}),
            code:
              serverCouponCode,
            discountAmount:
              serverDiscount,
          });

          setCouponInput(
            String(
              serverCouponCode
            ).toUpperCase()
          );

          setAppliedCouponDiscount(
            serverDiscount
          );

          await dispatch(
            fetchCartItemsCheckOut()
          );

          setShowCouponModal(false);

          toast.success(
            `Coupon ${serverCouponCode} applied successfully.`,
            {
              description:
                serverDiscount > 0
                  ? `You saved ${formatPrice(
                    serverDiscount
                  )}.`
                  : "Coupon applied successfully.",
            }
          );

          return;
        }

        const localDiscount =
          calculateCouponDiscount(
            coupon,
            cartSubtotal
          );

        if (localDiscount <= 0) {
          throw new Error(
            "This coupon cannot be applied to this Buy Now order."
          );
        }

        setAppliedCoupon({
          ...coupon,
          code,
          discountAmount:
            localDiscount,
        });

        setCouponInput(code);

        setAppliedCouponDiscount(
          localDiscount
        );

        setShowCouponModal(false);

        const saved =
          sessionStorage.getItem(
            "buyNowCheckout"
          );

        const parsed = saved
          ? JSON.parse(saved)
          : {};

        sessionStorage.setItem(
          "buyNowCheckout",
          JSON.stringify({
            ...parsed,
            couponCode: code,
            couponId:
              coupon?.id ?? null,
            couponDiscount:
              localDiscount,
          })
        );

        toast.success(
          `Coupon ${code} applied successfully.`,
          {
            description: `You saved ${formatPrice(
              localDiscount
            )}.`,
          }
        );
      } catch (error) {
        console.error(
          "Apply coupon error:",
          error
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to apply coupon.";

        setCouponError(message);
        toast.error(message);
      } finally {
        setCouponLoading(false);
      }
    };

  const handleCouponSubmit =
    async (event) => {
      event.preventDefault();

      const code =
        couponInput
          .trim()
          .toUpperCase();

      if (!code) {
        setCouponError(
          "Please enter a coupon code."
        );
        return;
      }

      const coupon =
        coupons.find(
          (item) =>
            String(
              item?.code ||
              item?.couponCode ||
              ""
            ).toUpperCase() === code
        );

      if (!coupon) {
        setCouponError(
          "Invalid coupon code."
        );

        toast.error(
          "Coupon code not found."
        );

        return;
      }

      await handleApplyCoupon(
        coupon
      );
    };

  const handleRemoveCoupon =
    async () => {
      if (!appliedCoupon) {
        return;
      }

      try {
        setCouponLoading(true);

        if (!isBuyNow) {
          const response =
            await removeCouponApi({
              couponId:
                appliedCoupon?.id,
              code:
                appliedCoupon?.code ||
                couponInput,
            });

          const data =
            response?.data ??
            response;

          if (
            data?.success === false
          ) {
            throw new Error(
              data?.message ||
              "Unable to remove coupon."
            );
          }

          await dispatch(
            fetchCartItems()
          );
        } else {
          const saved =
            sessionStorage.getItem(
              "buyNowCheckout"
            );

          const parsed = saved
            ? JSON.parse(saved)
            : {};

          delete parsed.couponCode;
          delete parsed.couponId;
          delete parsed.couponDiscount;

          sessionStorage.setItem(
            "buyNowCheckout",
            JSON.stringify(parsed)
          );
        }

        setAppliedCoupon(null);
        setAppliedCouponDiscount(0);
        setCouponInput("");
        setCouponError("");

        toast.success(
          "Coupon removed."
        );
      } catch (error) {
        console.error(
          "Remove coupon error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to remove coupon."
        );
      } finally {
        setCouponLoading(false);
      }
    };

  const loadRazorpay = () => {
    return new Promise(
      (resolve, reject) => {
        if (
          typeof window ===
          "undefined"
        ) {
          reject(
            new Error(
              "Razorpay can only load in the browser."
            )
          );
          return;
        }

        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const existing =
          document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          );

        if (existing) {
          existing.addEventListener(
            "load",
            () => {
              if (
                window.Razorpay
              ) {
                resolve(true);
              } else {
                reject(
                  new Error(
                    "Razorpay script loaded but Razorpay is unavailable."
                  )
                );
              }
            },
            { once: true }
          );

          existing.addEventListener(
            "error",
            () => {
              reject(
                new Error(
                  "Razorpay Checkout script failed to load."
                )
              );
            },
            { once: true }
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload = () => {
          if (
            window.Razorpay
          ) {
            resolve(true);
          } else {
            reject(
              new Error(
                "Razorpay script loaded but Razorpay is unavailable."
              )
            );
          }
        };

        script.onerror = () => {
          reject(
            new Error(
              "Unable to load Razorpay Checkout."
            )
          );
        };

        document.body.appendChild(
          script
        );
      }
    );
  };

  const startPayment = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (isBuyNow && !buyNowItem) {
      toast.error("Buy Now item is missing.");
      return;
    }

    if (!isBuyNow && !cart.length) {
      toast.error("Your checkout is empty.");
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    try {
      setPaymentLoading(true);

      let response;

      if (isBuyNow) {
        response = await buyNowApi({
          productId: buyNowItem?.productId,
          variantId: buyNowItem?.variantId ?? null,
          quantity: Number(buyNowItem?.quantity || 1),
          addressId: Number(selectedAddressId),
          paymentMethod: paymentMode,
          couponCode: appliedCoupon?.code || null,
          couponId: appliedCoupon?.id || null,
          couponDiscount: Number(appliedCouponDiscount || 0),
        });
      } else {
        response = await createRazorpayOrderApi({
          addressId: Number(selectedAddressId),
          paymentMethod: paymentMode,
        });
      }

      const data = response?.data ?? response;


      if (!data) {
        throw new Error("No response received from checkout API.");
      }

      if (data?.success === false) {
        throw new Error(
          data?.message || "Unable to create order."
        );
      }

      const isCOD = Boolean(
        data?.isCOD ??
        data?.order?.isCOD ??
        data?.data?.isCOD ??
        paymentMode === "COD"
      );

      const razorpayOrderId =
        data?.razorpayOrderId ||
        data?.order?.razorpayOrderId ||
        data?.data?.razorpayOrderId;

      const razorpayCurrency =
        data?.currency ||
        data?.order?.currency ||
        data?.data?.currency ||
        "INR";

      const razorpayKey =
        data?.key ||
        data?.order?.key ||
        data?.data?.key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const advanceAmount = Number(
        data?.advanceAmount ??
        data?.order?.advanceAmount ??
        data?.data?.advanceAmount ??
        0
      );

      const rawAmount = Number(
        data?.amount ??
        data?.order?.amount ??
        data?.data?.amount ??
        0
      );

      const orderNumber =
        data?.orderNumber ||
        data?.order?.orderNumber ||
        data?.data?.orderNumber ||
        "";

      const remainingAmount = Number(
        data?.remainingAmount ??
        data?.order?.remainingAmount ??
        data?.data?.remainingAmount ??
        0
      );

      if (!razorpayOrderId) {
        throw new Error("Razorpay order ID is missing.");
      }

      if (!razorpayKey) {
        throw new Error("Razorpay key is missing.");
      }

      let razorpayAmount;

      if (isCOD) {
        if (!advanceAmount || advanceAmount <= 0) {
          throw new Error(
            "COD advance amount is missing."
          );
        }

        razorpayAmount = Math.round(
          advanceAmount * 100
        );
      } else {
        if (!rawAmount || rawAmount <= 0) {
          throw new Error("Razorpay amount is missing.");
        }

        razorpayAmount = Math.round(rawAmount);
      }

      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not be loaded."
        );
      }

      const options = {
        key: razorpayKey,
        amount: razorpayAmount,
        currency: razorpayCurrency,
        name: "Cost2Cost",
        description: isCOD
          ? `COD Advance Payment${orderNumber ? ` - ${orderNumber}` : ""}`
          : isBuyNow
            ? "Buy Now Order"
            : "Order Payment",
        order_id: razorpayOrderId,

        prefill: {
          name: selectedAddress?.fullName || "",
          email: selectedAddress?.email || "",
          contact: selectedAddress?.mobile || "",
        },

        notes: {
          payment_method: isCOD ? "COD" : "PREPAID",
          order_number: orderNumber,
          address_id: String(selectedAddressId),
          advance_amount: isCOD
            ? String(advanceAmount)
            : String(rawAmount / 100),
          remaining_amount: isCOD
            ? String(remainingAmount)
            : "0",
        },

        theme: {
          color: "#111111",
        },

        handler: async (paymentResponse) => {
          try {
            setPaymentLoading(true);

            const verifyPayload = {
              razorpay_order_id:
                paymentResponse?.razorpay_order_id,
              razorpay_payment_id:
                paymentResponse?.razorpay_payment_id,
              razorpay_signature:
                paymentResponse?.razorpay_signature,
              addressId: Number(selectedAddressId),
            };

            const verifyResponse =
              await verifyPaymentApi(verifyPayload);

            const verifyData =
              verifyResponse?.data ?? verifyResponse;


            if (
              !verifyData ||
              verifyData?.success === false
            ) {
              throw new Error(
                verifyData?.message ||
                "Payment verification failed."
              );
            }

            if (isBuyNow) {
              sessionStorage.removeItem(
                "buyNowCheckout"
              );
            }

            if (!isBuyNow) {
              await dispatch(
                fetchCartItemsCheckOut()
              );

              await dispatch(
                fetchCartItems()
              );
            }

            if (isCOD) {
              toast.success(
                `COD order confirmed. Advance paid ₹${advanceAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}. Remaining ₹${remainingAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )} will be payable on delivery.`
              );
            } else {
              toast.success(
                "Payment successful. Order placed."
              );
            }

            router.push("/cart");
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            toast.error(
              error?.response?.data?.message ||
              error?.message ||
              "Payment verification failed."
            );
          } finally {
            if (mountedRef.current) {
              setPaymentLoading(false);
            }
          }
        },

        modal: {
          ondismiss: () => {
            if (mountedRef.current) {
              setPaymentLoading(false);
            }
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (paymentError) => {
          console.error(
            "Razorpay payment failed:",
            paymentError
          );

          toast.error(
            paymentError?.error?.description ||
            "Payment failed."
          );

          if (mountedRef.current) {
            setPaymentLoading(false);
          }
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout payment error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to process checkout."
      );

      if (mountedRef.current) {
        setPaymentLoading(false);
      }
    }
  };

  const visibleAddresses =
    showAllAddresses
      ? addresses
      : addresses.slice(0, 2);

  if (
    !isBuyNow &&
    !cartStateProducts
  ) {
    return <CheckoutSkeleton />;
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-text-primary lg:pb-10">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="hidden sm:inline">
              Secure checkout
            </span>
            <span className="sm:hidden">
              Secure
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Checkout
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Complete your order
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-text-muted sm:text-sm">
            Select your delivery address,
            choose a payment method, and
            review your order before placing
            it.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    1
                  </span>

                  <div>
                    <h2 className="text-sm font-bold sm:text-base">
                      Delivery address
                    </h2>

                    <p className="mt-0.5 text-[10px] text-text-muted sm:text-xs">
                      Choose where your order
                      should be delivered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={
                      handleAddAddress
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-white hover:bg-primary-hover"
                  >
                    <Plus className="h-4 w-4" />
                    Add address
                  </button>
                </div>

                {showAddressForm ? (
                  <form
                    onSubmit={
                      handleSaveAddress
                    }
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="Full name"
                        name="fullName"
                        value={
                          form.fullName
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.fullName
                        }
                      />

                      <InputField
                        label="Mobile"
                        name="mobile"
                        value={
                          form.mobile
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.mobile
                        }
                      />

                      <InputField
                        label="Email"
                        name="email"
                        value={
                          form.email
                        }
                        onChange={
                          handleFormChange
                        }
                      />

                      <InputField
                        label="Alternate mobile"
                        name="alternateMobile"
                        value={
                          form.alternateMobile
                        }
                        onChange={
                          handleFormChange
                        }
                      />

                      <div className="sm:col-span-2">
                        <InputField
                          label="Address line 1"
                          name="addressLine1"
                          value={
                            form.addressLine1
                          }
                          onChange={
                            handleFormChange
                          }
                          error={
                            formErrors.addressLine1
                          }
                        />
                      </div>

                      <InputField
                        label="Address line 2"
                        name="addressLine2"
                        value={
                          form.addressLine2
                        }
                        onChange={
                          handleFormChange
                        }
                      />

                      <InputField
                        label="Landmark"
                        name="landmark"
                        value={
                          form.landmark
                        }
                        onChange={
                          handleFormChange
                        }
                      />

                      <InputField
                        label="City"
                        name="city"
                        value={
                          form.city
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.city
                        }
                      />

                      <InputField
                        label="State"
                        name="state"
                        value={
                          form.state
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.state
                        }
                      />

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-muted">
                          Pincode
                        </label>

                        <div className="relative">
                          <input
                            name="pincode"
                            value={
                              form.pincode
                            }
                            onChange={
                              handlePincodeChange
                            }
                            inputMode="numeric"
                            maxLength={6}
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                          />

                          {pincodeLookupLoading && (
                            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-border border-t-primary" />
                          )}
                        </div>

                        {formErrors.pincode && (
                          <p className="mt-1 text-[10px] text-red-500">
                            {
                              formErrors.pincode
                            }
                          </p>
                        )}
                      </div>

                      <InputField
                        label="Country"
                        name="country"
                        value={
                          form.country
                        }
                        onChange={
                          handleFormChange
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={
                          Boolean(
                            form.isDefault
                          )
                        }
                        onChange={
                          handleFormChange
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-xs text-text-muted">
                        Make this my default
                        address
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={
                          detectLocation
                        }
                        disabled={
                          locationLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-xs font-semibold hover:border-primary/40 disabled:opacity-50"
                      >
                        {locationLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                        ) : (
                          <Crosshair className="h-4 w-4" />
                        )}
                        Use my location
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(
                              false
                            );
                            setEditingAddressId(
                              null
                            );
                          }}
                          className="rounded-xl border border-border px-4 py-3 text-xs font-semibold"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={
                            savingAddress
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {savingAddress ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}

                          {editingAddressId
                            ? "Update address"
                            : "Save address"}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : addresses.length ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      {visibleAddresses.map(
                        (address) => {
                          const active =
                            Number(
                              selectedAddressId
                            ) ===
                            Number(
                              address?.id
                            );

                          return (
                            <button
                              key={
                                address?.id
                              }
                              type="button"
                              onClick={() =>
                                setSelectedAddressId(
                                  address?.id
                                )
                              }
                              className={`relative w-full rounded-2xl border p-4 text-left transition ${active
                                ? "border-primary bg-primary/[0.035] shadow-sm"
                                : "border-border bg-background hover:border-primary/40"
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active
                                      ? "bg-primary text-white"
                                      : "bg-surface text-text-muted"
                                      }`}
                                  >
                                    {address?.addressType ===
                                      "Work" ? (
                                      <Building2 className="h-4 w-4" />
                                    ) : (
                                      <Home className="h-4 w-4" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="truncate text-xs font-bold">
                                        {
                                          address?.fullName
                                        }
                                      </p>

                                      {address?.isDefault && (
                                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[8px] font-bold uppercase text-green-600">
                                          Default
                                        </span>
                                      )}
                                    </div>

                                    <p className="mt-1 text-[10px] text-text-muted">
                                      {
                                        address?.mobile
                                      }
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active
                                    ? "border-primary bg-primary"
                                    : "border-border"
                                    }`}
                                >
                                  {active && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </span>
                              </div>

                              <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-text-muted">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                                <span>
                                  {
                                    address?.addressLine1
                                  }
                                  {address?.addressLine2
                                    ? `, ${address.addressLine2}`
                                    : ""}
                                  {address?.landmark
                                    ? `, ${address.landmark}`
                                    : ""}
                                  {address?.city
                                    ? `, ${address.city}`
                                    : ""}
                                  {address?.state
                                    ? `, ${address.state}`
                                    : ""}
                                  {address?.pincode
                                    ? ` - ${address.pincode}`
                                    : ""}
                                </span>
                              </div>

                              <div className="mt-3 flex justify-end">
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(
                                    event
                                  ) => {
                                    event.stopPropagation();
                                    handleEditAddress(
                                      address
                                    );
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[9px] font-bold uppercase tracking-wide hover:border-primary/40"
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </span>
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {addresses.length >
                      2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAllAddresses(
                              (previous) =>
                                !previous
                            )
                          }
                          className="text-xs font-bold text-primary"
                        >
                          {showAllAddresses
                            ? "Show less"
                            : `View ${addresses.length -
                            2
                            } more addresses`}
                        </button>
                      )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <MapPin className="mx-auto h-8 w-8 text-text-muted" />

                    <p className="mt-3 text-xs font-bold">
                      No delivery address
                    </p>

                    <p className="mt-1 text-[10px] text-text-muted">
                      Add an address to
                      continue.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    2
                  </span>

                  <div>
                    <h2 className="text-sm font-bold sm:text-base">Payment method</h2>
                    <p className="mt-0.5 text-[10px] text-text-muted sm:text-xs">
                      Choose how you'd like to pay.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
                {/* Prepaid */}
                <button
                  type="button"
                  onClick={() => setPaymentMode("PREPAID")}
                  aria-pressed={paymentMode === "PREPAID"}
                  className={`group relative flex flex-col rounded-2xl border p-4 text-left transition sm:p-5 ${paymentMode === "PREPAID"
                      ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30 shadow-sm"
                      : "border-border bg-background hover:border-primary/40 active:scale-[0.99]"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${paymentMode === "PREPAID"
                          ? "bg-primary text-white"
                          : "bg-surface text-text-muted"
                        }`}
                    >
                      <CreditCard className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold sm:text-sm">Prepaid</h3>

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${paymentMode === "PREPAID"
                              ? "border-primary bg-primary"
                              : "border-border"
                            }`}
                        >
                          {paymentMode === "PREPAID" && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-text-muted sm:text-xs">
                        UPI, cards & net banking
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[9px] font-semibold text-green-600 sm:text-[10px]">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    Secure online payment
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMode("COD")}
                  aria-pressed={paymentMode === "COD"}
                  className={`group relative flex flex-col rounded-2xl border p-4 text-left transition sm:p-5 ${paymentMode === "COD"
                      ? "border-primary bg-primary/[0.04] ring-1 ring-primary/30 shadow-sm"
                      : "border-border bg-background hover:border-primary/40 active:scale-[0.99]"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${paymentMode === "COD"
                          ? "bg-primary text-white"
                          : "bg-surface text-text-muted"
                        }`}
                    >
                      <Truck className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold sm:text-sm">
                          Cash on Delivery
                        </h3>

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${paymentMode === "COD"
                              ? "border-primary bg-primary"
                              : "border-border"
                            }`}
                        >
                          {paymentMode === "COD" && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-text-muted sm:text-xs">
                        Pay the rest when it arrives
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-amber-500/10 px-2.5 py-1.5">
                    <p className="text-[9px] font-semibold leading-4 text-amber-700 sm:text-[10px]">
                      17% advance required to confirm · remaining paid on delivery
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold text-text-muted sm:text-[10px]">
                    <Truck className="h-3.5 w-3.5 shrink-0" />
                    ₹49 COD handling charge
                  </div>
                </button>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Tag className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold sm:text-base">
                        Save more on your
                        order
                      </h2>

                      <p className="mt-1 text-[10px] text-text-muted sm:text-xs">
                        Apply a coupon and
                        get the best available
                        price.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCouponModal(
                        true
                      )
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-primary sm:w-auto"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    View offers
                  </button>
                </div>

                <form
                  onSubmit={
                    handleCouponSubmit
                  }
                  className="mt-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                      <input
                        value={
                          couponInput
                        }
                        onChange={(
                          event
                        ) => {
                          setCouponInput(
                            event.target.value.toUpperCase()
                          );

                          setCouponError(
                            ""
                          );
                        }}
                        placeholder="ENTER COUPON CODE"
                        disabled={
                          couponLoading ||
                          Boolean(
                            appliedCoupon
                          )
                        }
                        className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold tracking-wide outline-none focus:border-primary disabled:opacity-60"
                      />
                    </div>

                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={
                          handleRemoveCoupon
                        }
                        disabled={
                          couponLoading
                        }
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 text-xs font-bold text-red-500 disabled:opacity-50"
                      >
                        {couponLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            Remove
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={
                          couponLoading
                        }
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white disabled:opacity-50"
                      >
                        {couponLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <>
                            Apply
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {couponError && (
                    <p className="mt-2 text-xs text-red-500">
                      {couponError}
                    </p>
                  )}
                </form>

                {appliedCoupon && (
                  <div className="mt-4 flex flex-col gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                        <Check className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-green-600">
                          Coupon applied
                        </p>

                        <p className="mt-0.5 text-xs font-bold">
                          {
                            appliedCoupon?.code
                          }
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase text-text-muted">
                        You save
                      </p>

                      <p className="text-sm font-bold text-green-600">
                        {formatPrice(
                          finalCouponDiscount
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-6">
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setMobileSummaryOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="flex w-full items-center justify-between border-b border-border p-4 text-left sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    3
                  </span>

                  <div>
                    <h2 className="text-sm font-bold sm:text-base">
                      Order summary
                    </h2>

                    <p className="mt-0.5 text-[10px] text-text-muted">
                      {cartCount}{" "}
                      {cartCount === 1
                        ? "item"
                        : "items"}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition lg:hidden ${mobileSummaryOpen
                    ? "rotate-180"
                    : ""
                    }`}
                />
              </button>

              <div
                className={
                  mobileSummaryOpen
                    ? "block"
                    : "hidden lg:block"
                }
              >
                <div className="p-4 sm:p-6">
                  {!cart.length ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-text-muted" />

                      <p className="mt-3 text-xs font-semibold">
                        No items in
                        checkout
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {cart.map(
                        (item) => (
                          <CheckoutCartItem
                            key={
                              item?.id ??
                              item?.cartItemId ??
                              item?._id ??
                              item?.productId
                            }
                            item={item}
                            formatPrice={
                              formatPrice
                            }
                            onQuantityChange={
                              handleQuantityChange
                            }
                            onRemove={
                              handleRemoveItem
                            }
                            slug={
                              item?.slug ??
                              item?.product?.slug ??
                              ""
                            }
                          />
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-5 border-t border-border pt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">
                        Subtotal
                      </span>

                      <span className="font-semibold">
                        {formatPrice(
                          cartSubtotal
                        )}
                      </span>
                    </div>

                    {finalCouponDiscount >
                      0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600">
                            Coupon discount
                          </span>

                          <span className="font-semibold text-green-600">
                            -
                            {formatPrice(
                              finalCouponDiscount
                            )}
                          </span>
                        </div>
                      )}

                    {paymentMode ===
                      "COD" && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted">
                            COD handling
                          </span>

                          <span className="font-semibold">
                            {formatPrice(
                              codCharge
                            )}
                          </span>
                        </div>
                      )}

                    <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-text-muted">
                          Total payable
                        </p>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Inclusive of
                          applicable
                          charges
                        </p>
                      </div>

                      <p className="text-xl font-bold sm:text-2xl">
                        {formatPrice(
                          payableAmount
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 hidden items-start gap-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3 sm:flex">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                    <div>
                      <p className="text-[10px] font-bold text-green-700">
                        Safe & secure
                        checkout
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-text-muted">
                        Your payment and
                        personal information
                        are protected.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      startPayment
                    }
                    disabled={
                      paymentLoading ||
                      !selectedAddressId ||
                      (isBuyNow
                        ? !buyNowItem
                        : !cart.length)
                    }
                    className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
                  >
                    {paymentLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMode ===
                          "COD"
                          ? "Place order"
                          : "Pay now"}

                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.15em] text-text-muted">
              Total payable
            </p>

            <p className="mt-0.5 truncate text-lg font-bold">
              {formatPrice(
                payableAmount
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              startPayment
            }
            disabled={
              paymentLoading ||
              !selectedAddressId ||
              (isBuyNow
                ? !buyNowItem
                : !cart.length)
            }
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[10px] font-bold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paymentLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                {paymentMode ===
                  "COD"
                  ? "Place order"
                  : "Pay now"}

                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {showCouponModal && (
        <CouponModal
          coupons={coupons}
          cartTotal={cartSubtotal}
          formatPrice={formatPrice}
          getCouponDescription={
            getCouponDescription
          }
          onApply={
            handleApplyCoupon
          }
          onClose={() =>
            setShowCouponModal(
              false
            )
          }
          loading={
            couponLoading
          }
        />
      )}
    </main>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-text-muted">
        {label}
      </label>

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`w-full rounded-xl border ${error
          ? "border-red-500"
          : "border-border"
          } bg-background px-4 py-3 text-xs outline-none focus:border-primary`}
      />

      {error && (
        <p className="mt-1 text-[10px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutCartItem({
  item,
  formatPrice,
  onQuantityChange,
  onRemove,
  slug,
}) {
  const product =
    item?.product ?? {};

  const variant =
    item?.variant ??
    item?.productVariant ??
    item?.selectedVariant ??
    null;

  const name =
    item?.name ??
    product?.name ??
    product?.title ??
    "Product";

  const imageUrl =
    getImageUrl(
      variant?.image
    ) ||
    getImageUrl(
      variant?.featuredImage
    ) ||
    getImageUrl(
      variant?.featuredimg
    ) ||
    getImageUrl(
      product?.featuredimg
    ) ||
    getImageUrl(
      product?.featuredImage
    ) ||
    getImageUrl(
      product?.image
    ) ||
    getImageUrl(
      item?.image
    );

  const price =
    getItemPrice(item);

  const quantity =
    Number(
      item?.quantity || 1
    );

  const subtotal =
    price * quantity;

  const variantName =
    variant?.name ??
    variant?.title ??
    variant?.value ??
    variant?.label ??
    "";

  const variantDetails = [
    variant?.flavour,
    variant?.flavor,
    variant?.size,
    variant?.weight,
    variant?.packSize,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-20 sm:w-20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="80px"
              className="object-contain p-1"
            />
          ) : (
            <ShoppingBag className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-text-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">
                {name}
              </p>

              {variantName && (
                <p className="mt-1 text-[9px] text-text-muted">
                  {variantName}
                </p>
              )}

              {variantDetails && (
                <p className="mt-1 text-[9px] text-text-muted">
                  {variantDetails}
                </p>
              )}
            </div>

            <p className="shrink-0 text-xs font-bold">
              {formatPrice(
                subtotal
              )}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(
                    item,
                    quantity - 1
                  )
                }
                disabled={
                  quantity <= 1
                }
                className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
              >
                <Minus className="h-3 w-3" />
              </button>

              <span className="min-w-8 text-center text-[10px] font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  onQuantityChange(
                    item,
                    quantity + 1
                  )
                }
                className="flex h-8 w-8 items-center justify-center"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {!String(
              item?.id ??
              item?.cartItemId ??
              ""
            ).startsWith(
              "buy-now-"
            ) && (
                <button
                  type="button"
                  onClick={() =>
                    onRemove(item)
                  }
                  className="text-[9px] font-bold uppercase text-red-500"
                >
                  Remove
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CouponModal({
  coupons,
  cartTotal,
  formatPrice,
  getCouponDescription,
  onApply,
  onClose,
  loading,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[88vh] w-full overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Tag className="h-4 w-4" />
              </div>

              <h2 className="text-sm font-bold sm:text-base">
                Available offers
              </h2>
            </div>

            <p className="mt-1 text-[10px] text-text-muted">
              Pick an offer that works
              for your order.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(88vh-90px)] overflow-y-auto p-4 sm:p-6">
          {!coupons.length ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <Tag className="mx-auto h-8 w-8 text-text-muted" />

              <p className="mt-3 text-xs font-bold">
                No coupons available
              </p>

              <p className="mt-1 text-[10px] text-text-muted">
                Check again later for
                new offers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map(
                (coupon, index) => {
                  const minimumCartValue =
                    Number(
                      coupon?.minCartValue ??
                      coupon?.minimumCartValue ??
                      coupon?.minOrderValue ??
                      0
                    );

                  const eligible =
                    cartTotal >=
                    minimumCartValue;

                  const code =
                    coupon?.code ||
                    coupon?.couponCode ||
                    `COUPON-${index}`;

                  return (
                    <div
                      key={
                        coupon?.id ??
                        code
                      }
                      className="rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                              {code}
                            </span>

                            <span className="text-[10px] font-bold text-green-600">
                              {getCouponDescription(
                                coupon
                              )}
                            </span>
                          </div>

                          <p className="mt-2 text-[10px] leading-4 text-text-muted">
                            {coupon?.description ||
                              getCouponDescription(
                                coupon
                              )}
                          </p>

                          {!eligible &&
                            minimumCartValue >
                            0 && (
                              <p className="mt-2 text-[9px] text-red-500">
                                Add{" "}
                                {formatPrice(
                                  minimumCartValue -
                                  cartTotal
                                )}{" "}
                                more to unlock
                              </p>
                            )}
                        </div>

                        <button
                          type="button"
                          disabled={
                            !eligible ||
                            loading
                          }
                          onClick={() =>
                            onApply(
                              coupon
                            )
                          }
                          className="shrink-0 rounded-xl bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-white disabled:bg-surface disabled:text-text-muted"
                        >
                          {eligible
                            ? "Apply"
                            : "Locked"}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-[1440px] animate-pulse">
        <div className="h-6 w-32 rounded bg-surface" />

        <div className="mt-8 h-10 w-72 rounded bg-surface" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">
          <div className="space-y-5">
            <div className="h-72 rounded-2xl bg-surface" />
            <div className="h-48 rounded-2xl bg-surface" />
            <div className="h-40 rounded-2xl bg-surface" />
          </div>

          <div className="h-[500px] rounded-2xl bg-surface" />
        </div>
      </div>
    </main>
  );
}