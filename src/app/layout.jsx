import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ShopProvider } from "@/context/ShopContext";
import { ToastProvider } from "@/context/ToastContext";
import StoreProvider from "@/redux/provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GTM_ID = "GTM-KKX5KXQ5";

export const metadata = {
  metadataBase: new URL("https://cost2costsupplement.com"),
  verification: {
    google: "RFvLVQGYcdrWbl0ym9qHka13UuMJ7pIkCi2FYkgOIE0",
    yandex: "f136c752b8c30798",
    other: {
      "p:domain_verify": "a7cde63f0d33481d92da8ca13db3f488",
      "msvalidate.01": "3D8DB2D729E6AD52E55F3CC39AC38797",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-oxanium min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>

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