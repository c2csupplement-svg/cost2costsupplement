import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";
import Main from "./main";

export async function generateMetadata() {
  try {
    const response = await getPageSeo("home");

    const seo =
      response?.data?.seo ||
      response?.seo ||
      response?.data ||
      response;

    return getSEOMetadata(seo);
  } catch (error) {
    console.error("Home SEO error:", error);

    return getSEOMetadata(null);
  }
}

export default async function Home() {
  let seo = null;

  try {
    const response = await getPageSeo("home");

    seo =
      response?.data?.seo ||
      response?.seo ||
      response?.data ||
      response;
  } catch (error) {
    console.error("Home SEO error:", error);
  }

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

      <Main />
    </>
  );
}