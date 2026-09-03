import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactPage from "@/components/contact/ContactPage";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      <ContactPage />
      <Footer />
    </main>
  );
}