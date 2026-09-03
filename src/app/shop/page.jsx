import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShopPage from "@/components/shop/ShopPage";
import WhyC2C from "@/components/home/WhyC2C";

export default function Shop() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      <ShopPage />
      <WhyC2C />
      <Footer />
    </main>
  );
}   