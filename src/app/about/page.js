import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";
import AboutPage from "./AboutPage";

const getAboutSEO = cache(async () => {
  try {
    const response = await getPageSeo("about");

    return (
      response?.data?.seo ||
      response?.seo ||
      response?.data ||
      response ||
      null
    );
  } catch (error) {
    console.error("About page SEO error:", error);
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

      <AboutPage />
    </>
  );
}