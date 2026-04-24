import { Truck, Clock, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Shipping Policy | NeelNir",
  description: "Shipping and delivery policy of NeelNir.",
};

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-20 ">
      {/* Header Section */}
      <div className="container-main px-4 max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground mb-4">
          Shipping <span className="text-primary">Policy</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          At NeelNir, we strive to deliver your handmade products with love and care, as quickly as possible.
        </p>
      </div>

      {/* Content Section */}
      <div className="container-main px-4 max-w-4xl mx-auto">
        <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-10">
          
          {/* Order Processing */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">1. Order Processing Time</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                All orders are processed within <strong className="text-foreground">1 to 2 business days</strong> (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
              </p>
            </div>
          </section>

          {/* Shipping Rates & Estimates */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-xl font-bold text-foreground mb-4">2. Shipping Rates & Delivery Estimates</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4">
                We offer standard delivery across Bangladesh. Shipping charges for your order will be calculated and displayed at checkout.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-border/60 rounded-lg overflow-hidden">
                  <thead className="text-xs text-muted-foreground bg-muted uppercase">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 font-semibold">Estimated Delivery Time</th>
                      <th className="px-6 py-4 font-semibold">Shipping Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="bg-background">
                      <td className="px-6 py-4 font-medium text-foreground">Inside Dhaka</td>
                      <td className="px-6 py-4 text-muted-foreground">1 - 3 Business Days</td>
                      <td className="px-6 py-4 font-bold text-primary">৳ 70</td>
                    </tr>
                    <tr className="bg-background">
                      <td className="px-6 py-4 font-medium text-foreground">Outside Dhaka (Sub-city)</td>
                      <td className="px-6 py-4 text-muted-foreground">3 - 5 Business Days</td>
                      <td className="px-6 py-4 font-bold text-primary">৳ 120</td>
                    </tr>
                    <tr className="bg-background">
                      <td className="px-6 py-4 font-medium text-foreground">Outside Dhaka (Rural)</td>
                      <td className="px-6 py-4 text-muted-foreground">4 - 7 Business Days</td>
                      <td className="px-6 py-4 font-bold text-primary">৳ 150</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                * Delivery delays can occasionally occur due to unavoidable weather conditions or political unrest.
              </p>
            </div>
          </section>

          {/* Cash on Delivery */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">3. Cash on Delivery (COD)</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We accept Cash on Delivery (COD) for all locations in Bangladesh. However, for orders outside Dhaka, an advance payment of the shipping fee (৳120 - ৳150) may be required via bKash or Nagad to confirm the order.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <PackageCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">4. How do I check the status of my order?</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-4">
                When your order has shipped, you will receive an email or SMS notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.
              </p>
              <Link href="/track-order">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                  Track Your Order Here
                </Button>
              </Link>
            </div>
          </section>

          {/* Damages */}
          <section className="flex gap-4 sm:gap-6">
            <div className="mt-1 shrink-0">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">5. Damages and Issues</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right. You must record a clear unboxing video as proof of damage.
              </p>
            </div>
          </section>

        </div>

        {/* Contact Info Footer */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm sm:text-base">
            If you have any further questions, please don't hesitate to contact us at <br />
            <a href="mailto:support@neelnir.com" className="text-primary font-semibold hover:underline">support@neelnir.com</a> or call us at <span className="font-semibold text-foreground">01772-162533</span>.
          </p>
        </div>
      </div>
    </div>
  );
}