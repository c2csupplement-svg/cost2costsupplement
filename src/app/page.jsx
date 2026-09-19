import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";
import { getBannersApi } from "@/redux/features/banner/bannerApi";
import Main from "./main";

// Home page har 5 minute mein background mein dobara banega, taaki admin se
// badle hue banners aur SEO bina naye build ke site par aa jaayein
export const revalidate = 300;

// API se description na aaye tab bhi page par ye description rahega.
// Text apne hisaab se badal lena.
const DEFAULT_DESCRIPTION =
  "Shop protein, pre-workout, fat burners and other supplements online at Cost2Cost Supplement.";

export async function generateMetadata() {
  let metadata;

  try {
    const response = await getPageSeo("home");

    metadata = await getSEOMetadata(response?.pageSeo);
  } catch (error) {
    console.error("Home SEO error:", error);

    metadata = await getSEOMetadata(null);
  }

  return {
    ...metadata,
    description: metadata?.description || DEFAULT_DESCRIPTION,
  };
}

export default async function Home() {
  // SEO aur banners ek saath mangao, taaki server ka time kam lage
  const [seoResponse, initialBanners] = await Promise.all([
    getPageSeo("home").catch((error) => {
      console.error("Home SEO error:", error);
      return null;
    }),

    // Banners na milein to null; tab Hero pehle ki tarah browser mein fetch kar lega
    getBannersApi().catch(() => null),
  ]);

  const seo =
    seoResponse?.data?.seo ||
    seoResponse?.seo ||
    seoResponse?.data ||
    seoResponse;

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

      <Main initialBanners={initialBanners} />
    </>
  );
}