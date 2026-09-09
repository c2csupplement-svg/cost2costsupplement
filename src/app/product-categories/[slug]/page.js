import { cache } from "react";

import { getCategoryBySlug } from "@/apiService/api";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";

import ProductCategoryClient from "./ProductCategoryClient";

function normalizeCategoryResponse(response) {
  if (!response) {
    return null;
  }

  const source =
    response?.data?.category ||
    response?.category ||
    response?.data ||
    response;

  if (!source || typeof source !== "object") {
    return null;
  }

  if (Array.isArray(source)) {
    return source[0] || null;
  }

  if (Array.isArray(source?.categories)) {
    return source.categories[0] || null;
  }

  return source;
}

const getCategory = cache(async (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const response = await getCategoryBySlug(slug);

    return normalizeCategoryResponse(response);
  } catch (error) {
    console.error(
      "Category detail error:",
      error
    );

    return null;
  }
});

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = Array.isArray(
    resolvedParams?.slug
  )
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const category = await getCategory(slug);

  return getSEOMetadata(category?.seo);
}

export default async function CategoryDetailsPage({
  params,
}) {
  const resolvedParams = await params;

  const slug = Array.isArray(
    resolvedParams?.slug
  )
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const category = await getCategory(slug);

  const jsonld = getJSONLD(category?.seo);

  return (
    <>
      {jsonld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonld,
          }}
        />
      )}

      <ProductCategoryClient
        initialCategory={category}
        initialSlug={slug}
      />
    </>
  );
}