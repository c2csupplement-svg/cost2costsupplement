
import ContactPage from "@/components/contact/ContactPage";
import { cache } from "react";
import { getSEOMetadata, getJSONLD } from "@/lib/seo";
import { getPageSeo } from "@/apiService/api";

const getContactSEO = cache(async () => {
  try {
    const response = await getPageSeo("contact");

    return (
      response?.pageSeo ||
      null
    );
  } catch (error) {
    console.error("Contact page SEO error:", error);
    return null;
  }
});

export async function generateMetadata() {
  const seo = await getContactSEO();

  return getSEOMetadata(seo);
}


export default async function Contact() {

  const seo = await getContactSEO();

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
        <ContactPage />
      </main>
    </>
  );
}