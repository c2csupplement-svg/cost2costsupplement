import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogsPage from "@/components/blogs/BlogsPage";
import WhyC2C from "@/components/home/WhyC2C";

export default function Blogs() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      <BlogsPage />
      <WhyC2C />
      <Footer />
    </main>
  );
}