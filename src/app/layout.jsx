import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ShopProvider } from "@/context/ShopContext";
import { ToastProvider } from "@/context/ToastContext";
import StoreProvider from "@/redux/provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { homePageSeo } from "@/apiService/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  try {
    const response = await homePageSeo();

    const seo = response?.data || response || {};

    const title =
      seo?.metaTitle ||
      seo?.seoTitle ||
      seo?.title ||
      "Cost2Cost Supplement";

    const description =
      seo?.metaDescription ||
      seo?.seoDescription ||
      seo?.description ||
      "Shop premium supplements at Cost2Cost Supplement.";

    const keywords =
      seo?.keywords ||
      seo?.metaKeywords ||
      seo?.seoKeywords ||
      [];

    const image =
      seo?.ogImage ||
      seo?.metaImage ||
      seo?.image ||
      seo?.featuredImage ||
      "";

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://cost2costsupplement.com";

    const metadata = {
      metadataBase: new URL(siteUrl),

      title: {
        default: title,
        template: `%s | Cost2Cost Supplement`,
      },

      description,

      keywords: Array.isArray(keywords)
        ? keywords
        : typeof keywords === "string"
          ? keywords.split(",").map((keyword) => keyword.trim())
          : [],

      applicationName: "Cost2Cost Supplement",

      authors: [
        {
          name: "Cost2Cost Supplement",
        },
      ],

      creator: "Cost2Cost Supplement",
      publisher: "Cost2Cost Supplement",

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },

      alternates: {
        canonical: "/",
      },

      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Cost2Cost Supplement",
        title,
        description,
        ...(image
          ? {
              images: [
                {
                  url: image,
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            }
          : {}),
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(image
          ? {
              images: [image],
            }
          : {}),
      },

      category: "health and supplements",
    };

    return metadata;
  } catch (error) {
    console.error("Failed to load homepage SEO:", error);

    return {
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ||
          "https://cost2costsupplement.com"
      ),

      title: {
        default: "Cost2Cost Supplement",
        template: "%s | Cost2Cost Supplement",
      },

      description:
        "Shop premium supplements at Cost2Cost Supplement.",

      robots: {
        index: true,
        follow: true,
      },

      alternates: {
        canonical: "/",
      },

      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Cost2Cost Supplement",
        title: "Cost2Cost Supplement",
        description:
          "Shop premium supplements at Cost2Cost Supplement.",
        url: "/",
      },

      twitter: {
        card: "summary_large_image",
        title: "Cost2Cost Supplement",
        description:
          "Shop premium supplements at Cost2Cost Supplement.",
      },
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-oxanium min-h-full flex flex-col">
        <StoreProvider>
          <ToastProvider>
            <ShopProvider>
              <Header />

              {children}

              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3000}
                theme="light"
              />

              <Footer />
            </ShopProvider>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}