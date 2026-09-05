"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Home,
  Lock,
  MapPin,
  Minus,
  Pencil,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  createRazorpayOrderApi,
  verifyPaymentApi,
  buyNowApi
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
  const [pincodeLookupLoading, setPincodeLookupLoading] =
    useState(false);

  const [paymentMode, setPaymentMode] = useState("RAZORPAY");

  const cartData =
    cartState?.products?.cart ??
    cartState?.products ??
    {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartState?.products?.cart?.items ??
    [];

  const cart = Array.isArray(rawItems) ? rawItems : [];

  const addresses = useMemo(() => {
    const data = addressState?.addressData;

    const raw =
      data?.addresses ??
      data?.data?.addresses ??
      data?.data ??
      data;

    return Array.isArray(raw) ? raw : [];
  }, [addressState]);

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item?.quantity || 0),
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(
        item?.price ??
          item?.unitPrice ??
          item?.variant?.price ??
          item?.product?.price ??
          0
      );

      const quantity = Number(item?.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  const selectedAddress = useMemo(() => {
    return (
      addresses.find(
        (address) =>
          Number(address?.id) ===
          Number(selectedAddressId)
      ) ?? null
    );
  }, [addresses, selectedAddressId]);

  const formatPrice = (price) => {
    return `₹ ${Number(price || 0).toLocaleString("en-IN")}`;
  };

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
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }

    const currentExists = addresses.some(
      (address) =>
        Number(address?.id) ===
        Number(selectedAddressId)
    );

    if (currentExists) {
      return;
    }

    const defaultAddress =
      addresses.find(
        (address) => Boolean(address?.isDefault)
      ) ?? addresses[0];

    setSelectedAddressId(defaultAddress?.id ?? null);
  }, [addresses, selectedAddressId]);

  const handleQuantity = async (item, quantity) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) {
      return;
    }

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
      console.error(
        "Cart update error:",
        error
      );

      toast.error(
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
      type === "checkbox"
        ? checked
        : value;

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
    if (!/^\d{6}$/.test(pin)) {
      return;
    }

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
            "Pincode not found, please check and re-enter",
        }));

        return;
      }

      setForm((previous) => ({
        ...previous,
        city: postOffice?.District || "",
        state: postOffice?.State || "",
        country:
          postOffice?.Country || "India",
      }));

      setFormErrors((previous) => ({
        ...previous,
        pincode: "",
        city: "",
        state: "",
        country: "",
      }));
    } catch (error) {
      console.error(
        "Pincode Error:",
        error?.message
      );

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

  const validateAddress = () => {
    const errors = {};

    if (!form.fullName.trim()) {
      errors.fullName =
        "Full name is required";
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      errors.mobile =
        "Mobile number must be exactly 10 digits";
    }

    if (
      form.alternateMobile &&
      !/^\d{10}$/.test(
        form.alternateMobile
      )
    ) {
      errors.alternateMobile =
        "Alternate mobile number must be exactly 10 digits";
    }

    if (!form.addressLine1.trim()) {
      errors.addressLine1 =
        "Address is required";
    }

    if (!form.city.trim()) {
      errors.city =
        "City is required";
    }

    if (!form.state.trim()) {
      errors.state =
        "State is required";
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

    return (
      Object.keys(errors).length === 0
    );
  };

  const openAddAddress = () => {
    setEditingAddressId(null);

    setForm({
      ...emptyAddress,
      isDefault:
        addresses.length === 0,
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
        Boolean(address?.isDefault),
    });

    setFormErrors({});
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    if (savingAddress) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setShowAddressForm(false);
    setEditingAddressId(null);
    setForm({
      ...emptyAddress,
    });
    setFormErrors({});
    setPincodeLookupLoading(false);
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    if (!validateAddress()) {
      return;
    }

    const payload = {
      fullName:
        form.fullName.trim(),

      mobile:
        form.mobile.trim(),

      alternateMobile:
        form.alternateMobile.trim() ||
        null,

      email:
        form.email.trim() ||
        null,

      addressLine1:
        form.addressLine1.trim(),

      addressLine2:
        form.addressLine2.trim() ||
        null,

      landmark:
        form.landmark.trim() ||
        null,

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      country:
        form.country.trim() ||
        "India",

      pincode:
        form.pincode.trim(),

      addressType:
        form.addressType,

      isDefault:
        Boolean(form.isDefault),
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
      setForm({
        ...emptyAddress,
      });
      setFormErrors({});
    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to save address.";

      toast.error(message);
    } finally {
      setSavingAddress(false);
    }
  };

  const waitForRazorpay = () => {
    return new Promise(
      (resolve, reject) => {
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
      }
    );
  };

  const startPayment = async (
    addressId
  ) => {
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

      const customerName =
        selectedAddress?.fullName ||
        "Customer";

      const customerEmail =
        selectedAddress?.email ||
        "";

      const customerContact =
        selectedAddress?.mobile ||
        "";

      const options = {
        key,
        amount,
        currency,
        order_id:
          razorpayOrderId,

        name: "Promolecules",
        description:
          "Order Payment",

        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerContact,
        },

        notes: {
          addressId: String(
            addressId
          ),
        },

        handler:
          async function (response) {
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
                  verifyRes?.data
                    ?.message ||
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
                    `Payment ID: ${response.razorpay_payment_id}`,
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
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          toast.error(
            response?.error
              ?.description ||
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
        error?.response?.data
          ?.message ||
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

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty."
      );
      return;
    }

    if (paymentLoading) {
      return;
    }

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

  if (
    cartState?.loading &&
    cart.length === 0
  ) {
    return <CheckoutSkeleton />;
  }

  if (cart.length === 0) {
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
            className="oxanium mt-7 flex items-center gap-2 bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="oxanium mb-10 flex items-center gap-3 border-b border-border pb-6 text-sm">
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

          <span className="text-text-primary">
            Checkout
          </span>
        </div>

        <div className="mb-10">
          <p className="oxanium mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Secure Checkout
          </p>

          <h1 className="bebas text-5xl uppercase tracking-wide sm:text-6xl">
            Checkout
          </h1>

          <p className="oxanium mt-3 text-sm text-text-muted">
            Complete your information to place your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">
          <section className="space-y-7">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="bebas text-2xl uppercase tracking-wide">
                    Delivery Address
                  </h2>

                  <p className="oxanium mt-2 text-sm text-text-muted">
                    Select an address for your order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    openAddAddress
                  }
                  className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              {addressState?.loading &&
              addresses.length === 0 ? (
                <div className="mt-7 space-y-4">
                  {[1, 2].map(
                    (item) => (
                      <div
                        key={item}
                        className="animate-pulse rounded-xl border border-border p-5"
                      >
                        <div className="h-5 w-32 rounded bg-surface" />
                        <div className="mt-4 h-4 w-2/3 rounded bg-surface" />
                        <div className="mt-2 h-4 w-1/2 rounded bg-surface" />
                      </div>
                    )
                  )}
                </div>
              ) : addresses.length ===
                0 ? (
                <div className="mt-7 rounded-xl border border-dashed border-border p-8 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-text-muted" />

                  <p className="oxanium mt-3 text-sm font-semibold">
                    No delivery address found
                  </p>

                  <p className="oxanium mt-1 text-xs text-text-muted">
                    Add an address to continue with checkout.
                  </p>

                  <button
                    type="button"
                    onClick={
                      openAddAddress
                    }
                    className="oxanium mt-5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold uppercase text-white"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="mt-7 grid gap-4">
                  {addresses.map(
                    (address) => {
                      const selected =
                        Number(
                          address?.id
                        ) ===
                        Number(
                          selectedAddressId
                        );

                      return (
                        <div
                          key={
                            address.id
                          }
                          className={`relative rounded-xl border p-5 transition ${
                            selected
                              ? "border-primary ring-1 ring-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedAddressId(
                                address.id
                              )
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer"
                            aria-label={`Select address for ${address.fullName}`}
                          />

                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-4">
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
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="oxanium text-sm font-bold">
                                      {
                                        address.fullName
                                      }
                                    </h3>

                                    <span className="oxanium rounded-full bg-surface px-2 py-1 text-[10px] font-semibold uppercase">
                                      {
                                        address.addressType
                                      }
                                    </span>

                                    {address.isDefault && (
                                      <span className="oxanium rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase text-primary">
                                        Default
                                      </span>
                                    )}
                                  </div>

                                  <p className="oxanium mt-1 text-xs text-text-muted">
                                    {
                                      address.mobile
                                    }
                                  </p>
                                </div>
                              </div>

                              <div className="relative z-20 flex shrink-0 items-center gap-2">
                                {selected && (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}

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
                                  <Pencil className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 space-y-1 pl-[52px]">
                              <p className="oxanium text-sm text-text-primary">
                                {
                                  address.addressLine1
                                }
                              </p>

                              {address.addressLine2 && (
                                <p className="oxanium text-sm text-text-primary">
                                  {
                                    address.addressLine2
                                  }
                                </p>
                              )}

                              {address.landmark && (
                                <p className="oxanium text-xs text-text-muted">
                                  Landmark:{" "}
                                  {
                                    address.landmark
                                  }
                                </p>
                              )}

                              <p className="oxanium text-sm text-text-primary">
                                {
                                  address.city
                                }
                                ,{" "}
                                {
                                  address.state
                                }{" "}
                                {
                                  address.pincode
                                }
                              </p>

                              <p className="oxanium text-xs text-text-muted">
                                {
                                  address.country
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-4 w-4 text-primary" />
                </div>

                <div className="flex-1">
                  <h2 className="bebas text-2xl uppercase tracking-wide">
                    Payment
                  </h2>

                  <p className="oxanium mt-2 text-sm leading-6 text-text-muted">
                    Your payment is processed securely through Razorpay.
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMode(
                          "RAZORPAY"
                        )
                      }
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                        paymentMode ===
                        "RAZORPAY"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          paymentMode ===
                          "RAZORPAY"
                            ? "bg-primary text-white"
                            : "bg-surface text-text-muted"
                        }`}
                      >
                        <Lock className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <p className="oxanium text-sm font-bold">
                          Razorpay
                        </p>

                        <p className="oxanium mt-1 text-xs text-text-muted">
                          Pay securely using UPI, cards, net banking and more.
                        </p>
                      </div>

                      {paymentMode ===
                        "RAZORPAY" && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="bebas text-2xl uppercase tracking-wide">
                Your Order
              </h2>

              <div className="mt-6 divide-y divide-border">
                {cart.map(
                  (item, index) => (
                    <CheckoutCartItem
                      key={
                        item?.id ??
                        item?.cartItemId ??
                        item?._id ??
                        index
                      }
                      item={item}
                      formatPrice={
                        formatPrice
                      }
                      onQuantityChange={
                        handleQuantity
                      }
                    />
                  )
                )}
              </div>

              <div className="my-6 h-px bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="oxanium text-text-muted">
                    Items
                  </span>

                  <span className="oxanium font-semibold">
                    {cartCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="oxanium text-text-muted">
                    Subtotal
                  </span>

                  <span className="oxanium font-semibold">
                    {formatPrice(
                      cartTotal
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="oxanium text-text-muted">
                    Shipping
                  </span>

                  <span className="oxanium text-xs text-text-muted">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="my-6 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="bebas text-2xl uppercase tracking-wide">
                  Total
                </span>

                <span className="oxanium text-2xl font-bold text-primary">
                  {formatPrice(
                    cartTotal
                  )}
                </span>
              </div>

              {selectedAddress && (
                <div className="mt-6 rounded-xl bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />

                    <span className="oxanium text-xs font-bold uppercase tracking-wide">
                      Delivering To
                    </span>
                  </div>

                  <p className="oxanium mt-2 text-sm font-semibold">
                    {
                      selectedAddress.fullName
                    }
                  </p>

                  <p className="oxanium mt-1 text-xs leading-5 text-text-muted">
                    {
                      selectedAddress.addressLine1
                    }
                    ,{" "}
                    {
                      selectedAddress.city
                    }
                    ,{" "}
                    {
                      selectedAddress.state
                    }{" "}
                    {
                      selectedAddress.pincode
                    }
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={
                  !selectedAddress ||
                  paymentLoading ||
                  addresses.length === 0
                }
                onClick={
                  handlePlaceOrder
                }
                className="oxanium mt-7 flex h-14 w-full items-center justify-center gap-2 bg-primary text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {!selectedAddress &&
                addresses.length > 0 && (
                  <p className="oxanium mt-3 text-center text-xs text-primary">
                    Please select a delivery address.
                  </p>
                )}

              <p className="oxanium mt-4 text-center text-xs leading-5 text-text-muted">
                By placing your order, you agree to our terms and conditions.
              </p>
            </div>

            <Link
              href="/cart"
              className="oxanium mt-5 flex items-center justify-center gap-2 text-sm text-text-muted transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to cart
            </Link>
          </aside>
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-8">
              <div>
                <h2 className="bebas text-2xl uppercase tracking-wide">
                  {editingAddressId
                    ? "Edit Address"
                    : "Add Address"}
                </h2>

                <p className="oxanium mt-1 text-xs text-text-muted">
                  Enter your delivery details.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeAddressForm
                }
                disabled={
                  savingAddress
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition hover:bg-surface hover:text-primary disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleSaveAddress
              }
              className="overflow-y-auto px-6 py-6 sm:px-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <AddressInput
                  label="Full Name"
                  name="fullName"
                  value={
                    form.fullName
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Full name"
                  required
                  disabled={
                    savingAddress
                  }
                  error={
                    formErrors.fullName
                  }
                />

                <AddressInput
                  label="Mobile Number"
                  name="mobile"
                  value={
                    form.mobile
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="10 digit mobile number"
                  required
                  disabled={
                    savingAddress
                  }
                  inputMode="numeric"
                  maxLength={10}
                  error={
                    formErrors.mobile
                  }
                />

                <AddressInput
                  label="Alternate Mobile"
                  name="alternateMobile"
                  value={
                    form.alternateMobile
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="10 digit alternate number"
                  disabled={
                    savingAddress
                  }
                  inputMode="numeric"
                  maxLength={10}
                  error={
                    formErrors.alternateMobile
                  }
                />

                <AddressInput
                  label="Email"
                  name="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Email address"
                  disabled={
                    savingAddress
                  }
                />

                <div className="sm:col-span-2">
                  <AddressInput
                    label="Address Line 1"
                    name="addressLine1"
                    value={
                      form.addressLine1
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="House number, building, street"
                    required
                    disabled={
                      savingAddress
                    }
                    error={
                      formErrors.addressLine1
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <AddressInput
                    label="Address Line 2"
                    name="addressLine2"
                    value={
                      form.addressLine2
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Apartment, suite, area"
                    disabled={
                      savingAddress
                    }
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
                  placeholder="Nearby landmark"
                  disabled={
                    savingAddress
                  }
                />

                <AddressInput
                  label="PIN Code"
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="6 digit PIN code"
                  required
                  disabled={
                    savingAddress
                  }
                  inputMode="numeric"
                  maxLength={6}
                  error={
                    formErrors.pincode
                  }
                  loading={
                    pincodeLookupLoading
                  }
                />

                <AddressInput
                  label="City"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="City"
                  required
                  disabled={
                    savingAddress
                  }
                  error={
                    formErrors.city
                  }
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
                  placeholder="State"
                  required
                  disabled={
                    savingAddress
                  }
                  error={
                    formErrors.state
                  }
                />

                <AddressInput
                  label="Country"
                  name="country"
                  value={
                    form.country
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Country"
                  required
                  disabled={
                    savingAddress
                  }
                  error={
                    formErrors.country
                  }
                />
              </div>

              <div className="mt-6">
                <label className="oxanium mb-3 block text-sm font-semibold">
                  Address Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Home",
                    "Office",
                  ].map(
                    (type) => {
                      const selected =
                        form.addressType ===
                        type;

                      return (
                        <button
                          key={type}
                          type="button"
                          disabled={
                            savingAddress
                          }
                          onClick={() =>
                            setForm(
                              (
                                previous
                              ) => ({
                                ...previous,
                                addressType:
                                  type,
                              })
                            )
                          }
                          className={`flex h-12 items-center justify-center gap-2 rounded-lg border font-oxanium text-sm font-semibold transition ${
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-text-secondary hover:border-primary"
                          }`}
                        >
                          {type ===
                          "Home" ? (
                            <Home className="h-4 w-4" />
                          ) : (
                            <Building2 className="h-4 w-4" />
                          )}

                          {type}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={
                    form.isDefault
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={
                    savingAddress
                  }
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                />

                <span className="oxanium text-sm font-semibold">
                  Make this my default address
                </span>
              </label>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeAddressForm
                  }
                  disabled={
                    savingAddress
                  }
                  className="oxanium h-12 rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wide text-text-secondary transition hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    savingAddress
                  }
                  className="oxanium flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingAddress ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingAddressId
                        ? "Update Address"
                        : "Save Address"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function AddressInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  inputMode,
  maxLength,
  error,
  loading = false,
}) {
  return (
    <div>
      <label className="oxanium mb-2 block text-sm font-semibold">
        {label}

        {required && (
          <span className="ml-1 text-primary">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          inputMode={inputMode}
          maxLength={maxLength}
          className={`oxanium h-12 w-full rounded-lg border bg-background px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-primary focus:border-primary"
              : "border-border focus:border-primary"
          } ${
            loading
              ? "pr-12"
              : ""
          }`}
        />

        {loading && (
          <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        )}
      </div>

      {error && (
        <p className="oxanium mt-1.5 text-xs text-primary">
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
}) {
  const product =
    item?.product ?? item;

  const itemId =
    item?.id ??
    item?.cartItemId ??
    item?._id;

  const productId =
    item?.productId ??
    product?.id ??
    product?._id;

  const name =
    item?.name ??
    product?.name ??
    product?.title ??
    "Product";

  const images =
    item?.images ??
    product?.images ??
    [];

  const image =
    images?.[0]?.url ??
    images?.[0] ??
    item?.image ??
    product?.image;

  const price = Number(
    item?.price ??
      item?.unitPrice ??
      item?.variant?.price ??
      product?.price ??
      0
  );

  const quantity = Number(
    item?.quantity || 0
  );

  const subtotal =
    price * quantity;

  const variant =
    item?.variant;

  const variantName =
    variant?.name ??
    variant?.title ??
    variant?.value ??
    "";

  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
          <Image
            src={image}
            alt={name}
            fill
            sizes="80px"
            className="object-cover"
            // onError={(event) => {
            //   event.currentTarget.src ;
            // }}
          />

          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
            {quantity}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="oxanium line-clamp-2 text-sm font-semibold">
                {name}
              </h3>

              {variantName && (
                <p className="oxanium mt-1 text-[11px] text-text-muted">
                  {variantName}
                </p>
              )}

              <p className="oxanium mt-1 text-xs text-text-muted">
                {formatPrice(price)}
              </p>
            </div>

            <span className="oxanium shrink-0 text-sm font-bold">
              {formatPrice(
                subtotal
              )}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex h-8 items-center overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                disabled={!itemId}
                onClick={() =>
                  onQuantityChange(
                    item,
                    quantity - 1
                  )
                }
                className="flex h-full w-8 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="oxanium flex h-full min-w-8 items-center justify-center border-x border-border px-2 text-xs font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                disabled={!itemId}
                onClick={() =>
                  onQuantityChange(
                    item,
                    quantity + 1
                  )
                }
                className="flex h-full w-8 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {productId && (
              <Link
                href={`/product/${productId}`}
                className="oxanium text-[11px] font-semibold text-text-muted transition hover:text-primary"
              >
                View product
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mb-7 animate-pulse sm:mb-10">
          <div className="h-3 w-32 rounded-full bg-surface sm:h-4 sm:w-40" />
          <div className="mt-4 h-10 w-48 rounded-lg bg-surface sm:mt-5 sm:h-14 sm:w-60" />
          <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-surface sm:h-4 sm:w-80" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_430px] lg:gap-8">
          <section className="space-y-5 sm:space-y-7">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-6 w-44 rounded-lg bg-surface sm:h-7 sm:w-52" />
                    <div className="mt-2 h-3 w-56 max-w-full rounded-full bg-surface sm:h-4 sm:w-72" />
                  </div>
                  <div className="hidden h-11 w-32 rounded-lg bg-surface sm:block" />
                </div>

                <div className="mt-6 space-y-3 sm:mt-7">
                  {[1, 2].map((item) => (
                    <div key={item} className="rounded-xl border border-border p-4 sm:p-5">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-surface sm:h-11 sm:w-11" />
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="h-4 w-32 rounded bg-surface" />
                          <div className="h-3 w-full max-w-[360px] rounded bg-surface" />
                          <div className="h-3 w-3/4 rounded bg-surface" />
                          <div className="h-3 w-1/2 rounded bg-surface" />
                        </div>
                        <div className="hidden h-5 w-5 rounded-full bg-surface sm:block" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 h-11 w-full rounded-lg bg-surface sm:hidden" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-6 w-36 rounded-lg bg-surface sm:h-7 sm:w-40" />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="h-12 rounded-lg bg-surface" />
                  <div className="h-12 rounded-lg bg-surface" />
                  <div className="h-12 rounded-lg bg-surface sm:col-span-2" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="h-12 rounded-lg bg-surface" />
                  <div className="h-12 rounded-lg bg-surface" />
                  <div className="h-12 rounded-lg bg-surface" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-6 w-32 rounded-lg bg-surface sm:h-7 sm:w-36" />
                <div className="mt-5 h-14 w-full rounded-lg bg-surface" />
                <div className="mt-4 h-14 w-full rounded-lg bg-surface" />
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-6 w-32 rounded-lg bg-surface sm:h-7 sm:w-36" />
                <div className="mt-6 space-y-5">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 sm:gap-4">
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-surface sm:h-20 sm:w-20" />
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="h-4 w-full rounded bg-surface" />
                        <div className="h-3 w-2/3 rounded bg-surface" />
                        <div className="h-3 w-1/3 rounded bg-surface" />
                      </div>
                      <div className="h-4 w-16 shrink-0 rounded bg-surface" />
                    </div>
                  ))}
                </div>

                <div className="my-6 h-px bg-border" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 rounded bg-surface" />
                    <div className="h-4 w-20 rounded bg-surface" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-28 rounded bg-surface" />
                    <div className="h-4 w-16 rounded bg-surface" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-5 w-20 rounded bg-surface" />
                    <div className="h-5 w-24 rounded bg-surface" />
                  </div>
                </div>

                <div className="my-6 h-px bg-border" />
                <div className="h-14 w-full rounded-xl bg-surface" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
