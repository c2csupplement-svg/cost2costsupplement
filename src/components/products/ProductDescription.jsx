// "use client";

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function ProductDescription({ product }) {
//   const [openSections, setOpenSections] = useState({
//     benefits: true,
//     perfectFor: false,
//     description: false,
//     howToUse: false,
//     warnings: false,
//   });

//   return (
//     <div className="max-w-5xl">
//       <SectionHeading>Description</SectionHeading>

//       <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
//         {/* KEY BENEFITS */}
//         <AccordionItem
//           title={`${product.shortName} Key Benefits`}
//           isOpen={openSections.benefits}
//           onClick={() =>
//             setOpenSections((prev) => ({
//               ...prev,
//               benefits: !prev.benefits,
//             }))
//           }
//         >
//           <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
//             {product.benefits?.map((benefit) => (
//               <li
//                 key={benefit}
//                 className="flex items-start gap-3 text-sm leading-6 text-[#525252]"
//               >
//                 <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E52323]" />

//                 <span>{benefit}</span>
//               </li>
//             ))}
//           </ul>
//         </AccordionItem>

//         {/* WHO SHOULD USE IT */}
//         <AccordionItem
//           title="Who Should Use It?"
//           isOpen={openSections.perfectFor}
//           onClick={() =>
//             setOpenSections((prev) => ({
//               ...prev,
//               perfectFor: !prev.perfectFor,
//             }))
//           }
//         >
//           <p className="text-sm text-[#737373]">Perfect for:</p>

//           <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//             {product.perfectFor?.map((item) => (
//               <li
//                 key={item}
//                 className="flex items-center gap-3 text-sm text-[#525252]"
//               >
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#E52323]" />

//                 {item}
//               </li>
//             ))}
//           </ul>
//         </AccordionItem>

//         {/* PRODUCT DESCRIPTION */}
//         <AccordionItem
//           title="Product Description"
//           isOpen={openSections.description}
//           onClick={() =>
//             setOpenSections((prev) => ({
//               ...prev,
//               description: !prev.description,
//             }))
//           }
//         >
//           <div className="space-y-5 text-sm leading-7 text-[#525252]">
//               <p>{product.description}</p>
         
//           </div>
//         </AccordionItem>

//         {/* HOW TO USE */}
//         <AccordionItem
//           title="How to Use"
//           isOpen={openSections.howToUse}
//           onClick={() =>
//             setOpenSections((prev) => ({
//               ...prev,
//               howToUse: !prev.howToUse,
//             }))
//           }
//         >
//           <ol className="space-y-4">
//             {product.howToUse?.map((item, index) => (
//               <li
//                 key={index}
//                 className="flex gap-4 text-sm leading-6 text-[#525252]"
//               >
//                 <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E52323]/10 text-xs font-bold text-[#E52323]">
//                   {index + 1}
//                 </span>

//                 <span className="pt-0.5">{item}</span>
//               </li>
//             ))}
//           </ol>
//         </AccordionItem>

//         {/* WARNINGS */}
//         <AccordionItem
//           title="Warnings"
//           isOpen={openSections.warnings}
//           onClick={() =>
//             setOpenSections((prev) => ({
//               ...prev,
//               warnings: !prev.warnings,
//             }))
//           }
//         >
//           <ul className="space-y-3">
//             {product.warnings?.map((warning, index) => (
//               <li
//                 key={index}
//                 className="flex gap-3 text-sm leading-6 text-[#737373]"
//               >
//                 <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E52323]" />

//                 {warning}
//               </li>
//             ))}
//           </ul>

//           {product.disclaimer && (
//             <div className="mt-8 border border-[#E7D9B5] bg-[#FFF9EA] p-5">
//               <p className="text-sm leading-6 text-[#6B5B35]">
//                 <strong className="text-[#8A6A24]">
//                   Disclaimer:
//                 </strong>{" "}
//                 {product.disclaimer}
//               </p>
//             </div>
//           )}
//         </AccordionItem>
//       </div>
//     </div>
//   );
// }

// function SectionHeading({ children }) {
//   return (
//     <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
//       {children}
//     </h2>
//   );
// }

// function AccordionItem({ title, isOpen, onClick, children }) {
//   return (
//     <div className="border-b border-[#E5E5E5] last:border-b-0">
//       <button
//         type="button"
//         onClick={onClick}
//         className="
//           flex
//           w-full
//           items-center
//           justify-between
//           gap-6
//           px-5
//           py-5
//           text-left
//           transition
//           hover:bg-[#FAFAFA]
//           sm:px-7
//         "
//       >
//         <span className="text-sm font-black uppercase tracking-wide text-[#111111] sm:text-xl">
//           {title}
//         </span>

//         <ChevronDown
//           className={`h-5 w-5 shrink-0 text-[#E52323] transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       <div
//         className={`
//           grid
//           transition-all
//           duration-300
//           ease-in-out
//           ${
//             isOpen
//               ? "grid-rows-[1fr] opacity-100"
//               : "grid-rows-[0fr] opacity-0"
//           }
//         `}
//       >
//         <div className="overflow-hidden">
//           <div className="px-5 pb-6 sm:px-7 sm:pb-7">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductDescription({ product }) {
  const [openSections, setOpenSections] = useState({
    benefits: true,
    perfectFor: false,
    description: false,
    howToUse: false,
    warnings: false,
  });

  // Safely convert API values into arrays
  const parseArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    let parsed = value;

    // Some API values are JSON stringified multiple times
    for (let i = 0; i < 10; i++) {
      if (typeof parsed !== "string") break;

      try {
        const nextParsed = JSON.parse(parsed);

        if (nextParsed === parsed) break;

        parsed = nextParsed;
      } catch {
        break;
      }
    }

    // Final result is already an array
    if (Array.isArray(parsed)) {
      // Flatten nested arrays if they exist
      return parsed
        .flat(Infinity)
        .filter(
          (item) =>
            typeof item === "string" &&
            item.trim() &&
            item.trim() !== "[]"
        );
    }

    // If it is a normal string
    if (typeof parsed === "string" && parsed.trim()) {
      return [parsed.trim()];
    }

    return [];
  };

  const benefits = useMemo(
    () => parseArray(product?.keyBenefits || product?.benefits),
    [product]
  );

  const perfectFor = useMemo(
    () => parseArray(product?.whoShouldUse || product?.perfectFor),
    [product]
  );

  const howToUse = useMemo(
    () => parseArray(product?.howToUse),
    [product]
  );

  const warnings = useMemo(
    () =>
      parseArray(
        product?.whatToAvoid ||
          product?.safetyInformation ||
          product?.warnings
      ),
    [product]
  );

  const description = product?.description || "";

  const productName =
    product?.shortName ||
    product?.name ||
    "Product";

  return (
    <div className="max-w-5xl">
      <SectionHeading>Description</SectionHeading>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">

        {/* KEY BENEFITS */}
        <AccordionItem
          title={`${productName} Key Benefits`}
          isOpen={openSections.benefits}
          onClick={() =>
            setOpenSections((prev) => ({
              ...prev,
              benefits: !prev.benefits,
            }))
          }
        >
          {benefits.length > 0 ? (
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <li
                  key={`${benefit}-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-[#525252]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E52323]" />

                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-[#525252]">
              Information will be available soon.
            </p>
          )}
        </AccordionItem>

        {/* WHO SHOULD USE IT */}
        <AccordionItem
          title="Who Should Use It?"
          isOpen={openSections.perfectFor}
          onClick={() =>
            setOpenSections((prev) => ({
              ...prev,
              perfectFor: !prev.perfectFor,
            }))
          }
        >
          {perfectFor.length > 0 ? (
            <>
              <p className="text-sm text-[#737373]">
                Perfect for:
              </p>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {perfectFor.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-center gap-3 text-sm text-[#525252]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E52323]" />

                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm leading-6 text-[#525252]">
              Information will be available soon.
            </p>
          )}
        </AccordionItem>

        {/* PRODUCT DESCRIPTION */}
        <AccordionItem
          title="Product Description"
          isOpen={openSections.description}
          onClick={() =>
            setOpenSections((prev) => ({
              ...prev,
              description: !prev.description,
            }))
          }
        >
          <div className="space-y-5 text-sm leading-7 text-[#525252]">
            {description ? (
              <p>{description}</p>
            ) : (
              <p>Description will be available soon.</p>
            )}
          </div>
        </AccordionItem>

        {/* HOW TO USE */}
        <AccordionItem
          title="How to Use"
          isOpen={openSections.howToUse}
          onClick={() =>
            setOpenSections((prev) => ({
              ...prev,
              howToUse: !prev.howToUse,
            }))
          }
        >
          {howToUse.length > 0 ? (
            <ol className="space-y-4">
              {howToUse.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex gap-4 text-sm leading-6 text-[#525252]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E52323]/10 text-xs font-bold text-[#E52323]">
                    {index + 1}
                  </span>

                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-[#525252]">
              Usage instructions will be available soon.
            </p>
          )}
        </AccordionItem>

        {/* WARNINGS */}
        <AccordionItem
          title="Warnings"
          isOpen={openSections.warnings}
          onClick={() =>
            setOpenSections((prev) => ({
              ...prev,
              warnings: !prev.warnings,
            }))
          }
        >
          {warnings.length > 0 ? (
            <ul className="space-y-3">
              {warnings.map((warning, index) => (
                <li
                  key={`${warning}-${index}`}
                  className="flex gap-3 text-sm leading-6 text-[#737373]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E52323]" />

                  {warning}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-[#737373]">
              Safety information will be available soon.
            </p>
          )}

          {product?.disclaimer && (
            <div className="mt-8 border border-[#E7D9B5] bg-[#FFF9EA] p-5">
              <p className="text-sm leading-6 text-[#6B5B35]">
                <strong className="text-[#8A6A24]">
                  Disclaimer:
                </strong>{" "}
                {product.disclaimer}
              </p>
            </div>
          )}
        </AccordionItem>
      </div>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
      {children}
    </h2>
  );
}

function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-[#E5E5E5] last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-6
          px-5
          py-5
          text-left
          transition
          hover:bg-[#FAFAFA]
          sm:px-7
        "
      >
        <span className="text-sm font-black uppercase tracking-wide text-[#111111] sm:text-xl">
          {title}
        </span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#E52323] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`
          grid
          transition-all
          duration-300
          ease-in-out
          ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 sm:px-7 sm:pb-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}