
import Header from "@/components/layout/Header";
import WhyC2C from "@/components/home/WhyC2C";
import Footer from "@/components/layout/Footer";
import OrderTracking from "@/components/orderTracking/orderTracking";
import Breadcrumb from "@/components/layout/Breadcrumb";
export default function FAQ() {
  return (
    <main className="min-h-screen">

      <Header />

      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Order Tracking",
          },
        ]}
      />
      <OrderTracking />
      <WhyC2C />    
      <Footer />
    </main>
  );
}