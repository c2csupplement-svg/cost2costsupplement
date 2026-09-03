import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  // items = [{ label: "Home", href: "/" }, { label: "FAQ" }]
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2 font-oxanium text-xs uppercase tracking-[0.14em]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <span key={item.label} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-primary transition-colors hover:text-primary-hover"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-text-muted" : "text-primary"}>
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}   