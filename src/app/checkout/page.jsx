"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Crosshair,
  CreditCard,
  Home,
  Lock,
  MapPin,
  Minus,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  createRazorpayOrderApi,
  buyNowApi,
  verifyPaymentApi,
  couponApi,
  removeCouponApi,
  appplyCouponApi,
} from "@/apiService/api";

import {
  fetchCartItems,
  updateItemQuantity,
  deleteCartItem,
} from "@/redux/features/cart/cartActions";

import {
  getAddress,
  createAddress,
  updateAddress,
} from "@/redux/features/address/addressAction";

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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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

  return Math.min(
    Math.max(0, discount),
    total
  );
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isBuyNow =
    searchParams.get("buyNow") === "true";

  const debounceRef = useRef(null);
  const mountedRef = useRef(true);

  const cartState = useSelector(
    (state) => state.product
  );

  const addressState = useSelector(
    (state) => state.address
  );

  /* ---------------------------------------------------------------------- */
  /* Address state                                                          */
  /* ---------------------------------------------------------------------- */

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [showAllAddresses, setShowAllAddresses] =
    useState(false);

  const [form, setForm] =
    useState(emptyAddress);

  const [formErrors, setFormErrors] =
    useState({});

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

  /* ---------------------------------------------------------------------- */
  /* Coupon state                                                           */
  /* ---------------------------------------------------------------------- */

  const [coupons, setCoupons] = useState([]);

  const [couponInput, setCouponInput] =
    useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [appliedCouponDiscount, setAppliedCouponDiscount] =
    useState(0);

  const [couponLoading, setCouponLoading] =
    useState(false);

  const [couponError, setCouponError] =
    useState("");

  const [showCouponModal, setShowCouponModal] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* Buy Now state                                                          */
  /* ---------------------------------------------------------------------- */

  const [buyNowItem, setBuyNowItem] =
    useState(null);

  /* ---------------------------------------------------------------------- */
  /* Cart data                                                              */
  /* ---------------------------------------------------------------------- */

  const cartStateProducts =
    cartState?.products;

  const cartData =
    cartStateProducts?.cart ??
    cartStateProducts ??
    {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartStateProducts?.cart?.items ??
    [];

  const normalCart =
    Array.isArray(rawItems)
      ? rawItems
      : [];

  const cart = isBuyNow
    ? buyNowItem
      ? [buyNowItem]
      : []
    : normalCart;

  /* ---------------------------------------------------------------------- */
  /* Address data                                                           */
  /* ---------------------------------------------------------------------- */

  const addressData =
    addressState?.addressData;

  const rawAddresses =
    addressData?.addresses ??
    addressData?.data?.addresses ??
    addressData?.data ??
    addressData;

  const addresses =
    Array.isArray(rawAddresses)
      ? rawAddresses
      : [];

  /* ---------------------------------------------------------------------- */
  /* Authentication                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  /* ---------------------------------------------------------------------- */
  /* Format price                                                           */
  /* ---------------------------------------------------------------------- */

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString(
      "en-IN"
    )}`;

  /* ---------------------------------------------------------------------- */
  /* Cart / Buy Now totals                                                  */
  /* ---------------------------------------------------------------------- */

  const calculatedCartTotal =
    cart.reduce((total, item) => {
      const price =
        getItemPrice(item);

      const quantity =
        Number(item?.quantity || 0);

      return (
        total +
        price * quantity
      );
    }, 0);

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
    discountedTotal +
    codCharge;

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

  const couponCode =
    appliedCoupon?.code ||
    (!isBuyNow
      ? cartData?.couponCode || ""
      : "");

  useEffect(() => {
    mountedRef.current = true;

    dispatch(getAddress());

    if (!isBuyNow) {
      dispatch(fetchCartItems());
    } else {
      try {
        const saved =
          sessionStorage.getItem(
            "buyNowCheckout"
          );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (
            parsed?.productId &&
            parsed?.quantity
          ) {
            setBuyNowItem({
              id: `buy-now-${parsed.productId}-${parsed.variantId ??
                "default"
                }`,
              productId:
                parsed.productId,
              variantId:
                parsed.variantId ??
                null,
              quantity:
                Number(
                  parsed.quantity
                ) || 1,
              name:
                parsed.name ??
                parsed.title ??
                "Product",
              price:
                Number(
                  parsed.price ??
                  parsed.unitPrice ??
                  0
                ),
              image:
                parsed.image ?? null,
              variant:
                parsed.variant ?? null,
              product:
                parsed.product ?? {},
            });
          }
        }
      } catch (error) {
        console.error(
          "Buy Now session data error:",
          error
        );

        toast.error(
          "Unable to load the Buy Now item."
        );
      }
    }

    return () => {
      mountedRef.current = false;

      if (debounceRef.current) {
        clearTimeout(
          debounceRef.current
        );
      }
    };
  }, [
    dispatch,
    isBuyNow,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Sync Buy Now quantity into sessionStorage                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !isBuyNow ||
      !buyNowItem
    ) {
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
  ]);

  /* ---------------------------------------------------------------------- */
  /* Sync normal cart coupon                                                */
  /* ---------------------------------------------------------------------- */

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
        cartData?.discountAmount ??
        0
      ) || 0;

    if (code) {
      setCouponInput(
        String(
          code
        ).toUpperCase()
      );

      setAppliedCoupon({
        ...(cartData?.coupon || {}),
        code,
        discountAmount:
          discount,
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

  /* ---------------------------------------------------------------------- */
  /* Load coupons - works for Buy Now too                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true;

    const loadCoupons = async () => {
      try {
        const response =
          await couponApi();

        const data =
          response?.data ??
          response;

        if (
          active &&
          data?.success &&
          Array.isArray(
            data?.coupons
          )
        ) {
          setCoupons(
            data.coupons
          );
        } else if (active) {
          setCoupons([]);
        }
      } catch (error) {
        console.error(
          "Coupon API error:",
          error?.response?.data ||
          error?.message
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

  /* ---------------------------------------------------------------------- */
  /* Coupon modal keyboard handling                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!showCouponModal) {
      return;
    }

    const onKeyDown = (event) => {
      if (
        event.key === "Escape"
      ) {
        setShowCouponModal(
          false
        );
      }
    };

    document.addEventListener(
      "keydown",
      onKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        onKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    showCouponModal,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Select default address                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!addresses.length) {
      return;
    }

    const currentExists =
      addresses.some(
        (address) =>
          Number(
            address?.id
          ) ===
          Number(
            selectedAddressId
          )
      );

    if (!currentExists) {
      const defaultAddress =
        addresses.find(
          (address) =>
            address?.isDefault ===
            true
        );

      setSelectedAddressId(
        defaultAddress?.id ??
        addresses[0]?.id ??
        null
      );
    }
  }, [
    addresses,
    selectedAddressId,
  ]);

  /* ---------------------------------------------------------------------- */
  /* If selected address is hidden, automatically expand                    */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (
      !selectedAddressId ||
      addresses.length <= 2
    ) {
      return;
    }

    const selectedIndex =
      addresses.findIndex(
        (address) =>
          Number(
            address?.id
          ) ===
          Number(
            selectedAddressId
          )
      );

    if (selectedIndex > 1) {
      setShowAllAddresses(
        true
      );
    }
  }, [
    selectedAddressId,
    addresses,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Coupon description                                                     */
  /* ---------------------------------------------------------------------- */

  const getCouponDescription =
    (coupon) => {
      if (
        coupon?.discountType ===
        "PERCENTAGE"
      ) {
        return `${coupon?.discountValue || 0}% OFF`;
      }

      if (
        coupon?.discountType ===
        "FIXED"
      ) {
        return `${formatPrice(
          coupon?.discountValue
        )} OFF`;
      }

      if (
        coupon?.discountAmount !==
        undefined &&
        coupon?.discountAmount !==
        null
      ) {
        return `${formatPrice(
          coupon.discountAmount
        )} OFF`;
      }

      return "Special discount";
    };

  /* ---------------------------------------------------------------------- */
  /* Apply coupon                                                           */
  /* ---------------------------------------------------------------------- */

  const handleApplyCoupon =
    async (coupon) => {
      const code =
        coupon?.code ||
        coupon?.couponCode;

      if (!code) {
        setCouponError(
          "Coupon code is missing."
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
        const message = `Minimum order value is ${formatPrice(
          minimumCartValue
        )}.`;

        setCouponError(message);
        toast.error(message);
        return;
      }

      try {
        setCouponLoading(true);
        setCouponError("");

        /*
         * Normal cart:
         * use backend coupon API exactly as before.
         */
        if (!isBuyNow) {
          const response =
            await appplyCouponApi(
              code
            );

          const data =
            response?.data ??
            response;

          if (
            data?.success === false
          ) {
            throw new Error(
              data?.message ||
              "Unable to apply coupon."
            );
          }

          const serverCouponCode =
            data?.couponCode ||
            data?.coupon?.code ||
            data?.appliedCoupon?.code ||
            code;

          const serverDiscount =
            Number(
              data?.discountAmount ??
              data?.discount ??
              data?.couponDiscount ??
              0
            );

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
            fetchCartItems()
          );

          setShowCouponModal(
            false
          );

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

        /*
         * Buy Now:
         *
         * appplyCouponApi() is cart-oriented in the
         * current API usage, so don't mutate the user's
         * actual cart just to apply a Buy Now coupon.
         *
         * Calculate the discount against the Buy Now
         * item and keep the coupon attached to the
         * Buy Now checkout session.
         */
        const localDiscount =
          calculateCouponDiscount(
            coupon,
            cartSubtotal
          );

        if (
          localDiscount <= 0
        ) {
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

        setCouponInput(
          String(
            code
          ).toUpperCase()
        );

        setAppliedCouponDiscount(
          localDiscount
        );

        setShowCouponModal(
          false
        );

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
              couponCode:
                code,
              couponId:
                coupon?.id ??
                null,
              couponDiscount:
                localDiscount,
            })
          );
        } catch (storageError) {
          console.error(
            "Buy Now coupon session error:",
            storageError
          );
        }

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
          "Apply coupon API error:",
          error?.response?.data ||
          error?.message
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to apply coupon.";

        setCouponError(
          message
        );

        toast.error(message);
      } finally {
        setCouponLoading(
          false
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Coupon input submit                                                    */
  /* ---------------------------------------------------------------------- */

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
            ).toUpperCase() ===
            code
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

  /* ---------------------------------------------------------------------- */
  /* Remove coupon                                                          */
  /* ---------------------------------------------------------------------- */

  const handleRemoveCoupon =
    async () => {
      if (
        !appliedCoupon
      ) {
        return;
      }

      try {
        setCouponLoading(
          true
        );

        /*
         * Normal cart coupon removal
         */
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
        }

        /*
         * Buy Now coupon is local checkout state.
         */
        if (isBuyNow) {
          try {
            const saved =
              sessionStorage.getItem(
                "buyNowCheckout"
              );

            const parsed =
              saved
                ? JSON.parse(
                  saved
                )
                : {};

            delete parsed.couponCode;
            delete parsed.couponId;
            delete parsed.couponDiscount;

            sessionStorage.setItem(
              "buyNowCheckout",
              JSON.stringify(
                parsed
              )
            );
          } catch (storageError) {
            console.error(
              "Buy Now coupon removal session error:",
              storageError
            );
          }
        }

        setAppliedCoupon(
          null
        );

        setAppliedCouponDiscount(
          0
        );

        setCouponInput("");

        setCouponError("");

        toast.success(
          "Coupon removed."
        );
      } catch (error) {
        console.error(
          "Remove coupon error:",
          error?.response?.data ||
          error?.message
        );

        toast.error(
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to remove coupon."
        );
      } finally {
        setCouponLoading(
          false
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Address form change                                                    */
  /* ---------------------------------------------------------------------- */

  const handleFormChange =
    (event) => {
      const {
        name,
        value,
        type,
        checked,
      } = event.target;

      setForm(
        (previous) => ({
          ...previous,
          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );

      setFormErrors(
        (previous) => ({
          ...previous,
          [name]: "",
        })
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Add address                                                            */
  /* ---------------------------------------------------------------------- */

  const handleAddAddress =
    () => {
      setEditingAddressId(
        null
      );

      setForm({
        ...emptyAddress,
      });

      setFormErrors({});

      setShowAddressForm(
        true
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Edit address                                                           */
  /* ---------------------------------------------------------------------- */

  const handleEditAddress =
    (address) => {
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

      setShowAddressForm(
        true
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Validate address                                                       */
  /* ---------------------------------------------------------------------- */

  const validateAddress =
    () => {
      const errors = {};

      if (
        !form.fullName?.trim()
      ) {
        errors.fullName =
          "Full name is required.";
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

      if (
        !form.addressLine1?.trim()
      ) {
        errors.addressLine1 =
          "Address is required.";
      }

      if (
        !form.city?.trim()
      ) {
        errors.city =
          "City is required.";
      }

      if (
        !form.state?.trim()
      ) {
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

      setFormErrors(
        errors
      );

      return (
        Object.keys(
          errors
        ).length === 0
      );
    };

  /* ---------------------------------------------------------------------- */
  /* Save address                                                           */
  /* ---------------------------------------------------------------------- */

  const handleSaveAddress =
    async (event) => {
      event.preventDefault();

      if (
        !validateAddress()
      ) {
        return;
      }

      try {
        setSavingAddress(
          true
        );

        let response;

        if (
          editingAddressId
        ) {
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

        if (
          response?.error
        ) {
          throw new Error(
            response.error
              ?.message ||
            "Unable to save address."
          );
        }

        await dispatch(
          getAddress()
        );

        setShowAddressForm(
          false
        );

        setEditingAddressId(
          null
        );

        toast.success(
          editingAddressId
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
        setSavingAddress(
          false
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Pincode lookup                                                         */
  /* ---------------------------------------------------------------------- */

  const lookupPincode =
    async (pincode) => {
      if (
        !/^\d{6}$/.test(
          String(
            pincode || ""
          )
        )
      ) {
        return;
      }

      try {
        setPincodeLookupLoading(
          true
        );

        const response =
          await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
          );

        const result =
          response?.data?.[0];

        if (
          result?.Status ===
          "Success" &&
          result?.PostOffice
            ?.length
        ) {
          const office =
            result.PostOffice[0];

          setForm(
            (previous) => ({
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
            })
          );
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

  const handlePincodeChange =
    (event) => {
      const value =
        event.target.value
          .replace(/\D/g, "")
          .slice(0, 6);

      setForm(
        (previous) => ({
          ...previous,
          pincode: value,
        })
      );

      setFormErrors(
        (previous) => ({
          ...previous,
          pincode: "",
        })
      );

      if (
        value.length === 6
      ) {
        lookupPincode(
          value
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Browser location                                                       */
  /* ---------------------------------------------------------------------- */

  const detectLocation =
    () => {
      if (
        !navigator.geolocation
      ) {
        toast.error(
          "Location is not supported by this browser."
        );
        return;
      }

      setLocationLoading(
        true
      );

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
              response?.data
                ?.address;

            setForm(
              (previous) => ({
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
                country:
                  "India",
              })
            );

            toast.success(
              "Location detected."
            );
          } catch (error) {
            console.error(
              "Location reverse geocoding error:",
              error
            );

            toast.error(
              "Unable to detect your location."
            );
          } finally {
            setLocationLoading(
              false
            );
          }
        },
        () => {
          setLocationLoading(
            false
          );

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

  /* ---------------------------------------------------------------------- */
  /* Quantity update                                                        */
  /* ---------------------------------------------------------------------- */

  const handleQuantityChange =
    async (
      item,
      nextQuantity
    ) => {
      const newQuantity =
        Number(
          nextQuantity
        );

      if (
        !Number.isFinite(
          newQuantity
        ) ||
        newQuantity < 1
      ) {
        return;
      }

      /*
       * BUY NOW
       *
       * Buy Now does not have a normal
       * cartItemId, so update local state.
       */
      if (isBuyNow) {
        setBuyNowItem(
          (previous) => {
            if (!previous) {
              return previous;
            }

            return {
              ...previous,
              quantity:
                newQuantity,
            };
          }
        );

        return;
      }

      /* Normal cart */
      const itemId =
        item?.id ??
        item?.cartItemId ??
        item?._id;

      if (!itemId) {
        return;
      }

      if (
        debounceRef.current
      ) {
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
                  newQuantity
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

  /* ---------------------------------------------------------------------- */
  /* Remove item                                                            */
  /* ---------------------------------------------------------------------- */

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
          deleteCartItem(
            itemId
          )
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

  /* ---------------------------------------------------------------------- */
  /* Start payment                                                          */
  /* ---------------------------------------------------------------------- */

  const startPayment =
    async () => {
      if (
        !selectedAddressId
      ) {
        toast.error(
          "Please select a delivery address."
        );
        return;
      }

      if (!cart.length) {
        toast.error(
          "Your checkout is empty."
        );
        return;
      }

      try {
        setPaymentLoading(
          true
        );

        let response;

        if (isBuyNow) {
          /*
           * Buy Now request.
           *
           * couponCode is included so the backend
           * can apply the same coupon at order level
           * if buyNowApi supports couponCode.
           */
          response =
            await buyNowApi({
              productId:
                buyNowItem?.productId,

              variantId:
                buyNowItem?.variantId,

              quantity:
                Number(
                  buyNowItem?.quantity ||
                  1
                ),

              addressId:
                selectedAddressId,

              paymentMethod:
                paymentMode,

              couponCode:
                appliedCoupon?.code ||
                null,

              couponId:
                appliedCoupon?.id ||
                null,

              couponDiscount:
                Number(
                  appliedCouponDiscount ||
                  0
                ),
            });
        } else {
          response =
            await createRazorpayOrderApi({
              addressId:
                selectedAddressId,

              paymentMethod:
                paymentMode,
            });
        }

        const data =
          response?.data ??
          response;

        if (
          data?.success ===
          false
        ) {
          throw new Error(
            data?.message ||
            "Unable to create order."
          );
        }

        /* ---------------------------------------------------------------- */
        /* COD                                                               */
        /* ---------------------------------------------------------------- */

        if (
          paymentMode === "COD"
        ) {
          if (isBuyNow) {
            sessionStorage.removeItem(
              "buyNowCheckout"
            );
          }

          toast.success(
            "Order placed successfully."
          );

          router.push(
            "/cart"
          );

          return;
        }

        /* ---------------------------------------------------------------- */
        /* Razorpay                                                          */
        /* ---------------------------------------------------------------- */

        const razorpayOrder =
          data?.order ??
          data?.data ??
          data;

        if (
          !razorpayOrder?.id
        ) {
          throw new Error(
            "Razorpay order ID is missing."
          );
        }

        if (
          typeof window ===
          "undefined" ||
          !window.Razorpay
        ) {
          throw new Error(
            "Razorpay is not loaded."
          );
        }

        const razorpay =
          new window.Razorpay({
            key:
              razorpayOrder?.key ||
              process.env
                .NEXT_PUBLIC_RAZORPAY_KEY_ID,

            amount:
              razorpayOrder?.amount,

            currency:
              razorpayOrder?.currency ||
              "INR",

            name:
              "Cost2Cost",

            description:
              isBuyNow
                ? "Buy Now Order"
                : "Order Payment",

            order_id:
              razorpayOrder?.id,

            handler:
              async function (
                paymentResponse
              ) {
                try {
                  const verifyResponse =
                    await verifyPaymentApi(
                      paymentResponse
                    );

                  const verifyData =
                    verifyResponse?.data ??
                    verifyResponse;

                  if (
                    verifyData?.success ===
                    false
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

                  toast.success(
                    "Payment successful. Order placed."
                  );

                  router.push(
                    "/cart"
                  );
                } catch (error) {
                  console.error(
                    "Payment verification error:",
                    error
                  );

                  toast.error(
                    error?.message ||
                    "Payment verification failed."
                  );
                } finally {
                  if (
                    mountedRef.current
                  ) {
                    setPaymentLoading(
                      false
                    );
                  }
                }
              },

            prefill: {
              name:
                selectedAddress?.fullName ||
                "",

              email:
                selectedAddress?.email ||
                "",

              contact:
                selectedAddress?.mobile ||
                "",
            },

            theme: {
              color:
                "#111111",
            },

            modal: {
              ondismiss:
                () => {
                  if (
                    mountedRef.current
                  ) {
                    setPaymentLoading(
                      false
                    );
                  }
                },
            },
          });

        razorpay.open();
      } catch (error) {
        console.error(
          "Checkout payment error:",
          error?.response?.data ||
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          error?.message ||
          "Unable to process checkout."
        );

        setPaymentLoading(
          false
        );
      }
    };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (
    !isBuyNow &&
    !cartData &&
    !cartStateProducts
  ) {
    return (
      <CheckoutSkeleton />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Visible addresses                                                      */
  /* ---------------------------------------------------------------------- */

  const visibleAddresses =
    showAllAddresses
      ? addresses
      : addresses.slice(
        0,
        2
      );

  const hiddenAddressCount =
    Math.max(
      0,
      addresses.length - 2
    );

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-background text-text-primary pb-28 lg:pb-10">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-10 lg:py-5">

          <Link
            href="/cart"
            className="group inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-text-muted transition hover:text-text-primary sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5" />

            <span className="truncate">
              Back to cart
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <Lock className="h-4 w-4 text-green-600" />

            <span className="hidden xs:inline">
              Secure checkout
            </span>

            <span className="xs:hidden">
              Secure
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <div className="mb-7 sm:mb-10">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Checkout
          </div>

          <h1 className="oxanium text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Complete your order
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-text-muted sm:text-sm sm:leading-6">
            Select your delivery address,
            choose a payment method, and
            review your order before placing
            it.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">

          {/* ============================================================ */}
          {/* LEFT                                                          */}
          {/* ============================================================ */}

          <div className="min-w-0 space-y-5 sm:space-y-6">

            {/* ========================================================== */}
            {/* ADDRESS                                                     */}
            {/* ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

              <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                <div>
                  <div className="flex items-center gap-3">

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      1
                    </span>

                    <div>
                      <h2 className="oxanium text-sm font-bold sm:text-base">
                        Delivery address
                      </h2>

                      <p className="mt-0.5 text-[10px] text-text-muted sm:text-xs">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>
                </div>

                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={
                      handleAddAddress
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs font-bold text-primary transition hover:bg-primary/10 sm:w-auto sm:py-2.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add new address
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-6">

                {/* Address form */}
                {showAddressForm ? (
                  <form
                    onSubmit={
                      handleSaveAddress
                    }
                    className="space-y-5"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <h3 className="oxanium text-sm font-bold">
                          {editingAddressId
                            ? "Edit address"
                            : "Add new address"}
                        </h3>

                        <p className="mt-1 text-xs text-text-muted">
                          Enter your complete
                          delivery details.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowAddressForm(
                            false
                          )
                        }
                        className="self-start rounded-lg p-2 text-text-muted transition hover:bg-surface hover:text-text-primary"
                        aria-label="Close address form"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <AddressInput
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
                        placeholder="Enter full name"
                        required
                      />

                      <AddressInput
                        label="Mobile number"
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
                        placeholder="10-digit mobile number"
                        inputMode="numeric"
                        maxLength={10}
                        required
                      />

                      <AddressInput
                        label="Alternate mobile"
                        name="alternateMobile"
                        value={
                          form.alternateMobile
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.alternateMobile
                        }
                        placeholder="Optional"
                        inputMode="numeric"
                        maxLength={10}
                      />

                      <AddressInput
                        label="Email"
                        name="email"
                        value={
                          form.email
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.email
                        }
                        placeholder="Email address"
                        type="email"
                      />

                      <div className="sm:col-span-2">
                        <AddressInput
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
                          placeholder="House no., building, street"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <AddressInput
                          label="Address line 2"
                          name="addressLine2"
                          value={
                            form.addressLine2
                          }
                          onChange={
                            handleFormChange
                          }
                          error={
                            formErrors.addressLine2
                          }
                          placeholder="Apartment, floor, area (optional)"
                        />
                      </div>

                      <AddressInput
                        label="Landmark"
                        name="landmark"
                        value={
                          form.landmark
                        }
                        onChange={
                          handleFormChange
                        }
                        error={
                          formErrors.landmark
                        }
                        placeholder="Nearby landmark"
                      />

                      <div>
                        <label className="oxanium mb-2 block text-xs font-semibold">
                          Pincode
                          <span className="ml-1 text-primary">
                            *
                          </span>
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
                            placeholder="6-digit pincode"
                            inputMode="numeric"
                            maxLength={6}
                            className={`oxanium w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm outline-none transition ${formErrors.pincode
                                ? "border-primary"
                                : "border-border focus:border-primary"
                              }`}
                          />

                          {pincodeLookupLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                            </div>
                          )}
                        </div>

                        {formErrors.pincode && (
                          <p className="mt-1.5 text-xs text-primary">
                            {
                              formErrors.pincode
                            }
                          </p>
                        )}
                      </div>

                      <AddressInput
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
                        placeholder="City"
                        required
                      />

                      <AddressInput
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
                        placeholder="State"
                        required
                      />

                      <div className="sm:col-span-2">

                        <label className="oxanium mb-2 block text-xs font-semibold">
                          Address type
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                          {[
                            {
                              value:
                                "Home",
                              icon:
                                Home,
                            },
                            {
                              value:
                                "Work",
                              icon:
                                Building2,
                            },
                          ].map(
                            ({
                              value,
                              icon: Icon,
                            }) => (
                              <button
                                type="button"
                                key={
                                  value
                                }
                                onClick={() =>
                                  setForm(
                                    (
                                      previous
                                    ) => ({
                                      ...previous,
                                      addressType:
                                        value,
                                    })
                                  )
                                }
                                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition ${form.addressType ===
                                    value
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-text-muted hover:border-primary/40"
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                                {value}
                              </button>
                            )
                          )}

                        </div>
                      </div>

                      <div className="sm:col-span-2">

                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-4">

                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={
                              !!form.isDefault
                            }
                            onChange={
                              handleFormChange
                            }
                            className="h-4 w-4 accent-primary"
                          />

                          <span>
                            <span className="block text-xs font-semibold">
                              Make this my default address
                            </span>

                            <span className="mt-0.5 block text-[10px] text-text-muted">
                              Use this address for future orders.
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <button
                        type="button"
                        onClick={
                          detectLocation
                        }
                        disabled={
                          locationLoading
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold transition hover:border-primary/40 disabled:opacity-50"
                      >
                        {locationLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
                        ) : (
                          <Crosshair className="h-4 w-4" />
                        )}

                        Use my location
                      </button>

                      <button
                        type="submit"
                        disabled={
                          savingAddress
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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
                              className={`group relative w-full rounded-2xl border p-4 text-left transition ${active
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
                                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-green-600">
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

                              <p className="mt-4 text-xs leading-5 text-text-muted">

                                {
                                  address?.addressLine1
                                }

                                {address?.addressLine2
                                  ? `, ${address.addressLine2}`
                                  : ""}

                                {address?.landmark
                                  ? `, ${address.landmark}`
                                  : ""}
                              </p>

                              <p className="mt-1 text-xs text-text-muted">
                                {
                                  address?.city
                                }
                                ,{" "}
                                {
                                  address?.state
                                }{" "}
                                -{" "}
                                {
                                  address?.pincode
                                }
                              </p>

                              <div className="pointer-events-auto mt-4 flex items-center justify-between border-t border-border pt-3">

                                <span className="text-[9px] font-bold uppercase tracking-wide text-text-muted">
                                  {
                                    address?.addressType ||
                                    "Home"
                                  }
                                </span>

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
                                  onKeyDown={(
                                    event
                                  ) => {
                                    if (
                                      event.key ===
                                      "Enter"
                                    ) {
                                      event.stopPropagation();
                                      handleEditAddress(
                                        address
                                      );
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-primary transition hover:bg-primary/5"
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

                    {/* -------------------------------------------------- */}
                    {/* View more / Show less                             */}
                    {/* -------------------------------------------------- */}

                    {hiddenAddressCount >
                      0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowAllAddresses(
                              (previous) =>
                                !previous
                            )
                          }
                          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold text-primary transition hover:border-primary/30 hover:bg-primary/5"
                        >
                          <span>
                            {showAllAddresses
                              ? "Show less"
                              : `View more addresses (${hiddenAddressCount})`}
                          </span>

                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${showAllAddresses
                                ? "rotate-180"
                                : ""
                              }`}
                          />
                        </button>
                      )}
                  </div>
                ) : (

                  /* ------------------------------------------------------ */
                  /* No addresses                                           */
                  /* ------------------------------------------------------ */

                  <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center sm:p-10">

                    <MapPin className="mx-auto h-8 w-8 text-text-muted" />

                    <h3 className="mt-3 text-sm font-bold">
                      No saved addresses
                    </h3>

                    <p className="mt-1 text-xs text-text-muted">
                      Add a delivery address to continue.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleAddAddress
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add address
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================== */}
            {/* COUPON                                                      */}
            {/* ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

              <div className="p-4 sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Tag className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="oxanium text-sm font-bold sm:text-base">
                        Save more on your order
                      </h2>

                      <p className="mt-1 text-[10px] leading-4 text-text-muted sm:text-xs">
                        Apply a coupon and get the best available price.
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-primary transition hover:bg-primary/10 sm:w-auto sm:py-2.5"
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
                          !!appliedCoupon
                        }
                        className="oxanium w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold tracking-wide outline-none transition placeholder:text-text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 text-xs font-bold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50 sm:min-w-[110px]"
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
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[110px]"
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

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                        <Check className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-wide text-green-600">
                          Coupon applied
                        </p>

                        <p className="oxanium mt-0.5 truncate text-xs font-bold">
                          {
                            appliedCoupon?.code
                          }
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-[9px] uppercase tracking-wide text-text-muted">
                        You save
                      </p>

                      <p className="oxanium text-sm font-bold text-green-600">
                        {formatPrice(
                          finalCouponDiscount
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================== */}
            {/* PAYMENT                                                     */}
            {/* ========================================================== */}

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

              <div className="border-b border-border p-4 sm:p-6">

                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    2
                  </span>

                  <div>
                    <h2 className="oxanium text-sm font-bold sm:text-base">
                      Payment method
                    </h2>

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
                  onClick={() =>
                    setPaymentMode(
                      "PREPAID"
                    )
                  }
                  className={`relative rounded-2xl border p-4 text-left transition sm:p-5 ${paymentMode ===
                      "PREPAID"
                      ? "border-primary bg-primary/[0.035] shadow-sm"
                      : "border-border bg-background hover:border-primary/40"
                    }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${paymentMode ===
                            "PREPAID"
                            ? "bg-primary text-white"
                            : "bg-surface text-text-muted"
                          }`}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>

                      <div>

                        <h3 className="text-xs font-bold sm:text-sm">
                          Prepaid
                        </h3>

                        <p className="mt-1 text-[10px] text-text-muted">
                          UPI, cards & net banking
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${paymentMode ===
                          "PREPAID"
                          ? "border-primary bg-primary"
                          : "border-border"
                        }`}
                    >
                      {paymentMode ===
                        "PREPAID" && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-green-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure online payment
                  </div>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMode(
                      "COD"
                    )
                  }
                  className={`relative rounded-2xl border p-4 text-left transition sm:p-5 ${paymentMode ===
                      "COD"
                      ? "border-primary bg-primary/[0.035] shadow-sm"
                      : "border-border bg-background hover:border-primary/40"
                    }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${paymentMode ===
                            "COD"
                            ? "bg-primary text-white"
                            : "bg-surface text-text-muted"
                          }`}
                      >
                        <Truck className="h-5 w-5" />
                      </div>

                      <div>

                        <h3 className="text-xs font-bold sm:text-sm">
                          Cash on Delivery
                        </h3>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Pay when your order arrives
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${paymentMode ===
                          "COD"
                          ? "border-primary bg-primary"
                          : "border-border"
                        }`}
                    >
                      {paymentMode ===
                        "COD" && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-text-muted">
                    <Truck className="h-3.5 w-3.5" />
                    ₹49 COD handling charge
                  </div>
                </button>
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
                className="flex w-full items-center justify-between border-b border-border p-4 text-left sm:p-6 lg:pointer-events-none"
              >

                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    3
                  </span>

                  <div>

                    <h2 className="oxanium text-sm font-bold sm:text-base">
                      Order summary
                    </h2>

                    <p className="mt-0.5 text-[10px] text-text-muted">
                      {cartCount}{" "}
                      {cartCount ===
                        1
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
                className={`${mobileSummaryOpen
                    ? "block"
                    : "hidden"
                  } lg:block`}
              >

                <div className="p-4 sm:p-6">

                  {!cart.length ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">

                      <ShoppingBag className="mx-auto h-8 w-8 text-text-muted" />

                      <p className="mt-3 text-xs font-semibold">
                        No items in checkout
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
                              item?._id
                            }
                            item={
                              item
                            }
                            formatPrice={
                              formatPrice
                            }
                            onQuantityChange={
                              handleQuantityChange
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

                  {/* ---------------------------------------------------- */}
                  {/* Totals                                                */}
                  {/* ---------------------------------------------------- */}

                  <div className="mt-5 space-y-3 border-t border-border pt-5">

                    <div className="flex items-center justify-between gap-4 text-xs">

                      <span className="text-text-muted">
                        Subtotal
                      </span>

                      <span className="oxanium font-semibold">
                        {formatPrice(
                          cartSubtotal
                        )}
                      </span>
                    </div>

                    {finalCouponDiscount >
                      0 && (
                        <div className="flex items-center justify-between gap-4 text-xs">

                          <span className="flex items-center gap-1.5 text-green-600">

                            <Tag className="h-3.5 w-3.5" />

                            Discount
                            {couponCode
                              ? ` (${couponCode})`
                              : ""}
                          </span>

                          <span className="oxanium font-semibold text-green-600">
                            -{" "}
                            {formatPrice(
                              finalCouponDiscount
                            )}
                          </span>
                        </div>
                      )}

                    <div className="flex items-center justify-between gap-4 text-xs">

                      <span className="text-text-muted">
                        Delivery
                      </span>

                      <span className="font-semibold text-green-600">
                        FREE
                      </span>
                    </div>

                    {codCharge >
                      0 && (
                        <div className="flex items-center justify-between gap-4 text-xs">

                          <span className="text-text-muted">
                            COD handling
                          </span>

                          <span className="oxanium font-semibold">
                            {formatPrice(
                              codCharge
                            )}
                          </span>
                        </div>
                      )}

                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-border pt-4">

                      <div>

                        <p className="text-[9px] uppercase tracking-[0.15em] text-text-muted">
                          Total payable
                        </p>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Inclusive of applicable charges
                        </p>
                      </div>

                      <p className="oxanium text-xl font-bold sm:text-2xl">
                        {formatPrice(
                          payableAmount
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="mt-5 hidden items-start gap-3 rounded-xl border border-green-500/15 bg-green-500/5 p-3 sm:flex">

                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                    <div>

                      <p className="text-[10px] font-bold text-green-700">
                        Safe & secure checkout
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-text-muted">
                        Your payment and personal information are protected.
                      </p>
                    </div>
                  </div>

                  {/* Desktop checkout button */}
                  <button
                    type="button"
                    onClick={
                      startPayment
                    }
                    disabled={
                      paymentLoading ||
                      !selectedAddressId ||
                      !cart.length
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

      {/* ------------------------------------------------------------------ */}
      {/* Mobile fixed checkout bar                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:hidden">

        <div className="mx-auto flex max-w-xl items-center gap-3">

          <div className="min-w-0 flex-1">

            <p className="text-[9px] uppercase tracking-[0.15em] text-text-muted">
              Total payable
            </p>

            <p className="oxanium mt-0.5 truncate text-lg font-bold">
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
              !cart.length
            }
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[10px] font-bold uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* ------------------------------------------------------------------ */}
      {/* Coupon modal                                                       */}
      {/* ------------------------------------------------------------------ */}

      {showCouponModal && (
        <CouponModal
          coupons={coupons}
          cartTotal={
            cartSubtotal
          }
          formatPrice={
            formatPrice
          }
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

/* ========================================================================== */
/* Coupon Modal                                                               */
/* ========================================================================== */

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

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Tag className="h-4 w-4" />
              </div>

              <h2 className="oxanium text-sm font-bold sm:text-base">
                Available offers
              </h2>
            </div>

            <p className="mt-1 text-[10px] text-text-muted">
              Pick an offer that works for your order.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl p-2 text-text-muted transition hover:bg-surface hover:text-text-primary"
            aria-label="Close coupons"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Coupon list */}
        <div className="max-h-[calc(88vh-90px)] overflow-y-auto p-4 sm:p-6">

          {!coupons.length ? (

            <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">

              <Tag className="mx-auto h-8 w-8 text-text-muted" />

              <p className="mt-3 text-xs font-bold">
                No coupons available
              </p>

              <p className="mt-1 text-[10px] text-text-muted">
                Check again later for new offers.
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
                      className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/30"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="oxanium rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1 text-[10px] font-bold tracking-wide text-primary">
                              {code}
                            </span>

                            <span className="text-[10px] font-semibold text-green-600">
                              {getCouponDescription(
                                coupon
                              )}
                            </span>
                          </div>

                          <p className="mt-2 text-[10px] leading-4 text-text-muted">
                            {minimumCartValue >
                              0
                              ? `Minimum order ${formatPrice(
                                minimumCartValue
                              )}`
                              : "No minimum order"}
                          </p>

                          {!eligible &&
                            minimumCartValue >
                            cartTotal && (
                              <p className="mt-1 text-[10px] font-semibold text-red-500">
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
                          className="w-full shrink-0 rounded-xl bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted sm:w-auto sm:py-2.5"
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

/* ========================================================================== */
/* Cart Item                                                                  */
/* ========================================================================== */

function CheckoutCartItem({
  item,
  formatPrice,
  onQuantityChange,
  slug
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

  /* Variant image first, featured image fallback */
  const variantImage =
    getImageUrl(
      variant?.image
    ) ||
    getImageUrl(
      variant?.featuredImage
    ) ||
    getImageUrl(
      variant?.featuredimg
    );

  const productImage =
    getImageUrl(
      product?.featuredimg
    ) ||
    getImageUrl(
      product?.featuredImage
    ) ||
    getImageUrl(
      product?.image
    );

  const imageUrl =
    variantImage ||
    productImage ||
    getImageUrl(
      item?.image
    );

  const price =
    getItemPrice(item);

  const quantity =
    Number(
      item?.quantity || 0
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

    <div className="py-4 first:pt-0 last:pb-0 sm:py-5">

      <div className="flex gap-3 sm:gap-4">

        {/* Image */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-20 sm:w-20">

          {imageUrl ? (
            <Image
              src={
                imageUrl
              }
              alt={
                name
              }
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-text-muted" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="line-clamp-2 text-xs font-bold sm:text-sm">
                {name}
              </p>

              {variantName && (
                <p className="mt-1 text-[10px] font-semibold text-text-muted">
                  {variantName}
                </p>
              )}

              {variantDetails && (
                <p className="mt-0.5 line-clamp-2 text-[9px] text-text-muted">
                  {variantDetails}
                </p>
              )}
            </div>

            <span className="oxanium shrink-0 text-xs font-bold sm:text-sm">
              {formatPrice(
                subtotal
              )}
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-3 flex items-center justify-between gap-3">

            <div className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-background">

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
                className="flex h-7 w-7 items-center justify-center text-text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                aria-label={`Decrease quantity of ${name}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="oxanium flex h-7 min-w-7 items-center justify-center border-x border-border px-2 text-xs font-semibold sm:h-8 sm:min-w-8">
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
                className="flex h-7 w-7 items-center justify-center text-text-muted transition hover:text-primary sm:h-8 sm:w-8"
                aria-label={`Increase quantity of ${name}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="oxanium truncate text-[10px] text-text-muted sm:text-xs">
              {formatPrice(
                price
              )}{" "}
              each
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Address Input                                                              */
/* ========================================================================== */

function AddressInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  disabled,
  required,
  maxLength,
  inputMode,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="oxanium mb-2 block text-xs font-semibold text-text-primary"
      >
        {label}

        {required && (
          <span className="ml-1 text-primary">
            *
          </span>
        )}
      </label>

      <div className="relative">

        <input
          id={name}
          name={name}
          type={type}
          value={
            value ?? ""
          }
          onChange={
            onChange
          }
          disabled={
            disabled
          }
          placeholder={
            placeholder
          }
          maxLength={
            maxLength
          }
          inputMode={
            inputMode
          }
          className={`oxanium w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition ${error
              ? "border-primary focus:ring-2 focus:ring-primary/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
            } ${disabled
              ? "cursor-not-allowed opacity-60"
              : ""
            }`}
        />
      </div>

      {error && (
        <p className="oxanium mt-1.5 text-xs text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Loading Skeleton                                                           */
/* ========================================================================== */

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-background text-text-primary">

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10 lg:py-14">

        <div className="animate-pulse">

          <div className="h-5 w-48 rounded bg-surface" />

          <div className="mt-8 h-10 w-80 rounded bg-surface" />

          <div className="mt-3 h-4 w-96 max-w-full rounded bg-surface" />

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">

            <div className="space-y-5">

              <div className="h-64 rounded-2xl bg-surface" />

              <div className="h-40 rounded-2xl bg-surface" />

              <div className="h-48 rounded-2xl bg-surface" />
            </div>

            <div className="h-[520px] rounded-2xl bg-surface" />
          </div>
        </div>
      </div>
    </main>
  );
}