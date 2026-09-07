"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  createRazorpayOrderApi,
  verifyPaymentApi,
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

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const debounceRef = useRef(null);
  const mountedRef = useRef(true);

  const cartState = useSelector((state) => state.product);
  const addressState = useSelector((state) => state.address);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [form, setForm] = useState(emptyAddress);
  const [formErrors, setFormErrors] = useState({});

  const [savingAddress, setSavingAddress] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [paymentMode, setPaymentMode] = useState("PREPAID");
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(true);

  const cartStateProducts = cartState?.products;
  const cartData = cartStateProducts?.cart ?? cartStateProducts ?? {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartStateProducts?.cart?.items ??
    [];

  const cart = Array.isArray(rawItems) ? rawItems : [];

  const addressData = addressState?.addressData;

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      router.push("/login")
    }
  },[]);

  const rawAddresses =
    addressData?.addresses ??
    addressData?.data?.addresses ??
    addressData?.data ??
    addressData;

  const addresses = Array.isArray(rawAddresses)
    ? rawAddresses
    : [];

  const cartCount = cart.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );

  const cartTotal = cart.reduce((total, item) => {
    const variant =
      item?.variant ??
      item?.productVariant ??
      item?.selectedVariant;

    const product = item?.product ?? {};

    const price = Number(
      item?.price ??
        item?.unitPrice ??
        variant?.price ??
        product?.price ??
        0
    );

    const quantity = Number(item?.quantity || 0);

    return total + price * quantity;
  }, 0);

  const selectedAddress =
    addresses.find(
      (address) =>
        Number(address?.id) === Number(selectedAddressId)
    ) ?? null;

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  useEffect(() => {
    mountedRef.current = true;

    dispatch(fetchCartItems());
    dispatch(getAddress());

    return () => {
      mountedRef.current = false;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddressId(null);
      return;
    }

    const currentExists = addresses.some(
      (address) =>
        Number(address?.id) === Number(selectedAddressId)
    );

    if (currentExists) return;

    const defaultAddress = addresses.find(
      (address) =>
        address?.isDefault === true ||
        address?.isDefault === 1 ||
        address?.isDefault === "1" ||
        address?.isDefault === "true"
    );

    setSelectedAddressId(
      defaultAddress?.id ?? addresses[0]?.id ?? null
    );
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!showAddressForm) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAddressForm]);

  const handleQuantity = async (item, quantity) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) return;

    try {
      if (quantity <= 0) {
        await dispatch(deleteCartItem(itemId));
      } else {
        await dispatch(
          updateItemQuantity(itemId, quantity)
        );
      }

      await dispatch(fetchCartItems());
    } catch (error) {
      console.error("Cart update error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update cart item."
      );
    }
  };

  const handleFormChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    let nextValue =
      type === "checkbox" ? checked : value;

    if (
      name === "mobile" ||
      name === "alternateMobile"
    ) {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pincode") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setFormErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    if (name === "pincode") {
      setForm((previous) => ({
        ...previous,
        pincode: nextValue,
        city: "",
        state: "",
        country: "India",
      }));

      setFormErrors((previous) => ({
        ...previous,
        pincode: "",
        city: "",
        state: "",
        country: "",
      }));

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (nextValue.length === 6) {
        debounceRef.current = setTimeout(() => {
          handlePincodeLookup(nextValue);
        }, 600);
      }
    }
  };

  const handlePincodeLookup = async (pin) => {
    if (!/^\d{6}$/.test(pin)) return;

    try {
      setPincodeLookupLoading(true);

      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pin}`
      );

      const postOffice =
        response?.data?.[0]?.PostOffice?.[0];

      if (!postOffice) {
        setFormErrors((previous) => ({
          ...previous,
          pincode:
            "Pincode not found, please check and re-enter.",
        }));

        return;
      }

      setForm((previous) => ({
        ...previous,
        city: postOffice?.District || "",
        state: postOffice?.State || "",
        country: postOffice?.Country || "India",
      }));

      setFormErrors((previous) => ({
        ...previous,
        pincode: "",
        city: "",
        state: "",
        country: "",
      }));
    } catch (error) {
      console.error("Pincode error:", error);

      setFormErrors((previous) => ({
        ...previous,
        pincode:
          "Unable to verify pincode. Please try again.",
      }));
    } finally {
      if (mountedRef.current) {
        setPincodeLookupLoading(false);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Location is not supported by your browser."
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

          const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
                addressdetails: 1,
                zoom: 18,
              },
              headers: {
                Accept: "application/json",
              },
            }
          );

          const address =
            response?.data?.address;

          if (!address) {
            toast.error(
              "Unable to find an address for your location."
            );
            return;
          }

          const city =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.municipality ||
            address?.county ||
            "";

          const state =
            address?.state || "";

          const country =
            address?.country || "India";

          const pincode =
            address?.postcode
              ?.replace(/\D/g, "")
              .slice(0, 6) || "";

          const addressParts = [
            address?.house_number,
            address?.road,
            address?.residential,
            address?.neighbourhood,
            address?.suburb,
          ].filter(Boolean);

          const addressLine1 =
            addressParts.join(", ");

          const addressLine2 = [
            address?.quarter,
            address?.city_district,
            address?.district,
          ]
            .filter(Boolean)
            .join(", ");

          const landmark =
            address?.landmark ||
            address?.building ||
            "";

          setForm((previous) => ({
            ...previous,
            addressLine1:
              addressLine1 ||
              previous.addressLine1,
            addressLine2:
              addressLine2 ||
              previous.addressLine2,
            landmark:
              landmark || previous.landmark,
            city:
              city || previous.city,
            state:
              state || previous.state,
            country,
            pincode:
              pincode || previous.pincode,
          }));

          setFormErrors((previous) => ({
            ...previous,
            addressLine1: "",
            addressLine2: "",
            landmark: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          }));

          toast.success(
            "Current location detected successfully."
          );
        } catch (error) {
          console.error(
            "Location address error:",
            error
          );

          toast.error(
            "Unable to get your address. Please enter it manually."
          );
        } finally {
          if (mountedRef.current) {
            setLocationLoading(false);
          }
        }
      },
      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        if (error.code === 1) {
          toast.error(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          toast.error(
            "Your current location could not be determined."
          );
        } else if (error.code === 3) {
          toast.error(
            "Location request timed out. Please try again."
          );
        } else {
          toast.error(
            "Unable to get your current location."
          );
        }

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const validateAddress = () => {
    const errors = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      errors.mobile =
        "Mobile number must be exactly 10 digits";
    }

    if (
      form.alternateMobile &&
      !/^\d{10}$/.test(form.alternateMobile)
    ) {
      errors.alternateMobile =
        "Alternate mobile number must be exactly 10 digits";
    }

    if (!form.addressLine1.trim()) {
      errors.addressLine1 =
        "Address is required";
    }

    if (!form.city.trim()) {
      errors.city = "City is required";
    }

    if (!form.state.trim()) {
      errors.state = "State is required";
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      errors.pincode =
        "PIN code must be exactly 6 digits";
    }

    if (!form.country.trim()) {
      errors.country =
        "Country is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const openAddAddress = () => {
    setEditingAddressId(null);

    setForm({
      ...emptyAddress,
      isDefault: addresses.length === 0,
    });

    setFormErrors({});
    setShowAddressForm(true);
  };

  const openEditAddress = (address) => {
    setEditingAddressId(
      address?.id ?? null
    );

    setForm({
      addressType:
        address?.addressType ?? "Home",
      fullName:
        address?.fullName ?? "",
      mobile:
        address?.mobile ?? "",
      alternateMobile:
        address?.alternateMobile ?? "",
      email:
        address?.email ?? "",
      addressLine1:
        address?.addressLine1 ?? "",
      addressLine2:
        address?.addressLine2 ?? "",
      landmark:
        address?.landmark ?? "",
      city:
        address?.city ?? "",
      state:
        address?.state ?? "",
      pincode:
        address?.pincode ?? "",
      country:
        address?.country ?? "India",
      isDefault:
        address?.isDefault === true ||
        address?.isDefault === 1 ||
        address?.isDefault === "1" ||
        address?.isDefault === "true",
    });

    setFormErrors({});
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    if (
      savingAddress ||
      locationLoading
    ) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setShowAddressForm(false);
    setEditingAddressId(null);
    setForm({ ...emptyAddress });
    setFormErrors({});
    setPincodeLookupLoading(false);
    setLocationLoading(false);
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    if (!validateAddress()) return;

    const payload = {
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      alternateMobile:
        form.alternateMobile.trim() || null,
      email:
        form.email.trim() || null,
      addressLine1:
        form.addressLine1.trim(),
      addressLine2:
        form.addressLine2.trim() || null,
      landmark:
        form.landmark.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      country:
        form.country.trim() || "India",
      pincode: form.pincode.trim(),
      addressType: form.addressType,
      isDefault: Boolean(form.isDefault),
    };

    try {
      setSavingAddress(true);

      if (editingAddressId) {
        await dispatch(
          updateAddress(
            editingAddressId,
            payload
          )
        );
      } else {
        await dispatch(
          createAddress(payload)
        );
      }

      await dispatch(getAddress());

      setShowAddressForm(false);
      setEditingAddressId(null);
      setForm({ ...emptyAddress });
      setFormErrors({});

      toast.success(
        editingAddressId
          ? "Address updated successfully."
          : "Address added successfully."
      );
    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const waitForRazorpay = () =>
    new Promise((resolve, reject) => {
      if (
        typeof window !== "undefined" &&
        typeof window.Razorpay !==
          "undefined"
      ) {
        resolve();
        return;
      }

      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;

        if (
          typeof window !== "undefined" &&
          typeof window.Razorpay !==
            "undefined"
        ) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 20) {
          clearInterval(interval);

          reject(
            new Error(
              "Payment gateway failed to load. Please refresh and try again."
            )
          );
        }
      }, 500);
    });

  const startPayment = async (addressId) => {
    if (!addressId) {
      toast.error(
        "Please select a delivery address."
      );
      setPaymentLoading(false);
      return;
    }

    try {
      await waitForRazorpay();

      const res =
        await createRazorpayOrderApi({
          addressId,
          paymentMethod: paymentMode,
        });

      if (!res?.data?.success) {
        toast.error(
          res?.data?.message ||
            "Unable to create order."
        );

        setPaymentLoading(false);
        return;
      }

      const {
        razorpayOrderId,
        amount,
        currency,
        key,
      } = res.data;

      if (!razorpayOrderId) {
        toast.error(
          "Payment order was not created."
        );
        setPaymentLoading(false);
        return;
      }

      const customerName =
        selectedAddress?.fullName ||
        form.fullName ||
        "Customer";

      const customerEmail =
        selectedAddress?.email ||
        form.email ||
        "";

      const customerContact =
        selectedAddress?.mobile ||
        form.mobile ||
        "";

      const options = {
        key,
        amount,
        currency,
        order_id: razorpayOrderId,

        name: "Promolecules",

        description:
          paymentMode === "COD"
            ? "Cash on Delivery Order"
            : "Prepaid Order Payment",

        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerContact,
        },

        notes: {
          addressId: String(addressId),
          paymentMode,
        },

        handler: async function (
          response
        ) {
          try {
            const verifyRes =
              await verifyPaymentApi({
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                addressId,

                paymentMethod: paymentMode,
              });

            if (
              verifyRes?.data?.success
            ) {
              toast.success(
                "Order placed successfully!",
                {
                  description:
                    verifyRes?.data?.order
                      ?.orderNumber
                      ? `Order ID: ${verifyRes.data.order.orderNumber}`
                      : "Your order has been confirmed.",
                }
              );

              setTimeout(() => {
                router.push("/cart");
              }, 700);
            } else {
              toast.error(
                verifyRes?.data?.message ||
                  "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(
              "Verify Error:",
              error?.response?.data ||
                error?.message
            );

            toast.info(
              "Payment successful! Confirming your order...",
              {
                description:
                  response?.razorpay_payment_id
                    ? `Payment ID: ${response.razorpay_payment_id}`
                    : "Your order is being confirmed.",
              }
            );

            setTimeout(() => {
              router.push("/cart");
            }, 1000);
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },

        theme: {
          color: "#dc2626",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          toast.error(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Create Order Error:",
        error?.response?.data ||
          error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong starting payment."
      );

      setPaymentLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error(
        "Please select a delivery address."
      );
      return;
    }

    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (paymentLoading) return;

    try {
      setPaymentLoading(true);

      await startPayment(
        selectedAddress.id
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setPaymentLoading(false);
    }
  };

  const canPlaceOrder =
    Boolean(selectedAddress) &&
    addresses.length > 0 &&
    !paymentLoading;

  if (
    cartState?.loading &&
    cart.length === 0
  ) {
    return <CheckoutSkeleton />;
  }



  if (!cart.length) {
    return (
      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto flex min-h-[650px] max-w-[1440px] flex-col items-center justify-center px-5 text-center sm:px-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-9 w-9 text-text-muted" />
          </div>

          <h1 className="bebas mt-6 text-4xl uppercase tracking-wide sm:text-5xl">
            Your Cart Is Empty
          </h1>

          <p className="oxanium mt-3 max-w-md text-sm leading-6 text-text-muted">
            Add some products to your cart before proceeding to checkout.
          </p>

          <Link
            href="/products"
            className="oxanium mt-7 flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90 active:scale-[0.98]"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-text-primary lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 py-3 sm:px-8 sm:py-5 lg:px-10 lg:py-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-5 sm:mb-10 sm:pb-6">
          <div className="oxanium hidden items-center gap-3 text-sm sm:flex">
            <Link
              href="/"
              className="text-text-muted transition hover:text-primary"
            >
              Home
            </Link>

            <span className="text-text-muted">
              ›
            </span>

            <Link
              href="/cart"
              className="text-text-muted transition hover:text-primary"
            >
              Cart
            </Link>

            <span className="text-text-muted">
              ›
            </span>

            <span>Checkout</span>
          </div>

          <Link
            href="/cart"
            className="oxanium flex items-center gap-2 text-sm text-text-muted transition hover:text-primary sm:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <span className="oxanium hidden items-center gap-1.5 text-xs font-semibold text-text-muted sm:flex">
            <Lock className="h-3.5 w-3.5" />
            Secure checkout
          </span>
        </div>

        <div className="mb-8 sm:mb-10">
          <p className="oxanium mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Step {selectedAddress ? "2" : "1"} of 2
          </p>

          <h1 className="bebas text-4xl uppercase tracking-wide sm:text-6xl">
            Secure Checkout
          </h1>

          <p className="oxanium mt-3 max-w-2xl text-sm leading-6 text-text-muted">
            {selectedAddress
              ? "Review your delivery details and complete your payment securely."
              : "Choose your delivery address to continue with your order."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="oxanium inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-semibold text-text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Safe & secure
            </span>

            <span className="oxanium inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] font-semibold text-text-muted">
              <Truck className="h-3.5 w-3.5 text-primary" />
              Tracked delivery
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          <section className="space-y-5 sm:space-y-7">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="oxanium flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    1
                  </span>

                  <div>
                    <h2 className="bebas text-xl uppercase tracking-wide sm:text-2xl">
                      Delivery Address
                    </h2>

                    <p className="oxanium mt-0.5 text-xs text-text-muted sm:text-sm">
                      {addresses.length
                        ? `${addresses.length} saved ${
                            addresses.length === 1
                              ? "address"
                              : "addresses"
                          }`
                        : "Add an address to continue"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openAddAddress}
                  className="oxanium inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              {addressState?.loading &&
              !addresses.length ? (
                <div className="mt-6 space-y-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-xl border border-border p-5"
                    >
                      <div className="h-5 w-32 rounded bg-surface" />
                      <div className="mt-4 h-4 w-2/3 rounded bg-surface" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-surface" />
                    </div>
                  ))}
                </div>
              ) : !addresses.length ? (
                <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-text-muted" />

                  <p className="oxanium mt-3 text-sm font-semibold">
                    No delivery address found
                  </p>

                  <p className="oxanium mt-1 text-xs text-text-muted">
                    Add an address to continue with checkout.
                  </p>

                  <button
                    type="button"
                    onClick={openAddAddress}
                    className="oxanium mt-5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold uppercase text-white transition hover:bg-primary/90"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:gap-4">
                  {addresses.map((address) => {
                    const selected =
                      Number(address?.id) ===
                      Number(selectedAddressId);

                    const isDefault =
                      address?.isDefault === true ||
                      address?.isDefault === 1 ||
                      address?.isDefault === "1" ||
                      address?.isDefault === "true";

                    return (
                      <div
                        key={address.id}
                        className={`group relative overflow-hidden rounded-xl border p-4 transition-all sm:p-5 ${
                          selected
                            ? "border-primary bg-primary/[0.03] shadow-sm ring-1 ring-primary"
                            : "border-border hover:border-primary/50 hover:bg-surface/50"
                        }`}
                      >
                        {selected && (
                          <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAddressId(
                              address.id
                            )
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer rounded-xl"
                          aria-label={`Select address for ${address.fullName}`}
                        />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                  selected
                                    ? "bg-primary text-white"
                                    : "bg-surface text-text-muted"
                                }`}
                              >
                                {address.addressType ===
                                "Office" ? (
                                  <Building2 className="h-5 w-5" />
                                ) : (
                                  <Home className="h-5 w-5" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h3 className="oxanium truncate text-sm font-bold">
                                    {address.fullName}
                                  </h3>

                                  <span className="oxanium rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase">
                                    {address.addressType}
                                  </span>

                                  {isDefault && (
                                    <span className="oxanium rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                                      Default
                                    </span>
                                  )}
                                </div>

                                <p className="oxanium mt-1 text-xs text-text-muted">
                                  {address.mobile}
                                </p>
                              </div>
                            </div>

                            <div className="relative z-20 flex items-center gap-2">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                                  selected
                                    ? "border-primary bg-primary text-white"
                                    : "border-border"
                                }`}
                              >
                                {selected && (
                                  <Check className="h-4 w-4" />
                                )}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  openEditAddress(
                                    address
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-text-muted transition hover:border-primary hover:text-primary"
                                aria-label="Edit address"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-0.5 pl-[52px]">
                            <p className="oxanium text-sm leading-5">
                              {address.addressLine1}

                              {address.addressLine2
                                ? `, ${address.addressLine2}`
                                : ""}
                            </p>

                            {address.landmark && (
                              <p className="oxanium text-xs text-text-muted">
                                Landmark:{" "}
                                {address.landmark}
                              </p>
                            )}

                            <p className="oxanium text-sm">
                              {address.city},{" "}
                              {address.state}{" "}
                              {address.pincode}
                            </p>

                            <p className="oxanium text-xs text-text-muted">
                              {address.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="oxanium flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>

                <div>
                  <h2 className="bebas text-xl uppercase tracking-wide sm:text-2xl">
                    Payment
                  </h2>

                  <p className="oxanium mt-0.5 text-xs text-text-muted">
                    Choose your preferred payment method
                  </p>
                </div>
              </div>

              <div
                role="radiogroup"
                aria-label="Payment method"
                className="mt-6 gap-3 flex flex-row sm:flex-col"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={
                    paymentMode === "PREPAID"
                  }
                  onClick={() =>
                    setPaymentMode("PREPAID")
                  }
                  className={`relative flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    paymentMode === "PREPAID"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      paymentMode === "PREPAID"
                        ? "bg-primary text-white"
                        : "bg-surface text-text-muted"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="oxanium text-sm font-bold">
                      Prepaid
                    </p>

                    <p className="oxanium mt-1 text-xs text-text-muted">
                      Pay full amount now
                    </p>
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMode === "PREPAID"
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {paymentMode ===
                      "PREPAID" && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={
                    paymentMode === "COD"
                  }
                  onClick={() =>
                    setPaymentMode("COD")
                  }
                  className={`relative flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    paymentMode === "COD"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      paymentMode === "COD"
                        ? "bg-primary text-white"
                        : "bg-surface text-text-muted"
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="oxanium text-sm font-bold">
                      COD
                    </p>

                    <p className="oxanium mt-1 text-xs text-text-muted">
                      Partial pay now
                    </p>
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMode === "COD"
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {paymentMode === "COD" && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
              </div>

              {paymentMode === "COD" && (
  <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3.5">
    <div className="mt-0.5 shrink-0">
      <ShieldCheck className="h-5 w-5 text-blue-500" />
    </div>

    <div className="oxanium min-w-0 text-xs leading-5 text-text-primary sm:text-sm">
      <p>
        Pay just{" "}
        <span className="font-bold text-text-primary">
          17% now
        </span>{" "}
        and the remaining amount at the time of delivery.
      </p>

      <p className="mt-1 text-text-secondary">
        <span className="font-bold text-text-primary">
          ₹49 extra
        </span>{" "}
        applies to Cash on Delivery (COD).
      </p>
    </div>
  </div>
)}

              <div className="oxanium mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  100% secure payment
                </span>

                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  Tracked delivery
                </span>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <button
                type="button"
                onClick={() =>
                  setMobileSummaryOpen(
                    (previous) => !previous
                  )
                }
                className="flex w-full items-center justify-between lg:pointer-events-none lg:cursor-default"
              >
                <h2 className="bebas text-xl uppercase tracking-wide sm:text-2xl">
                  Your Order

                  <span className="oxanium ml-2 text-sm font-normal normal-case text-text-muted">
                    ({cartCount}{" "}
                    {cartCount === 1
                      ? "item"
                      : "items"}
                    )
                  </span>
                </h2>

                <ChevronDown
                  className={`h-5 w-5 text-text-muted transition-transform lg:hidden ${
                    mobileSummaryOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              <div
                className={`${
                  mobileSummaryOpen
                    ? "block"
                    : "hidden"
                } lg:block`}
              >
                <div className="mt-5 divide-y divide-border">
                  {cart.map((item) => (
                    <CheckoutCartItem
                      key={
                        item?.id ??
                        item?.cartItemId ??
                        item?._id
                      }
                      item={item}
                      formatPrice={formatPrice}
                      onQuantityChange={
                        handleQuantity
                      }
                    />
                  ))}
                </div>

                <div className="my-5 h-px bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="oxanium text-sm text-text-muted">
                      Subtotal
                    </span>

                    <span className="oxanium text-sm font-semibold">
                      {formatPrice(
                        cartTotal
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="oxanium text-sm text-text-muted">
                      Delivery
                    </span>

                    <span className="oxanium text-sm font-semibold text-green-500">
                      FREE
                    </span>
                  </div>

                  {paymentMode === "COD" && (
                    <div className="flex items-center justify-between">
                      <span className="oxanium text-sm text-text-muted">
                        COD charge
                      </span>

                      <span className="oxanium text-sm font-semibold">
                        ₹49
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-5 h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="bebas text-xl uppercase tracking-wide sm:text-2xl">
                    Total
                  </span>

                  <span className="oxanium text-xl font-bold text-primary sm:text-2xl">
                    {formatPrice(
                      paymentMode === "COD"
                        ? cartTotal + 49
                        : cartTotal
                    )}
                  </span>
                </div>

                {paymentMode === "COD" && (
                  <div className="mt-4 rounded-xl bg-blue-500/10 p-3.5">
                    <div className="flex items-center gap-2">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

                      <div>
                        <p className="oxanium text-xs font-bold text-black">
                          COD selected
                        </p>

                        <p className="oxanium mt-1 text-[11px] leading-5 text-black">
                          Pay 17% now and the
                          remaining amount at
                          delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddress && (
                  <div className="mt-5 rounded-xl bg-surface p-4 sm:mt-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />

                      <span className="oxanium text-xs font-bold uppercase tracking-wide">
                        Delivering To
                      </span>
                    </div>

                    <p className="oxanium mt-2 text-sm font-semibold">
                      {selectedAddress.fullName}
                    </p>

                    <p className="oxanium mt-1 text-xs leading-5 text-text-muted">
                      {selectedAddress.addressLine1},{" "}
                      {selectedAddress.city},{" "}
                      {selectedAddress.state}{" "}
                      {selectedAddress.pincode}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!canPlaceOrder}
                  onClick={handlePlaceOrder}
                  className="oxanium mt-6 hidden h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                >
                  {paymentLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMode === "COD"
                        ? "Continue with COD"
                        : "Pay Now"}

                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {!selectedAddress &&
                  addresses.length > 0 && (
                    <p className="oxanium mt-3 text-center text-xs text-primary">
                      Please select a delivery
                      address.
                    </p>
                  )}

                <p className="oxanium mt-4 hidden text-center text-xs leading-5 text-text-muted lg:block">
                  By placing your order, you agree
                  to our terms and conditions.
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="oxanium mt-5 hidden items-center justify-center gap-2 text-sm text-text-muted transition hover:text-primary lg:flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to cart
            </Link>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="oxanium text-[11px] text-text-muted">
              Total ({cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}
              )
            </p>

            <p className="oxanium text-lg font-bold text-primary">
              {formatPrice(
                paymentMode === "COD"
                  ? cartTotal + 49
                  : cartTotal
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={!canPlaceOrder}
            onClick={handlePlaceOrder}
            className="oxanium flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {paymentLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing
              </>
            ) : (
              <>
                {paymentMode === "COD"
                  ? "Continue with COD"
                  : "Pay Now"}

                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function CheckoutCartItem({
  item,
  formatPrice,
  onQuantityChange,
}) {
  const product = item?.product ?? {};

  const variant =
    item?.variant ??
    item?.productVariant ??
    item?.selectedVariant ??
    null;

  const itemId =
    item?.id ??
    item?.cartItemId ??
    item?._id;

  const name =
    item?.name ??
    product?.name ??
    product?.title ??
    "Product";

  const variantImage =
    getImageUrl(variant?.image) ||
    getImageUrl(variant?.featuredImage) ||
    getImageUrl(variant?.featuredimg);

  const productImage =
    getImageUrl(product?.featuredimg) ||
    getImageUrl(product?.featuredImage) ||
    getImageUrl(product?.image);

  const imageUrl =
    variantImage || productImage;

  const price = Number(
    item?.price ??
      item?.unitPrice ??
      variant?.price ??
      product?.price ??
      0
  );

  const quantity = Number(
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
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-20 sm:w-20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-text-muted sm:h-7 sm:w-7" />
            </div>
          )}

          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white sm:h-6 sm:min-w-6 sm:px-1.5">
            {quantity}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h3 className="oxanium line-clamp-2 text-xs font-semibold sm:text-sm">
                {name}
              </h3>

              {variantName && (
                <p className="oxanium mt-1 text-[10px] text-text-muted sm:text-xs">
                  {variantName}
                </p>
              )}

              {variantDetails && (
                <p className="oxanium mt-0.5 line-clamp-1 text-[10px] text-text-muted sm:text-xs">
                  {variantDetails}
                </p>
              )}
            </div>

            <p className="oxanium shrink-0 text-xs font-bold sm:text-sm">
              {formatPrice(subtotal)}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center rounded-lg border border-border">
              <button
                type="button"
                onClick={() =>
                  onQuantityChange(
                    item,
                    quantity - 1
                  )
                }
                disabled={!itemId}
                className="flex h-7 w-7 items-center justify-center text-text-muted transition hover:text-primary disabled:opacity-50 sm:h-8 sm:w-8"
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
                disabled={!itemId}
                className="flex h-7 w-7 items-center justify-center text-text-muted transition hover:text-primary disabled:opacity-50 sm:h-8 sm:w-8"
                aria-label={`Increase quantity of ${name}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <span className="oxanium text-[10px] text-text-muted sm:text-xs">
              {formatPrice(price)} each
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          className={`oxanium w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition ${
            error
              ? "border-primary focus:ring-2 focus:ring-primary/20"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
          } ${
            disabled
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

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-10 lg:py-14">
        <div className="animate-pulse">
          <div className="h-5 w-48 rounded bg-surface" />

          <div className="mt-10 h-12 w-72 rounded bg-surface" />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <div className="h-80 rounded-2xl border border-border bg-card" />
              <div className="h-56 rounded-2xl border border-border bg-card" />
            </div>

            <div className="h-[500px] rounded-2xl border border-border bg-card" />
          </div>
        </div>
      </div>
    </main>
  );
}