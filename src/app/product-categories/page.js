import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";
import ProductCategoriesPageClient from "./ProductCategory";

const getSEO = cache(async () => {
  const response = await getPageSeo("category");

  return (
    response?.data?.seo ||
    response?.seo ||
    response?.data ||
    response ||
    null
  );
});

export async function generateMetadata() {
  const seo = await getSEO();

  return getSEOMetadata(seo);
}

export default async function ProductCategoriesPage() {
  const seo = await getSEO();
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

      <ProductCategoriesPageClient />
    </>
  );
}