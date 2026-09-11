"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center px-6 text-center">

        <div className="relative mb-7">
          <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex h-20 w-20 items-center justify-center">

            <div className="absolute inset-0 rounded-full border-4 border-border" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary" />

            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-xl shadow-primary/25">
              <Image
                src="/images/c2c-logo-black.png"
                alt="Cost2Cost Logo"
                fill
                priority
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          Cost2Cost
        </h2>

        <div className="mt-2 flex items-center gap-1 text-sm text-text-secondary">
          <span>Loading</span>

          <span className="flex gap-1">
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
          </span>
        </div>
        <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-border">
          <div className="loading-progress h-full rounded-full bg-primary" />
        </div>

        <p className="mt-3 text-[11px] text-text-secondary/60">
          Preparing your experience...
        </p>
      </div>

      <style jsx>{`
        .loading-progress {
          width: 0%;
          animation: loadingProgress 3s linear forwards;
        }

        @keyframes loadingProgress {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}