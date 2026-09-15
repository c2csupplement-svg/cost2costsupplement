
import WhyC2C from "@/components/home/WhyC2C";
import FAQPage from "@/components/faq/FAQPage";
import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";

const getFAQSEO = cache(async () => {
  try {
    const response = await getPageSeo("faq");

    return (
      response?.pageSeo ||
      null
    );
  } catch (error) {
    console.error("FAQ page SEO error:", error);
    return null;
  }
});

export async function generateMetadata() {
  const seo = await getFAQSEO();

  return getSEOMetadata(seo);
}

export default async function FAQ() {

  const seo = await getFAQSEO();

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

      <main className="min-h-screen bg-[#0B0B0B] text-white">
        <FAQPage />
        <WhyC2C />
      </main>
    </>
  );
}