import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhyC2C from "@/components/home/WhyC2C";
import AccountPage from "@/components/account/AccountPage";

export default function Blogs() {
  return (
    <main className="min-h-screen">
      <Header />
      <AccountPage />
      <WhyC2C />
      <Footer />
    </main>
  );
}