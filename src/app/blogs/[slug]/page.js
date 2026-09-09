import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getBlogBySlug } from "@/apiService/api";
import BlogDetailsPageClient from "./BlogDetailsPageClient";

const getBlog = cache(async (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const response = await getBlogBySlug(slug);

    if (!response) return null;

    if (response?.data?.blog) {
      return response.data.blog;
    }

    if (response?.data?.data) {
      return response.data.data;
    }

    if (response?.blog) {
      return response.blog;
    }

    if (
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
    ) {
      return response.data;
    }

    return response;
  } catch (error) {
    console.error("Blog SEO error:", error);
    return null;
  }
});

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const blog = await getBlog(slug);

  return getSEOMetadata(blog?.seo);
}

export default async function BlogDetailsPage({ params }) {
  const resolvedParams = await params;

  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;

  const blog = await getBlog(slug);

  const jsonld = getJSONLD(blog?.seo);

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

      <BlogDetailsPageClient
        blog={blog}
        slug={slug}
      />
    </>
  );
}