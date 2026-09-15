import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";
import WhyPageClient from "./WhyPageClient";

const getAboutSEO = cache(async () => {
  try {
    const response = await getPageSeo("why-cost2cost");

    return (
      response?.pageSeo ||
      null
    );
  } catch (error) {
    console.error("WhyC2C page SEO error:", error);
    return null;
  }
});

export async function generateMetadata() {
  const seo = await getAboutSEO();

  return getSEOMetadata(seo);
}

export default async function About() {
  const seo = await getAboutSEO();

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

      <WhyPageClient />
    </>
  );
}