
import WhyC2C from "@/components/home/WhyC2C";
import OrderTracking from "@/components/orderTracking/orderTracking";
import Breadcrumb from "@/components/layout/Breadcrumb";
export default function FAQ() {
  return (
    <main className="min-h-screen">

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
    </main>
  );
}