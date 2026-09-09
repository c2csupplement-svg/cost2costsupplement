import { cache } from "react";

import { getBrandBySlug } from "@/apiService/api";
import {
  getSEOMetadata,
  getJSONLD,
} from "@/lib/seo";

import BrandPageClient from "./BrandPageClient ";

const getBrand = cache(async (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const response = await getBrandBySlug(
      slug,
      1,
      12
    );

    return (
      response?.data ??
      response ??
      null
    );
  } catch (error) {
    console.error(
      "Failed to load brand:",
      error
    );

    return null;
  }
});

export async function generateMetadata({
  params,
}) {
  const resolvedParams = await params;

  const slug = Array.isArray(
    resolvedParams?.slug
  )
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const data = await getBrand(slug);

  const seo =
    data?.brand?.seo ||
    data?.seo ||
    null;

  return getSEOMetadata(seo);
}

export default async function BrandDetailsPage({
  params,
}) {
  const resolvedParams = await params;

  const slug = Array.isArray(
    resolvedParams?.slug
  )
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const data = await getBrand(slug);

  const seo =
    data?.brand?.seo ||
    data?.seo ||
    null;

  const jsonld = getJSONLD(seo);

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

      <BrandPageClient
        initialBrandData={data}
        initialSlug={slug}
      />
    </>
  );
}
