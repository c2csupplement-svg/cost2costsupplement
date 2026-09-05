"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Home,
  Building2,
  Phone,
  Loader2,
  AlertCircle,
  Mail,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getAddress,
  updateAddress,
  deleteAddress,
  createAddress,
} from "@/redux/features/address/addressAction";

const emptyForm = {
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

export default function AddressesSection() {
  const dispatch = useDispatch();

  const {
    addressData,
    loading: addressLoading,
    error: addressError,
  } = useSelector((state) => state.address);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingDefault, setSettingDefault] = useState(null);

  const addresses = Array.isArray(addressData?.addresses)
    ? addressData.addresses
    : Array.isArray(addressData)
      ? addressData
      : [];

  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      isDefault: addresses.length === 0,
    });

    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      addressType: address.addressType || "Home",
      fullName: address.fullName || "",
      mobile: address.mobile || "",
      alternateMobile: address.alternateMobile || "",
      email: address.email || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Full name is required.";
    }

    if (!form.mobile.trim()) {
      return "Mobile number is required.";
    }

    if (!form.addressLine1.trim()) {
      return "Address is required.";
    }

    if (!form.city.trim()) {
      return "City is required.";
    }

    if (!form.state.trim()) {
      return "State is required.";
    }

    if (!form.pincode.trim()) {
      return "PIN code is required.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "PIN code must contain 6 digits.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);

    try {
      const addressPayload = {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        alternateMobile: form.alternateMobile.trim() || null,
        email: form.email.trim() || null,
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || null,
        landmark: form.landmark.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim() || "India",
        pincode: form.pincode.trim(),
        addressType: form.addressType,
        isDefault: Boolean(form.isDefault),
      };

      if (editingId) {
        await dispatch(
          updateAddress(
            editingId,
            addressPayload
          )
        );
      } else {
        await dispatch(
          createAddress(addressPayload)
        );
      }

      await dispatch(getAddress());

      handleCancel();
    } catch (error) {
      console.error(
        "Address save error:",
        error?.response?.data ||
        error?.message ||
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while saving the address."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || deleting) {
      return;
    }

    setDeleting(true);

    try {
      await dispatch(
        deleteAddress(deleteId)
      );

      await dispatch(getAddress());

      setDeleteId(null);
    } catch (error) {
      console.error(
        "Delete address error:",
        error?.response?.data ||
        error?.message ||
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while deleting the address."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSetDefault = async (address) => {
    if (!address?.id || settingDefault) {
      return;
    }

    setSettingDefault(address.id);

    try {
      const addressPayload = {
        fullName: address.fullName || "",
        mobile: address.mobile || "",
        alternateMobile:
          address.alternateMobile || null,
        email: address.email || null,
        addressLine1:
          address.addressLine1 || "",
        addressLine2:
          address.addressLine2 || null,
        landmark:
          address.landmark || null,
        city:
          address.city || "",
        state:
          address.state || "",
        country:
          address.country || "India",
        pincode:
          address.pincode || "",
        addressType:
          address.addressType || "Home",
        isDefault: true,
      };

      await dispatch(
        updateAddress(
          address.id,
          addressPayload
        )
      );

      await dispatch(getAddress());
    } catch (error) {
      console.error(
        "Set default address error:",
        error?.response?.data ||
        error?.message ||
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while setting the default address."
      );
    } finally {
      setSettingDefault(null);
    }
  };

  const errorMessage =
    typeof addressError === "string"
      ? addressError
      : addressError?.message || null;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
            Delivery
          </p>

          <h1 className="bebas text-5xl uppercase tracking-wide">
            My Addresses
          </h1>

          <p className="oxanium mt-2 max-w-xl text-sm leading-6 text-[#777]">
            Create and manage your shipping addresses for faster checkout.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddAddress}
            disabled={addressLoading}
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="oxanium text-sm font-bold">
              Unable to load addresses
            </p>

            <p className="oxanium mt-1 text-xs">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <AddressForm
          form={form}
          editingId={editingId}
          saving={saving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {!showForm && (
        <>
          {addressLoading ? (
            <LoadingAddresses />
          ) : addresses.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => handleEdit(address)}
                  onDelete={() =>
                    setDeleteId(address.id)
                  }
                  onSetDefault={() =>
                    handleSetDefault(address)
                  }
                  settingDefault={
                    settingDefault === address.id
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyAddresses
              onAdd={handleAddAddress}
            />
          )}
        </>
      )}

      {deleteId && (
        <DeleteModal
          deleting={deleting}
          onCancel={() => {
            if (!deleting) {
              setDeleteId(null);
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function AddressForm({
  form,
  editingId,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 bg-[#111] px-6 py-6 text-white sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E52323]">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <p className="oxanium text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
              Address
            </p>

            <h2 className="bebas text-3xl uppercase tracking-wide">
              {editingId
                ? "Edit Address"
                : "Add New Address"}
            </h2>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="p-6 sm:p-8"
      >
        <div className="mb-7">
          <label className="oxanium mb-3 block text-xs font-bold uppercase tracking-wide text-[#555]">
            Address Type
          </label>

          <div className="flex gap-3">
            <AddressTypeButton
              value="Home"
              selected={
                form.addressType === "Home"
              }
              onClick={() =>
                onChange({
                  target: {
                    name: "addressType",
                    value: "Home",
                  },
                })
              }
              icon={Home}
              disabled={saving}
            />

            <AddressTypeButton
              value="Office"
              selected={
                form.addressType === "Office"
              }
              onClick={() =>
                onChange({
                  target: {
                    name: "addressType",
                    value: "Office",
                  },
                })
              }
              icon={Building2}
              disabled={saving}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="Full name"
            required
            disabled={saving}
          />

          <Input
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              onChange({
                target: {
                  name: "mobile",
                  value,
                },
              });
            }}
            placeholder="Mobile number"
            required
            disabled={saving}
            inputMode="numeric"
            maxLength={10}
          />

          <Input
            label="Alternate Mobile"
            name="alternateMobile"
            value={form.alternateMobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              onChange({
                target: {
                  name: "alternateMobile",
                  value,
                },
              });
            }}
            placeholder="Alternate mobile number"
            disabled={saving}
            inputMode="numeric"
            maxLength={10}
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email address"
            disabled={saving}
            type="email"
          />

          <div className="md:col-span-2">
            <Input
              label="Address Line 1"
              name="addressLine1"
              value={form.addressLine1}
              onChange={onChange}
              placeholder="House number, street name"
              required
              disabled={saving}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Address Line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={onChange}
              placeholder="Apartment, floor, building, etc."
              disabled={saving}
            />
          </div>

          <Input
            label="Landmark"
            name="landmark"
            value={form.landmark}
            onChange={onChange}
            placeholder="Nearby landmark"
            disabled={saving}
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="City"
            required
            disabled={saving}
          />

          <Input
            label="State"
            name="state"
            value={form.state}
            onChange={onChange}
            placeholder="State"
            required
            disabled={saving}
          />

          <Input
            label="PIN Code"
            name="pincode"
            value={form.pincode}
            onChange={onChange}
            placeholder="6 digit PIN code"
            required
            disabled={saving}
            maxLength={6}
            inputMode="numeric"
          />

          <Input
            label="Country"
            name="country"
            value={form.country}
            onChange={onChange}
            placeholder="Country"
            disabled={saving}
          />
        </div>

        <label
          className={`oxanium mt-6 flex items-center gap-3 text-sm text-[#555] ${saving
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
            }`}
        >
          <input
            type="checkbox"
            name="isDefault"
            checked={Boolean(form.isDefault)}
            onChange={onChange}
            disabled={saving}
            className="h-4 w-4 accent-[#E52323]"
          />

          Make this my default address
        </label>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-6 py-3.5 text-sm font-bold text-[#555] transition hover:border-black hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {editingId
                  ? "Save Changes"
                  : "Save Address"}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  settingDefault,
}) {
  const addressType =
    address.addressType || "Home";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-white transition hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] ${address.isDefault
          ? "border-[#E52323]/40"
          : "border-black/10"
        }`}
    >
      {address.isDefault && (
        <div className="absolute left-0 top-0 h-1 w-full bg-[#E52323]" />
      )}

      <div className="flex items-center justify-between border-b border-black/10 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${address.isDefault
                ? "bg-[#E52323] text-white"
                : "bg-[#111] text-white"
              }`}
          >
            {addressType === "Office" ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <Home className="h-5 w-5" />
            )}
          </div>

          <div>
            <h3 className="bebas text-2xl uppercase tracking-wide">
              {addressType}
            </h3>

            {address.isDefault && (
              <span className="oxanium text-[10px] font-bold uppercase tracking-wider text-[#E52323]">
                Default Address
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#777] transition hover:bg-[#111] hover:text-white"
            aria-label="Edit address"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#777] transition hover:bg-red-50 hover:text-[#E52323]"
            aria-label="Delete address"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="oxanium text-sm font-bold text-[#111]">
          {address.fullName}
        </p>

        <div className="oxanium mt-3 space-y-1 text-sm leading-6 text-[#777]">
          <p>{address.addressLine1}</p>

          {address.addressLine2 && (
            <p>{address.addressLine2}</p>
          )}

          {address.landmark && (
            <p>{address.landmark}</p>
          )}

          <p>
            {address.city}, {address.state}
          </p>

          <p>
            {address.country} - {address.pincode}
          </p>
        </div>

        <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
          {address.mobile && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#E52323]" />

              <span className="oxanium text-xs font-medium text-[#666]">
                {address.mobile}
              </span>
            </div>
          )}

          {address.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#E52323]" />

              <span className="oxanium text-xs font-medium text-[#666]">
                {address.email}
              </span>
            </div>
          )}
        </div>

        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            disabled={settingDefault}
            className="oxanium mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#111] underline decoration-[#E52323] underline-offset-4 transition hover:text-[#E52323] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {settingDefault ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Setting...
              </>
            ) : (
              "Set as default address"
            )}
          </button>
        )}
      </div>
    </article>
  );
}

function AddressTypeButton({
  value,
  selected,
  onClick,
  icon: Icon,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`oxanium flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-bold transition ${selected
          ? "border-[#E52323] bg-[#E52323] text-white"
          : "border-black/10 bg-white text-[#555] hover:border-[#E52323]/40"
        } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Icon className="h-4 w-4" />
      {value}
    </button>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  inputMode,
  type = "text",
}) {
  return (
    <div>
      <label className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#555]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
        className="oxanium h-12 w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 text-sm text-[#111] outline-none transition placeholder:text-[#AAA] focus:border-[#E52323] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function LoadingAddresses() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-2xl border border-black/10 bg-white"
        >
          <div className="flex items-center gap-3 border-b border-black/10 p-5 sm:p-6">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />

            <div className="space-y-2">
              <div className="h-5 w-20 rounded bg-gray-200" />
              <div className="h-3 w-28 rounded bg-gray-200" />
            </div>
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-3 w-full rounded bg-gray-200" />
            <div className="h-3 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyAddresses({ onAdd }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-white">
        <MapPin className="h-7 w-7" />
      </div>

      <h2 className="bebas mt-6 text-3xl uppercase tracking-wide">
        No Addresses Yet
      </h2>

      <p className="oxanium mx-auto mt-2 max-w-md text-sm leading-6 text-[#777]">
        Add your first shipping address to make your checkout experience
        faster and easier.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="oxanium mt-6 inline-flex items-center gap-2 rounded-lg bg-[#E52323] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#111]"
      >
        <Plus className="h-4 w-4" />
        Add Address
      </button>
    </div>
  );
}

function DeleteModal({
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex justify-center pt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#E52323]">
            <Trash2 className="h-6 w-6" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-5 text-center">
          <h2 className="bebas text-3xl uppercase tracking-wide">
            Delete Address?
          </h2>

          <p className="oxanium mt-2 text-sm leading-6 text-[#777]">
            Are you sure you want to delete this address?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 border-t border-black/10 p-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="oxanium flex-1 rounded-lg border border-black/10 px-4 py-3 text-sm font-bold text-[#555] transition hover:border-black hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="oxanium flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#111] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
