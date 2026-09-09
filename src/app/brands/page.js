import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import {getPageSeo} from "@/apiService/api";
import BrandsClientPage from "./BrandsPage";

const getBrandsSEO = cache(async () => {
  try {
    const response = await getPageSeo("brands");

    return (
      response?.data?.seo ||
      response?.seo ||
      response?.data ||
      response ||
      null
    );
  } catch (error) {
    console.error("Failed to load brands SEO:", error);
    return null;
  }
});

export async function generateMetadata() {
  const seo = await getBrandsSEO();

  return getSEOMetadata(seo);
}

export default async function BrandsPage() {
  const seo = await getBrandsSEO();

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

      <BrandsClientPage/>
    </>
  );
}