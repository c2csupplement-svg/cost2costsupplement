"use client";

import { useState } from "react";
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
} from "lucide-react";

const initialAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Test User",
    phone: "+91 98765 43210",
    address: "123 Main Street",
    area: "Sector 15",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    isDefault: true,
  },
  {
    id: 2,
    type: "Office",
    name: "Test User",
    phone: "+91 98765 43210",
    address: "45 Business Park",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110002",
    isDefault: false,
  },
];

const emptyForm = {
  type: "Home",
  name: "",
  phone: "",
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function AddressesSection() {
  const [addresses, setAddresses] = useState(initialAddresses);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [deleteId, setDeleteId] = useState(null);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================
     OPEN CREATE FORM
  ========================================= */

  const handleAddAddress = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      isDefault: addresses.length === 0,
    });

    setShowForm(true);
  };

  /* =========================================
     OPEN EDIT FORM
  ========================================= */

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });

    setShowForm(true);
  };

  /* =========================================
     CLOSE FORM
  ========================================= */

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  /* =========================================
     SAVE ADDRESS
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setAddresses((current) =>
        current.map((address) =>
          address.id === editingId
            ? {
                ...address,
                ...form,
              }
            : form.isDefault
              ? {
                  ...address,
                  isDefault: false,
                }
              : address
        )
      );
    } else {
      const newAddress = {
        id: Date.now(),
        ...form,
      };

      setAddresses((current) => {
        if (form.isDefault) {
          return [
            ...current.map((address) => ({
              ...address,
              isDefault: false,
            })),
            newAddress,
          ];
        }

        return [...current, newAddress];
      });
    }

    handleCancel();
  };

  /* =========================================
     DELETE ADDRESS
  ========================================= */

  const handleDelete = () => {
    if (!deleteId) return;

    setAddresses((current) =>
      current.filter((address) => address.id !== deleteId)
    );

    setDeleteId(null);
  };

  /* =========================================
     SET DEFAULT
  ========================================= */

  const handleSetDefault = (id) => {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  return (
    <div className="space-y-7">

      {/* =========================================
          HEADER
      ========================================= */}

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
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#111]"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        )}

      </div>

      {/* =========================================
          ADD / EDIT FORM
      ========================================= */}

      {showForm && (
        <AddressForm
          form={form}
          editingId={editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* =========================================
          ADDRESS LIST
      ========================================= */}

      {!showForm && (
        <>
          {addresses.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">

              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => handleEdit(address)}
                  onDelete={() => setDeleteId(address.id)}
                  onSetDefault={() => handleSetDefault(address.id)}
                />
              ))}

            </div>
          ) : (
            <EmptyAddresses onAdd={handleAddAddress} />
          )}
        </>
      )}

      {/* =========================================
          DELETE MODAL
      ========================================= */}

      {deleteId && (
        <DeleteModal
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  );
}


/* =============================================
   ADDRESS FORM
============================================= */

function AddressForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">

      {/* Form Header */}

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
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
          </div>

        </div>

      </div>

      <form
        onSubmit={onSubmit}
        className="p-6 sm:p-8"
      >

        {/* Address Type */}

        <div className="mb-7">

          <label className="oxanium mb-3 block text-xs font-bold uppercase tracking-wide text-[#555]">
            Address Type
          </label>

          <div className="flex gap-3">

            <AddressTypeButton
              value="Home"
              selected={form.type === "Home"}
              onClick={() =>
                onChange({
                  target: {
                    name: "type",
                    value: "Home",
                  },
                })
              }
              icon={Home}
            />

            <AddressTypeButton
              value="Office"
              selected={form.type === "Office"}
              onClick={() =>
                onChange({
                  target: {
                    name: "type",
                    value: "Office",
                  },
                })
              }
              icon={Building2}
            />

          </div>

        </div>

        {/* Fields */}

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+91 XXXXX XXXXX"
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="House number, street name"
              required
            />
          </div>

          <Input
            label="Area / Locality"
            name="area"
            value={form.area}
            onChange={onChange}
            placeholder="Area or locality"
            required
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="City"
            required
          />

          <Input
            label="State"
            name="state"
            value={form.state}
            onChange={onChange}
            placeholder="State"
            required
          />

          <Input
            label="PIN Code"
            name="pincode"
            value={form.pincode}
            onChange={onChange}
            placeholder="PIN code"
            required
          />

        </div>

        {/* Default */}

        <label className="oxanium mt-6 flex cursor-pointer items-center gap-3 text-sm text-[#555]">

          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={onChange}
            className="h-4 w-4 accent-[#E52323]"
          />

          Make this my default address

        </label>

        {/* Buttons */}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-6 py-3.5 text-sm font-bold text-[#555] transition hover:border-black hover:text-[#111]"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            className="oxanium inline-flex items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#111]"
          >
            <Check className="h-4 w-4" />
            {editingId ? "Save Changes" : "Save Address"}
          </button>

        </div>

      </form>

    </section>
  );
}


/* =============================================
   ADDRESS CARD
============================================= */

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-white transition hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] ${
        address.isDefault
          ? "border-[#E52323]/40"
          : "border-black/10"
      }`}
    >

      {/* Default indicator */}

      {address.isDefault && (
        <div className="absolute left-0 top-0 h-1 w-full bg-[#E52323]" />
      )}

      {/* Card Header */}

      <div className="flex items-center justify-between border-b border-black/10 p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              address.isDefault
                ? "bg-[#E52323] text-white"
                : "bg-[#111] text-white"
            }`}
          >
            {address.type === "Office" ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <Home className="h-5 w-5" />
            )}
          </div>

          <div>

            <h3 className="bebas text-2xl uppercase tracking-wide">
              {address.type}
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

      {/* Address */}

      <div className="p-5 sm:p-6">

        <p className="oxanium text-sm font-bold text-[#111]">
          {address.name}
        </p>

        <div className="oxanium mt-3 space-y-1 text-sm leading-6 text-[#777]">

          <p>{address.address}</p>

          <p>
            {address.area}, {address.city}
          </p>

          <p>
            {address.state} - {address.pincode}
          </p>

        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-4">

          <Phone className="h-3.5 w-3.5 text-[#E52323]" />

          <span className="oxanium text-xs font-medium text-[#666]">
            {address.phone}
          </span>

        </div>

        {/* Set default */}

        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="oxanium mt-5 text-xs font-bold text-[#111] underline decoration-[#E52323] underline-offset-4 transition hover:text-[#E52323]"
          >
            Set as default address
          </button>
        )}

      </div>

    </article>
  );
}


/* =============================================
   ADDRESS TYPE BUTTON
============================================= */

function AddressTypeButton({
  value,
  selected,
  onClick,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`oxanium flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-bold transition ${
        selected
          ? "border-[#E52323] bg-[#E52323] text-white"
          : "border-black/10 bg-white text-[#555] hover:border-[#E52323]/40"
      }`}
    >
      <Icon className="h-4 w-4" />
      {value}
    </button>
  );
}


/* =============================================
   INPUT
============================================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#555]">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="oxanium h-12 w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 text-sm text-[#111] outline-none transition placeholder:text-[#AAA] focus:border-[#E52323] focus:bg-white"
      />

    </div>
  );
}


/* =============================================
   EMPTY STATE
============================================= */

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


/* =============================================
   DELETE MODAL
============================================= */

function DeleteModal({
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Icon */}

        <div className="flex justify-center pt-8">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#E52323]">
            <Trash2 className="h-6 w-6" />
          </div>

        </div>

        {/* Content */}

        <div className="px-6 pb-6 pt-5 text-center">

          <h2 className="bebas text-3xl uppercase tracking-wide">
            Delete Address?
          </h2>

          <p className="oxanium mt-2 text-sm leading-6 text-[#777]">
            Are you sure you want to delete this address? This action cannot
            be undone.
          </p>

        </div>

        {/* Actions */}

        <div className="flex gap-3 border-t border-black/10 p-5">

          <button
            type="button"
            onClick={onCancel}
            className="oxanium flex-1 rounded-lg border border-black/10 px-4 py-3 text-sm font-bold text-[#555] transition hover:border-black hover:text-[#111]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="oxanium flex-1 rounded-lg bg-[#E52323] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#111]"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}