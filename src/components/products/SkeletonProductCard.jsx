export default function SkeletonProductCard() {
  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
      <div className="skeleton-shimmer aspect-square w-full bg-[#EDEDED]" />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="skeleton-shimmer h-4 w-16 rounded-full bg-[#EDEDED]" />

        <div className="mt-1 space-y-1.5">
          <div className="skeleton-shimmer h-3.5 w-[85%] rounded bg-[#EDEDED]" />
          <div className="skeleton-shimmer h-3.5 w-[55%] rounded bg-[#EDEDED]" />
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <div className="skeleton-shimmer h-3 w-16 rounded bg-[#EDEDED]" />
          <div className="skeleton-shimmer h-3 w-8 rounded bg-[#EDEDED]" />
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <div className="skeleton-shimmer h-5 w-14 rounded bg-[#EDEDED]" />
          <div className="skeleton-shimmer h-4 w-10 rounded bg-[#EDEDED]" />
        </div>
      </div>

      <style jsx global>{`
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-sweep 1.4s infinite;
        }
        @keyframes shimmer-sweep {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}