import Header from "@/components/layout/Header";
import WhyC2C from "@/components/home/WhyC2C";
import Footer from "@/components/layout/Footer";
import FAQPage from "@/components/faq/FAQPage";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      <FAQPage />
      <WhyC2C />    
      <Footer />
    </main>
  );
}