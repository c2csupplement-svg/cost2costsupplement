import { cache } from "react";
import { getProductBySlug } from "@/redux/features/product/productApi";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import ProductPageClient  from "./ProductPageClient ";
import LoadingPage from "@/components/ui/loading"

function normalizeProductResponse(response) {
  if (!response) {
    return null;
  }

  if (response?.product) {
    return response.product;
  }

  if (response?.data?.product) {
    return response.data.product;
  }

  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    return response.data;
  }

  return response;
}

const getProduct = cache(async (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const response = await getProductBySlug(slug);

    return normalizeProductResponse(response);
  } catch (error) {
    console.error("Product SEO error:", error);
    return null;
  }
});

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const product = await getProduct(slug);

  return getSEOMetadata(product?.seo);
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const product = await getProduct(slug);

  const schemaJson = getJSONLD(product?.seo);

  return (
    <>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaJson,
          }}
        />
      )}

      <LoadingPage/>
      <ProductPageClient
        product={product}
        slug={slug}
      />
    </>
  );
}