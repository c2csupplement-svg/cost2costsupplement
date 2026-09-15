import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";

import BlogsPage from "@/components/blogs/BlogsPage";
import WhyC2C from "@/components/home/WhyC2C";

const getBlogsSEO = cache(async () => {
  try {
    const response = await getPageSeo("blogs");

    return (
      response?.pageSeo||null
    );
  } catch (error) {
    console.error("Blogs page SEO error:", error);
    return null;
  }
});

export async function generateMetadata() {
  const seo = await getBlogsSEO();

  return getSEOMetadata(seo);
}

export default async function Blogs() {
  const seo = await getBlogsSEO();

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
        <BlogsPage />
        <WhyC2C />
      </main>
    </>
  );
}