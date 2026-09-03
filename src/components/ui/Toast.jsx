"use client";

import { Check, Heart, X } from "lucide-react";

export default function Toast({
  message,
  onClose,
  type = "cart",
}) {
  const isWishlist = type === "wishlist";

  const theme = isWishlist
    ? {
        background: "bg-[#E52323]",
        iconBackground: "bg-white/15",
        progress: "bg-white/70",
        Icon: Heart,
      }
    : {
        background: "bg-[#438343]",
        iconBackground: "bg-white/15",
        progress: "bg-white/70",
        Icon: Check,
      };

  const Icon = theme.Icon;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[min(470px,calc(100vw-32px))] animate-in slide-in-from-right-5 fade-in duration-300">
      <div
        className={`relative overflow-hidden rounded-xl ${theme.background} px-5 py-4 text-white shadow-[0_12px_35px_rgba(0,0,0,0.25)]`}
      >
        {/* Content */}
        <div className="flex items-start gap-3.5">

          {/* Icon */}
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${theme.iconBackground}`}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={2.3}
              fill={isWishlist ? "currentColor" : "none"}
            />
          </div>

          {/* Message */}
          <p className="flex-1 pt-1 text-[15px] font-medium leading-6">
            {message}
          </p>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close notification"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div
          className={`absolute bottom-0 left-0 h-[3px] w-full ${theme.progress} origin-left animate-[toastProgress_3s_linear_forwards]`}
        />
      </div>
    </div>
  );
}